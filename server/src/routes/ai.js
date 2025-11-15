const express = require('express');
const OpenAI = require('openai');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// initiate OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// response settings
router.post('/recommendations', authenticateToken, async (req, res) => {
  try {
    const { destination, interests, budget } = req.body;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are an expert travel advisor specializing in personalized recommendations.
             Provide exactly 3 specific, actionable travel recommendations with 
             realistic prices in Swedish Kronor (SEK). Include practical details like location,
              duration, and what makes each experience special. 
              Keep response summarized into max 300 words total and focus on authentic local experiences.`,
        },
        {
          role: 'user',
          content: `Recommend activities for ${destination}. Interests: ${
            interests || 'general'
          }. Budget: ${budget || '5000'} SEK.`,
        },
      ],
      max_tokens: 300,
      temperature: 1.0,
    });

    const recommendations =
      response.choices[0]?.message?.content || 'No recommendations available';

    res.json({
      success: true,
      recommendations,
      destination,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('AI Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate recommendations',
    });
  }
});

module.exports = router;
