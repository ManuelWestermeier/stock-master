import askChatGPT from "./ask-chatgpt.js";
import getStockChange from "./parse-google-stocks.js";

export default async function get2ndPrediction(page, ans) {
    const out = [];

    for (const { name, intensity, reason } of ans) {
        try {
            const stockChangeInPercent = await getStockChange(page, name);
            const prompt = `Evaluate the following prediction:

            Stock: ${name}
            Predicted movement: The stock is expected to change by a factor of ${intensity} (from -10 indicating a strong decline to 10 indicating a strong increase)
            Reason for prediction: ${reason}
            Actual stock change: ${stockChangeInPercent}%
            
            Instructions:
            1. Compare the prediction with the actual stock change.
            2. Answer with a single numeric value in the JSON format encapsulated in a code block.
            3. The number must be between -10 (completely incorrect) and 10 (perfectly correct).
            4. USE ONLY THE PROVIDED DATA - DO NOT HALLUCINATE any additional information.
               
            Example output (if the number is 7):
            \`\`\`json
            7
            \`\`\``.replaceAll("\n", "\\n");

            const answer = await askChatGPT(page, prompt);

            out.push({ answer, name, reason, intensity });
        } catch (error) { console.error(error); }
    }

    return out;
}