const httpStatus = require("http-status");
const ObjectUtil = require("../utils/ObjectUtil");
const { StatusError } = require("../utils/errorHandlers");
const logger = require("../services/Logger");
const productService = require("../services/ProductService");

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

      return productService
        .list({ limit, offset, sort, query })
        .then((products) =>
          Promise.all([products, productService.count(query)])
        )
        .then(([products, totalCount]) =>
          res.status(httpStatus.OK).send({
            meta: { totalCount },
            body: products,
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
      return productService
        .get(id)
        .then((product) =>
          this.#resourceNotFound(product, "Product not found!")
        )
        .then((product) => res.status(httpStatus.OK).send({ body: product }))
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
      const createForm = { ...req.body, ...req.validated?.body };
      return productService
        .create(createForm)
        .then((product) =>
          res.status(httpStatus.CREATED).json({ body: product })
        )
        .catch(next);
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
      const id = req.validated?.params.id,
        updateForm = { ...req.body, ...req.validated?.body };
      return productService
        .update(id, ObjectUtil.clean(updateForm))
        .then((product) => res.status(httpStatus.OK).send({ body: product }))
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
      return productService
        .delete(id)
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
