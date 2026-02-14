const { callGemini } = require('./gemini');

const SYSTEM_INSTRUCTION = `
You are a React Code Generator.
Your input is a JSON structure representing a UI plan.
Your output must be a valid React Functional Component code string.

RULES:
1. Use the 'lucide-react' library for icons.
   - Use the base name, e.g. <Home />, <Zap />, <User />, <Search />.
   - DO NOT append 'Icon' suffix unless necessary (e.g. use <User /> not <UserIcon />).
   - For 'LightningBolt', use <Zap />.
   - For 'DesktopComputer', use <Monitor />.
2. Import UI components from './ui'.
   Example: import { Button, Card, CardHeader, CardTitle, CardContent } from './ui';
   IMPORTANT: Do NOT use dot notation like <Card.Header>. Use <CardHeader>.
3. Use Tailwind CSS for layout on standard HTML elements.
4. The output should be a single file string.
5. DO NOT include \`\`\`jsx or markdown blocks. Just the code.
6. The component should be named \`GeneratedUI\`.
7. You must export the component as default.
8. Ensure all props passed in the JSON plan are correctly rendered.
9. DO NOT redeclare imported components. If 'Sidebar' is imported, do not create a 'Sidebar' function.

Input JSON will be provided.
`;

const generateCode = async (plan, apiKey, model = "gemini-2.0-flash") => {
  const prompt = `Plan JSON: ${JSON.stringify(plan)}`;
  
  const response = await callGemini(prompt, SYSTEM_INSTRUCTION, apiKey, model);

  if (!response) {
      throw new Error("Code generation failed - no response from API");
  }

  // Strip markdown
  let cleanCode = response.replace(/```jsx/g, '').replace(/```javascript/g, '').replace(/```/g, '');
  return cleanCode;
};

module.exports = { generateCode };
