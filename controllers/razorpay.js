const jwt = require('jsonwebtoken');
const Razorpay = require('razorpay');
const Order = require('../models/orders');

function generateAccessToken(id, name, ispremiumuser) {
    return jwt.sign({ userId: id, name: name, ispremiumuser: ispremiumuser }, 'secretkey');
}

exports.getPurchase = async (req, res) => {
    try {
        var rzp = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        });

        const amount = 2500;
        console.log(amount);

        rzp.orders.create({ amount, currency: "INR" }, async (err, order) => {
            if (err) {
                return res.status(500).json({ message: 'Failed to create order', error: err });
            }

            try {
                await req.user.createOrder({ orderid: order.id, status: 'PENDING' });
                return res.json({ order, key_id: rzp.key_id });
            } catch (err) {
                return res.status(500).json({ message: 'Failed to create order', error: err });
            }
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'something went wrong', error: err });
    }
};

exports.getUpdate = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { payment_id, order_id } = req.body;
        const order = await Order.findOne({ where: { orderid: order_id } });

        try {
            await order.update({ paymentid: payment_id, status: 'SUCCESSFULL' });
            await req.user.update({ ispremiumuser: true });
            return res.status(202).json({ success: true, message: "Transaction Successful", token: generateAccessToken(userId, undefined, true) });
        } catch (err) {
            return res.status(500).json({ message: 'Failed to update order', error: err });
        }

    } catch (err) {
        res.status(500).json({ message: 'something went wrong', error: err });
    }
};
