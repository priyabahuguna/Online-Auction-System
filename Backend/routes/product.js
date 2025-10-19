const express = require('express');
const Product = require('../models/Product');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { body, validationResult } = require('express-validator');
var jwt = require('jsonwebtoken');
var fetchProduct = require('../middleware/fetchProduct');
var fetchUser = require('../middleware/fetchUser');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const axios = require('axios');


const JWT_SECRET = "thisisavery";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'C:/Users/priya/Desktop/onlineauctionsystem/productImages');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Add unique timestamp to filename
  }
});

const upload = multer({ storage: storage });

// Ensure the 'uploads' directory exists and is accessible from the client
const fs = require('fs');
const uploadDir = path.join(__dirname, '..', 'productImages');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

router.post('/createproduct', upload.single('image'), [
  body('name', "Enter a valid name").isLength({ min: 2 }),
  body('category').isLength({ min: 2 }),
  body('description', "Enter valid description").isLength({ min: 2 }),
  body('startingbidprice', "Enter a valid starting bid price").isNumeric(),
  body('reserveprice', "Enter a valid reserve price").isNumeric(),
  body('durationInMinutes', "Enter a valid duration").isNumeric(),
  body('paymentmethods', "Enter a valid payment method").isLength({ min: 2 }),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    let success = false;

    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }

    let product = await Product.findOne({ description: req.body.description });

    if (product) {
      return res.status(400).json({ success, error: "Sorry, a product with this description already exists" });
    }

    const createdAt = new Date();
    const durationInMinutes = parseInt(req.body.durationInMinutes);
    const endDate = new Date(createdAt.getTime() + durationInMinutes * 60000); // Convert minutes to milliseconds

    product = await Product.create({
      name: req.body.name,
      seller: req.body.seller,
      category: req.body.category,
      description: req.body.description,
      startingbidprice: req.body.startingbidprice,
      reserveprice: req.body.reserveprice,
      currentbidprice: req.body.startingbidprice,
      durationInMinutes: req.body.durationInMinutes,
      paymentmethods: req.body.paymentmethods,
      condition: req.body.condition,
      status: req.body.status,
      createdAt: createdAt,
      endDate: endDate,
      image: req.file ? req.file.filename : null
    });
    success = true;
    console.log(req.body.seller);
    const user=await User.findById(req.body.seller);
    user.productUploadedForSale+=1;
    await user.save();
    //await User.findByIdAndUpdate(req.body.seller, { $inc: { productUploadedForSale: 1 } });
    res.json({ success, product });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});


router.get('/product/:id', fetchProduct, async (req, res) => {
    try {
        const productId = req.product.id;
        const product = await Product.findById(productId);
        res.json(product);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

router.get('/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

router.get('/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const products = await Product.find({ seller: id });
        res.json(products);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

router.get('/upcoming', async (req, res) => {
    try {
      // Fetch products whose status is 'active' and endDate is in the future
      const products = await Product.find({ status: 'active' });
      res.json(products);
    } catch (error) {
      console.error('Error fetching upcoming auctions:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  router.get('/search/:category/:searchTerm', async (req, res) => {
    try {
        const { category, searchTerm } = req.params; // Extracting category and searchTerm from params
        //console.log("Category:", category);
        //console.log("Search term:", searchTerm);
        const products = await Product.find({
            name: { $regex: new RegExp(searchTerm, 'i') }, // Case-insensitive search for product name
            category, // Filter by category
            status: 'active' // Only active products
        });
        res.json(products);
    } catch (error) {
        console.error('Error searching for products:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/place-bid/:productId', fetchUser, async (req, res) => {
    try {
        const { productId } = req.params;
        const { bidAmount } = req.body;
        const userId = req.user.id; // Extract userId from request

        // Fetch the product
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Check if bid amount is greater than current bid price
        if (bidAmount <= product.currentbidprice) {
            return res.status(400).json({ error: 'Bid amount must be higher than the current bid price' });
        }

        // Update product bid information
        product.currentbidprice = bidAmount;
        product.bidders.push({ userId, bidAmount });
        // Sort the bidders array based on bidAmount in descending order
        product.bidders.sort((a, b) => b.bidAmount - a.bidAmount);
        // Update the current bid price to the highest bid amount
        product.currentbidprice = product.bidders[0].bidAmount;
        await product.save();
        
        res.json({ success: true, message: 'Bid placed successfully' });
    } catch (error) {
        console.error('Error placing bid:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

const checkExpiredAuctions = async () => {
    try {
        const currentTime = new Date();
        const expiredProducts = await Product.find({ status: 'expired'});
        
        if(expiredProducts.length === 0) {
            //console.log('No expired auctions found');
            return;
        }
        // Process each expired auction
        console.log("Expired products",expiredProducts.length);
        for (let i = 0; i < expiredProducts.length; i++) {
            const product = expiredProducts[i];
            if(product.bidders.length>0&&product.status==='expired')
            {
                const winningBidder = product.bidders[0]; // Assuming bidders array contains userId and bidAmount
                console.log(product._id);
                await Product.findByIdAndUpdate(product._id, { $push : {winningBidder: winningBidder}, transactionStatus: 'pending' });
                await product.save();
                await sendEmailToWinner(winningBidder, product);
                await Product.findByIdAndUpdate(product._id, { $set:{status: 'email sent to winner' }});
                await product.save();
                console.log("Email send successfully");
                await updateInventory(product, winningBidder.userId, product.seller);
            }
        }
    } catch (error) {
        console.error('Error checking expired auctions:', error);
    }
};

//function to increase the number of product bought by user
const updateInventory = async (product, buyerId, sellerId) => {
    try {
        console.log("buyer id",buyerId);
        console.log("seller id",sellerId);
        const buyer = await User.findById(buyerId);
        const seller = await User.findById(sellerId);

        if (!buyer || !seller) {
            console.error('Buyer or Seller not found');
            return;
        }

        /*// Add product to buyer's inventory and increment product count
        buyer.boughtProducts.push(product);
        buyer.productBought += 1;*/
        await User.findByIdAndUpdate(buyerId, { $push: { boughtProducts: product }, $inc: { productBought: 1 } });
        await buyer.save();

        // Optional: Update seller's stats, if needed

        console.log('Inventory updated successfully');
    } catch (error) {
        console.error('Error updating inventory:', error);
    }
};

// Function to send email to winning bidder
const sendEmailToWinner = async (winner, product) => {
    try {
        // Fetch user details using the userId
        console.log("winner id",winner.userId);
        const user = await User.findById(winner.userId);

        if (!user) {
            console.error('User not found');
            return;
        }
        console.log("sending mail");
        // Implement logic to send email to the winning bidder
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'priyabahuguna220@gmail.com',
                pass: 'sslt dkek ahcb yycm'
            }
        });

        console.log("product seller",product.seller);
        const seller=await User.findById(product.seller);

        const mailOptions = {
            from: 'priyabahuguna220@gmail.com',
            to: user.email,
            subject: 'Congratulations! You have won the bid',
            html: 
                `
      <h3>Congratulations! You've won the auction for ${product.name}!</h3>
      <p>Please contact the seller to arrange payment and shipping:</p>
      <p><strong>Seller's Email:</strong> ${seller.email}</p>
      <p><strong>Seller's Phone:</strong> ${seller.contactnumber}</p>
      <p><strong>Payment Details:</strong></p>
      <ul>
        <li><strong>UPI ID:</strong> priyabahuguna@oksbi</li>
        <li><strong>Bank Name:</strong> PNB</li>
        <li><strong>Account Number:</strong>84787 </li>
        <li><strong>Account Name:</strong>Priya Bahuguna </li>
        <li><strong>IFSC Code:</strong>342211 </li>
      </ul>
      <p><a href="http://localhost:3000/confirm-transaction/${product._id}/${seller._id}">Click here</a> to confirm the transaction and submit your shipping details.</p>
    `
};
        await transporter.sendMail(mailOptions);
        return;
    } catch (error) {
        console.error('Error sending email to winner:', error);
    }
};

setInterval(checkExpiredAuctions, 60000); 

router.post('/confirmTransaction/:productId', async (req, res) => {
    try {
      const { productId } = req.params;
      const { buyerId, address, proofOfPayment } = req.body;
  
      // Validate buyerId, address, and proofOfPayment as needed
  
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
  
      // Update product details with buyer info and mark transaction as confirmed
      product.transactionDetails.buyerId = buyerId;
      product.transactionDetails.address = address;
      product.transactionDetails.proofOfPayment = proofOfPayment;
      product.transactionStatus = 'confirmed';
  
      await product.save();

      const seller=User.findById(product.seller);
      
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'priyabahuguna220@gmail.com',
            pass: 'sslt dkek ahcb yycm'
        }
    });

    const mailOptions = {
        from: 'priyabahuguna220@gamil.com',
        to: seller.email,
        subject: 'Shipment Address Confirmation',
        text:`Dear Seller,\n\nThe buyer has confirmed the transaction for product ${product.name}.\n\nShipping Address:\n${product.transactionDetails.address.addressLine1}\n${product.transactionDetails.address.addressLine2 ? product.transactionDetails.address.addressLine2 + '\n' : ''}${product.transactionDetails.address.city}, ${product.transactionDetails.address.state} ${product.transactionDetails.address.zipCode}\n${product.transactionDetails.address.country}\n\nPlease proceed with shipment.\n\nRegards,\nYour Company`
};
    await transporter.sendMail(mailOptions);
      res.json({ success: true, message: 'Transaction confirmed successfully' });
    } catch (error) {
      console.error('Error confirming transaction:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  // Endpoint to update shipment status
  router.post('/updateShipment/:productId', async (req, res) => {
    try {
      const { productId } = req.params;
      const { buyerId, otp } = req.body;
  
      // Validate buyerId and otp as needed
  
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
  
      // Perform OTP verification logic here (assuming a simple check for demonstration)
      const otpFromBuyer = '1234'; // Replace with actual OTP verification logic
      if (otp !== otpFromBuyer) {
        return res.status(400).json({ error: 'Invalid OTP' });
      }
  
      // Update shipment status and mark transaction as completed
      product.shipmentStatus = 'shipped';
      product.transactionStatus = 'completed';
  
      await product.save();
  
      res.json({ success: true, message: 'Shipment updated successfully' });
    } catch (error) {
      console.error('Error updating shipment status:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  

module.exports = router;