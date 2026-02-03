import axios from 'axios';

const BASE_URL = 'http://localhost:5000';

// Mock doctor token (you'll need a real token from your system)
const doctorToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwibmFtZSI6IkRyLiBSYWohciIsInJvbGUiOiJkb2N0b3IiLCJpYXQiOjE3MzY2MDUwMDB9.sQ8dxf8xM4I8XQ5ZY_3F5QQ_RzF8D7C9E0F1G2H3I4J';

const client = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${doctorToken}`
  }
});

async function testStatusUpdateFlow() {
  try {
    console.log('🔍 [TEST] Starting appointment status update flow test...\n');

    // Step 1: Fetch appointments to find one to update
    console.log('📤 [TEST] Step 1: Fetching doctor appointments...');
    const appointmentsRes = await client.get('/appointments');
    console.log('✅ [TEST] Appointments fetched:', appointmentsRes.data.appointments?.length || 0);
    
    if (!appointmentsRes.data.appointments || appointmentsRes.data.appointments.length === 0) {
      console.log('⚠️ [TEST] No appointments found');
      process.exit(0);
    }

    const appointment = appointmentsRes.data.appointments.find(a => a.status === 'scheduled');
    if (!appointment) {
      console.log('⚠️ [TEST] No scheduled appointment found to test');
      process.exit(0);
    }

    console.log(`📍 [TEST] Found appointment to test:`, {
      id: appointment.id,
      patient: appointment.patient_name,
      status: appointment.status,
      date: appointment.appointment_date
    });

    // Step 2: Update appointment to completed
    console.log(`\n📝 [TEST] Step 2: Updating appointment ${appointment.id} status to "completed"...`);
    const updateRes = await client.put(`/appointments/${appointment.id}`, {
      status: 'completed'
    });
    console.log('✅ [TEST] Update request successful:', updateRes.data);

    // Step 3: Fetch appointments again to verify status changed
    console.log(`\n🔄 [TEST] Step 3: Re-fetching appointments to verify status change...`);
    await new Promise(resolve => setTimeout(resolve, 500)); // Small delay to ensure database commit
    
    const verifyRes = await client.get('/appointments');
    const updatedAppointment = verifyRes.data.appointments.find(a => a.id === appointment.id);
    
    if (updatedAppointment) {
      console.log(`📊 [TEST] Updated appointment status:`, updatedAppointment.status);
      if (updatedAppointment.status === 'completed') {
        console.log('✅ [TEST] SUCCESS! Status was updated from "scheduled" to "completed"');
      } else {
        console.log('❌ [TEST] FAILED! Status is still:', updatedAppointment.status);
      }
    } else {
      console.log('❌ [TEST] FAILED! Appointment not found after update');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ [TEST] Error:', error.response?.data || error.message);
    console.error('📋 [TEST] Status code:', error.response?.status);
    process.exit(1);
  }
}

testStatusUpdateFlow();
