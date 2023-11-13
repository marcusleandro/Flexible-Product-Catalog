const BaseForm = require("../BaseForm");
const { body } = require("express-validator");

class Create extends BaseForm {
  static get validations() {
    return [
      this.validator.string(body, "name"),
      this.validator.numeric(body, "currentPrice", { min: 0 }),
      this.validator.numeric(body, "offerPrice", { min: 0 }),
      this.validator.positiveInteger(body, "quantity", {
        required: false,
        min: 1,
      }),
    ];
  }
}

module.exports = Create;
