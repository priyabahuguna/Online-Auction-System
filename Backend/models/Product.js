const mongoose = require('mongoose');
const { Schema } = mongoose;

const BidderSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'user' },
    bidAmount: { type: Number, required: true },
});

const ProductSchema = new Schema({
    name: { type: String, required: true },
    seller: { type: String, required: true },//??
    category: { type: String, required: true },
    description: { type: String, required: true },
    startingbidprice: { type: Number, required: true },
    reserveprice: { type: Number, required: true },
    currentbidprice: { type: Number, required: true },
    durationInMinutes: { type: Number, required: true },
    paymentmethods: { type: String, required: true },
    condition: { type: String, required: true },
    image:{type:String,required:true},
    status: {
        type: String,
        enum: ['active', 'expired', 'completed','email sent to winner'],
        default: 'active'
    },
    createdAt: { type: Date, default: Date.now },
    endDate: { type: Date, required: true },
    bidders: [BidderSchema],
    winningBidder: [{ type: Schema.Types.ObjectId, ref: 'user' }],
    transactionStatus: { type: String, default: 'pending' },
    shipmentStatus: { type: String, default: 'pending' },
    transactionDetails: {
        buyerId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        },
        address: {
          addressLine1: String,
          addressLine2: String,
          city: String,
          state: String,
          zipCode: String,
          country: String
        },
        proofOfPayment: String,
        status: {
          type: String,
          default: 'pending' // possible values: pending, confirmed, completed
        }
      }
});

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;