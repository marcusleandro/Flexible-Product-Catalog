const httpStatus = require("http-status");
const Product = require("../models/Product");
const { StatusError } = require("../utils/errorHandlers");

class ProductService {
  /**
   * Creates or return a singleton instance of ProductService.
   *
   * @returns {ProductService}
   */
  constructor() {
    if (ProductService._instance instanceof ProductService) {
      return ProductService._instance;
    }
    ProductService._instance = this;
  }

  async create(productForm) {
    const dbData = this.toDatabaseDataFormat(productForm);
    const product = new Product(dbData);
    await product.save();
    return this.toBusinessDataFormat(product._doc);
  }

  async update(id, productForm) {
    const dbData = this.toDatabaseDataFormat(productForm);
    const product = await Product.findByIdAndUpdate(id, dbData, { new: true });
    if (!product) {
      throw new StatusError(httpStatus.NOT_FOUND, "Product not found!");
    }
    return this.toBusinessDataFormat(product._doc);
  }

  async delete(id) {
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      throw new StatusError(httpStatus.NOT_FOUND, "Product not found!");
    }
    return true;
  }

  async get(id) {
    const product = await Product.findById(id);
    return product ? this.toBusinessDataFormat(product._doc) : null;
  }

  async list({ limit = 10, offset = 0, sort = {}, query = {} }) {
    return Product.find({ ...query })
      .limit(limit)
      .skip(offset)
      .sort(sort)
      .then((products) => this.toBusinessDataFormatList(products));
  }

  async count(query = {}) {
    return Product.countDocuments({ ...query });
  }

  toBusinessDataFormat(input) {
    const result = {};
    Object.keys(input).forEach((key) => {
      switch (key) {
        case "_id":
          result.id = input[key].toString();
          break;
        case "prices":
          result.currentPrice = input.prices.currentPrice;
          result.offerPrice = input.prices.offerPrice;
          break;
        case "name":
        case "quantity":
          result[key] = input[key];
          break;
        case "customAttributes":
          input.customAttributes.forEach((customAttribute) => {
            result[customAttribute.name] = customAttribute.value;
          });
          break;
        case "__v":
          result.version = input[key];
          break;
        default:
          result[key] = input[key];
          break;
      }
    });

    return result;
  }

  toBusinessDataFormatList(products) {
    return products.map((product) => this.toBusinessDataFormat(product._doc));
  }

  toDatabaseDataFormat(input) {
    const result = {};
    const checkPrices = () => {
      if (!result.prices || typeof result.prices != typeof {}) {
        result.prices = {};
      }
    };
    const checkCustomAttributes = () => {
      if (
        !result.customAttributes ||
        typeof result.customAttributes != typeof []
      ) {
        result.customAttributes = [];
      }
    };

    Object.keys(input).forEach((key) => {
      switch (key) {
        case "name":
        case "quantity":
          result[key] = input[key];
          break;
        case "currentPrice":
          checkPrices();
          result.prices.currentPrice = input[key];
          break;
        case "offerPrice":
          checkPrices();
          result.prices.offerPrice = input[key];
          break;
        default:
          checkCustomAttributes();
          result.customAttributes.push({ name: key, value: input[key] });
          break;
      }
    });
    return result;
  }
}

module.exports = new ProductService();

//
//
//
var regularAttributes = ["name", "currentPrice", "offerPrice", "quantity"];

var businessInterfaceData = {
  name: "cocacola 2l un",
  currentPrice: 10,
  offerPrice: 8,
  quantity: 29,
  ecommerceCurrentPrice: 12,
  ecommerceOfferPrice: 0,
  ecommerceName: "Coca Cola Normal 2L",
};

var dbInterfaceData = {
  name: "cocacola 2l un",
  prices: { currentPrice: 10, offerPrice: 8 },
  quantity: 29,
  customAttributes: [
    { name: "ecommerceCurrentPrice", value: 12 },
    { name: "ecommerceOfferPrice", value: 0 },
    { name: "ecommerceName", value: "Coca Cola Normal 2L" },
  ],
};
//
//
//
