const { lstatSync, readdirSync } = require("fs");
const { join, basename } = require("path");

class ImportUtil {
	/**
	 * Since it's a static, utilitary class, it can not be instantiated.
	 */
	constructor() {
		throw new Error("This class can't be instantiated.");
	}

	/**
	 * Auto import all the files in the root directory returning an object with the following format: {fileName: exportedObject, ...}
	 * @param {String} dirname Name of the root directory from where the imports will be fetched, usually __dirname.
	 * @param {Array<String>} [filesToIgnore] Array with names of files to ignore, usually with the index file itself that's calling the method, in this case you can simply pass [ __filename, ... ] .
	 */
	static getDirImports(dirname, filesToIgnore = []) {
		return readdirSync(dirname)
			.filter(
				(file) =>
					file.indexOf(".") !== 0 &&
					file.slice(-3) === ".js" &&
					filesToIgnore.every((fileToIgnore) => file !== basename(fileToIgnore))
			)
			.reduce(
				(imports, file) => ({
					[file.slice(0, -3)]: require(join(dirname, file)),
					...imports,
				}),
				{}
			);
	}

	/**
	 * Auto import all the files in the sub-directories returning an object with the following format: {subdirectoryName: {fileName: exportedObject, ...}, ...}
	 * @param {String} dirname Name of the root directory from where the sub directories will be fetched.
	 */
	static getAllSubDirImports(dirname) {
		return ImportUtil.getAllSubDir(dirname).reduce(
			(imports, subDirname) => ({
				[basename(subDirname)]: ImportUtil.getDirImports(subDirname),
				...imports,
			}),
			{}
		);
	}

	/**
	 * Get the path of all the sub directories inside a root directory.
	 * @param {String} dirname Name of the root directory from where the sub directories will be fetched.
	 */
	static getAllSubDir(dirname) {
		return readdirSync(dirname)
			.map((file) => join(dirname, file))
			.filter(ImportUtil.isDirectory);
	}

	/**
	 * Verifies if a source is a directory.
	 * @param {String} source Target source.
	 */
	static isDirectory(source) {
		return lstatSync(source).isDirectory();
	}
}

module.exports = ImportUtil;
