export default function getPrompt(data) {
  const promptLines = [
    "Extract all relevant information about stocks from the articles below in strict JSON format (ONLY JSON—no additional text).",
    "Include only important, trusted, and promising stocks that are expected to undergo significant changes.",
    "Exclude countries; include only stocks with increasing potential.",
    'The JSON output must follow this format: [{"name": "stock name", "intensity": -10 to 10, "reason": "brief explanation of why the stock is changing"}].',
    "Write the json in a code view.",
    "USE ONLY THE PROVIDED DATA - DO NOT HALLUCINATE any additional information.",
    "Articles content:",
    data,
  ];

  const prompt = promptLines.join("\n");
  return prompt.replace(/\n/g, "\\n").replace(/\t/g, " ");
}
