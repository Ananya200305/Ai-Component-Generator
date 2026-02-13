require("dotenv").config();
const express = require("express");
const { GoogleGenAI } = require("@google/genai");

const app = express();

// Log all requests
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.url}`);
  next();
});

// CORS headers - MUST be before routes
const cors = require("cors");

app.use(cors({
  origin: "http://localhost:5173", // Vite default
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));


app.use(express.json());

// Initialize AI client ONCE
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Generate route - all in one file
app.post("/generate", async (req, res) => {
  try {
    const { prompt, framework } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt required" });
    }

    console.log("🤖 Generating for:", prompt.substring(0, 50) + "...");

    const finalPrompt = `
You are an experienced programmer with expertise in web development and UI/UX design. You create modern, animated, and fully responsive UI components. You are highly skilled in HTML, CSS, Tailwind CSS, Bootstrap, JavaScript, React, Next.js, Vue.js, Angular, and more.

Now, generate a UI component for: ${prompt}  
Framework to use: ${framework}  

Requirements:  
The code must be clean, well-structured, and easy to understand.  
Optimize for SEO where applicable.  
Focus on creating a modern, animated, and responsive UI design.  
Include high-quality hover effects, shadows, animations, colors, and typography.  
Return ONLY the code, formatted properly in **Markdown fenced code blocks**.  
Do NOT include explanations, text, comments, or anything else besides the code.  
And give the whole code in a single HTML file.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: finalPrompt,
    });

    const text = response.text;
    const match = text.match(/```(?:\w+)?\n?([\s\S]*?)```/);
    const cleanCode = match ? match[1].trim() : text.trim();

    console.log("✅ Content generated successfully");
    res.json({ output: cleanCode });

  } catch (err) {
    console.error("❌ Error:", err.message);
    
    if (err.message.includes("API key")) {
      return res.status(403).json({ 
        error: "Invalid API key",
        details: "Check your .env file"
      });
    }
    
    res.status(500).json({ 
      error: err.message || "Failed to generate content"
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`\n🚀 Server running on port ${PORT}`);
    console.log(`📡 API: http://localhost:${PORT}/generate`);
    console.log(`✅ CORS enabled\n`);
});