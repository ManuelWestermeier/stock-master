const puppeteer = require('puppeteer');

(async () => {
    // Launch full Chrome with non-headless mode; adjust executablePath as needed.
    const browser = await puppeteer.launch({
        headless: false,
        // Adjust the executablePath for your system. For Windows:
        defaultViewport: null,
        args: [
            '--disable-blink-features=AutomationControlled', // Helps bypass some bot detections.
            '--start-maximized'
        ]
    });
    // async function getNewsTexts() {
    //     // Create a new page
    //     const page = await browser.newPage();

    //     // Navigate to a website
    //     await page.goto("https://news.google.com/");

    //     const acceptButton = await page.waitForSelector("[jsname=b3VHJd]");
    //     acceptButton.click();

    //     await page.waitForSelector("h2");

    //     // Get the headlines of the news articles
    //     return await page.evaluate(() => {
    //         // Select all text
    //         document.execCommand('selectAll', false, null);

    //         // Get the selected text
    //         const selection = window.getSelection();
    //         return selection.toString();
    //     });
    // }

    // async function askChatGptText(texts) {
    //     // Create a new page
    //     const page = await browser.newPage();

    //     // Navigate to the ChatGPT website (adjust the URL if needed)
    //     await page.goto("https://chat.openai.com/chat");

    //     await page.waitForNetworkIdle()

    //     await new Promise(res => setTimeout(res, Math.floor(Math.floor(Math.random() * 10))))

    //     // Wait for the input area to be available
    //     const inputArea = await page.waitForSelector("[contenteditable=true]");

    //     const dataPrompt = `Please provide all relevant information from these articles in strict JSON format (onyl JSON NO other texts). Only include stocks that are certain to increase. The format should be: [{ "name": "stock name", "intensity": 0-10 }]. The articles content: ${texts}`.replaceAll("\n", "\\n") + "\n";

    //     console.log("dataPrompt", dataPrompt);

    //     // await page.evaluate(() => {
    //     //     document.querySelector("[contenteditable=true]").textContent = dataPrompt
    //     // })

    //     inputArea.type(dataPrompt)

    //     // Wait for the submit button and click it
    //     // const submitButton = await page.waitForSelector("#composer-submit-button");
    //     // await submitButton.click();

    //     // Wait for the specific fade -in element to appear and be visible
    //     await page.waitForFunction(
    //         'document.querySelector("._fadeIn_4f9by_7") !== null && window.getComputedStyle(document.querySelector("._fadeIn_4f9by_7")).visibility !== "hidden"',
    //         { timeout: 300000 }  // Timeout after 5 Min
    //     );

    //     // Wait for the response to be generated(adjust the selector if necessary)
    //     // await page.waitForSelector(".message-in"); // Waiting for the response message

    //     // // Retrieve the answer from the conversation
    //     // const answer = await page.evaluate(() => {
    //     //     const messages = Array.from(document.querySelectorAll(".message-in"));
    //     //     return messages[messages.length - 1].innerText; // Get the last response message
    //     // });

    //     const answerElem = await page.waitForSelector("code", { timeout: 300000 })

    //     const answer = page.evaluate(() => {
    //         return document.querySelector("[class='!whitespace-pre language-json']").textContent
    //     })

    //     return JSON.parse(answer);
    // }

    async function askChatGPT(prompt) {
        const page = await browser.newPage();

        // Go to ChatGPT
        await page.goto('https://chat.openai.com', { waitUntil: 'networkidle2' });
        return ""
        // TODO: You must be logged in! Best to reuse cookies or auth session.

        // Wait for the chat box to appear
        await page.waitForSelector('textarea');

        // Type the prompt
        await page.type('textarea', prompt);

        // Press Enter to submit
        await page.keyboard.press('Enter');

        await page.waitForFunction(() => {
            const responses = document.querySelectorAll('.markdown');
            return responses.length > 0;
        }, { timeout: 30000 });

        let lastText = Math.random() + "";
        // Get the last response
        const response = await await page.evaluate(() => {
            function getRes() {
                const responses = document.querySelectorAll('.markdown');

                console.log(response);

                let currentText = "";

                responses.forEach(res => {
                    currentText += res.textContent;
                });

                return response;
            }

            return new Promise(res => {
                let counter = 0;
                const interval = setInterval(() => {
                    const res = getRes();

                    console.log("res", res);

                    if (res != lastText) {
                        counter = 0;
                        lastText = res;
                    }
                    else if (counter++ > 2) {
                        res(res)
                        clearInterval(interval)
                    };
                }, 5_000);
            })
        });

        await browser.close();
        return response;
    }

    // Usage
    askChatGPT('Tell me a joke about electrons.').then(console.log);

    return

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
