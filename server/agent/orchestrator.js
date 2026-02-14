const { planUI } = require('./planner');
const { generateCode } = require('./generator');
const { explainDecisions } = require('./explainer');

const generateUI = async (userPrompt, history = [], apiKey, startModel = 'gemini-2.5-flash') => {
  // Full hierarchy of all available models (best to worst)
  const modelHierarchy = [
    'gemini-2.5-pro',
    'gemini-2.5-flash', 
    'gemini-2.0-flash',
    'gemini-2.5-flash-lite',
    'gemini-2.0-flash-lite'
  ];
  
  // Start with user's selected model, then try rest of hierarchy
  const startIndex = modelHierarchy.indexOf(startModel);
  const fallbackChain = startIndex >= 0 
    ? [...modelHierarchy.slice(startIndex), ...modelHierarchy.slice(0, startIndex)]
    : modelHierarchy;
  
  // Remove duplicates
  const uniqueChain = [...new Set(fallbackChain)];

  const userSelectedModel = startModel;
  let userModelFailed = false;
  let userModelFailureReason = null;
  const fallbackAttempts = []; // Track fallback attempts only

  for (const model of uniqueChain) {
      if (!model) continue;
      console.log(`\n🔄 ${model}`);

      try {
          // Step 1: Planner
          const plan = await planUI(userPrompt, history, apiKey, model);
          if (!plan) throw new Error("Planner returned null");

          // Step 2 & 3: Generator & Explainer (Parallel)
          const [codeResult, explanationResult] = await Promise.allSettled([
            generateCode(plan, apiKey, model),
            explainDecisions(plan, userPrompt, apiKey, model)
          ]);

          const code = codeResult.status === 'fulfilled' ? codeResult.value : null;
          let explanation = explanationResult.status === 'fulfilled' ? explanationResult.value : null;

          if (!code) {
              throw new Error(codeResult.reason || "Code generation failed");
          }

          if (!explanation) {
              explanation = `I generated the UI using ${model}. (Explanation unavailable due to high traffic)`;
          }

          // Build success message with fallback info
          let modelNote = '';
          if (model !== userSelectedModel) {
              // User's model failed, we succeeded with a fallback
              let message = `\n\n---\n**⚠️ Note:** Your selected model **${userSelectedModel}** ${userModelFailureReason}.\n`;
              
              if (fallbackAttempts.length > 0) {
                  message += `\nI also tried:\n${fallbackAttempts.map(a => `- **${a.model}**: ${a.reason}`).join('\n')}\n`;
              }
              
              message += `\n✅ Successfully generated using **${model}** instead.`;
              modelNote = message;
          }

          return {
            message: explanation + modelNote,
            code: code,
            layout: plan.layout,
            model: model
          };

      } catch (error) {
          const errorReason = error.message.includes('RATE_LIMIT') 
              ? `Quota limit reached`
              : error.message;
          
          if (model === userSelectedModel) {
              // Track user's selected model failure separately
              userModelFailed = true;
              userModelFailureReason = errorReason;
          } else {
              // Track fallback attempts
              fallbackAttempts.push({ model, reason: errorReason });
          }
          
          console.warn(`[Orchestrator] Model ${model} failed: ${error.message}`);
      }
  }

  // All models failed - create detailed separated error message
  let errorMessage = `**Your selected model failed:**\n- **${userSelectedModel}**: ${userModelFailureReason}\n`;
  
  if (fallbackAttempts.length > 0) {
      errorMessage += `\n**Fallback models also failed:**\n${fallbackAttempts.map(a => `- **${a.model}**: ${a.reason}`).join('\n')}\n`;
  }
  
  errorMessage += `\nAll available models have reached their quota limits. Quota limits reset daily. Please try again tomorrow.`;
  
  throw new Error(errorMessage);
};

module.exports = { generateUI };
