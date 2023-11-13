const {
  describe,
  it,
  beforeAll,
  beforeEach,
  afterAll,
  expect,
} = require("@jest/globals");

const request = require("supertest");
const mongoose = require("mongoose");

const app = require("../app");
const db = require("../db");
const Product = require("../models/Product");
const factory = require("../../__tests__/factories");

describe("ProductController", () => {
  beforeAll(async () => await db.connect());

  beforeEach(async () => await db.clearDatabase());

  afterAll(async () => await db.close());

  describe("list", () => {
    it("should return ZERO products", async () => {
      const res = await request(app).get("/api/products");
      expect(res.statusCode).toBe(200);
      const response = res.body;

      expect(response.meta.totalCount).toBe(0);
      expect(response.body).toEqual([]);
    });

    it("should return ONE product", async () => {
      const product = await factory.create("Product");
      const productBI = product.toBusinessDataFormat();

      const res = await request(app).get("/api/products");
      expect(res.statusCode).toBe(200);
      const response = res.body;

      // normalizing 'createdAt', 'updatedAt' to correspond with the response:
      productBI.createdAt = new Date(productBI.createdAt).getTime();
      productBI.updatedAt = new Date(productBI.updatedAt).getTime();

      expect(response.meta.totalCount).toBe(1);
      expect(response.body).toEqual([productBI]);
    });

    it("should return TWO products", async () => {
      const product1 = await factory.create("Product");
      const product2 = await factory.create("Product");
      const productBI1 = product1.toBusinessDataFormat();
      const productBI2 = product2.toBusinessDataFormat();

      const res = await request(app).get("/api/products");
      expect(res.statusCode).toBe(200);
      const response = res.body;

      // normalizing 'createdAt', 'updatedAt' to correspond with the response:
      productBI1.createdAt = new Date(productBI1.createdAt).getTime();
      productBI1.updatedAt = new Date(productBI1.updatedAt).getTime();
      productBI2.createdAt = new Date(productBI2.createdAt).getTime();
      productBI2.updatedAt = new Date(productBI2.updatedAt).getTime();

      expect(response.meta.totalCount).toBe(2);
      expect(response.body).toEqual([productBI1, productBI2]);
    });

    it("should get a list of all products", async () => {
      const product1 = await factory.create("Product");
      const product2 = await factory.create("Product");

      const { body } = await request(app).get("/api/products").expect(200);

      expect(body.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ id: product1._id.toString() }),
          expect.objectContaining({ id: product2._id.toString() }),
        ])
      );
    });

    it("should return ONE product with page=1 and size=1", async () => {
      const product1 = await factory.create("Product");
      const product2 = await factory.create("Product");
      const productBI1 = product1.toBusinessDataFormat();
      const productBI2 = product2.toBusinessDataFormat();

      const res = await request(app).get("/api/products?page=1&size=1");
      expect(res.statusCode).toBe(200);
      const response = res.body;

      // normalizing 'createdAt', 'updatedAt' to correspond with the response:
      productBI1.createdAt = new Date(productBI1.createdAt).getTime();
      productBI1.updatedAt = new Date(productBI1.updatedAt).getTime();
      productBI2.createdAt = new Date(productBI2.createdAt).getTime();
      productBI2.updatedAt = new Date(productBI2.updatedAt).getTime();

      expect(response.meta.totalCount).toBe(2);
      expect(response.body).toEqual([productBI2]);
    });

    it("should return products sorted by name in ascending order when sortBy=name", async () => {
      const product1 = await factory.create("Product", { name: "B" });
      const product2 = await factory.create("Product", { name: "A" });
      const productBI1 = product1.toBusinessDataFormat();
      const productBI2 = product2.toBusinessDataFormat();

      const res = await request(app).get("/api/products?sortBy=name");
      //console.log("res.body: ", res.body);
      expect(res.statusCode).toBe(200);
      const response = res.body;

      // normalizing 'createdAt', 'updatedAt' to correspond with the response:
      productBI1.createdAt = new Date(productBI1.createdAt).getTime();
      productBI1.updatedAt = new Date(productBI1.updatedAt).getTime();
      productBI2.createdAt = new Date(productBI2.createdAt).getTime();
      productBI2.updatedAt = new Date(productBI2.updatedAt).getTime();

      expect(response.body).toEqual([productBI2, productBI1]);
    });

    it("should return products sorted by name in descending order when sortBy=-name", async () => {
      const product1 = await factory.create("Product", { name: "B" });
      const product2 = await factory.create("Product", { name: "A" });
      const productBI1 = product1.toBusinessDataFormat();
      const productBI2 = product2.toBusinessDataFormat();

      const res = await request(app).get("/api/products?sortBy=name:desc");
      //console.log("res.body: ", res.body);
      expect(res.statusCode).toBe(200);
      const response = res.body;

      // normalizing 'createdAt', 'updatedAt' to correspond with the response:
      productBI1.createdAt = new Date(productBI1.createdAt).getTime();
      productBI1.updatedAt = new Date(productBI1.updatedAt).getTime();
      productBI2.createdAt = new Date(productBI2.createdAt).getTime();
      productBI2.updatedAt = new Date(productBI2.updatedAt).getTime();

      expect(response.body).toEqual([productBI1, productBI2]);
    });

    // testing filter by name:

    it("should return products filtered by name when name=product1", async () => {
      const product1 = await factory.create("Product", { name: "product1" });
      const product2 = await factory.create("Product", { name: "product2" });
      const productBI1 = product1.toBusinessDataFormat();
      const productBI2 = product2.toBusinessDataFormat();

      const res = await request(app).get("/api/products?name=product1");
      //console.log("res.body: ", res.body);
      expect(res.statusCode).toBe(200);
      const response = res.body;

      // normalizing 'createdAt', 'updatedAt' to correspond with the response:
      productBI1.createdAt = new Date(productBI1.createdAt).getTime();
      productBI1.updatedAt = new Date(productBI1.updatedAt).getTime();
      productBI2.createdAt = new Date(productBI2.createdAt).getTime();
      productBI2.updatedAt = new Date(productBI2.updatedAt).getTime();

      expect(response.body).toEqual([productBI1]);
    });

    it("should return products filtered by id when id=product1._id", async () => {
      const [product1, _] = await Promise.all([
        factory.create("Product", { name: "product1" }),
        factory.create("Product", { name: "product2" }),
      ]);

      const productBI1 = product1.toBusinessDataFormat();

      const res = await request(app).get(`/api/products?id=${product1._id}`);
      expect(res.statusCode).toBe(200);
      const response = res.body;

      // normalizing 'createdAt', 'updatedAt' to correspond with the response:
      productBI1.createdAt = new Date(productBI1.createdAt).getTime();
      productBI1.updatedAt = new Date(productBI1.updatedAt).getTime();

      expect(response.body).toEqual([productBI1]);
    });

    // now filter by a custom attribute:

    it("should return products filtered by custom attribute when customAttribute=product1.customAttribute", async () => {
      const [product1, _] = await Promise.all([
        factory.create("Product", {
          name: "product1",
          customAttribute: "a",
          customAttributes: [{ name: "customAttribute", value: "a" }],
        }),
        factory.create("Product", {
          name: "product2",
          customAttributes: [{ name: "customAttribute", value: "b" }],
        }),
      ]);

      const productBI1 = product1.toBusinessDataFormat();

      const res = await request(app).get(`/api/products?customAttribute=a`);
      expect(res.statusCode).toBe(200);
      const response = res.body;
      //console.log("response: ", response);

      // normalizing 'createdAt', 'updatedAt' to correspond with the response:
      productBI1.createdAt = new Date(productBI1.createdAt).getTime();
      productBI1.updatedAt = new Date(productBI1.updatedAt).getTime();

      expect(response.body).toEqual([productBI1]);
    });
  });

  describe("show", () => {
    it("should return a product when given a valid id", async () => {
      const product = await factory.create("Product");

      const { body } = await request(app)
        .get(`/api/products/${product._id}`)
        .expect(200);

      const productBI = product.toBusinessDataFormat();

      // normalizing 'createdAt', 'updatedAt' and 'id' to correspond with the response:
      productBI.createdAt = new Date(productBI.createdAt).getTime();
      productBI.updatedAt = new Date(productBI.updatedAt).getTime();

      expect(body.body).toEqual(productBI);
    });

    it("should call next with an error when given an invalid id", async () => {
      const id = 1;
      const resp = await request(app).get(`/api/products/${id}`);
      //console.log("resp: ", resp.body);

      expect(resp.headers["content-type"]).toMatch(/application\/json/);
      expect(resp.statusCode).toBe(422);

      const error = resp.body.error;
      expect(error["validation-errors"]).toEqual([
        {
          type: "field",
          value: `${id}`,
          msg: "The field id must be a valid mongo id.",
          path: "id",
          location: "params",
        },
      ]);
    });

    it("should call next with an error when given not found id", async () => {
      const id = new mongoose.Types.ObjectId();
      const resp = await request(app).get(`/api/products/${id}`);
      //console.log("resp: ", resp.body);

      expect(resp.headers["content-type"]).toMatch(/application\/json/);
      expect(resp.statusCode).toBe(404);

      const error = resp.body.error;
      expect(error.message).toBe("Product Not Found!");
    });
  });

  describe("create", () => {
    it("should create a product with valid data", async () => {
      const productData = {
        name: "fanta laranja 2l un",
        currentPrice: 11,
        offerPrice: 9,
        quantity: 30,
        ecommerceCurrentPrice: 13,
        ecommerceOfferPrice: 0,
        ecommerceName: "Fanta 2L",
      };
      const { body } = await request(app)
        .post("/api/products")
        .send(productData)
        .expect(201);

      expect(body.name).toBe(productData.name);
      expect(body.currentPrice).toBe(productData.currentPrice);
      expect(body.offerPrice).toBe(productData.offerPrice);
      expect(body.quantity).toBe(productData.quantity);
      expect(body.ecommerceCurrentPrice).toBe(
        `${productData.ecommerceCurrentPrice}`
      );
      expect(body.ecommerceOfferPrice).toBe(
        `${productData.ecommerceOfferPrice}`
      );
      expect(body.ecommerceName).toBe(productData.ecommerceName);
    });

    it("should not create a product with invalid data", async () => {
      const productData = {
        name: "fanta laranja 2l un",
        currentPrice: 11,
        offerPrice: -9,
        quantity: 30,
        ecommerceCurrentPrice: 13,
        ecommerceOfferPrice: 0,
        ecommerceName: "Fanta 2L",
      };
      const { body } = await request(app)
        .post("/api/products")
        .send(productData)
        .expect(422);

      expect(body.error).toBeDefined();
      expect(body.error.message).toBe("Request Validation Failed.");
    });
  });

  describe("update", () => {
    it("should update a product with valid data", async () => {
      const product = await factory.create("Product");
      const updatedData = {
        name: "zabacu 2l un",
      };

      const { body } = await request(app)
        .put(`/api/products/${product._id}`)
        .send(updatedData)
        .expect(200);

      expect(body.body).toEqual(expect.objectContaining(updatedData));
    });

    it("should not update a product with invalid data", async () => {
      const product = await factory.create("Product");
      const updatedData = {
        currentPrice: -11,
      };

      const { body } = await request(app)
        .put(`/api/products/${product._id}`)
        .send(updatedData)
        .expect(422);

      expect(body.error).toBeDefined();
      expect(body.error.message).toBe("Request Validation Failed.");
    });

    it("should not update a product with an invalid id", async () => {
      const invalidId = 1;

      const { body } = await request(app)
        .put(`/api/products/${invalidId}`)
        .expect(422);

      expect(body.error).toBeDefined();
    });

    it("should not update a product with a not found id", async () => {
      const id = new mongoose.Types.ObjectId();

      const { body } = await request(app)
        .put(`/api/products/${id}`)
        .expect(404);

      expect(body.error).toBeDefined();
    });
  });

  describe("delete", () => {
    it("should delete a product with a valid id", async () => {
      const product = await factory.create("Product");

      await request(app).delete(`/api/products/${product._id}`).expect(204);
    });

    it("should not delete a product with an invalid id", async () => {
      const invalidId = 1;

      const { body } = await request(app)
        .delete(`/api/products/${invalidId}`)
        .expect(422);

      expect(body.error).toBeDefined();
    });

    it("should not delete a product with a not found id", async () => {
      const id = new mongoose.Types.ObjectId();

      const { body } = await request(app)
        .delete(`/api/products/${id}`)
        .expect(404);

      expect(body.error).toBeDefined();
    });
  });
});
