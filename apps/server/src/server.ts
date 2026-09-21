import app from "./app.js";
import dotenv from 'dotenv';
import { OpenRouterProvider } from "@resume-analyzer/ai";

// Load environment variables from the .env file in the root directory
dotenv.config();

const PORT = process.env.PORT;

const provider = new OpenRouterProvider(
  process.env.LLM_MODEL!,
);

app.get("/api/ai/test", async (_req, res) => {
  try {
    const result = await provider.generate({
      systemPrompt:
        "You are a helpful resume analysis assistant.",

      userPrompt:
        "Give me three concise tips for improving a software engineer resume.",

      temperature: 0.2,
    });

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      error: "AI request failed",
    });
  }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);  
});