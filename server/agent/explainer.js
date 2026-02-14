const { callGemini } = require('./gemini');

const SYSTEM_INSTRUCTION = `
You are a UI UX Explainer.
Analyze the User Request and the generated UI Plan.
Explain WHY you chose certain components and layouts.
Be concise and helpful.
`;

const explainDecisions = async (plan, userPrompt, apiKey, model = "gemini-2.0-flash") => {
  const prompt = `User Request: ${userPrompt}\nPlan: ${JSON.stringify(plan)}`;
  
  const response = await callGemini(prompt, SYSTEM_INSTRUCTION, apiKey, model);
  
  if (!response) {
      throw new Error("Explanation generation failed - no response from API");
  }

  return response;
};

module.exports = { explainDecisions };
