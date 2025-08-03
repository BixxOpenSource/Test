const fetch = require('node-fetch');

async function testAPI() {
  try {
    console.log('🧪 Testing NSFW Detection API...');
    
    // Test with the example image from the original code
    const testImageUrl = 'https://raw.githubusercontent.com/gradio-app/gradio/main/test/test_files/bus.png';
    const apiUrl = `http://localhost:3000/api/detect/${encodeURIComponent(testImageUrl)}`;
    
    console.log(`📡 Making request to: ${apiUrl}`);
    
    const response = await fetch(apiUrl);
    const result = await response.json();
    
    console.log('✅ API Response:');
    console.log(JSON.stringify(result, null, 2));
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  testAPI();
}

module.exports = { testAPI }; 