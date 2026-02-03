const BASE_URL = 'http://localhost:5000';

async function testStatusUpdate() {
  try {
    console.log('🔍 [DEBUG] Starting comprehensive status update test...\n');

    // Step 1: Login as doctor
    console.log('🔐 [DEBUG] Step 1: Logging in as doctor...');
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'john@medcare.com',
        password: 'password123'
      })
    });

    const loginData = await loginRes.json();
    if (!loginData.token) {
      console.log('❌ [DEBUG] No token received');
      console.log('Response:', loginData);
      process.exit(0);
    }

    const token = loginData.token;
    console.log('✅ [DEBUG] Login successful, token received');

    // Helper function for authenticated requests
    const authenticatedFetch = (url, options = {}) => {
      return fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          ...options.headers
        }
      });
    };

    // Step 2: Fetch appointments
    console.log('\n📤 [DEBUG] Step 2: Fetching doctor appointments...');
    const appointmentsRes = await authenticatedFetch(`${BASE_URL}/appointments`);
    const appointmentsData = await appointmentsRes.json();
    console.log(`✅ [DEBUG] Got ${appointmentsData.appointments.length} appointments`);

    const apt = appointmentsData.appointments.find(a => a.status === 'scheduled');
    if (!apt) {
      console.log('⚠️ [DEBUG] No scheduled appointment found');
      process.exit(0);
    }

    console.log(`\n📍 [DEBUG] Testing with appointment:`);
    console.log(`  ID: ${apt.id}`);
    console.log(`  Patient: ${apt.patient_name}`);
    console.log(`  Current Status: ${apt.status}`);

    // Step 3: Update status
    console.log(`\n🔄 [DEBUG] Step 3: Sending update request...`);
    console.log(`  PUT /appointments/${apt.id}`);
    console.log(`  Body: { "status": "completed" }`);

    const updateRes = await authenticatedFetch(`${BASE_URL}/appointments/${apt.id}`, {
      method: 'PUT',
      body: JSON.stringify({ status: 'completed' })
    });

    const updateData = await updateRes.json();
    console.log(`✅ [DEBUG] Update request successful`);
    console.log(`  Response:`, updateData);

    // Step 4: Verify update
    console.log(`\n🔍 [DEBUG] Step 4: Verifying status change...`);
    await new Promise(resolve => setTimeout(resolve, 500));

    const verifyRes = await authenticatedFetch(`${BASE_URL}/appointments`);
    const verifyData = await verifyRes.json();
    const updated = verifyData.appointments.find(a => a.id === apt.id);

    console.log(`\n📊 [DEBUG] Verification result:`);
    console.log(`  Current Status: ${updated.status}`);

    if (updated.status === 'completed') {
      console.log(`\n✅ SUCCESS! Status updated from "scheduled" to "completed"`);
    } else {
      console.log(`\n❌ FAILED! Status is still "${updated.status}"`);
    }

    process.exit(0);
  } catch (error) {
    console.error('\n❌ [ERROR]', error.message);
    process.exit(1);
  }
}

testStatusUpdate();
