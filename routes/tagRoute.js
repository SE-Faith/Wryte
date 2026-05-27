const express = require('express');
const router = express.Router();
const tagController = require('../controllers/tagController');

router.post('/', tagController.createTag);
router.get('/', tagController.getAllTags);
router.get('/:tagId', tagController.getTagById);
router.put('/:tagId', tagController.updateTag);
router.delete('/:tagId', tagController.deleteTag);

module.exports = router;