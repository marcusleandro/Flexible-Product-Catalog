const BaseForm = require("../BaseForm");
const { param } = require("express-validator");

class GetById extends BaseForm {
  static get validations() {
    return [this.validator.objectId(param)];
  }
}

module.exports = GetById;
