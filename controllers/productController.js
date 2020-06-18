const Product = require('../models/productModel.js');
const selectString = 'name amount price size category url productImage';
const multer = require('multer');
const date = new Date();
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '_' + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  //reject a file
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5, //bytes
  },
  fileFilter: fileFilter,
});

module.exports = function (app) {
  app.get('/products', (req, res) => {
    Product.find()
      .select(selectString)
      .exec()
      .then((docs) => {
        res.status(200).json(docs);
      })
      .catch((err) => {
        res.status(500).json({
          error: err,
        });
      });
  });

  app.get('/products/:name', (req, res) => {
    Product.findOne({ name: req.params.name })
      .select(selectString)
      .exec()
      .then((product) => {
        if (!product) {
          return res.status(404).json({
            message: 'Product not found',
          });
        }
        res.status(200).json(product);
      })
      .catch((err) => {
        res.status(500).json({
          error: err,
        });
      });
  });

  app.post('/upload', upload.single('productImage'), (req, res) => {
    console.log('upload file-> ', req.file);
    console.log('upload body->', req.body);
    res.status(200);
  });

  app.post('/product', upload.single('productImage'), (req, res) => {
    console.log('bodyyy', req.body);
    console.log('filleee', req.file);
    let productImageUrl = null;
    if (req.file) productImageUrl = req.file.path.replace(/\\/g, '/').substring('public'.length);
    if (req.body._id) {
      Product.findByIdAndUpdate(req.body._id, {
        name: req.body.name,
        price: req.body.price,
        size: req.body.size,
        category: req.body.category,
        productImage: productImageUrl,
      })
        .exec()
        .then((doc) => {
          res.status(200).json({
            message: 'Product updated',
          });
        })
        .catch((err) => {
          res.status(500).json({
            error: err,
          });
        });
    } else {
      const newProduct = new Product({
        name: req.body.name,
        price: req.body.price,
        size: req.body.size,
        category: req.body.category,
        productImage: productImageUrl,
      });
      newProduct
        .save()
        .then(
          res.status(200).json({
            message: 'Product saved',
          })
        )
        .catch((err) => {
          res.status(500).json({
            error: err,
          });
        });
    }
  });

  app.delete('/product', (req, res) => {
    Product.remove({ _id: req.body._id })
      .exec()
      .then((result) => {
        res.status(200).json({
          message: 'Product deleted',
        });
      })
      .catch((err) => {
        res.send(500).json({
          error: err,
        });
      });
  });
};
