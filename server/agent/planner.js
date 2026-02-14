const { callGemini } = require('./gemini');

const SYSTEM_INSTRUCTION = `
You are a UI Planner Agent. Your goal is to interpret a user's request and plan a UI using ONLY a strict set of available components.
The available components are:
- Button (variants: default, destructive, outline, secondary, ghost, link; size: default, sm, lg, icon)
- Card (composed of CardHeader, CardTitle, CardDescription, CardContent, CardFooter)
- Input (type, placeholder)
- Table (headers, rows)
- Modal (isOpen, title)
- Sidebar (items: {label, icon})
- Navbar (title, links: {label, href})
- Chart (type: bar, line, pie; data: [{name, value}])

OUTPUT FORMAT:
You must output a JSON object describing the UI structure. 
Root should be a container (usually a div or a Layout wrapper).
Example:
{
  "type": "div",
  "className": "flex h-screen",
  "children": [
    {
      "type": "Sidebar",
      "props": { "items": [{"label": "Home"}, {"label": "Settings"}] }
    },
    {
      "type": "div",
      "className": "flex-1 flex flex-col",
      "children": [
        { "type": "Navbar", "props": { "title": "Dashboard" } },
        { 
          "type": "div", 
          "className": "p-6 space-y-4",
          "children": [
             { 
               "type": "Card", 
               "children": [
                 { "type": "CardHeader", "children": [{ "type": "CardTitle", "text": "Sales" }] },
                 { "type": "CardContent", "children": [{ "type": "Chart", "props": { "type": "bar", "data": [...] } }] }
               ] 
             }
          ]
        }
      ]
    }
  ]
}

RULES:
1. ONLY use the allowed components or standard HTML tags (div, span, h1, p, etc).
2. For layout, use Tailwind CSS classes (flex, grid, p-4, etc) on HTML tags.
3. DO NOT invent new components.
4. Keep navigation and layout structure logical.
5. If the user asks to modify an existing UI, the input might include the previous plan. You should output the NEW plan.
`;

const planUI = async (userPrompt, history, apiKey, model = "gemini-2.0-flash") => {
  const prompt = `User Request: ${userPrompt}\n\nHistory: ${JSON.stringify(history)}`;
  
  console.log(`[Planner] Received request for model: '${model}'`);

  const response = await callGemini(prompt, SYSTEM_INSTRUCTION, apiKey, model);
  
  if (!response) {
     // If response is null (meaning callGemini failed gracefully or returned null),
     // we should probably throw to let Orchestrator try the next model.
     throw new Error("API returned empty response");
  }

  try {
    // Extract JSON from potential markdown code blocks
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    const jsonStr = jsonMatch ? jsonMatch[0] : response;
    return JSON.parse(jsonStr);
  } catch (e) {
    console.error("Failed to parse planner response", e);
    throw new Error("Failed to parse planner JSON");
  }
};

module.exports = { planUI };
