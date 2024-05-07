const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const Dbconnect = require('./config/db');
const Product = require('./models/productModel');
const Banner= require('./models/banner')
const app = express();
const port = process.env.PORT || 2000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

Dbconnect();

// Serve static images
app.use('/public/Images', express.static(path.join(__dirname, 'public', 'images')));

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'public', 'Images'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Add a new product with image upload
app.post('/addProduct', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: "No File Uploaded" });
    }

    const product = await Product.create({
      title: req.body.title,
      price: req.body.price,
      description: req.body.description,
      discountPercentage: req.body.discountPercentage,
      rating: req.body.rating,
      category: req.body.category,
      images: '/public/Images/' + req.file.filename, 
      stock: req.body.stock
    });
    

    res.status(201).json(product);
    res.send(product.images);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


const memory = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'public', 'banner'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const uploaded = multer({ storage: memory }); 

app.post('/addBanner', uploaded.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: "No File Uploaded" });
    }

    const banner = await Banner.create({
      images: '/public/banner/' + req.file.filename,
    });

    res.status(201).json(banner);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


app.get('/getbanner', async (req, res) => {
  try {
    const banners = await Banner.find();
    res.json({
      success: true,
      message: 'Banners fetched successfully!',
      data: banners,
    });
  } catch (err) {
    console.error('Error fetching banners:', err);
    res.status(500).send('Server Error');
  }
});
// Get all products
app.get('/products/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json({
      success: true,
      message: 'Products fetched successfully!',
      data: products
    });
    
    // console.log(products)
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
app.get('/products/:productId', async (req, res) => {
  try {
    const productId = req.params.productId;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({
      success: true,
      message: 'Product fetched successfully!',
      data: product
    });
  } catch (err) {
    console.error('Error fetching product details:', err);
    res.status(500).send('Server Error');
  }
});


app.put('/updateProduct/:id', async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedProduct);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


app.delete('/deleteProduct/:id', async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
