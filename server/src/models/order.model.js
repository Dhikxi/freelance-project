const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    gigID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Gig',
        required: true,
    },
    projectID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: false // Not needed for all orders
      },
      

    image: {
        type: String,
        required: false,
    },
    title: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    sellerID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    buyerID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    isCompleted: {
        type: Boolean,
        default: false,
    },
    payment_intent: {
        type: String,
        required: true,
    },
}, {
    versionKey: false
});

module.exports = mongoose.model('Order', orderSchema);