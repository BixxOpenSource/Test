const express = require('express');
const cors = require('cors');
const { Client } = require('@gradio/client');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'NSFW Detection API',
    endpoints: {
      detect: '/api/detect/{image_url}',
      health: '/health'
    }
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// NSFW Detection endpoint
app.get('/api/detect/:imageUrl(*)', async (req, res) => {
  try {
    const imageUrl = req.params.imageUrl;
    
    // Validate URL
    if (!imageUrl || !imageUrl.startsWith('http')) {
      return res.status(400).json({
        error: 'Invalid image URL. Must be a valid HTTP/HTTPS URL.',
        example: '/api/detect/https://example.com/image.jpg'
      });
    }

    console.log(`Processing image: ${imageUrl}`);

    // Fetch the image from the provided URL
    const response = await fetch(imageUrl);
    
    if (!response.ok) {
      return res.status(400).json({
        error: 'Failed to fetch image from URL',
        status: response.status,
        statusText: response.statusText
      });
    }

    const imageBlob = await response.blob();

    // Connect to Gradio client
    const client = await Client.connect("Ateeqq/nsfw-image-detection");
    
    // Predict using the image
    const result = await client.predict("/predict", {
      image: imageBlob,
    });

    console.log('Detection result:', result.data);

    // Return the result as JSON
    res.json({
      success: true,
      image_url: imageUrl,
      detection_result: result.data,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error processing image:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: err.message
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    available_endpoints: {
      detect: '/api/detect/{image_url}',
      health: '/health'
    }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 NSFW Detection API running on port ${PORT}`);
  console.log(`📝 API Documentation:`);
  console.log(`   GET /api/detect/{image_url} - Detect NSFW content in image`);
  console.log(`   GET /health - Health check`);
  console.log(`   GET / - API info`);
}); 
