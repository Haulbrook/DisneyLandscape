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
        lighting: 'soft morning light',
        sky: 'partly cloudy spring sky'
      },
      summer: {
        lighting: 'warm afternoon sunlight',
        sky: 'clear blue summer sky'
      },
      fall: {
        lighting: 'golden hour amber light',
        sky: 'autumn sky with scattered clouds'
      },
      winter: {
        lighting: 'cool diffused light',
        sky: 'overcast winter sky'
      }
    };

    const seasonInfo = seasonDetails[season] || seasonDetails.spring;

    // Parse the plant count from the prompt
    const plantCountMatch = prompt.match(/Total plants: (\d+)/);
    const totalPlants = plantCountMatch ? parseInt(plantCountMatch[1]) : 1;

    // Build a STRICT prompt that only shows what's in the plan
    const fullPrompt = `Professional landscape photograph of a residential front yard garden bed, shot from an elevated perspective.

CRITICAL: This image must show ONLY the following plants - NO ADDITIONAL PLANTS:
${prompt}

STRICT REQUIREMENTS:
- Show EXACTLY ${totalPlants} individual plant(s) total - count them
- DO NOT add any plants not listed above
- DO NOT fill empty space with extra shrubs, flowers, or groundcover
- Empty mulch areas are CORRECT if the plan is sparse
- If only 9 Japanese Maples are listed, show ONLY 9 Japanese Maple trees

CAMERA ANGLE:
- Elevated view from second-story window or 15-20 feet up
- Camera positioned 25-30 feet back from the garden bed
- 25-30 degree downward angle (between eye-level and bird's eye)
- Shows full garden bed layout while still seeing plant forms and structure
- Must see: entire garden bed, surrounding lawn, house facade in background

SCENE:
- ${season} season, ${seasonInfo.lighting}, ${seasonInfo.sky}
- Suburban house visible in background
- Brown mulch garden bed with clearly defined edges
- Green lawn surrounding the bed
- Walkway or lawn edge visible for scale

PLANT RENDERING:
- Trees at 60-70% mature size (established 2-3 years)
- Show full plant structure - trunks, branches, and canopy visible
- See both the height and spread of each plant
- Appropriate spacing between plants

STYLE: Professional landscaping portfolio photo, elevated angle, sharp focus, natural lighting.

FORBIDDEN: Do not add roses, azaleas, hostas, ferns, annuals, or ANY plant not explicitly listed in the plant list above.`;

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
      version: "bytedance/seedream-3",
      input: {
        prompt: prompt,
        aspect_ratio: "16:9",
        output_format: "webp",
        output_quality: 90,
        guidance_scale: 9,
        num_inference_steps: 30
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
