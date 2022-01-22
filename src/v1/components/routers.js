const express = require("express");
const router = express.Router();

router.get('/', (_, response) => {
  response.status(200).json({
    endpoints: [
      '/api/v1/sections',
      '/api/v1/categories',
      '/api/v1/theme',
      '/api/v1/references',
      'api/v1/auth'
    ]
  });
});

router.use('/sections', require('./sections'));
router.use('/categories', require('./categories'));
router.use('/themes', require('./themes'));
router.use('/references', require('./references'));
router.use('/auth', require('./auth'));
router.use('/counters', require('./counters'));
router.use('/users', require('./users'));
router.use('/search', require('./search'));

module.exports = router;
