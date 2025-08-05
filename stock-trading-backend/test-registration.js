const axios = require('axios');

async function testRegistration() {
  try {
    const response = await axios.post('http://localhost:5000/users/register', {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    });

    console.log('✅ Registration successful!');
    console.log('Response:', response.data);
  } catch (error) {
    console.error('❌ Registration failed!');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Error:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
}

testRegistration();
