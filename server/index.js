const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { generateUI } = require('./agent/orchestrator');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration - update for production domain
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL || '*' // Update with your frontend URL
    : '*',
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// Health check endpoint for deployment platforms
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// API info endpoint
app.get('/api', (req, res) => {
  res.json({ message: 'Dezin AI API - Make Smooth UI Easily' });
});

app.post('/api/chat', async (req, res) => {
  try {
    const { messages, apiKey, model } = req.body;
    // Basic validation
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid messages format" });
    }

    const lastMessage = messages[messages.length - 1].content;
    
    // Call the AI Agent Orchestrator
    const result = await generateUI(lastMessage, messages, apiKey, model || 'gemini-2.5-flash');
    
    res.json(result);
  } catch (error) {
    console.error("Error in chat endpoint:", error.message);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Dezin AI Server running on port ${PORT}`);
    console.log(`📍 Health check: http://localhost:${PORT}/health`);
  });
}

module.exports = app;
