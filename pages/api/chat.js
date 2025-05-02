import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default async function handler(req, res) {
  const modelReplies = [
    "Whoopsie! That didn't go as planned 🙏",
    "Uh-oh, looks like we hit a snag 🙏",
    "Well, that's not right… Let's try again 🙏",
    "Oops-a-daisy! Something's off here 🙏",
    "Apologies—we've encountered an issue 🙏",
    "It seems there's been a hiccup 🙏",
    "Thank you for your patience—we're troubleshooting now 🙏",
    "We've run into a small problem. Bear with us 🙏"
  ];

  const fallback = modelReplies[Math.floor(Math.random() * modelReplies.length)]
  
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // const { message } = req.body;
  const { message, messages = [] } = req.body;
  console.log("Incoming message:", message);
  console.log("Full message history:", messages);

  try {
    // ********** Single Use **********
    // const result = await ai.models.generateContent({
      // model: "gemini-1.5-flash",
      // contents: message,
    // });

    // const response = result.text;

    // ********** Multi Turn **********
    const chat = ai.chats.create({
      model: "gemini-1.5-flash",
      history: messages.map((m) => ({
        role: m.role,
        parts: [{ text: m.content }]
      })),
      config: { 
        temperature: 0.7,
        systemInstruction: "You're an instructor for a child with the age of 4-17 years old that is going to help them to build projects based on the field that the child is interested in."
      },
    })

    const response = await chat.sendMessage({
      message: message
    });
    console.log(messages)
    const text = response.text;

    const isReady = text.toLowerCase().includes("i'm ready to generate your project");
    console.log(isReady)

    res.status(200).json({ reply: text, readyToGenerate: isReady });
  }
  catch (error) {
    console.error("Gemini error: ", error);
    res.status(500).json({ reply: fallback, readyToGenerate: false });
  }
}