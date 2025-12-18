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

    // Build the full prompt for DALL-E 3 (4000 char limit)
    const seasonDescriptions = {
      spring: 'early spring with fresh growth, some plants just leafing out, cool morning light',
      summer: 'peak summer with full lush foliage, warm golden hour sunlight, plants at full size',
      fall: 'autumn with warm fall colors where applicable, soft afternoon light, mature plants'
    };

    const fullPrompt = `${prompt}

Season: ${seasonDescriptions[season] || seasonDescriptions.spring}.

SETTING - RESIDENTIAL HOME LANDSCAPE:
- OUTDOOR residential setting - front yard, backyard, or side yard of a home
- Background can include: house facade, porch, garage, driveway, fence, patio, deck
- Grass lawn surrounding the bed, typical suburban neighborhood feel
- Natural outdoor environment with sky visible
- NO industrial buildings, NO commercial properties, NO office parks
- NO public parks, NO botanical gardens, NO formal estate gardens
- NO elaborate pathways through the bed itself
- Think: typical American residential landscaping you'd see in a nice neighborhood

STYLE REQUIREMENTS:
- Photorealistic outdoor landscape photography
- Eye-level perspective from front of bed looking toward back
- Show EXACTLY the plants specified - no more, no less
- Maintain proper scale relationships between plant types
- Dark brown shredded hardwood mulch visible between plants
- Clean curved or natural bed edges against grass
- Soft natural outdoor daylight
- No people, no garden tools
- Plants should look healthy and well-maintained
- Simple, clean, professional landscaping - not elaborate formal gardens`;

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

    req.setTimeout(55000, () => {
      req.destroy();
      reject(new Error('Request timed out - DALL-E is taking too long. Please try again.'));
    });

    req.write(data);
    req.end();
  });
}
