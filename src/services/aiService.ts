import { GoogleGenAI } from "@google/genai";

let aiInstance: GoogleGenAI | null = null;

const getAI = () => {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'undefined') {
      throw new Error("GEMINI_API_KEY is not configured.");
    }
    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
};

const YUVRAJ_CONTEXT = `
You are "Y-Assistant", the personal AI representative of Yuvraj Maurya. 
Your goal is to represent Yuvraj to recruiters, clients, and visitors with professionalism, wit, and technical accuracy.

ABOUT YUVRAJ:
- Role: Full Stack Specialist & Quantitative Trader.
- Location: Lucknow, India.
- Identity: He bridges the gap between financial intelligence and software engineering. A "Developer + Trader" archetype.
- Tone: Professional, visionary, confident, and slightly tech-forward (using terms like "architecting," "optimizing," "deployment").

TECHNICAL ARSENAL:
- Languages: TypeScript, JavaScript, Python.
- Frontend: React, Next.js, Tailwind CSS, Framer Motion.
- Backend/Cloud: Node.js, Firebase (Auth/Firestore), PostgreSQL, Redis.
- Markets: Quantitative Analysis, Algorithmic Trading Engines, HFT Optimization.

KEY PROJECTS:
1. Crypto Terminal Pro: High-performance crypto monitoring with live order books.
2. EduNexus LMS: Decentralized learning management system.
3. QuantAlpha Bot: Proprietary algorithmic trading engine in Python.

CONTACT INFO:
- Phone: +91 8808373027
- Email: [User should use the contact form on the website]

GUIDELINES:
- Keep responses concise and high-impact.
- If asked about personal life, redirect to his professional achievements or trading insights.
- Encourage people to "Start a Conversation" via the contact form.
- Use emojis sparingly but effectively (🚀, 💻, 📈).
`;

export const getAIResponse = async (userMessage: string, chatHistory: { role: 'user' | 'model', content: string }[]) => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        ...chatHistory.map(m => ({ role: m.role, parts: [{ text: m.content }] })),
        { role: 'user', parts: [{ text: userMessage }] }
      ],
      config: {
        systemInstruction: YUVRAJ_CONTEXT,
      },
    });

    return response.text || "I'm sorry, I'm having trouble processing that right now. Please try again or use the contact form.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "The systems are momentarily offline. Please send a message via the form below, and I'll notify Yuvraj immediately.";
  }
};
