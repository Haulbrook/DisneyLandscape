const https = require('https');

exports.handler = async (event) => {
  // Only allow POST requests
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

    console.log('Received prompt:', prompt);
    console.log('Season:', season);

    // Season-specific lighting and plant appearance
    const seasonDetails = {
      spring: {
        lighting: 'soft morning light with slight haze, fresh dewy atmosphere',
        plants: 'fresh bright green foliage, flowering plants in early bloom, some plants just leafing out',
        colors: 'light greens, pinks, whites, soft yellows, lavenders'
      },
      summer: {
        lighting: 'warm golden hour sunlight, clear blue sky, slight lens flare',
        plants: 'full lush foliage at peak growth, flowers in full bloom, dense healthy coverage',
        colors: 'deep greens, vibrant reds, purples, yellows, oranges'
      },
      fall: {
        lighting: 'warm amber afternoon light, soft shadows, slightly overcast',
        plants: 'mature plants with fall colors where applicable, ornamental grasses with plumes',
        colors: 'warm oranges, reds, burgundies, golden yellows, bronze tones'
      },
      winter: {
        lighting: 'cool crisp winter light, soft overcast sky',
        plants: 'evergreen plants prominent, deciduous plants with interesting bark/structure, ornamental grasses tan colored',
        colors: 'deep greens of evergreens, browns, tans, subtle winter interest'
      }
    };

    const seasonInfo = seasonDetails[season] || seasonDetails.spring;

    // Build the optimized DALL-E 3 prompt
    const fullPrompt = `PHOTOREALISTIC LANDSCAPE PHOTOGRAPHY of a professionally designed residential garden bed:

${prompt}

SEASONAL APPEARANCE (${season.toUpperCase()}):
- Lighting: ${seasonInfo.lighting}
- Plant appearance: ${seasonInfo.plants}
- Color palette: ${seasonInfo.colors}

COMPOSITION & CAMERA:
- Shot from eye-level, standing at the front edge of the bed looking toward the back
- Wide angle lens (24-35mm equivalent) to capture the full bed
- Shallow depth of field with foreground plants sharp, background slightly soft
- Rule of thirds composition with focal plant positioned off-center

SETTING:
- Residential backyard or front yard of an upscale suburban home
- Well-manicured grass lawn bordering the bed
- Clean curved bed edge with dark brown shredded hardwood mulch visible between plants
- Background hints: wooden fence, house siding, or mature trees - slightly blurred

REALISM REQUIREMENTS:
- Professional landscape photography style (like from a garden magazine)
- Natural plant spacing and layering (tall in back, medium in middle, low in front)
- Plants at correct mature sizes relative to each other
- Healthy, well-maintained appearance
- Absolutely NO artificial elements, NO garden gnomes, NO decorations
- NO people, NO animals, NO garden tools
- NO text, NO watermarks, NO labels

QUALITY:
- Sharp focus on main plants
- Rich natural colors
- Professional photography quality
- Realistic shadows and highlights`;

    console.log('Full prompt length:', fullPrompt.length);

    const response = await callOpenAI(apiKey, fullPrompt);

    console.log('Successfully generated image');

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
    // DALL-E 3 request configuration
    const requestBody = {
      model: 'dall-e-3',
      prompt: prompt,
      n: 1,
      size: '1792x1024',      // Landscape orientation for garden beds
      quality: 'standard',     // 'standard' is faster (15-20s vs 30-60s for 'hd')
      style: 'natural'         // More photorealistic than 'vivid'
    };

    const data = JSON.stringify(requestBody);

    console.log('Calling OpenAI DALL-E 3 API...');
    console.log('Model:', requestBody.model);
    console.log('Size:', requestBody.size);
    console.log('Quality:', requestBody.quality);

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

        // Check if response is HTML (error page from gateway)
        if (body.trim().startsWith('<') || body.trim().startsWith('<!')) {
          console.error('Received HTML instead of JSON. Status:', res.statusCode);
          console.error('First 500 chars:', body.substring(0, 500));
          reject(new Error(`Gateway error (${res.statusCode}). The request may have timed out. Please try again.`));
          return;
        }

        try {
          const response = JSON.parse(body);

          if (res.statusCode !== 200) {
            console.error('OpenAI API Error:', JSON.stringify(response.error, null, 2));
            const errorMsg = response.error?.message || `OpenAI API error (${res.statusCode})`;
            reject(new Error(errorMsg));
            return;
          }

          if (!response.data || !response.data[0] || !response.data[0].url) {
            console.error('Unexpected response structure:', JSON.stringify(response, null, 2));
            reject(new Error('Invalid response from OpenAI - no image URL returned'));
            return;
          }

          console.log('Image generated successfully');
          console.log('Revised prompt:', response.data[0].revised_prompt?.substring(0, 200) + '...');
          resolve(response);
        } catch (e) {
          console.error('JSON Parse Error:', e.message);
          console.error('Response body (first 500 chars):', body.substring(0, 500));
          reject(new Error(`Failed to parse OpenAI response: ${e.message}`));
        }
      });
    });

    req.on('error', (e) => {
      console.error('Network Request Error:', e.message);
      reject(new Error(`Network error: ${e.message}`));
    });

    // 55 second timeout (Netlify function timeout is 60s)
    req.setTimeout(55000, () => {
      console.error('Request timed out after 55 seconds');
      req.destroy();
      reject(new Error('DALL-E 3 is taking too long to respond. Please try again - image generation can sometimes be slow.'));
    });

    req.write(data);
    req.end();
  });
}
