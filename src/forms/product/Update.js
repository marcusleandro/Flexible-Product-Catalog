const BaseForm = require("../BaseForm");
const { param, body } = require("express-validator");

class Update extends BaseForm {
  static get validations() {
    return [
      this.validator.objectId(param),
      this.validator.string(body, "name", { required: false }),
      this.validator.numeric(body, "currentPrice", { min: 0, required: false }),
      this.validator.numeric(body, "offerPrice", { min: 0, required: false }),
      this.validator.positiveInteger(body, "quantity", {
        required: false,
        min: 1,
      }),
    ];
  }
}

module.exports = Update;
