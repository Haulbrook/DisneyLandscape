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

    const fullPrompt = `Professional landscape photograph of an established residential garden bed at 60-70% maturity (2-3 years after planting) in ${season}:

${prompt}

PLANT MATURITY: All plants at 60-70% of their mature size. Not newly planted, not fully mature. Plants have filled in nicely but still have some growing room. Natural, established look with plants touching neighbors slightly.

SETTING: Residential suburban home - front yard foundation bed, backyard border, or side yard. Background shows brick/siding house wall, wooden fence, or stone patio. Well-maintained lawn grass borders the mulch bed edges.

Scene: ${seasonInfo.lighting}. Plants showing ${seasonInfo.plants}. Color palette: ${seasonInfo.colors}.

CRITICAL Requirements:
- Show EXACTLY the plants listed above in their EXACT positions described
- Photorealistic professional landscaping photography
- Eye-level perspective from front of bed looking toward back
- Plants at 60-70% mature size, well-established but not overgrown
- Dark brown hardwood mulch visible between plants (2-3 inch layer)
- Clean defined bed edge with green lawn grass border
- Natural layering: tallest at back, medium in middle, lowest at front edge
- NO extra plants, NO text, NO labels, NO people, NO garden tools
- Sharp focus, vibrant natural colors, golden hour lighting
- Authentic suburban residential landscaping style`;

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
      version: "black-forest-labs/flux-schnell",
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
