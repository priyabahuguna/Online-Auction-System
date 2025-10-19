const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    name: { type: String, required: true},
    email: { type: String, required: true, unique: true },
    contactnumber: { type: Number, required: true, unique: true },
    password: { type: String, required: true },
    image: { type: String }, // Add a field to store the image path
    productUploadedForSale: { type: Number, default: 0 },
    productBought: { type: Number, default: 0 },
    uniqueid: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    boughtProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }] 
});

const User = mongoose.model('user', UserSchema);
module.exports = User;
