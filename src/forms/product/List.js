const BaseForm = require("../BaseForm");

const { query } = require("express-validator");

class List extends BaseForm {
  static get validations() {
    return [
      this.validator.nonNegativeInteger(query, "page", { required: false }),
      this.validator.positiveInteger(query, "size", { required: false }),
      this.validator.string(query, "sortBy", { required: false }),
      //this.validator.array(query, 'sortBy', { required: false }),
    ];
  }
}

module.exports = List;
