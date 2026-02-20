import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { appointmentAPI } from '../api/api';
import axios from '../api/axios';

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const initialAmount = location.state?.amount || '';
  const appointmentId = location.state?.appointmentId || null;

  const [amount, setAmount] = useState(initialAmount);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!initialAmount) setAmount('');
  }, [initialAmount]);

  const handlePayment = async () => {
    setLoading(true);
    try {
      // Call backend to create Razorpay order (use axios baseURL -> http://localhost:5000/api)
      const createRes = await axios.post('/payment/create-order', { amount: Number(amount) });
      const { order } = createRes.data;

      // Razorpay options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'Medcare Payment',
        description: 'Payment for appointment',
        order_id: order.id,
        handler: async function (response) {
          try {
            // Call backend to verify payment
            const verifyRes = await axios.post('/payment/verify', {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            });
            const verifyData = verifyRes.data;
            if (verifyRes.ok && verifyData.success) {
              // Mark appointment as confirmed
              if (appointmentId) {
                await appointmentAPI.updateAppointment(appointmentId, { status: 'confirmed' });
              }
              // Redirect to patient's appointments (booking success)
              navigate('/patient/appointments', { replace: true });
            } else {
              alert('Payment verification failed');
            }
          } catch (e) {
            console.error('Payment verification error', e);
            alert('Payment verification error');
          }
        },
        theme: {
          color: '#3399cc',
        },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      alert('Payment failed');
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Payment</h2>
      <input
        type="number"
        placeholder="Enter amount"
        value={amount}
        onChange={e => setAmount(e.target.value)}
        className="border p-2 mb-4"
      />
      <button
        onClick={handlePayment}
        className="bg-blue-500 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? 'Processing...' : 'Pay Now'}
      </button>
    </div>
  );
};

export default PaymentPage;
