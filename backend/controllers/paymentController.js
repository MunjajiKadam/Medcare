import Razorpay from 'razorpay';
import crypto from 'crypto';
import AppError from '../utils/AppError.js';
import logger from '../utils/logger.js';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createOrder = async (req, res, next) => {
  const { amount } = req.body;
  try {
    logger.info(`💳 [PAYMENT] Creating order for amount: ${amount}`);

    if (!amount || amount <= 0) {
      return next(new AppError('Invalid payment amount', 400));
    }

    const order = await razorpay.orders.create({
      amount: amount * 100, // Amount in paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    });

    logger.info(`✅ [PAYMENT] Order created: ${order.id}`);
    res.json({ status: 'success', order });
  } catch (err) {
    logger.error(`❌ [PAYMENT] Order creation failed: ${err.message}`);
    next(new AppError('Order creation failed', 500));
  }
};

export const verifyPayment = (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return next(new AppError('Missing payment verification details', 400));
    }

    const key_secret = process.env.RAZORPAY_KEY_SECRET;
    const generated_signature = crypto.createHmac('sha256', key_secret)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');

    if (generated_signature === razorpay_signature) {
      logger.info(`✅ [PAYMENT] Verification successful for order: ${razorpay_order_id}`);
      res.json({ status: 'success', message: 'Payment verified' });
    } else {
      logger.warn(`❌ [PAYMENT] Verification failed for order: ${razorpay_order_id}`);
      next(new AppError('Payment verification failed', 400));
    }
  } catch (error) {
    next(error);
  }
};
