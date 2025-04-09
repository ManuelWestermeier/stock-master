import randomMoveMouse from "./random-move-mouse.js";

export default async function askChatGPT(page, prompt) {
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
    }, { timeout: 500_000 });

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