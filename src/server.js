const db = require("./db");
const app = require("./app");
const logger = require("./services/Logger");
const port = process.env.PORT || "4000";

let ONLINE = true;
const gracefulShutdownHandler = (signal) => {
  logger.warn(`⚠️ Caught ${signal}, gracefully shutting down`);
  ONLINE = false;
  let status = 0;

  setTimeout(async () => {
    logger.info("🤞 Shutting down application");
    try {
      // closing db connection:
      await db.close();
    } catch (e) {
      logger.error(
        "Failed to gracefulShutdown schedules or close database connection",
        e
      );
      status = 1;
    }

    // stop the server from accepting new connections
    server.close(function (err) {
      if (err) {
        logger.error("Failed to close server", err);
        status = 1;
      } else {
        logger.info("👋 All requests stopped, shutting down");
      }
      // once the server is not accepting connections, exit
      process.exit(status);
    });
  }, 0);
};

const server = app.listen(port, async () => {
  logger.info(`🚀 Server running on port ${port}.`);
  await db.connect();
});

// The SIGINT signal is sent to a process by its controlling terminal when a user wishes to interrupt the process.
process.on("SIGINT", gracefulShutdownHandler);

// The SIGTERM signal is sent to a process to request its termination.
process.on("SIGTERM", gracefulShutdownHandler);
