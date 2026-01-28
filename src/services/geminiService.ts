import { GoogleGenAI } from "@google/genai";
import { Task } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateSubtasks = async (taskTitle: string, taskDescription: string): Promise<string[]> => {
  try {
    const prompt = `
      Break down the following software development task into 3-5 concise, actionable subtasks. 
      Return ONLY a raw JSON array of strings. Do not include markdown formatting like \`\`\`json.
      
      Task: ${taskTitle}
      Description: ${taskDescription}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    const text = response.text || "[]";
    // Clean up potential markdown if the model ignores instruction slightly
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanText);
  } catch (error) {
    console.error("Error generating subtasks:", error);
    return ["Failed to generate subtasks. Try again."];
  }
};

export const suggestPriority = async (taskTitle: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze this task title: "${taskTitle}". Suggest a priority level (LOW, MEDIUM, or HIGH) based on urgency implied. Return ONLY the word.`,
    });
    return response.text?.trim().toUpperCase() || "MEDIUM";
  } catch (e) {
    return "MEDIUM";
  }
};