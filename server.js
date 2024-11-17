const express = require('express');
const bodyParser = require('body-parser');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const port = 3000;

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.use(bodyParser.json());

app.post('/generate-story', async (req, res) => {
    const { prompt } = req.body;
  
    try {
      const response = await model.generateText({
        prompt,
        temperature: 0.7,
        maxOutputTokens: 150,
      });
  
      const story = response.data.candidates[0].output;
      res.json({ story });
    } catch (error) {
      console.error('Error generating story:', error.response?.data || error.message);
      res.status(500).json({ error: 'Failed to generate story' });
    }
  });
  
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
