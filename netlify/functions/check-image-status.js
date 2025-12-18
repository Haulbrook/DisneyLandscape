const { getStore } = require('@netlify/blobs');

exports.handler = async (event) => {
  // Allow GET requests for status checks
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  const jobId = event.queryStringParameters?.jobId;

  if (!jobId) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'jobId is required' })
    };
  }

  try {
    const store = getStore('image-results');
    const result = await store.get(jobId, { type: 'json' });

    if (!result) {
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'pending' })
      };
    }

    // If job is complete or errored, delete from store after returning
    if (result.status === 'complete' || result.status === 'error') {
      // Clean up after a delay (don't block the response)
      setTimeout(async () => {
        try {
          await store.delete(jobId);
        } catch (e) {
          console.log('Cleanup error (non-critical):', e.message);
        }
      }, 1000);
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(result)
    };
  } catch (error) {
    console.error('Error checking status:', error.message);
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'pending' })
    };
  }
};
