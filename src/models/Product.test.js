const {
  describe,
  it,
  beforeAll,
  beforeEach,
  afterAll,
  expect,
} = require("@jest/globals");

const db = require("../db");
const Product = require("../models/Product");
const factory = require("../../__tests__/factories");

describe("Product", () => {
  beforeAll(async () => await db.connect());

  beforeEach(async () => await db.clearDatabase());

  afterAll(async () => await db.close());

  // lets define test for Create, Read, Update and Detelete operations in the  Product model database:

  // Create:
  describe("Create", () => {
    it("should create a new product", async () => {
      const product = await factory.create("Product");
      //console.log("product: ", product);

      // now lets get the product from db and compare it with the product we created:
      const dbProduct = await Product.findOne({ _id: product._id });

      expect(product.name).toBe(dbProduct.name);
      expect(product.prices).toEqual(dbProduct.prices);
      expect(product.quantity).toBe(dbProduct.quantity);

      const dbProductCustomAttributes = dbProduct.customAttributes.map(
        (item) => ({ name: item.name, value: item.value })
      );
      const productCustomAttributes = product.customAttributes.map((item) => ({
        name: item.name,
        value: item.value,
      }));

      expect(productCustomAttributes).toEqual(dbProductCustomAttributes);
    });

    it("should create a new product and add a custom attribute", async () => {
      let product = await factory.create("Product");

      // Add a new customAttribute
      product.customAttributes.push({ name: "color", value: "blue" });

      // Save the updated product
      await product.save();

      // Fetch the product from the database again
      const dbProduct = await Product.findOne({ _id: product._id });

      // Test the properties
      expect(product.name).toBe(dbProduct.name);
      expect(product.prices).toEqual(dbProduct.prices);
      expect(product.quantity).toBe(dbProduct.quantity);

      const customAttributes = dbProduct.customAttributes.map((item) => {
        return { name: item.name, value: item.value };
      });

      // Test the customAttributes property
      expect(customAttributes).toEqual(
        expect.arrayContaining([{ name: "color", value: "blue" }])
      );
    });

    it("should create a new product and add a new price", async () => {
      let product = await factory.create("Product");

      // Add a new price
      product.prices.offerPrice = 10;

      // Save the updated product
      await product.save();

      // Fetch the product from the database again
      const dbProduct = await Product.findOne({ _id: product._id });

      // Test the properties
      expect(product.name).toBe(dbProduct.name);
      expect(product.prices).toEqual(dbProduct.prices);
      expect(product.quantity).toBe(dbProduct.quantity);

      // Test the customAttributes property
      expect(product.prices).toHaveProperty("offerPrice");
    });
  });

  // Read:
  describe("Read", () => {
    it("should read a product", async () => {
      const product = await factory.create("Product");

      const dbProduct = await Product.findOne({ _id: product._id });

      expect(product.name).toBe(dbProduct.name);
      expect(product.prices).toEqual(dbProduct.prices);
      expect(product.quantity).toBe(dbProduct.quantity);
    });
  });

  // Update:
  describe("Update", () => {
    it("should update a product", async () => {
      const product = await factory.create("Product");

      // Update the product
      product.name = "cocacola 2l un";
      product.prices.offerPrice = 10;
      product.quantity = 10;

      // Save the updated product
      await product.save();

      // Fetch the product from the database again
      const dbProduct = await Product.findOne({ _id: product._id });

      // Test the properties
      expect(product.name).toBe(dbProduct.name);
      expect(product.prices).toEqual(dbProduct.prices);
      expect(product.quantity).toBe(dbProduct.quantity);
    });

    it("should update a product and add a custom attribute", async () => {
      let product = await factory.create("Product");

      // Add a new customAttribute
      product.customAttributes.push({ name: "color", value: "blue" });

      // Save the updated product
      await product.save();

      // Fetch the product from the database again
      const dbProduct = await Product.findOne({ _id: product._id });

      // Test the properties
      expect(product.name).toBe(dbProduct.name);
      expect(product.prices).toEqual(dbProduct.prices);
      expect(product.quantity).toBe(dbProduct.quantity);

      const customAttributes = dbProduct.customAttributes.map((item) => {
        return { name: item.name, value: item.value };
      });

      // Test the customAttributes property
      expect(customAttributes).toEqual(
        expect.arrayContaining([{ name: "color", value: "blue" }])
      );
    });
  });

  // Delete:
  describe("Delete", () => {
    it("should delete a product", async () => {
      const product = await factory.create("Product");

      // Delete the product
      await Product.deleteOne({ _id: product._id });

      // Fetch the product from the database again
      const dbProduct = await Product.findOne({ _id: product._id });

      // Test the properties
      expect(dbProduct).toBe(null);
    });
  });

  // Search:
  describe("Search", () => {
    it("should search products by name", async () => {
      await Promise.all([
        factory.create("Product", { name: "cocacola 2l un" }),
        factory.create("Product", { name: "cocacola 2l pack" }),
        factory.create("Product", { name: "cocacola 3l un" }),
        factory.create("Product", { name: "cocacola 3l pack" }),
        factory.create("Product", { name: "cocacola 4l un" }),
        factory.create("Product", { name: "cocacola 4l pack" }),
      ]);

      // Fetch the product from the database again
      const products = await Product.find({ name: /cocacola 2l un/ });

      // Test the properties
      expect(products.length).toBe(1);
    });

    it("should search products by quantity", async () => {
      await Promise.all([
        factory.create("Product", { quantity: 10 }),
        factory.create("Product", { quantity: 20 }),
        factory.create("Product", { quantity: 10 }),
        factory.create("Product", { quantity: 40 }),
        factory.create("Product", { quantity: 10 }),
        factory.create("Product", { quantity: 60 }),
      ]);

      // Fetch the product from the database again
      const products = await Product.find({ quantity: 10 });

      // Test the properties
      expect(products.length).toBe(3);
    });
  });

  // Sorting:
  describe("Sorting", () => {
    it("should sort products by name", async () => {
      await Promise.all([
        factory.create("Product", { name: "cocacola 2l un" }),
        factory.create("Product", { name: "cocacola 2l pack" }),
        factory.create("Product", { name: "cocacola 3l un" }),
        factory.create("Product", { name: "cocacola 3l pack" }),
        factory.create("Product", { name: "cocacola 4l un" }),
        factory.create("Product", { name: "cocacola 4l pack" }),
      ]);

      // Fetch the product from the database again
      const products = await Product.find().sort({ name: 1 });

      // Test the properties
      expect(products.length).toBe(6);
      expect(products[0].name).toBe("cocacola 2l pack");
      expect(products[1].name).toBe("cocacola 2l un");
      expect(products[2].name).toBe("cocacola 3l pack");
      expect(products[3].name).toBe("cocacola 3l un");
      expect(products[4].name).toBe("cocacola 4l pack");
      expect(products[5].name).toBe("cocacola 4l un");
    });

    it("should sort products by quantity", async () => {
      await Promise.all([
        factory.create("Product", { quantity: 10 }),
        factory.create("Product", { quantity: 20 }),
        factory.create("Product", { quantity: 10 }),
        factory.create("Product", { quantity: 40 }),
        factory.create("Product", { quantity: 10 }),
        factory.create("Product", { quantity: 60 }),
      ]);

      // Fetch the product from the database again
      const products = await Product.find().sort({ quantity: 1 });

      // Test the properties
      expect(products.length).toBe(6);
      expect(products[0].quantity).toBe(10);
      expect(products[1].quantity).toBe(10);
      expect(products[2].quantity).toBe(10);
      expect(products[3].quantity).toBe(20);
      expect(products[4].quantity).toBe(40);
      expect(products[5].quantity).toBe(60);
    });

    it("should sort products by price", async () => {
      await Promise.all([
        factory.create("Product", {
          prices: { currentPrice: 10, offerPrice: 10 },
        }),
        factory.create("Product", {
          prices: { currentPrice: 20, offerPrice: 20 },
        }),
        factory.create("Product", {
          prices: { currentPrice: 30, offerPrice: 30 },
        }),
        factory.create("Product", {
          prices: { currentPrice: 40, offerPrice: 40 },
        }),
        factory.create("Product", {
          prices: { currentPrice: 50, offerPrice: 50 },
        }),
        factory.create("Product", {
          prices: { currentPrice: 60, offerPrice: 60 },
        }),
      ]);

      // Fetch the product from the database again
      const products = await Product.find().sort({ "prices.currentPrice": 1 });

      // Test the properties
      expect(products.length).toBe(6);
      expect(products[0].prices.currentPrice).toBe(10);
      expect(products[1].prices.currentPrice).toBe(20);
      expect(products[2].prices.currentPrice).toBe(30);
      expect(products[3].prices.currentPrice).toBe(40);
      expect(products[4].prices.currentPrice).toBe(50);
      expect(products[5].prices.currentPrice).toBe(60);
    });
  });

  // test toBusinessDataFormat method:

  describe("toBusinessDataFormat", () => {
    it("should return a product in business format", async () => {
      const product = await factory.create("Product");
      const productBI = product.toBusinessDataFormat();

      expect(product.name).toBe(productBI.name);
      expect(product.prices.currentPrice).toBe(productBI.currentPrice);
      expect(product.prices.offerPrice).toBe(productBI.offerPrice);
      expect(product.quantity).toBe(productBI.quantity);

      product.customAttributes.forEach((item) => {
        expect(productBI[item.name]).toBe(item.value);
      });
    });

    it("should return a product in business format with custom attributes", async () => {
      const product = await factory.create("Product");
      //console.log("product: ", product);

      // Add a new customAttribute
      product.customAttributes.push({ name: "color", value: "blue" });

      // Save the updated product
      await product.save();

      const productBI = product.toBusinessDataFormat();
      //console.log("productBI: ", productBI);

      expect(product.name).toBe(productBI.name);
      expect(product.prices.currentPrice).toBe(productBI.currentPrice);
      expect(product.prices.offerPrice).toBe(productBI.offerPrice);
      expect(product.quantity).toBe(productBI.quantity);

      product.customAttributes.forEach((item) => {
        expect(productBI[item.name]).toBe(item.value);
      });
    });
  });

  // test toBusinessDataFormatList method:

  describe("toBusinessDataFormatList", () => {
    it("should return a list of products in business format", async () => {
      await Promise.all([
        factory.create("Product"),
        factory.create("Product"),
        factory.create("Product"),
        factory.create("Product"),
        factory.create("Product"),
        factory.create("Product"),
      ]);

      const products = await Product.find();

      const productsBI = Product.toBusinessDataFormatList(products);

      expect(products.length).toBe(productsBI.length);

      products.forEach((product, index) => {
        expect(product.name).toBe(productsBI[index].name);
        expect(product.prices.currentPrice).toBe(
          productsBI[index].currentPrice
        );
        expect(product.prices.offerPrice).toBe(productsBI[index].offerPrice);
        expect(product.quantity).toBe(productsBI[index].quantity);
      });

      products.forEach((product, index) => {
        product.customAttributes.forEach((item) => {
          expect(productsBI[index][item.name]).toBe(item.value);
        });
      });
    });
  });

  // test toDatabaseDataFormat method:

  describe("toDatabaseDataFormat", () => {
    it("should return a product in database format", async () => {
      const bid = {
        name: "cocacola 2l un",
        currentPrice: 10,
        offerPrice: 8,
        quantity: 29,
        ecommerceCurrentPrice: 12,
        ecommerceOfferPrice: 0,
        ecommerceName: "Coca Cola Normal 2L",
      };

      const did = Product.toDatabaseDataFormat(bid);

      expect(did.name).toBe(bid.name);
      expect(did.prices.currentPrice).toBe(bid.currentPrice);
      expect(did.prices.offerPrice).toBe(bid.offerPrice);
      expect(did.quantity).toBe(bid.quantity);

      did.customAttributes.forEach((item) => {
        expect(bid[item.name]).toBe(item.value);
      });
    });
  });
});
