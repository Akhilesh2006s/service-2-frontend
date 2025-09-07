// Debug script to check interview data
const API_BASE_URL = 'https://service-2-backend-production.up.railway.app/api';

async function debugInterview() {
  try {
    // First, let's check if we can get applications
    console.log('🔍 Checking applications...');
    
    // You'll need to replace this with a valid token
    const token = 'YOUR_TOKEN_HERE'; // Replace with actual token
    
    const response = await fetch(`${API_BASE_URL}/employees/applications`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    console.log('📊 API Response:', data);
    
    if (data.status === 'success') {
      const applications = data.data?.applications || [];
      console.log('📋 Total Applications:', applications.length);
      
      // Check for interview status applications
      const interviewApps = applications.filter(app => app.status === 'interview');
      console.log('🎯 Interview Applications:', interviewApps.length);
      
      interviewApps.forEach((app, index) => {
        console.log(`\n📅 Interview ${index + 1}:`);
        console.log('  - Application ID:', app._id);
        console.log('  - Status:', app.status);
        console.log('  - Interview Data:', app.interviewData);
        console.log('  - Opportunity:', app.opportunity?.title);
        console.log('  - Organization:', app.organization?.name);
      });
    } else {
      console.error('❌ API Error:', data.message);
    }
    
  } catch (error) {
    console.error('💥 Debug Error:', error);
  }
}

// Run the debug function
debugInterview();
