const puppeteer = require('puppeteer');

(async () => {
    // Launch browser
    const browser = await puppeteer.launch({ headless: false });

    async function getNewsTexts() {
        // Create a new page
        const page = await browser.newPage();

        // Navigate to a website
        await page.goto("https://news.google.com/");

        const acceptButton = await page.waitForSelector("[jsname=b3VHJd]");
        acceptButton.click();

        await page.waitForSelector("h2");

        // Get the headlines of the news articles
        return await page.evaluate(() => {
            // Select all text
            document.execCommand('selectAll', false, null);

            // Get the selected text
            const selection = window.getSelection();
            return selection.toString();
        });
    }

    async function askChatGptText(texts) {
        // Create a new page
        const page = await browser.newPage();

        // Navigate to the ChatGPT website (adjust the URL if needed)
        await page.goto("https://chat.openai.com/chat");

        // Wait for the input area to be available
        const inputArea = await page.waitForSelector("[contenteditable=true]");

        const dataPrompt = `Please provide all relevant information from these articles in strict JSON format (onyl JSON NO other texts). Only include stocks that are certain to increase. The format should be: [{ "name": "stock name", "intensity": 0-10 }]. The articles content: ${texts}`.replaceAll("\n", "\\n") + "\n";


        await inputArea.type(dataPrompt);

        // Wait for the submit button and click it
        // const submitButton = await page.waitForSelector("#composer-submit-button");
        // await submitButton.click();

        // Wait for the specific fade -in element to appear and be visible
        await page.waitForFunction(
            'document.querySelector("._fadeIn_4f9by_7") !== null && window.getComputedStyle(document.querySelector("._fadeIn_4f9by_7")).visibility !== "hidden"',
            { timeout: 300000 }  // Timeout after 5 Min
        );

        // Wait for the response to be generated(adjust the selector if necessary)
        // await page.waitForSelector(".message-in"); // Waiting for the response message

        // // Retrieve the answer from the conversation
        // const answer = await page.evaluate(() => {
        //     const messages = Array.from(document.querySelectorAll(".message-in"));
        //     return messages[messages.length - 1].innerText; // Get the last response message
        // });

        const answerElem = await page.waitForSelector("code")

        const answer = page.evaluate(() => {
            return document.querySelector("[class='!whitespace-pre language-json']").textContent
        })

        return JSON.parse(answer);
    }

    try {
        const texts = await getNewsTexts();
        console.log(texts);

        const gptResponse = await askChatGptText(texts);
        console.log(gptResponse);
    } catch (error) {
        console.error('Error:', error);
    } finally {
        // Close the browser
        // await browser.close();
    }
})();
