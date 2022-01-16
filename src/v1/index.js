const express = require("express");
const router = express.Router();

const errorMiddleware = require("./middlewares/error");
const catchAsyncErrors = require("./middlewares/catchAsyncErrors");

const components = require("./components");

router.get('/api/v1', (_, response) => {
  response.status(200).json({
    message: 'Bienvenue sur Refemi API (v1)',
    endpoints: [
      '/api/v1/sections',
      '/api/v1/categories',
      '/api/v1/theme',
      '/api/v1/references',
      '/api/v1/auth'
    ]
  });
});

router.use('/api/v1',
  errorMiddleware,
  catchAsyncErrors(async (request, response, next) =>
      components(request, response, next)
  )
);

module.exports = router;
