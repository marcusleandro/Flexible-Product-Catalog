const { validationResult, matchedData } = require("express-validator");

const handleValidationTemplate = (req, res, next) => {
  try {
    validationResult(req).throw();
  } catch (err) {
    err.status = 422;
    err.message = "Request Validation Failed.";
    err["validation-errors"] = err.errors;
    delete err.errors;
    return next(err);
  }
  req.validated = {
    body: matchedData(req, { locations: ["body"] }),
    cookies: matchedData(req, { locations: ["cookies"] }),
    headers: matchedData(req, { locations: ["headers"] }),
    params: matchedData(req, { locations: ["params"] }),
    query: matchedData(req, { locations: ["query"] }),
  };
  return next();
};

module.exports = handleValidationTemplate;
