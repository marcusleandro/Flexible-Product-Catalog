require("dotenv").config({
  path: process.env.NODE_ENV === "test" ? ".env.test" : ".env",
});

const express = require("express");
const helmet = require("helmet");
const xss = require("xss-clean");
const compression = require("compression");
const cors = require("cors");
const morgan = require("morgan");
const httpStatus = require("http-status");

const apiRouter = require("./routes");
const logger = require("./services/Logger");
const defaultErrors = require("./constants/errors");
const { StatusError } = require("./utils/errorHandlers");
const ObjectUtil = require("./utils/ObjectUtil");

const { BODY_SIZE_LIMIT, NODE_ENV, MONGO_URI } = process.env;
console.log("MONGO_URI", MONGO_URI);

/**
 * Make every first letter, of every word in the msg, uppercase.
 *
 * @param {String} msg The message to transform.
 */
const transformMessage = (msg) =>
  msg
    .split(" ")
    .map((word) => word && word[0].toUpperCase() + word.substring(1))
    .join(" ");

/**
 * This method change the Date object to miliseconds.
 *
 * @param {*} key       The key of the object.
 * @param {*} value     The value of the object.
 */
const jsonReplacerFn = function (key, value) {
  if (this[key] instanceof Date) {
    // Our custom date serialization -> the date timestamp in milliseconds:
    value = this[key].getTime();
  }
  return value;
};

class AppController {
  constructor() {
    this.express = express();
    this._initialize();
  }

  _initialize() {
    this.middlewares();
    this.routes();
    this.handleErrors();
  }

  middlewares() {
    if (NODE_ENV !== "test") {
      // Configuring express integration with morgan and logger:
      this.express.use(
        morgan("common", { stream: { write: logger.info.bind(logger) } })
      );
    }

    // set security HTTP headers
    this.express.use(helmet({ crossOriginResourcePolicy: false }));

    // parse json request body:
    this.express.use(express.json({ limit: BODY_SIZE_LIMIT || "2mb" }));

    // parse urlencoded request body
    this.express.use(
      express.urlencoded({ limit: BODY_SIZE_LIMIT || "2mb", extended: false })
    );

    // Sanitize request data:
    this.express.use(xss());

    // gzip compression
    this.express.use(compression());

    // Enabling CORS:
    const corsOptions = {
      origin: "*",
      optionsSuccessStatus: httpStatus.OK, // some legacy browsers (IE11, various SmartTVs) choke on 204
    };
    this.express.use(cors(corsOptions));

    // Configuring json replacer to parse Date to miliseconds:
    this.express.set("json replacer", jsonReplacerFn);
  }

  routes() {
    this.express.use("/api", apiRouter);
  }

  handleErrors() {
    // Handle 404 route not found errors:
    this.express.use((req, res, next) =>
      next(new StatusError(httpStatus.NOT_FOUND, "Route Not Found"))
    );

    // Handle all errors
    this.express.use((err, req, res, next) => {
      if (typeof err === "string") err = { message: err };

      // Let's merge the default error with the throwned one.
      // Additionally, we'll deconstruct the result to ensure the order of the properties.
      const { status, message, description, ..._err } = {
        status: httpStatus.INTERNAL_SERVER_ERROR,
        ...defaultErrors[err.status || httpStatus.INTERNAL_SERVER_ERROR],
        ...err,
        message: transformMessage(
          err.message ||
            defaultErrors[err.status || httpStatus.INTERNAL_SERVER_ERROR]
              .message
        ),
      };

      logger.error(err);

      res.status(status).json({
        error: ObjectUtil.removeCiclesFromObject({
          status,
          message,
          description,
          ..._err,
        }),
      });
    });
  }
}

module.exports = new AppController().express;
