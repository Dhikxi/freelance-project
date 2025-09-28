const { Order, Project, Gig } = require('../models');
const { CustomException } = require('../utils');
const stripe = require('stripe')(process.env.STRIPE_SECRET);

// CREATE or UPDATE Stripe payment intent
const paymentIntent = async (req, res) => {
  const { _id } = req.params;

  try {
    let order = await Order.findOne({ projectID: _id });

    if (!order) {
      const project = await Project.findById(_id);
      if (!project) throw CustomException('Project not found', 404);

      const gig = await Gig.findById(project.gigID);
      if (!gig) throw CustomException('Gig not found', 404);

      const paymentIntent = await stripe.paymentIntents.create({
        amount: project.budget * 100,
        currency: 'INR',
        automatic_payment_methods: { enabled: true },
      });

      order = await Order.create({
        gigID: gig._id,
        image: gig.cover || '',
        title: project.title,
        price: project.budget,
        sellerID: project.freelancerID,
        buyerID: project.buyerID,
        payment_intent: paymentIntent.id,
        projectID: _id,
      });

      return res.send({
        error: false,
        clientSecret: paymentIntent.client_secret,
      });
    } else {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: order.price * 100,
        currency: 'INR',
        automatic_payment_methods: { enabled: true },
      });

      order.payment_intent = paymentIntent.id;
      await order.save();

      return res.send({
        error: false,
        clientSecret: paymentIntent.client_secret,
      });
    }
  } catch ({ message, status = 500 }) {
    return res.status(status).send({ error: true, message });
  }
};

const confirmPayment = async (req, res) => {
  try {
    const { payment_intent } = req.body;

    const order = await Order.findOneAndUpdate(
      { payment_intent },
      { isCompleted: true },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({ message: 'Order confirmed', order });
  } catch (err) {
    res.status(500).json({ message: 'Error confirming payment', error: err.message });
  }
};

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      $or: [{ buyerID: req.userID }, { sellerID: req.userID }],
    }).sort({ createdAt: -1 });

    res.status(200).json({ error: false, orders });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
};

const updatePaymentStatus = async (req, res) => {
  try {
    const { payment_intent } = req.body;

    const order = await Order.findOneAndUpdate(
      { payment_intent },
      { isCompleted: true },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ error: true, message: 'Order not found' });
    }

    res.status(200).json({ error: false, message: 'Order marked complete', order });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
};

module.exports = {
  paymentIntent,
  confirmPayment,
  getOrders,
  updatePaymentStatus,
};
