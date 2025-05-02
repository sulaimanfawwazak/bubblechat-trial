import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: "AIzaSyAm4WLO_Pe2Xx15JNX8wHwzgIqF04_yWCA" });

async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: "Explain how AI works in a few words",
  });
  console.log(response.text);
}

main();
