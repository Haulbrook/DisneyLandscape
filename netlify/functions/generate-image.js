const https = require('https');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    console.error('OPENAI_API_KEY environment variable is not set');
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error: 'OpenAI API key not configured',
        details: 'Please add OPENAI_API_KEY to your Netlify environment variables'
      }),
    };
  }

  try {
    const { prompt, season = 'spring' } = JSON.parse(event.body);

    if (!prompt) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Prompt is required' }),
      };
    }

    console.log('Generating image for season:', season);

    // Season-specific details
    const seasonDetails = {
      spring: {
        lighting: 'soft morning light, fresh dewy atmosphere',
        plants: 'fresh green foliage, early blooms',
        colors: 'light greens, pinks, whites, soft yellows'
      },
      summer: {
        lighting: 'warm golden hour sunlight, clear sky',
        plants: 'lush foliage at peak, flowers in full bloom',
        colors: 'deep greens, vibrant reds, purples, yellows'
      },
      fall: {
        lighting: 'warm amber light, soft shadows',
        plants: 'fall colors, ornamental grass plumes',
        colors: 'oranges, reds, burgundies, golden yellows'
      },
      winter: {
        lighting: 'cool crisp light, overcast sky',
        plants: 'evergreens prominent, structural interest',
        colors: 'deep greens, browns, tans'
      }
    };

    const seasonInfo = seasonDetails[season] || seasonDetails.spring;

    // Simplified, more focused prompt for faster generation
    const fullPrompt = `Professional landscape photograph of a residential garden bed in ${season}:

${prompt}

Scene: ${seasonInfo.lighting}. Plants showing ${seasonInfo.plants}. Color palette: ${seasonInfo.colors}.

Requirements:
- Photorealistic garden magazine style
- Eye-level shot with lawn border and mulch
- Natural layering: tall plants back, medium middle, low front
- NO text, labels, people, or decorations
- Sharp focus, rich colors, professional quality`;

    console.log('Prompt length:', fullPrompt.length);

    // Call OpenAI and wait for result (using smaller image for speed)
    const response = await callOpenAI(apiKey, fullPrompt);

    console.log('Image generated successfully');

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        imageUrl: response.data[0].url,
        revisedPrompt: response.data[0].revised_prompt
      }),
    };
  } catch (error) {
    console.error('Error generating image:', error.message);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error: 'Failed to generate image',
        details: error.message
      }),
    };
  }
};

function callOpenAI(apiKey, prompt) {
  return new Promise((resolve, reject) => {
    const requestBody = {
      model: 'dall-e-3',
      prompt: prompt,
      n: 1,
      size: '1024x1024',       // Square is faster than landscape
      quality: 'standard',
      style: 'natural'
    };

    const data = JSON.stringify(requestBody);

    console.log('Calling DALL-E 3...');
    console.log('Size:', requestBody.size);

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
        console.log('OpenAI Status:', res.statusCode);

        if (body.trim().startsWith('<')) {
          reject(new Error('Gateway timeout. Please try again.'));
          return;
        }

        try {
          const response = JSON.parse(body);

          if (res.statusCode !== 200) {
            reject(new Error(response.error?.message || 'OpenAI API error'));
            return;
          }

          if (!response.data?.[0]?.url) {
            reject(new Error('No image URL in response'));
            return;
          }

          resolve(response);
        } catch (e) {
          reject(new Error('Failed to parse response'));
        }
      });
    });

    req.on('error', (e) => {
      reject(new Error(`Network error: ${e.message}`));
    });

    req.setTimeout(25000, () => {
      req.destroy();
      reject(new Error('Request timed out. Please try again.'));
    });

    req.write(data);
    req.end();
  });
}
