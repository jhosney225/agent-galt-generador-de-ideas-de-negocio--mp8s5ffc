
```javascript
const Anthropic = require("@anthropic-ai/sdk");
const readline = require("readline");

const client = new Anthropic();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      resolve(answer);
    });
  });
}

async function generateBusinessIdeas(industry, budget, skills) {
  const conversationHistory = [];

  console.log("\n📊 Iniciando generación de ideas de negocio...\n");

  // Step 1: Generate initial ideas
  const initialPrompt = `Eres un experto en emprendimiento y desarrollo de negocios. 
Basándote en la siguiente información, genera 5 ideas de negocio innovadoras y viables:
- Industria/Sector: ${industry}
- Presupuesto inicial: ${budget}
- Habilidades disponibles: ${skills}

Para cada idea, proporciona:
1. Nombre de la idea
2. Descripción breve (2-3 líneas)
3. Potencial de mercado (bajo/medio/alto)
4. Inversión estimada

Sé específico y realista en tus propuestas.`;

  conversationHistory.push({
    role: "user",
    content: initialPrompt,
  });

  const ideasResponse = await client.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 1500,
    system:
      "Eres un consultor de negocios experto que genera ideas de negocio viables y bien fundamentadas.",
    messages: conversationHistory,
  });

  const ideasContent = ideasResponse.content[0].text;
  console.log("💡 Ideas de Negocio Generadas:\n");
  console.log(ideasContent);

  conversationHistory.push({
    role: "assistant",
    content: ideasContent,
  });

  // Step 2: Request validation analysis
  const validationPrompt =
    "Ahora, realiza un análisis de validación para estas ideas considerando: mercado potencial, competencia, viabilidad técnica, y requerimientos de recursos. ¿Cuáles son las 2 ideas más prometedoras y por qué?";

  conversationHistory.push({
    role: "user",
    content: validationPrompt,
  });

  const validationResponse = await client.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 1500,
    system:
      "Eres un consultor de negocios experto que valida ideas de negocio de manera crítica y constructiva.",
    messages: conversationHistory,
  });

  const validationContent = validationResponse.content[0].text;
  console.log("\n\n✅ Análisis de Validación:\n");
  console.log(validationContent);

  conversationHistory.push({
    role: "assistant",
    content: validationContent,
  });

  // Step 3: Request implementation roadmap for top idea
  const roadmapPrompt =
    "Para la idea más prometedora, proporciona un roadmap de implementación detallado con: pasos iniciales (primeros 30 días), hitos clave en 3-6 meses, y métricas de éxito a medir.";

  conversationHistory.push({
    role: "user",
    content: roadmapPrompt,
  });

  const roadmapResponse = await client.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 1500,
    system:
      "Eres un consultor de negocios experto que crea roadmaps de implementación prácticos y detallados.",
    messages: conversationHistory,
  });

  const roadmapContent = roadmapResponse.content[0].text;
  console.log("\n\n🗺️ Roadmap de Implementación:\n");
  console.log(roadmapContent);

  conversationHistory.push({
    role: "assistant",
    content: roadmapContent,
  });

  // Step 4: Risk assessment
  const riskPrompt =
    "Finalmente, proporciona un análisis de riesgos principales y mitigation strategies para las 2 ideas más prometedoras. ¿Cuáles son los mayores desafíos a anticipar?";

  conversationHistory.push({
    role: "user",
    content: riskPrompt,
  });

  const riskResponse = await client.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 1500,
    system:
      "Eres un experto en gestión de riesgos y análisis de viabilidad empresarial.",
    messages: conversationHistory,
  });

  const riskContent = riskResponse.content[0].text;
  console.log("\n\n⚠️ Análisis de Riesgos y Estrategias de Mitigación:\n");
  console.log(riskContent);

  return {
    ideas: ideasContent,
    validation: validationContent,
    roadmap: roadmapContent,
    riskAnalysis: riskContent,
    conversationHistory: conversationHistory,
  };
}

async function main() {
  console.log("\n🚀 === GENERADOR DE IDEAS DE NEGOCIO CON VALIDACIÓN ===\n");
  console.log(
    "Este sistema utiliza IA para generar y validar ideas de negocio\n"
  );

  // Demo mode with predefined values
  const useDemo = process.argv[2] === "--demo";

  let industry, budget, skills;

  if (useDemo) {
    console.log("📋 Usando modo