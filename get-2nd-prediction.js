import askChatGPT from "./ask-chatgpt.js";
import getStockChange from "./parse-google-stocks.js";

export default async function get2ndPrediction(page, ans) {
    const out = [];

    for (const { name, intensity, reason } of ans) {
        try {
            const stockChangeInPercent = await getStockChange(page, name);

            const prompt = `Is the prediction right: 
            the stock ${name} gets higher with factor: ${intensity} (-10 to 10) with reason: ${reason}. 
            This is the real stock change in percent: ${stockChangeInPercent}%. 
            Give me as answer only the number in json in a code block (JSON). No text.
            The answer has to be from -10 (no) to 10 (yessss)`.replaceAll("\n", "\\n");

            const answer = await askChatGPT(page, prompt);

            out.push({ answer, name, reason, intensity });
        } catch (error) { console.error(error); }
    }

    return out;
}