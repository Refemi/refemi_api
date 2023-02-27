const https = require("https");
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

if (process.env.NODE_ENV === "production") {
  const ssl = require("./v1/ssl");

  const options = {
    key: ssl.key,
    cert: ssl.cert,
  };

  https.createServer(options, app).listen(process.env.HTTPSPORT);
}

// Unhandled Promise Rejection
process.on("unhandledRejection", (err) => {
  console.log(err);
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to Unhandled Promise Rejection`);

  server.close(() => {
    process.exit(1);
  });
});
