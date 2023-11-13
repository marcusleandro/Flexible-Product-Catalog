const winston = require('winston');
const fs = require('fs');

const { NODE_ENV } = process.env;

const enumerateErrorFormat = winston.format((info) => {
	if (info instanceof Error) {
		Object.assign(info, { message: info.stack });
	}
	return info;
});

if (!fs.existsSync('logs')) {
	fs.mkdirSync('logs');
}

class Logger {
	constructor() {
		if (Logger._instance) {
			return Logger._instance;
		}
		Logger._instance = this;
		this.logger = this._createLogger();
	}

	/**
	 * This method creates a intance of logger using winston:
	 * @returns {winston.Logger}	The Logger instance
	 */
	_createLogger() {
		const logger = winston.createLogger({
			level: NODE_ENV === 'development' ? 'debug' : 'info',
			format: winston.format.combine(
				winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
				enumerateErrorFormat(),
				winston.format.errors({ stack: false }),
				winston.format.splat(),
				winston.format.json(),
			),
			transports: [
				new winston.transports.File({
					level: 'error',
					filename: 'logs/error.log',
					maxsize: 100000,
					maxFiles: 10,
				}),
				new winston.transports.File({
					filename: 'logs/combined.log',
					maxsize: 100000,
					maxFiles: 10,
				}),
			],
		});

		// If we're not in production then **ALSO**
		// log to the `console` with the colorized simple format.
		if (process.env.NODE_ENV !== 'production') {
			logger.add(
				new winston.transports.Console({
					format: winston.format.combine(
						winston.format.colorize(),
						winston.format.simple(),
					),
				}),
			);
		}

		return logger;
	}
}

module.exports = new Logger().logger;
