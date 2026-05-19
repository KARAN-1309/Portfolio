// server.js

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import process from 'process';
import { HfInference } from '@huggingface/inference';
import knowledgeBase from './data/knowledgeBase.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Initialize Hugging Face
const hf = new HfInference(process.env.HF_API_KEY);

// ==============================
// K-1 SYSTEM PROMPT
// ==============================

const SYSTEM_PROMPT = `
You are K-1, the futuristic AI assistant of Karan Jogi.

Knowledge Base:
${JSON.stringify(knowledgeBase, null, 2)}

Rules:
- Be concise
- Be futuristic
- Never invent fake information
- Keep answers conversational
`;

// ==============================
// CHAT API
// ==============================

app.post('/api/chat', async (req, res) => {
  try {
    const { message = "" } = req.body;

    // Validate message
    if (!message.trim()) {
      return res.status(400).json({
        error: "Empty transmission received."
      });
    }

    // Generate response from Hugging Face
    const response = await hf.chatCompletion({
  model: "meta-llama/Llama-3.1-8B-Instruct",

  messages: [
    {
      role: "system",
      content: SYSTEM_PROMPT,
    },
    {
      role: "user",
      content: message,
    },
  ],

  max_tokens: 200,
  temperature: 0.8,
});

    const reply =
      response.choices?.[0]?.message?.content ||
      "K-1 neural core failed to generate response.";

    res.json({
      reply,
    });

  } catch (error) {

    console.error("K-1 Core Error:", error);

    // HuggingFace Rate Limit
    if (error?.status === 429) {
      return res.status(429).json({
        error:
          "K-1 neural core is overloaded. Retry shortly.",
      });
    }

    res.status(500).json({
      error: "Neural link severed.",
    });
  }
});

// ==============================
// SERVER START
// ==============================

const PORT = process.env.PORT || 5005;

const server = app.listen(PORT, () => {
  console.log(
    `[ SYSTEM ONLINE ] K-1 Backend Server running on port ${PORT}`
  );
});

// ==============================
// ERROR HANDLING
// ==============================

server.on('error', (err) => {
  console.error('Server Error:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error(
    'Unhandled Rejection at:',
    promise,
    'reason:',
    reason
  );
});