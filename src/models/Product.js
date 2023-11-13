const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    prices: {
      currentPrice: {
        type: Number,
        required: true,
      },
      offerPrice: {
        type: Number,
        required: true,
      },
    },
    quantity: {
      type: Number,
      required: true,
    },
    customAttributes: [
      {
        name: {
          type: String,
          required: true,
        },
        value: {
          type: String, //!
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

ProductSchema.methods.toBusinessDataFormat = function () {
  const result = {};
  Object.keys(this._doc).forEach((key) => {
    switch (key) {
      case "_id":
        result.id = this._doc[key].toString();
        break;
      case "prices":
        result.currentPrice = this._doc.prices.currentPrice;
        result.offerPrice = this._doc.prices.offerPrice;
        break;
      case "name":
      case "quantity":
        result[key] = this._doc[key];
        break;
      case "customAttributes":
        this._doc.customAttributes.forEach((customAttribute) => {
          result[customAttribute.name] = customAttribute.value;
        });
        break;
      case "__v":
        result.version = this._doc[key];
        break;
      default:
        result[key] = this._doc[key];
        break;
    }
  });

  return result;
};

ProductSchema.statics.toBusinessDataFormatList = function (products) {
  return products.map((product) => product.toBusinessDataFormat());
};

ProductSchema.statics.toDatabaseDataFormat = function (input) {
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
};

module.exports = mongoose.model("Product", ProductSchema);

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
