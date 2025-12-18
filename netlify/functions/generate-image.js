const https = require('https');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'OpenAI API key not configured' })
    };
  }

  try {
    const { prompt, season = 'spring' } = JSON.parse(event.body);

    if (!prompt) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'prompt is required' })
      };
    }

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
      }
    };

    const seasonInfo = seasonDetails[season] || seasonDetails.spring;

    const fullPrompt = `Professional landscape photograph of a residential garden bed in ${season}:

${prompt}

SETTING: Residential home - front yard, backyard, or side yard. Background shows house, fence, or patio. Grass lawn surrounds the mulch bed.

Scene: ${seasonInfo.lighting}. Plants showing ${seasonInfo.plants}. Color palette: ${seasonInfo.colors}.

Requirements:
- Photorealistic residential landscaping photo
- Eye-level shot from front of bed looking back
- Show ONLY the plants specified - no extras
- Dark brown mulch visible between plants
- Lawn grass bordering the bed edges
- Natural layering: tall plants back, medium middle, low front
- NO text, labels, signs, people, or garden tools
- Sharp focus, rich colors, professional quality
- Simple suburban home landscaping style`;

    console.log('Calling OpenAI DALL-E 3...');
    const response = await callOpenAI(apiKey, fullPrompt);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        imageUrl: response.data[0].url,
        revisedPrompt: response.data[0].revised_prompt
      })
    };
  } catch (error) {
    console.error('Error:', error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};

function callOpenAI(apiKey, prompt) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      model: 'dall-e-3',
      prompt: prompt,
      n: 1,
      size: '1024x1024',
      quality: 'standard',
      style: 'natural'
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

      res.on('data', (chunk) => { body += chunk; });

      res.on('end', () => {
        console.log('OpenAI response status:', res.statusCode);

        if (body.trim().startsWith('<')) {
          reject(new Error('Gateway error from OpenAI - please retry'));
          return;
        }

        try {
          const response = JSON.parse(body);

          if (res.statusCode !== 200) {
            reject(new Error(response.error?.message || 'OpenAI API error'));
            return;
          }

          resolve(response);
        } catch (e) {
          reject(new Error('Failed to parse OpenAI response'));
        }
      });
    });

    req.on('error', (e) => reject(new Error(`Network error: ${e.message}`)));

    req.setTimeout(25000, () => {
      req.destroy();
      reject(new Error('Request timed out - please retry'));
    });

    req.write(data);
    req.end();
  });
}
