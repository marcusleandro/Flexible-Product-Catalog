const {
  check,
  body,
  cookie,
  header,
  param,
  query,
} = require("express-validator");

class ExpressValidator {
  /**
   * Validates an email field using express-chain API.
   * @param {check | body | cookie | header | param | query } validator The validator to be used in the chain, i.e "check", "body" etc.
   * @param {Object} [options] An object with optional parameters to customize the validation.
   * @param {String} [options.fieldName] The name of the field with the email, by default it's value is "email".
   * @param {Boolean} [options.required]  If the field is required, default is true.
   * @returns {import('express-validator').ValidationChain}
   */
  static email(validator, options = {}) {
    const { fieldName, required } = {
      fieldName: "email",
      required: true,
      ...options,
    };

    return ExpressValidator.string(validator, fieldName, { required })
      .bail()
      .isEmail()
      .withMessage(`The field ${fieldName} must be a valid email.`);
    // Emails must be normalized, but since we weren't doing it before, it may be a problem
    // .normalizeEmail(),
  }

  /**
   * Validates an id field using express-chain API.
   * @param {check | body | cookie | header | param | query } validator The validator to be used in the chain, i.e "check", "body" etc.
   * @param {Object} [options] An object with optional parameters to customize the validation.
   * @param {String} [options.fieldName] The name of the field with the id, by default it's value is "id".
   * @param {Boolean} [options.required] If the field is required, default is true.
   * @returns {import('express-validator').ValidationChain}
   */
  static id(validator, options = {}) {
    const { fieldName, required } = {
      fieldName: "id",
      required: true,
      ...options,
    };
    return (
      required
        ? ExpressValidator.required(validator, fieldName).bail()
        : validator(fieldName)
    )
      .if(validator(fieldName).exists({ checkNull: true }))
      .isInt({ min: 1 })
      .withMessage(`The field ${fieldName} must be a positive integer.`);
  }

  /**
   * Validates an objectId field using express-chain API.
   * @param {check | body | cookie | header | param | query } validator The validator to be used in the chain, i.e "check", "body" etc.
   * @param {Object} [options] An object with optional parameters to customize the validation.
   * @param {String} [options.fieldName] The name of the field with the id, by default it's value is "id".
   * @param {Boolean} [options.required] If the field is required, default is true.
   * @returns {import('express-validator').ValidationChain}
   */
  static objectId(validator, options = {}) {
    const { fieldName, required } = {
      fieldName: "id",
      required: true,
      ...options,
    };
    return (
      required
        ? ExpressValidator.required(validator, fieldName).bail()
        : validator(fieldName)
    )
      .if(validator(fieldName).exists({ checkNull: true }))
      .isMongoId()
      .withMessage(`The field ${fieldName} must be a valid mongo id.`);
  }

  /**
   * Validates a string field using express-chain API.
   * @param {check | body | cookie | header | param | query } validator The validator to be used in the chain, i.e "check", "body" etc.
   * @param {String} fieldName The name of the field to be validated.
   * @param {Object} [options] An object with optional parameters to customize the validation.
   * @param {Boolean} [options.required] If the field is required, default is true.
   * @param {Boolean} [options.allowEmpty] If empty strings are allowed, default is false.
   * @returns {import('express-validator').ValidationChain}
   */
  static string(validator, fieldName, options = {}) {
    const { required, allowEmpty } = {
      required: true,
      allowEmpty: false,
      ...options,
    };

    const validation = (
      required
        ? ExpressValidator.required(validator, fieldName).bail()
        : validator(fieldName)
    )
      .if(validator(fieldName).exists({ checkNull: true }))
      .isString()
      .withMessage(`The field ${fieldName} must be a string.`);

    return allowEmpty
      ? validation
      : validation
          .bail()
          .notEmpty()
          .withMessage(`The field ${fieldName} cannot be an empty string.`);
  }

  /**
   * Validates a boolean field using express-chain API.
   * @param {check | body | cookie | header | param | query } validator The validator to be used in the chain, i.e "check", "body" etc.
   * @param {String} fieldName The name of the field to be validated.
   * @param {Object} [options] An object with optional parameters to customize the validation.
   * @param {Boolean} [options.required] If the field is required, default is true.
   * @returns {import('express-validator').ValidationChain}
   */
  static boolean(validator, fieldName, options = {}) {
    const { required } = {
      required: true,
      ...options,
    };
    return (
      required
        ? ExpressValidator.required(validator, fieldName).bail()
        : validator(fieldName)
    )
      .if(validator(fieldName).exists({ checkNull: true }))
      .isBoolean()
      .withMessage(`The field ${fieldName} must be a boolean.`);
  }

  /**
   * Validates a JSON field using express-chain API.
   * @param {check | body | cookie | header | param | query } validator The validator to be used in the chain, i.e "check", "body" etc.
   * @param {String} fieldName The name of the field to be validated.
   * @param {Object} [options] An object with optional parameters to customize the validation.
   * @param {Boolean} [options.required] If the field is required, default is true.
   * @param {Boolean} [options.allow_primitives] If true, the primitives 'true', 'false' and 'null' are accepted as valid JSON values, default is false.
   * @returns {import('express-validator').ValidationChain}
   */
  static JSON(validator, fieldName, options = {}) {
    const { required, allow_primitives } = {
      required: true,
      ...options,
    };
    return (
      required
        ? ExpressValidator.required(validator, fieldName).bail()
        : validator(fieldName)
    )
      .if(validator(fieldName).exists({ checkNull: true }))
      .isJSON({ allow_primitives })
      .withMessage(`The field ${fieldName} must be a JSON.`);
  }

  /**
   * Validates an array field using express-chain API.
   * @param {check | body | cookie | header | param | query } validator The validator to be used in the chain, i.e "check", "body" etc.
   * @param {String} fieldName The name of the field to be validated.
   * @param {Object} [options] An object with optional parameters to customize the validation.
   * @param {Boolean} [options.required] If the field is required, default is true.
   * @param {Number} [options.min] Minimum array length.
   * @param {Number} [options.max] Maximum array length.
   * @returns {import('express-validator').ValidationChain}
   */
  static array(validator, fieldName, options = {}) {
    const { required, min, max } = {
      required: true,
      ...options,
    };
    return (
      required
        ? ExpressValidator.required(validator, fieldName).bail()
        : validator(fieldName)
    )
      .if(validator(fieldName).exists({ checkNull: true }))
      .isArray({ min, max })
      .withMessage(
        `The field ${fieldName} must be an array with length inside [${
          min || "*"
        },${max || "*"}], where * symbolizes any number.`
      );
  }

  /**
   * Validates an object field using express-chain API.
   * @param {check | body | cookie | header | param | query } validator The validator to be used in the chain, i.e "check", "body" etc.
   * @param {String} fieldName The name of the field to be validated.
   * @param {Object} [options] An object with optional parameters to customize the validation.
   * @param {Boolean} [options.required] If the field is required, default is true.
   * @param {Boolean} [options.strict] If set to false the validation passes also for object and null types, defaults to true.
   * @returns {import('express-validator').ValidationChain}
   */
  static object(validator, fieldName, options) {
    const { required, strict } = {
      required: true,
      ...options,
    };
    return (
      required
        ? ExpressValidator.required(validator, fieldName).bail()
        : validator(fieldName)
    )
      .if(validator(fieldName).exists({ checkNull: true }))
      .isObject({ strict })
      .withMessage(`The field ${fieldName} must be an object.`);
  }

  /**
   * Validates a non negative integer field using express-chain API.
   * @param {check | body | cookie | header | param | query } validator The validator to be used in the chain, i.e "check", "body" etc.
   * @param {String} fieldName The name of the field to be validated.
   * @param {Object} [options] An object with optional parameters to customize the validation.
   * @param {Boolean} [options.required] If the field is required, default is true.
   * @returns {import('express-validator').ValidationChain}
   */
  static nonNegativeInteger(validator, fieldName, options = {}) {
    const { required } = {
      required: true,
      ...options,
    };
    return (
      required
        ? ExpressValidator.required(validator, fieldName).bail()
        : validator(fieldName)
    )
      .if(validator(fieldName).exists({ checkNull: true }))
      .isInt({ min: 0 })
      .withMessage(`The field ${fieldName} must be a non negative integer.`);
  }

  /**
   * Validates an positive integer field using express-chain API.
   * @param {check | body | cookie | header | param | query } validator The validator to be used in the chain, i.e "check", "body" etc.
   * @param {String} fieldName The name of the field to be validated.
   * @param {Object} [options] An object with optional parameters to customize the validation.
   * @param {Boolean} [options.required] If the field is required, default is true.
   * @param {Boolean} [options.min] If the validation needs to match a minimalValue, default is 1.
   * @returns {import('express-validator').ValidationChain} The validation chain.
   */
  static positiveInteger(validator, fieldName, options = {}) {
    const { required, min, max } = {
      required: true,
      min: 1,
      max: Number.MAX_SAFE_INTEGER,
      ...options,
    };
    return (
      required
        ? ExpressValidator.required(validator, fieldName).bail()
        : validator(fieldName)
    )
      .if(validator(fieldName).exists({ checkNull: true }))
      .isInt({ min, max })
      .withMessage(`The field ${fieldName} must be a positive integer.`);
  }

  /**
   *
   * @param {check | body | cookie | header | param | query } validator The validator to be used in the chain, i.e "check", "body" etc.
   * @param {String} fieldName The name of the field to be validated.
   * @param {Object} [options] An object with optional parameters to customize the validation.
   * @param {Boolean} [options.required] If the field is required, default is true.
   * @returns {import('express-validator').ValidationChain} The validation chain.
   */
  static numeric(validator, fieldName, options = {}) {
    const { required, min, max } = {
      required: true,
      ...options,
    };
    return (
      required
        ? ExpressValidator.required(validator, fieldName).bail()
        : validator(fieldName)
    )
      .if(validator(fieldName).exists({ checkNull: true }))
      .isNumeric()
      .withMessage(`The field ${fieldName} must be a number.`)
      .isFloat({
        ...(min !== undefined && min !== null ? { min } : {}),
        ...(max !== undefined && max !== null ? { max } : {}),
      })
      .withMessage(
        `The field ${fieldName} must be a number between ${min} and ${max}.`
      );
  }

  /**
   * Validates a required field using express-chain API.
   * @param {check | body | cookie | header | param | query } validator The validator to be used in the chain, i.e "check", "body" etc.
   * @param {String} fieldName The name of the field to be validated.
   * @param {Object} [options] An object with optional parameters to customize the validation.
   * @returns {import('express-validator').ValidationChain} The validation chain.
   */
  static required(validator, fieldName, options = {}) {
    return validator(fieldName)
      .exists({ checkNull: true })
      .withMessage(`The field ${fieldName} is required.`);
  }
}

module.exports = ExpressValidator;
