const https = require('https');
const { getStore } = require('@netlify/blobs');

// Configure as a background function (15 minute timeout)
exports.config = {
  type: 'background'
};

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    console.error('OPENAI_API_KEY not set');
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'OpenAI API key not configured' })
    };
  }

  try {
    const { prompt, season = 'spring', jobId } = JSON.parse(event.body);

    if (!prompt || !jobId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'prompt and jobId are required' })
      };
    }

    console.log('Background job started:', jobId);
    console.log('Season:', season);

    // Get blob store for results
    const store = getStore('image-results');

    // Mark job as processing
    await store.setJSON(jobId, { status: 'processing', startedAt: Date.now() });

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

    const fullPrompt = `Professional landscape photograph of a residential garden bed in ${season}:

${prompt}

Scene: ${seasonInfo.lighting}. Plants showing ${seasonInfo.plants}. Color palette: ${seasonInfo.colors}.

Requirements:
- Photorealistic garden magazine style
- Eye-level shot with lawn border and mulch
- Natural layering: tall plants back, medium middle, low front
- NO text, labels, people, or decorations
- Sharp focus, rich colors, professional quality`;

    console.log('Calling OpenAI DALL-E 3...');

    try {
      const response = await callOpenAI(apiKey, fullPrompt);

      console.log('Image generated successfully for job:', jobId);

      // Store successful result
      await store.setJSON(jobId, {
        status: 'complete',
        imageUrl: response.data[0].url,
        revisedPrompt: response.data[0].revised_prompt,
        completedAt: Date.now()
      });
    } catch (error) {
      console.error('OpenAI error:', error.message);

      // Store error result
      await store.setJSON(jobId, {
        status: 'error',
        error: error.message,
        completedAt: Date.now()
      });
    }

    // Background functions return 202 Accepted
    return { statusCode: 202, body: JSON.stringify({ jobId, status: 'processing' }) };
  } catch (error) {
    console.error('Function error:', error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};

function callOpenAI(apiKey, prompt) {
  return new Promise((resolve, reject) => {
    const requestBody = {
      model: 'dall-e-3',
      prompt: prompt,
      n: 1,
      size: '1024x1024',
      quality: 'standard',
      style: 'natural'
    };

    const data = JSON.stringify(requestBody);

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
          reject(new Error('Gateway error from OpenAI'));
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
          reject(new Error('Failed to parse OpenAI response'));
        }
      });
    });

    req.on('error', (e) => reject(new Error(`Network error: ${e.message}`)));

    // 2 minute timeout for background function
    req.setTimeout(120000, () => {
      req.destroy();
      reject(new Error('OpenAI request timed out'));
    });

    req.write(data);
    req.end();
  });
}
