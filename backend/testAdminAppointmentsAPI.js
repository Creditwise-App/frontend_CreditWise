// Test script to check if admin appointments API is working
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testAdminAppointmentsAPI() {
  try {
    // First, let's login as admin to get a token
    const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@example.com',
        password: 'admin123'
      })
    });
    
    if (!loginResponse.ok) {
      console.error('Login failed:', await loginResponse.text());
      return;
    }
    
    const loginData = await loginResponse.json();
    console.log('Login successful, token:', loginData.token);
    
    // Now let's try to get appointments via admin endpoint
    const appointmentsResponse = await fetch('http://localhost:5000/api/admin/appointments', {
      headers: {
        'Authorization': `Bearer ${loginData.token}`,
        'Content-Type': 'application/json',
      }
    });
    
    console.log('Admin Appointments API response status:', appointmentsResponse.status);
    
    if (!appointmentsResponse.ok) {
      console.error('Failed to fetch appointments:', await appointmentsResponse.text());
      return;
    }
    
    const appointmentsData = await appointmentsResponse.json();
    console.log('Admin Appointments fetched successfully:');
    console.log(JSON.stringify(appointmentsData, null, 2));
  } catch (error) {
    console.error('Error testing admin appointments API:', error);
  }
}

testAdminAppointmentsAPI();