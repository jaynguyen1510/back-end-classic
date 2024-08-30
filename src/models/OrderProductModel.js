const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema({
    orderSelected:
        [
            {
                name: { type: String, required: true },
                amount: { type: Number, required: true },
                image: { type: String, required: true },
                price: { type: Number, required: true },
                discount: { type: Number, required: false },
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true
                },
            },
        ],
    shippingAddress: {
        fullName: { type: String, required: true },
        address: { type: String, required: true },
        city: { type: String, required: true },
        country: { type: String, required: false },
        phone: { type: Number, required: true },
    },
    deliveryMethod: { // New field added here
        type: String,
        required: false,
    },
    paymentMethod: {
        type: String,
        required: true,
    },
    itemsPrice: { type: Number, required: true },
    shippingPrice: { type: Number, required: true },
    taxPrice: { type: Number, required: false },
    totalPrice: { type: Number, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
    isDelivered: { type: Boolean, default: false },
    deliveredAt: { type: Date },
},
    {
        timestamps: true
    }
);

const Order = mongoose.model('Order', orderSchema)
module.exports = Order