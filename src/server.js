const dotenv = require("dotenv");
dotenv.config({
  path: "./config.env",
});

const app = require("./api");

//  Uncaught Exception error
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to Uncaught Exception`);
  process.exit(1);
});

const server = app.listen(process.env.APIPORT, () => {
  console.log(`Listening on port ${process.env.APIPORT}`);
});

// Unhandled Promise Rejection
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to Unhandled Promise Rejection`);

  server.close(() => {
    process.exit(1);
  });
});
