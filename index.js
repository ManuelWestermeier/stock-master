import askChatGPT from "./ask-chatgpt.js";
import getBrowser from "./create-browser.js";
import getNewsTexts from "./get-news-text.js";
import getPrompt from "./get-prompt.js";
import getStockChange from "./parse-google-stocks.js";

// Launch full Chrome with non-headless mode; adjust executablePath as needed.
const browser = await getBrowser();
const page = browser?.pages?.[0] ?? (await browser.newPage());

try {
  const articles = await getNewsTexts(page);
  console.log("articles", articles);

  const ans = await askChatGPT(page, getPrompt(articles));
  console.log("ans", ans);

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

      console.log("answer", answer);
      out.push(answer);
    } catch (error) { console.error(error); }
  }

  console.log(out);
} catch (error) {
  console.error("Error:", error);
} finally {
  // Close the browser
  await browser.close();
}
