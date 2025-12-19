import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.type.ObjectId,
        ref: 'Product'
    },
    quantity: {
        type: Number,
        default:0
    }
});

const orderSchema = new mongoose.Schema({
    orderPrice: {
        type: Number,
        default: 0
    },
    customer: {
        type: mongoose.Schema.type.ObjectId,
        ref: 'User'
    },
    orderItems: {
        type: [orderItemSchema]
    },
    address: {
        type: String,
        require: true
    },
    status: {
        enum: ['PENDING', 'CANCELLED', 'DELIVERED'],
        default: 'PENDING',
        type: String
    }
}, {
    timestamps: true
});


export const Order = mongoose.model('Order', orderSchema);