
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateCustomBrief = async (topic: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Generate a creative and detailed design challenge brief for the topic: ${topic}. 
    Include:
    - A catchy title
    - A summary of the design problem
    - 3 specific deliverables
    - 2 recommended tools
    - A difficulty level (Beginner, Intermediate, Advanced, Expert)
    - A point value (between 100 and 1000)
    `,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          summary: { type: Type.STRING },
          deliverables: { 
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          tools: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          difficulty: { type: Type.STRING },
          points: { type: Type.NUMBER }
        },
        required: ["title", "summary", "deliverables", "tools", "difficulty", "points"]
      }
    }
  });

  return JSON.parse(response.text);
};
