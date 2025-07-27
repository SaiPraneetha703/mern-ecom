// model/ProductModel.js
const mongoose = require('mongoose');
const ecomDbConnection = mongoose.connection.useDb('Ecomdb');
const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  pic: {
    type: String,
    default: 'https://placehold.co/300x200/D0E0F0/000000?text=Product'
  },
  price: { type: Number, required: true, min: 0 },
  mfg: { type: String, trim: true },
  discount: { type: Number, default: 0, min: 0, max: 100 },
  offer: { type: String, trim: true }
}, {
  timestamps: true
});

const productModel = ecomDbConnection.model('Product', productSchema);
module.exports = productModel;