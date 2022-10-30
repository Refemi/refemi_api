const express = require('express');
const router = express.Router();

const SearchController = require('./searchController');

router.get('/', SearchController.getAllSearch);
router.get('/reference-name', SearchController.getAllSearchReferencesByName);

module.exports = router;
