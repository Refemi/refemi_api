const express = require("express");
const router = express.Router();

const errorMiddleware = require("./middlewares/error");
const catchAsyncErrors = require("./middlewares/catchAsyncErrors");

const components = require("./components");


router.get('/api/v1', (_, response) => {
  response.status(200).json({
    message: 'Bienvenue sur Refemi API (v1)',
    endpoints: [
      { ['GET']: '/api/v1/sections' },
      { ['GET, POST, PUT, DELETE']: '/api/v1/sections/:id' },
      { ['GET']: '/api/v1/categories' },
      { ['GET, POST, PUT, DELETE']: '/api/v1/categories/:id' },
      { ['GET']: '/api/v1/categories/sections/:section_id' },
      { ['GET']: '/api/v1/themes' },
      { ['GET, POST, PUT, DELETE']: '/api/v1/themes/:id' },
      { ['GET']: '/api/v1/references' },
      { ['GET, POST, PUT, DELETE']: '/api/v1/references/:id' },
      { ['GET']: '/api/v1/references/section/:id' },
      { ['GET']: '/api/v1/references/theme/:id' },
      { GET: '/api/v1/auth' }
    ]
  });
});

router.use('/api/v1',
  catchAsyncErrors(async (request, response, next) => components(request, response, next)),
  errorMiddleware,
);


module.exports = router;
