import askChatGPT from "./ask-chatgpt.js";
import getBrowser from "./create-browser.js";
import getNewsTexts from "./get-news-text.js";
import getPrompt from "./get-prompt.js";

// Launch full Chrome with non-headless mode; adjust executablePath as needed.
const browser = await getBrowser();
const page = browser?.pages?.[0] ?? await browser.newPage();

try {
    const data = await getNewsTexts(page);

    const ans = await askChatGPT(page, getPrompt(data));

    console.log(ans);
} catch (error) {
    console.error('Error:', error);
} finally {
    // Close the browser
    await browser.close();
}