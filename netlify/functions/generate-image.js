const https = require('https');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const apiKey = process.env.REPLICATE_API_TOKEN;

  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Replicate API token not configured. Add REPLICATE_API_TOKEN to Netlify environment variables.' })
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

    // Parse the plant count from the prompt to enforce strict rendering
    const plantCountMatch = prompt.match(/Total plants: (\d+)/);
    const totalPlants = plantCountMatch ? parseInt(plantCountMatch[1]) : 1;

    // Extract just the plant names and counts for emphasis
    const plantListMatch = prompt.match(/EXACT PLANT LIST[\s\S]*?(?=\n\n|$)/);

    const fullPrompt = `WIDE SHOT landscape photograph of a residential garden bed with EXACTLY ${totalPlants} plant(s).

${prompt}

CAMERA: Wide establishing shot showing the ENTIRE garden bed from 15-20 feet away. Must see full plants from ground to top, the mulch bed, lawn edges, and house in background. NOT a close-up. NOT a flower detail. FULL SCENE VIEW.

MANDATORY CONSTRAINTS:
- Show EXACTLY ${totalPlants} plant(s), no more, no less
- Show the WHOLE plant/tree from base to crown, not just flowers or leaves
- A Southern Magnolia is a LARGE TREE 35-50ft tall at 60% maturity, not a flower close-up
- A Crape Myrtle is a TREE 10-15ft tall at 60% maturity
- DO NOT add extra plants to fill space
- Empty mulch is correct for sparse designs

SCENE COMPOSITION:
- ${season} season, ${seasonInfo.lighting}
- Suburban home visible in background (brick, siding, or stone)
- Mulched garden bed with clean edges
- Green lawn surrounding the bed
- Eye-level view from front yard/street perspective

PLANT SIZE (60-70% MATURITY):
- Trees should be substantial, 2-3 years established
- Show full height and canopy spread
- ${seasonInfo.plants}
- Mulch visible at base of plants

STYLE: Professional real estate or landscaping portfolio photo. Sharp focus, whole scene in frame, natural lighting. NO close-ups, NO macro shots, NO flower details.`;

    console.log('Calling Replicate FLUX...');

    // Create prediction
    const prediction = await createPrediction(apiKey, fullPrompt);

    // Poll for result (FLUX is fast, usually 5-10 seconds)
    const result = await pollForResult(apiKey, prediction.id);

    if (result.status === 'failed') {
      throw new Error(result.error || 'Image generation failed');
    }

    const imageUrl = Array.isArray(result.output) ? result.output[0] : result.output;

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        imageUrl: imageUrl,
        revisedPrompt: fullPrompt.substring(0, 200) + '...'
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

function createPrediction(apiKey, prompt) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      version: "black-forest-labs/flux-1.1-pro",
      input: {
        prompt: prompt,
        num_outputs: 1,
        aspect_ratio: "16:9",
        output_format: "webp",
        output_quality: 90
      }
    });

    const options = {
      hostname: 'api.replicate.com',
      port: 443,
      path: '/v1/predictions',
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
        try {
          const response = JSON.parse(body);
          if (res.statusCode !== 201 && res.statusCode !== 200) {
            reject(new Error(response.detail || response.error || 'Failed to create prediction'));
            return;
          }
          resolve(response);
        } catch (e) {
          reject(new Error('Failed to parse Replicate response'));
        }
      });
    });

    req.on('error', (e) => reject(new Error(`Network error: ${e.message}`)));
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timed out'));
    });

    req.write(data);
    req.end();
  });
}

function pollForResult(apiKey, predictionId, maxAttempts = 30) {
  return new Promise((resolve, reject) => {
    let attempts = 0;

    const poll = () => {
      attempts++;

      const options = {
        hostname: 'api.replicate.com',
        port: 443,
        path: `/v1/predictions/${predictionId}`,
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
      };

      const req = https.request(options, (res) => {
        let body = '';
        res.on('data', (chunk) => { body += chunk; });
        res.on('end', () => {
          try {
            const response = JSON.parse(body);

            if (response.status === 'succeeded') {
              resolve(response);
            } else if (response.status === 'failed' || response.status === 'canceled') {
              reject(new Error(response.error || 'Prediction failed'));
            } else if (attempts >= maxAttempts) {
              reject(new Error('Prediction timed out'));
            } else {
              // Still processing, poll again in 500ms
              setTimeout(poll, 500);
            }
          } catch (e) {
            reject(new Error('Failed to parse status response'));
          }
        });
      });

      req.on('error', (e) => reject(new Error(`Network error: ${e.message}`)));
      req.end();
    };

    poll();
  });
}
