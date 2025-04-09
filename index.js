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

    function randomMoveMouse(page) {
        // Define circle parameters
        const centerX = 500;      // X-coordinate of the circle's center
        const centerY = 500;      // Y-coordinate of the circle's center
        const radius = 100;       // Radius of the circle
        let angle = 0;            // Starting angle in radians
        // Set up the interval to move the mouse every 20 ms
        return setInterval(() => {
            // Increase the angle by a random increment between 0.05 and 0.25 radians
            angle += Math.random() * 0.2 + 0.05;

            // Calculate new x, y coordinates along the circle
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);

            // Move the mouse to the new coordinates
            page.mouse.move(x, y);
        }, 20);
    }

    async function askChatGPT(prompt) {
        const page = await browser.newPage();

        // Go to ChatGPT
        await page.goto('https://chat.openai.com');

        const mouseMoveInterval = randomMoveMouse(page)

        page.waitForNetworkIdle({});

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

                    //clear intervals
                    clearInterval(interval);
                    clearInterval(mouseMoveInterval);

                    resolve(json);
                } catch (error) { }
            }, 2_000);
        }));
    }

    try {
        const data = await getNewsTexts();

        const prompt = `Extract all relevant information about stocks from the articles below in strict JSON format (ONLY JSON—no additional text). 
        Include only important, trusted, and promising stocks that are expected to undergo significant changes. 
        The JSON output must follow this format: [{"name": "stock name", "intensity": -10 to 10, reason: "little amount of words that describe the reason the stock is changing"}].
        Articles content:
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
