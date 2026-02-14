const { GoogleGenerativeAI } = require("@google/generative-ai");

const callGemini = async (prompt, systemInstruction, apiKey, modelName = "gemini-2.0-flash") => {
  if (!apiKey && !process.env.GEMINI_API_KEY) {
     throw new Error("MISSING_API_KEY: No API key provided");
  }

  const genAI = new GoogleGenerativeAI(apiKey || process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ 
      model: modelName,
      systemInstruction: systemInstruction 
  });

  const maxRetries = 3;
  let attempt = 0;
  
  while (attempt < maxRetries) {
    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      if ((error.message.includes("429") || error.message.includes("503")) && attempt < maxRetries - 1) {
        let waitTime = 2000 * Math.pow(2, attempt);
        console.log(`[${modelName}] Retrying in ${waitTime/1000}s...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        attempt++;
      } else {

        
        if (error.message.includes("429")) {
             throw new Error(`RATE_LIMIT:${modelName}`); 
        }
        if (error.message.includes("503")) {
             throw new Error(`MODEL_OVERLOAD:${modelName}`); 
        }
        return null;
      }
    }
  }
  throw new Error(`RATE_LIMIT:${modelName}`);
};

module.exports = { callGemini };
