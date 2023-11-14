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

module.exports = mongoose.model("Product", ProductSchema);
