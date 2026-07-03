import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

app.get("/", (req, res) => {
  res.send("AI Cover Letter Generator Backend Running");
});

app.post("/generate", async (req, res) => {
  try {
    const { name, role, company, skills, resume } = req.body;

    const prompt = `
Write a professional cover letter using the details below.

Candidate Name: ${name}
Job Role: ${role}
Company: ${company}
Skills: ${skills}
Resume: ${resume}

Instructions:
- Start directly with today's date.
- Address the hiring manager professionally.
- Use "${name}" as the candidate name.
- Use "${company}" as the company name.
- Use "${role}" as the job title.
- Do NOT use placeholders like [Your Name], [Date], [Company], [Platform], or [Address].
- Do NOT leave any blank fields.
- Write 250-350 words.
- End with:

Sincerely,
${name}

Return only the cover letter.
`;

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    res.json({
      text: result.text,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      text: error.message,
    });
  }
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});