const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    image: {
        type: String, // URL da imagem
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    priceOld: {
        type: Number,
        required: false
    },
    filters: {
        type: [String], 
        default: []
    },
    size: {
        type: String,
        required: false
    },
    type: {
        type: String,
        required: false
    },
    color: {
        type: String,
        required: false
    },
    isBestSeller: {
        type: Boolean,
        default: false
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Product', ProductSchema);
