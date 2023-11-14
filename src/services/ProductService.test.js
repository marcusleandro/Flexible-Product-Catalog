const { describe, it, expect, beforeEach } = require("@jest/globals");
const httpStatus = require("http-status");
const mongoose = require("mongoose");

const db = require("../db");
const { StatusError } = require("../utils/errorHandlers");
const Product = require("../models/Product");
const productService = require("./ProductService");
const factory = require("../../__tests__/factories");

describe("ProductService", () => {
  beforeAll(async () => await db.connect());

  beforeEach(async () => await db.clearDatabase());

  afterAll(async () => await db.close());

  describe("create", () => {
    it("should create a new product", async () => {
      const productForm = {
        name: "Test Product",
        quantity: 10,
        currentPrice: 20,
        offerPrice: 15,
        customAttribute1: "value1",
        customAttribute2: "value2",
      };

      const product = await productService.create(productForm);

      expect(product.id).toBeDefined();
      expect(product.name).toBe(productForm.name);
      expect(product.quantity).toBe(productForm.quantity);
      expect(product.currentPrice).toBe(productForm.currentPrice);
      expect(product.offerPrice).toBe(productForm.offerPrice);
      expect(product.customAttribute1).toBe(productForm.customAttribute1);
      expect(product.customAttribute2).toBe(productForm.customAttribute2);
    });
  });

  describe("update", () => {
    it("should update an existing product", async () => {
      const existingProduct = await Product.create({
        name: "Test Product",
        quantity: 10,
        prices: { currentPrice: 20, offerPrice: 15 },
        customAttributes: [{ name: "color", value: "blue" }],
      });

      const productForm = {
        name: "Updated Product",
        quantity: 20,
        currentPrice: 25,
        offerPrice: 20,
        customAttribute1: "value1",
        customAttribute2: "value2",
      };

      const updatedProduct = await productService.update(
        existingProduct._id,
        productForm
      );

      expect(updatedProduct.id).toBe(existingProduct._id.toString());
      expect(updatedProduct.name).toBe(productForm.name);
      expect(updatedProduct.quantity).toBe(productForm.quantity);
      expect(updatedProduct.currentPrice).toBe(productForm.currentPrice);
      expect(updatedProduct.offerPrice).toBe(productForm.offerPrice);
      expect(updatedProduct.customAttribute1).toBe(
        productForm.customAttribute1
      );
      expect(updatedProduct.customAttribute2).toBe(
        productForm.customAttribute2
      );
    });

    it("should throw an error if product is not found", async () => {
      const productForm = {
        name: "Updated Product",
        quantity: 20,
        currentPrice: 25,
        offerPrice: 20,
        customAttribute1: "value1",
        customAttribute2: "value2",
      };

      const id = new mongoose.Types.ObjectId();

      await expect(productService.update(id, productForm)).rejects.toThrow(
        new StatusError(httpStatus.NOT_FOUND, "Product not found!")
      );
    });
  });

  describe("delete", () => {
    it("should delete an existing product", async () => {
      const existingProduct = await Product.create({
        name: "Test Product",
        quantity: 10,
        prices: { currentPrice: 20, offerPrice: 15 },
        customAttributes: [{ name: "color", value: "blue" }],
      });

      const result = await productService.delete(existingProduct._id);

      expect(result).toBe(true);
      const product = await Product.findById(existingProduct._id);
      expect(product).toBe(null);
    });

    it("should throw an error if product is not found", async () => {
      const id = new mongoose.Types.ObjectId();
      await expect(productService.delete(id)).rejects.toThrow(
        new StatusError(httpStatus.NOT_FOUND, "Product not found!")
      );
    });
  });

  describe("get", () => {
    it("should return an existing product", async () => {
      const existingProduct = await Product.create({
        name: "Test Product",
        quantity: 10,
        prices: { currentPrice: 20, offerPrice: 15 },
        customAttributes: [{ name: "color", value: "blue" }],
      });

      const product = await productService.get(existingProduct._id);

      expect(product.id).toBe(existingProduct._id.toString());
      expect(product.name).toBe(existingProduct.name);
      expect(product.quantity).toBe(existingProduct.quantity);
      expect(product.currentPrice).toBe(existingProduct.prices.currentPrice);
      expect(product.offerPrice).toBe(existingProduct.prices.offerPrice);
      expect(product.color).toBe(existingProduct.customAttributes[0].value);
    });

    it("should return null if product is not found", async () => {
      const id = new mongoose.Types.ObjectId();
      const product = await productService.get(id);
      expect(product).toBe(null);
    });
  });

  describe("list", () => {
    it("should return a list of products", async () => {
      await Product.create({
        name: "Test Product 1",
        quantity: 10,
        prices: { currentPrice: 20, offerPrice: 15 },
        customAttributes: [{ name: "color", value: "blue" }],
      });

      await Product.create({
        name: "Test Product 2",
        quantity: 20,
        prices: { currentPrice: 30, offerPrice: 25 },
        customAttributes: [{ name: "size", value: "large" }],
      });

      const products = await productService.list({});

      expect(products.length).toBe(2);
      expect(products[0].name).toBe("Test Product 1");
      expect(products[0].quantity).toBe(10);
      expect(products[0].currentPrice).toBe(20);
      expect(products[0].offerPrice).toBe(15);
      expect(products[0].color).toBe("blue");
      expect(products[1].name).toBe("Test Product 2");
      expect(products[1].quantity).toBe(20);
      expect(products[1].currentPrice).toBe(30);
      expect(products[1].offerPrice).toBe(25);
      expect(products[1].size).toBe("large");
    });

    it("should limit the number of products returned", async () => {
      await Product.create({
        name: "Test Product 1",
        quantity: 10,
        prices: { currentPrice: 20, offerPrice: 15 },
        customAttributes: [{ name: "color", value: "blue" }],
      });

      await Product.create({
        name: "Test Product 2",
        quantity: 20,
        prices: { currentPrice: 30, offerPrice: 25 },
        customAttributes: [{ name: "size", value: "large" }],
      });

      const products = await productService.list({ limit: 1 });

      expect(products.length).toBe(1);
      expect(products[0].name).toBe("Test Product 1");
    });

    it("should skip the first n products", async () => {
      await Product.create({
        name: "Test Product 1",
        quantity: 10,
        prices: { currentPrice: 20, offerPrice: 15 },
        customAttributes: [{ name: "color", value: "blue" }],
      });

      await Product.create({
        name: "Test Product 2",
        quantity: 20,
        prices: { currentPrice: 30, offerPrice: 25 },
        customAttributes: [{ name: "size", value: "large" }],
      });

      const products = await productService.list({ offset: 1 });

      expect(products.length).toBe(1);
      expect(products[0].name).toBe("Test Product 2");
    });

    it("should sort the products by name", async () => {
      await Product.create({
        name: "Test Product 2",
        quantity: 20,
        prices: { currentPrice: 30, offerPrice: 25 },
        customAttributes: [{ name: "size", value: "large" }],
      });

      await Product.create({
        name: "Test Product 1",
        quantity: 10,
        prices: { currentPrice: 20, offerPrice: 15 },
        customAttributes: [{ name: "color", value: "blue" }],
      });

      const products = await productService.list({ sort: { name: 1 } });

      expect(products.length).toBe(2);
      expect(products[0].name).toBe("Test Product 1");
      expect(products[1].name).toBe("Test Product 2");
    });

    it("should filter the products by name", async () => {
      await Product.create({
        name: "Test Product 1",
        quantity: 10,
        prices: { currentPrice: 20, offerPrice: 15 },
        customAttributes: [{ name: "color", value: "blue" }],
      });

      await Product.create({
        name: "Test Product 2",
        quantity: 20,
        prices: { currentPrice: 30, offerPrice: 25 },
        customAttributes: [{ name: "size", value: "large" }],
      });

      const products = await productService.list({
        query: { name: /Test Product 1/ },
      });

      expect(products.length).toBe(1);
      expect(products[0].name).toBe("Test Product 1");
    });
  });

  describe("count", () => {
    it("should return the number of products", async () => {
      await Product.create({
        name: "Test Product 1",
        quantity: 10,
        prices: { currentPrice: 20, offerPrice: 15 },
        customAttributes: [{ name: "color", value: "blue" }],
      });

      await Product.create({
        name: "Test Product 2",
        quantity: 20,
        prices: { currentPrice: 30, offerPrice: 25 },
        customAttributes: [{ name: "size", value: "large" }],
      });

      const count = await productService.count();

      expect(count).toBe(2);
    });

    it("should return the number of products that match the query", async () => {
      await Product.create({
        name: "Test Product 1",
        quantity: 10,
        prices: { currentPrice: 20, offerPrice: 15 },
        customAttributes: [{ name: "color", value: "blue" }],
      });

      await Product.create({
        name: "Test Product 2",
        quantity: 20,
        prices: { currentPrice: 30, offerPrice: 25 },
        customAttributes: [{ name: "size", value: "large" }],
      });

      const count = await productService.count({ name: /Test Product 1/ });

      expect(count).toBe(1);
    });
  });

  describe("toBusinessDataFormat", () => {
    it("should convert a product to business format", () => {
      const product = {
        _id: "123",
        name: "Test Product",
        quantity: 10,
        prices: { currentPrice: 20, offerPrice: 15 },
        customAttributes: [{ name: "color", value: "blue" }],
        __v: 0,
      };

      const result = productService.toBusinessDataFormat(product);

      expect(result.id).toBe(product._id.toString());
      expect(result.name).toBe(product.name);
      expect(result.quantity).toBe(product.quantity);
      expect(result.currentPrice).toBe(product.prices.currentPrice);
      expect(result.offerPrice).toBe(product.prices.offerPrice);
      expect(result.color).toBe(product.customAttributes[0].value);
      expect(result.version).toBe(product.__v);
    });
  });

  describe("toBusinessDataFormatList", () => {
    it("should convert a list of products to business format", async () => {
      const products = await Promise.all([
        factory.create("Product", {
          name: "Test Product 1",
          quantity: 10,
          prices: { currentPrice: 20, offerPrice: 15 },
          customAttributes: [{ name: "color", value: "blue" }],
        }),
        factory.create("Product", {
          name: "Test Product 2",
          quantity: 20,
          prices: { currentPrice: 30, offerPrice: 25 },
          customAttributes: [{ name: "size", value: "large" }],
        }),
      ]);

      const result = productService.toBusinessDataFormatList(products);

      expect(result.length).toBe(2);
      expect(result[0].id).toBe(products[0]._id.toString());
      expect(result[0].name).toBe(products[0].name);
      expect(result[0].quantity).toBe(products[0].quantity);
      expect(result[0].currentPrice).toBe(products[0].prices.currentPrice);
      expect(result[0].offerPrice).toBe(products[0].prices.offerPrice);
      expect(result[0].color).toBe(products[0].customAttributes[0].value);
      expect(result[0].version).toBe(products[0].__v);
      expect(result[1].id).toBe(products[1]._id.toString());
      expect(result[1].name).toBe(products[1].name);
      expect(result[1].quantity).toBe(products[1].quantity);
      expect(result[1].currentPrice).toBe(products[1].prices.currentPrice);
      expect(result[1].offerPrice).toBe(products[1].prices.offerPrice);
      expect(result[1].size).toBe(products[1].customAttributes[0].value);
      expect(result[1].version).toBe(products[1].__v);
    });
  });

  describe("toDatabaseDataFormat", () => {
    it("should convert a product form to database format", () => {
      const productForm = {
        name: "Test Product",
        quantity: 10,
        currentPrice: 20,
        offerPrice: 15,
        customAttribute1: "value1",
        customAttribute2: "value2",
      };

      const result = productService.toDatabaseDataFormat(productForm);

      expect(result.name).toBe(productForm.name);
      expect(result.quantity).toBe(productForm.quantity);
      expect(result.prices.currentPrice).toBe(productForm.currentPrice);
      expect(result.prices.offerPrice).toBe(productForm.offerPrice);
      expect(result.customAttributes[0].name).toBe("customAttribute1");
      expect(result.customAttributes[0].value).toBe("value1");
      expect(result.customAttributes[1].name).toBe("customAttribute2");
      expect(result.customAttributes[1].value).toBe("value2");
    });
  });
});
