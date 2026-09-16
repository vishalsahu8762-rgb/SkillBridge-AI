const { generateSkillGapAssistantReply } = require('../services/chatService');

const handleSkillGapChat = async (req, res) => {
  try {
    const { question, context, history } = req.body || {};
    const normalizedQuestion = typeof question === 'string' ? question.trim() : '';

    if (!normalizedQuestion) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a question.'
      });
    }

    const reply = await generateSkillGapAssistantReply(normalizedQuestion, context || {}, history || []);

    return res.json({
      success: true,
      message: reply
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Sorry, I couldn\'t process that right now. Please try again.'
    });
  }
};

module.exports = {
  handleSkillGapChat
};
