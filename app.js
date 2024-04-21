require("dotenv").config();

const validator = require("validator");
const mongoose = require("mongoose");
const express = require("express");

const app = express();
const port = 30000;
const mongoUser = encodeURIComponent(process.env.MONGO_DB_USER);
const mongoPassword = encodeURIComponent(process.env.MONGO_DB_PASSWORD);
const mongoDb = process.env.MONGO_DB_URL;
const mongoUrl = `mongodb+srv://${mongoUser}:${mongoPassword}@${mongoDb}`;
mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((res) => {
    console.log("Connect db success.");
  })
  .catch((err) => {
    console.error(err);
  });

const productSchema = new mongoose.Schema({
  name: String,
  category: String,
  price: Number,
  stock: Number,
});

const Product = mongoose.model("Product", productSchema);

const validateProduct = (req, res, next) => {
  const product = req.body;
  const validatedPrice =
    product.price != undefined
      ? validator.isDecimal(product.price.toString(), {
          decimal_digits: "1,2",
        })
      : true;
  const validatedStock =
    product.stock != undefined
      ? validator.isInt(product.stock.toString())
      : true;
  if (validatedPrice && validatedStock) {
    next();
  } else {
    return res.status(400).send("bad request");
  }
};

app.use((req, res, next) => {
  console.log(`${req.method} request for ${req.url}`);
  console.log(req.body);
  next();
});

app.use(express.json());
app.use(validateProduct);

app.use((err, req, res, next) => {
  console.error("error middleware");
  console.error(err.stack);
  const statusCode = err.status || 500;
  res.status(statusCode).json({ error: err.message });
});

app.post("/products", (req, res, next) => {
  const newProduct = new Product(req.body);
  newProduct
    .save()
    .then((data) => {
      return res.status(201).send(data);
    })
    .catch((err) => next(err));
});

app.get("/products", (req, res, next) => {
  const products = req.query;
  Product.find(products)
    .then((data) => {
      return res.status(200).send(data);
    })
    .catch((err) => next(err));
});

app.put("/products/:id", (req, res, next) => {
  Product.updateOne({ _id: req.params.id }, req.body)
    .then((data) => res.status(200).send("Updated successfully"))
    .catch((err) => next(err));
});

app.delete("/products/:id", (req, res, next) => {
  Product.deleteOne({ _id: req.params.id })
    .then((data) => {
      res.status(200).send("Deleted successfully");
    })
    .catch((err) => next(err));
});

app.listen(port, () => {
  console.log(`Server runing at <http://localhost>:${port}/`);
});

module.exports = app;