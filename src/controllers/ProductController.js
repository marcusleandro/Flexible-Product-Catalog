const httpStatus = require("http-status");
const Product = require("../models/Product");
const ObjectUtil = require("../utils/ObjectUtil");
const { StatusError } = require("../utils/errorHandlers");
const logger = require("../services/Logger");

class ProductController {
  constructor() {
    /**
     * @type {Logger}
     */
    this._logger = logger;
    this._options = {
      size: 10,
      page: 0,
    };
  }

  list() {
    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     * @returns {Promise<import('express').Response>}
     */
    return async (req, res, next) => {
      const { page, size, sortBy, ..._query } = {
        ...req.query,
        ...req.validated?.query,
      };

      // Setting up the limit and offset values:
      const limit = (size || this._options.size) * 1;
      const offset = (page || this._options.page) * limit;

      // Setting up the query:
      const query = {};
      for (const key in _query) {
        if (_query.hasOwnProperty(key)) {
          const value = _query[key];
          if (value) {
            switch (key) {
              case "id":
                query["_id"] = value;
                break;
              case "name":
              case "quantity":
                query[key] = { $regex: value, $options: "i" };
                break;
              case "currentPrice":
              case "offerPrice":
                query[`prices.${key}`] = value;
                break;
              default:
                query["customAttributes"] = {
                  $elemMatch: {
                    name: key,
                    value: { $regex: value, $options: "i" },
                  },
                };
                break;
            }
          }
        }
      }
      //console.log("query: ", query);

      // Setting up the sort:
      const sort = {};
      if (sortBy) {
        const parts = sortBy.split(":");
        const [fieldName, direction] = parts;
        switch (fieldName) {
          case "id":
            sort["_id"] = direction === "desc" ? -1 : 1;
            break;
          case "name":
          case "quantity":
            sort[fieldName] = direction === "desc" ? -1 : 1;
            break;
          case "currentPrice":
          case "offerPrice":
            sort[`prices.${fieldName}`] = direction === "desc" ? -1 : 1;
            break;
          default:
            sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
            // sort["customAttributes"] = {
            //   $elemMatch: {
            //     name: fieldName,
            //     value: direction === "desc" ? -1 : 1,
            //   },
            // };
            break;
        }
        //sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
      }
      //console.log("sort: ", sort);

      return Product.find({ ...query })
        .limit(limit)
        .skip(offset)
        .sort(sort)
        .then((products) =>
          Promise.all([products, Product.countDocuments({ ...query })])
        )
        .then(([products, totalCount]) =>
          res.status(httpStatus.OK).send({
            meta: { totalCount },
            body: Product.toBusinessDataFormatList(products),
          })
        )
        .catch(next);
    };
  }

  show() {
    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     * @returns {Promise<import('express').Response>}
     */
    return async (req, res, next) => {
      const id = req.validated?.params.id;
      return Product.findById(id)
        .then((product) =>
          this.#resourceNotFound(product, "Product not found!")
        )
        .then((product) =>
          res
            .status(httpStatus.OK)
            .send({ body: product.toBusinessDataFormat() })
        )
        .catch(next);
    };
  }

  create() {
    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     * @returns {Promise<import('express').Response>}
     */
    return async (req, res, next) => {
      try {
        const createForm = { ...req.body, ...req.validated?.body };
        //console.log("createForm: ", createForm);

        const data = Product.toDatabaseDataFormat(createForm);
        const product = new Product(data);

        await product.save();

        return res
          .status(httpStatus.CREATED)
          .json(product.toBusinessDataFormat());
      } catch (error) {
        next(error);
      }
    };
  }

  update() {
    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     * @returns {Promise<import('express').Response>}
     */
    return async (req, res, next) => {
      const id = req.validated?.params.id;
      const updateForm = { ...req.body, ...req.validated?.body };
      ObjectUtil.clean(updateForm);
      //this._logger.info("updateForm: ", updateForm);

      const data = Product.toDatabaseDataFormat(updateForm);
      //this._logger.info("data to update: ", data);

      return Product.findByIdAndUpdate(id, data, { new: true })
        .then((product) =>
          this.#resourceNotFound(product, "Product not found!")
        )
        .then((product) =>
          res
            .status(httpStatus.OK)
            .send({ body: product.toBusinessDataFormat() })
        )
        .catch(next);
    };
  }

  delete() {
    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     * @returns {Promise<import('express').Response>}
     */
    return async (req, res, next) => {
      const id = req.validated?.params.id;
      return Product.findByIdAndDelete(id)
        .then((product) =>
          this.#resourceNotFound(product, "Product not found!")
        )
        .then((product) => res.status(httpStatus.NO_CONTENT).send())
        .catch(next);
    };
  }

  #resourceNotFound(data, message) {
    if (!data || data[0] <= 0) {
      throw new StatusError(404, message);
    }
    return data;
  }
}

module.exports = new ProductController();
