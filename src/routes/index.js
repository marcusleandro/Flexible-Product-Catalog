const express = require("express");
const router = express.Router();
const productController = require("../controllers/ProductController");

const List = require("../forms/product/List");
const Create = require("../forms/product/Create");
const GetById = require("../forms/product/GetById");
const Update = require("../forms/product/Update");

router.get("/", (req, res, next) => {
  res.send({
    api: {
      name: process.env.NAME || "RWS - API",
      version: process.env.VERSION || "1.0.0",
      enviroment: process.env.NODE_ENV || "development",
    },
  });
});

// Products routes:
router.get("/products", List.validate, productController.list());
router.post("/products", Create.validate, productController.create());
router.get("/products/:id", GetById.validate, productController.show());
router.put("/products/:id", Update.validate, productController.update());
router.delete("/products/:id", GetById.validate, productController.delete());

module.exports = router;
