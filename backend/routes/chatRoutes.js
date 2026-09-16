const express = require('express');
const { handleSkillGapChat } = require('../controllers/chatController');

const router = express.Router();

router.post('/skill-gap', handleSkillGapChat);

module.exports = router;
