const https = require('https');

exports.handler = async (event) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'OpenAI API key not configured' }),
    };
  }

  try {
    const { prompt, season = 'spring' } = JSON.parse(event.body);

    if (!prompt) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Prompt is required' }),
      };
    }

    // Build the full prompt for Disney-quality landscape rendering
    const fullPrompt = `Photorealistic professional landscape photography of a Disney theme park quality garden bed. ${prompt}.
    Season: ${season}.
    Style: Immaculate Disney Imagineering standards with perfect plant spacing, lush healthy plants, pristine mulch beds,
    dramatic lighting, shallow depth of field. The garden should look like it belongs in Magic Kingdom or EPCOT.
    High-end architectural photography style, golden hour lighting, no people visible.`;

    const response = await callOpenAI(apiKey, fullPrompt);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        imageUrl: response.data[0].url,
        revisedPrompt: response.data[0].revised_prompt
      }),
    };
  } catch (error) {
    console.error('Error generating image:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Failed to generate image',
        details: error.message
      }),
    };
  }
};

function callOpenAI(apiKey, prompt) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      model: 'dall-e-3',
      prompt: prompt,
      n: 1,
      size: '1792x1024',
      quality: 'hd',
    });

    const options = {
      hostname: 'api.openai.com',
      port: 443,
      path: '/v1/images/generations',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'Content-Length': Buffer.byteLength(data),
      },
    };

    const req = https.request(options, (res) => {
      let body = '';

      res.on('data', (chunk) => {
        body += chunk;
      });

      res.on('end', () => {
        console.log('OpenAI Response Status:', res.statusCode);
        console.log('OpenAI Response Body (first 500 chars):', body.substring(0, 500));

        // Check if response looks like HTML (error page)
        if (body.trim().startsWith('<')) {
          console.error('Received HTML instead of JSON:', body.substring(0, 200));
          reject(new Error(`OpenAI returned HTML error page (status ${res.statusCode}). This may indicate an API issue or rate limiting.`));
          return;
        }

        try {
          const response = JSON.parse(body);
          if (res.statusCode !== 200) {
            console.error('OpenAI API Error:', response.error);
            reject(new Error(response.error?.message || `OpenAI API error (status ${res.statusCode})`));
          } else {
            resolve(response);
          }
        } catch (e) {
          console.error('JSON Parse Error:', e.message, 'Body:', body.substring(0, 200));
          reject(new Error(`Failed to parse OpenAI response: ${e.message}`));
        }
      });
    });

    req.on('error', (e) => {
      console.error('Request Error:', e);
      reject(e);
    });

    req.setTimeout(60000, () => {
      req.destroy();
      reject(new Error('Request timed out after 60 seconds'));
    });

    req.write(data);
    req.end();
  });
}
