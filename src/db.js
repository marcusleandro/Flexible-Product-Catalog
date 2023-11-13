const mongoose = require("mongoose");
const logger = require("./services/Logger");

module.exports.connect = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  logger.info("MongoDB connected!");
};

module.exports.close = async () => {
  await mongoose.connection.close();
};

module.exports.dropDatabase = async () => {
  await mongoose.connection.dropDatabase();
};

module.exports.clearDatabase = async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany();
  }
};

module.exports.clearCollection = async (collectionName) => {
  const collection = mongoose.connection.collections[collectionName];
  await collection.deleteMany();
};
