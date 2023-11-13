const ExpressValidator = require("../services/ExpressValidator");
const validationMiddleware = require("../middlewares/validation");

class BaseForm {
  static validator = ExpressValidator;

  static get validations() {
    throw new Error("This getter must be implemented.");
  }

  static get validate() {
    return [...this.validations, validationMiddleware];
  }
}

module.exports = BaseForm;
