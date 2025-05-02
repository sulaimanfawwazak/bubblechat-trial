import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default async function hanlder(req, res) {
  const { messages } = req.body;

  try {
    const chat = ai.chats.create({
      model: "gemini-1.5-flash",
      history: messages.map((m) => ({
        role: m.role,
        parts: [m.content]
      })),
      config: { 
        temperature: 0.7,
      },
    });

    const prompt = `
Based on the conversation so far, generate a complete project plan for a child.
The project plan should include:
- A fun title
- A list of tools and materials
- Clear step-by-step instructions
- Any safety tips
- A fun fact or bonus idea if relevant

Make it engaging and age-appropriate.
`;

    const result = await chat.sendMessage(prompt)
    const text = result.text;

    res.status(200).json({ project: text });
  }
  catch (error) {
    console.error("Generation error:", error);
    res.status(500).json({ project: "Sorry! Couldn't generate the project" })
  }
}