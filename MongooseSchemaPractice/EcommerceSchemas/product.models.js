import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    description: {
        type: String,
        require: true
    },
    name: {
        type: String,
        require: true
    },
    image: {
        type: String,
    },
    price: {
        type: Number,
        default: 0
    },
    stock: {
        type: Number,
        default: 0
    },
    category : {
        type: mongoose.Schema.type.ObjectId,
        ref: 'Category'
    },
    owner : {
        type: mongoose.Schema.type.ObjectId,
        ref: 'User'
    },
},{timestamps:true});


export const Product = mongoose.model('Product', productSchema);