import askChatGPT from "./ask-chatgpt.js";
import getBrowser from "./create-browser.js";
import get2ndPrediction from "./get-2nd-prediction.js";
import getNewsTexts from "./get-news-text.js";
import getPrompt from "./get-prompt.js";
import http from "http";

// Launch full Chrome with non-headless mode; adjust executablePath as needed.
const browser = await getBrowser();
const page = browser?.pages?.[0] ?? (await browser.newPage());

let state = "initializing...";

http.createServer((_req, res) => {
  const realodScript = `<script>
    setTimeout(() => window.location.reload(), 2000);
  </script>`;

  res.writeHead(200, { "content-type": "text/html" });
  if (typeof state == "string")
    return res.end(`<p>
    <b>state</b>: ${state}
    ${realodScript}
    </p>`);
  else return res.end(`<p>
      <b>data</b>: ${state}
      ${realodScript}
      </p>`);
}).listen(28802);

try {
  state = "getting articles...";
  const articles = await getNewsTexts(page);
  state = "has articles: waiting for chatgpt... (up tp 10min)." + articles;
  const ans = await askChatGPT(page, getPrompt(articles));
  state = "has chatgpt answer... checking (up tp 2min)." + JSON.stringify(articles);
  const out = await get2ndPrediction(page, ans);
  state = "output: " + JSON.stringify(out);
  console.log(out);
} catch (error) {
  console.error("Error:", error);
} finally {
  // Close the browser
  await browser.close();
}