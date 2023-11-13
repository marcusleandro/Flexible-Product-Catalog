class StatusError extends Error {
	constructor(status, msg) {
		super(msg);
		this.status = status;
	}
}

const errorHandlers = {
	internalError: (message) => {
		throw new StatusError(500, message);
	},
	resourceNotFound: (data, message) => {
		if (!data || data[0] <= 0) {
			throw new StatusError(404, message);
		}
		return data;
	},
	unauthorized: (data, message) => {
		if (!data) {
			throw new StatusError(401, message);
		}
		return data;
	},
	forbidden: (message) => {
		throw new StatusError(403, message);
	},
	badRequest: (message) => {
		throw new StatusError(400, message);
	},
};

module.exports.errorHandlers = errorHandlers;
module.exports.StatusError = StatusError;
