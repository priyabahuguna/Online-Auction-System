const express = require('express');
const multer = require('multer');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchUser = require('../middleware/fetchUser');
const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');

// Multer setup for disk storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'C:/Users/priya/Desktop/onlineauctionsystem/uploads'); // Ensure path is absolute
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

const JWT_SECRET = 'thisisavery';
const OTP_SECRET = 'some_random_secret';

let otps = {}; // In-memory store for OTPs, replace with a proper store in production

// OTP generation and email sending
router.post('/sendotp', [
  body('email', 'Enter a valid email').isEmail(),
], async (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit OTP
  otps[email] = otp; // Store OTP in memory

  // Send OTP via email using nodemailer
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'priyabahuguna220@gmail.com',
      pass: 'sslt dkek ahcb yycm'
    }
  });

  let mailOptions = {
    from: 'priyabahuguna220@gmail.com',
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code is ${otp}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).json({ success: false, error: 'Error sending OTP' });
    } else {
      return res.json({ success: true, message: 'OTP sent successfully' });
    }
  });
});

// OTP verification
router.post('/verifyotp', [
  body('email', 'Enter a valid email').isEmail(),
  body('otp', 'OTP cannot be blank').exists(),
], async (req, res) => {
  const { email, otp } = req.body;
  if (otps[email] && otps[email] == otp) {
    delete otps[email]; // Remove OTP after successful verification
    return res.json({ success: true, message: 'OTP verified successfully' });
  } else {
    return res.status(400).json({ success: false, error: 'Invalid OTP' });
  }
});

// Create User
router.post('/createuser', [
  body('name', 'Enter a valid name').isLength({ min: 3 }),
  body('email', 'Enter a valid email').isEmail(),
  body('contactnumber').isLength({ min: 10 }),
  body('password').isLength({ min: 5 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    let success = false;
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({ success, error: "Sorry, a user with this email already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password, salt);
    user = await User.create({
      name: req.body.name,
      email: req.body.email,
      contactnumber: req.body.contactnumber,
      password: secPass,
      uniqueid: req.body.uniqueid,
      productUploadedForSale: 0,
      productBought: 0,
      //filename: null,
      //path: null,
      image: null
    });
    const data = {
      user: {
        id: user.id
      }
    };
    const authToken = jwt.sign(data, JWT_SECRET);
    success = true;
    res.json({ success, authToken, uniqueid: user.uniqueid });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// User Login
router.post('/login', [
  body('email', 'Enter a valid email').isEmail(),
  body('password', 'Password cannot be blank').exists()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    let success = false;
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Please try to login with correct credentials" });
    }
    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      return res.status(400).json({ success, error: "Please try to login with correct credentials" });
    }
    const data = {
      user: {
        id: user.id,
        uniqueid: user.uniqueid
      }
    };
    const authToken = jwt.sign(data, JWT_SECRET);
    success = true;
    res.json({ success, authToken, uniqueid: user.uniqueid });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

router.get('/getuser', fetchUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});
  

// Update User Data
router.put('/updateuser', fetchUser, async (req, res) => {
  try {
    const userId = req.user.id;
    let success = false;
    const user = await User.findById(userId);
    if (user) {
      user.name = req.body.name;
      user.contactnumber = req.body.contactnumber;
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);
      user.password = secPass;
      await user.save();
      success = true;
      res.send({ success, user });
    } else {
      res.json({ success, error: "User not found" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// Upload User Photo
router.post('/uploadphoto', fetchUser, upload.single('image'), async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Remove old image file if it exists
    if (user.image) {
      fs.unlink(path.join('C:\Users\priya\Desktop\onlineauctionsystem', user.image), (err) => {
        if (err) console.error('Failed to delete old image:', err);
      });
    }

    user.image = `/uploads/${req.file.filename}`; // Store the relative file path in the database
    await user.save();

    return res.json({ success: "Photo uploaded successfully", imageUrl: user.image });
  } catch (error) {
    console.error(error.message);
    return res.status(500).send("Internal Server Error");
  }
});
  
// Increase Product Uploaded For Sale
router.put('/user/increaseProductUploadForSale/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    // Find the user by userId and increment productUploadedForSale field by 1
    const updatedUser = await User.findOneAndUpdate(
      { uniqueid: userId },
      { $inc: { productUploadedForSale: 1 } },
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    res.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
