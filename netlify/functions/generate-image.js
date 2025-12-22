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
    const { prompt, season = 'spring', sketchImage } = JSON.parse(event.body);

    if (!prompt) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'prompt is required' })
      };
    }

    // Use img2img when sketch is provided - this preserves plant positions
    const useImg2Img = !!sketchImage;

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

    // Parse the bed shape from the prompt
    const shapeMatch = prompt.match(/Shape: ([^\n]+)/);
    const bedShape = shapeMatch ? shapeMatch[1] : 'rectangular mulch bed';

    // Build a STRICT prompt that includes spatial layout
    const fullPrompt = `Professional landscape photograph of a residential garden bed, viewed from an elevated front angle.

${prompt}

CRITICAL PLACEMENT INSTRUCTIONS:
- Position plants EXACTLY as described in the layout above
- "BACK" means furthest from viewer (against house/fence)
- "FRONT" means closest to viewer (lawn edge)
- "LEFT/RIGHT" are from the viewer's perspective looking at the bed
- Clusters should show plants of the same type grouped tightly together
- Maintain the spatial relationships described

CAMERA & SCENE:
- ${season} season, ${seasonInfo.lighting}, ${seasonInfo.sky}
- Elevated view from 8-10 feet up, 20-25 feet back
- 15-20 degree downward angle showing full bed layout
- ${bedShape} with brown hardwood mulch, curved organic edges
- Green lawn surrounding the bed
- House or fence visible in background behind the bed

PLANT RENDERING:
- Plants at 60-70% mature size (2-3 year established look)
- Show natural plant forms - not perfectly symmetrical
- Clusters of same plants should touch/overlap slightly
- Taller plants in back, shorter in front (layered depth)

STYLE: Professional landscaping portfolio photo, sharp focus, natural ${seasonInfo.lighting}.`;

    let prediction;

    if (useImg2Img && sketchImage) {
      console.log('Calling Replicate SDXL img2img with sketch for accurate placement...');
      prediction = await createImg2ImgPrediction(apiKey, fullPrompt, sketchImage);
    } else {
      console.log('Calling Replicate Seedream-3 (text only)...');
      prediction = await createPrediction(apiKey, fullPrompt);
    }

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
      input: {
        prompt: prompt,
        aspect_ratio: "16:9",
        output_format: "webp",
        output_quality: 90,
        guidance_scale: 9,
        num_inference_steps: 30
      }
    });

    // Use the models endpoint with model name (not version hash)
    const options = {
      hostname: 'api.replicate.com',
      port: 443,
      path: '/v1/models/bytedance/seedream-3/predictions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'Content-Length': Buffer.byteLength(data),
        'Prefer': 'wait'
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
    req.setTimeout(30000, () => {
      req.destroy();
      reject(new Error('Request timed out'));
    });

    req.write(data);
    req.end();
  });
}

// Img2Img using SDXL - preserves layout structure from sketch
function createImg2ImgPrediction(apiKey, prompt, sketchImage) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      input: {
        image: sketchImage,
        prompt: prompt + ", professional landscape photography, realistic plants and foliage, natural lighting, photorealistic, 8k quality",
        negative_prompt: "cartoon, anime, illustration, painting, drawing, sketch, abstract, unrealistic colors, blurry, low quality",
        prompt_strength: 0.75,  // 0.75 = keep 25% of original structure, transform 75%
        num_outputs: 1,
        guidance_scale: 7.5,
        num_inference_steps: 30,
        scheduler: "K_EULER"
      }
    });

    const options = {
      hostname: 'api.replicate.com',
      port: 443,
      path: '/v1/models/stability-ai/sdxl/predictions',
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
            reject(new Error(response.detail || response.error || 'Failed to create img2img prediction'));
            return;
          }
          resolve(response);
        } catch (e) {
          reject(new Error('Failed to parse img2img response'));
        }
      });
    });

    req.on('error', (e) => reject(new Error(`Network error: ${e.message}`)));
    req.setTimeout(30000, () => {
      req.destroy();
      reject(new Error('Request timed out'));
    });

    req.write(data);
    req.end();
  });
}

function pollForResult(apiKey, predictionId, maxAttempts = 60) {
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
