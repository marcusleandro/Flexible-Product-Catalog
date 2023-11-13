//const faker = require("faker");
const { faker } = require("@faker-js/faker/locale/pt_BR");
const FactoryGirl = require("factory-girl");
const Product = require("../src/models/Product");

const factory = FactoryGirl.factory;
const adapter = new FactoryGirl.MongooseAdapter();
factory.setAdapter(adapter);

factory.define("Product", Product, {
  name: faker.commerce.productName(),
  prices: {
    currentPrice: faker.commerce.price(),
    offerPrice: faker.commerce.price(),
  },
  quantity: faker.number.int({
    min: 1,
    max: 100,
  }),
  customAttributes: [
    {
      name: "ecommerceCurrentPrice",
      value: faker.commerce.price(),
    },
    {
      name: "ecommerceOfferPrice",
      value: faker.commerce.price(),
    },
    {
      name: "ecommerceName",
      value: faker.commerce.productName(),
    },
  ],
});

module.exports = factory;
