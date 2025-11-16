
import { GoogleGenAI } from "@google/genai";
import type { InventoryItem, Transaction } from '../types';

export async function generateInventoryInsights(
  inventory: InventoryItem[],
  transactions: Transaction[],
  userPrompt: string
): Promise<string> {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const fullPrompt = `
    You are an expert inventory analyst for a company. Your task is to analyze the provided inventory data and transaction logs to answer the user's question.

    Current Inventory Data:
    ${JSON.stringify(inventory, null, 2)}

    Recent Transaction Log (most recent first):
    ${JSON.stringify(transactions.slice(0, 20), null, 2)}

    User's Question:
    "${userPrompt}"

    Based on the data, provide a concise, insightful, and easy-to-understand answer. Use markdown for formatting if it helps clarity (e.g., lists, bold text).
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: fullPrompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "Sorry, I couldn't process your request. There was an error connecting to the AI service.";
  }
}
