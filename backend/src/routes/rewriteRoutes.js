const express = require('express');
const { rewriteContent, getHistory, getRewrite, getAnalytics, deleteRewrite } = require('../controllers/rewriteController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect); // all rewrite routes are protected

router.post('/', rewriteContent);
router.get('/history', getHistory);
router.get('/analytics', getAnalytics);
router.get('/:id', getRewrite);
router.delete('/:id', deleteRewrite);

module.exports = router;
