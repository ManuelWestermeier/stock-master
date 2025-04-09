export default function getPrompt(data) {
    return `Extract all relevant information about stocks from the articles below in strict JSON format (ONLY JSON—no additional text). 
        Include only important, trusted, and promising stocks that are expected to undergo significant changes. 
        The JSON output must follow this format: [{"name": "stock name", "intensity": -10 to 10, reason: "little amount of words that describe the reason the stock is changing"}].
        Articles content:
        ${data}`
        .replaceAll("\n", "\\n")
        .replaceAll("\t", " ");
}