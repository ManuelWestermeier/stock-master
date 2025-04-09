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

    async function askChatGPT(prompt) {
        const page = await browser.newPage();

        // Go to ChatGPT
        await page.goto('https://chat.openai.com', { waitUntil: 'networkidle2' });

        // Wait for the chat box to appear
        await page.waitForSelector('textarea');

        // Type the prompt
        await page.type('textarea', prompt);

        // Press Enter to submit
        await page.keyboard.press('Enter');

        await page.waitForFunction(() => {
            const responses = document.querySelectorAll('code');
            return responses.length > 0;
        }, { timeout: 30_000 });

        // Get the last response
        return await await page.evaluate(() => new Promise(resolve => {
            const interval = setInterval(() => {
                const res = document.querySelector("code").textContent;
                try {
                    const json = JSON.parse(res);
                    resolve(json);
                    clearInterval(interval);
                } catch (error) { }
            }, 2_000);
        }));
    }

    try {
        const data = await getNewsTexts();

        const prompt = `Please provide all relevant information from these articles in strict JSON format (onyl JSON NO other texts).
        Only include important and trusted stocks that are certain to change.
        The format should be: [{ "name": "stock name", "intensity": -10 to 10 }].
        The articles content:
        ${data}`
            .replaceAll("\n", "\\n")
            .replaceAll("\t", " ");
        // Usage
        const ans = await askChatGPT(prompt);

        console.log(ans);
    } catch (error) {
        console.error('Error:', error);
    } finally {
        // Close the browser
        await browser.close();
    }
})();
