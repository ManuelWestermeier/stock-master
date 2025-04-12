import randomMoveMouse from "./random-move-mouse.js";

export default async function askChatGPT(page, prompt) {
  await page.goto("https://chat.openai.com", { waitUntil: "networkidle2" });
  // clearStorage(page);

  const mouseMoveInterval = randomMoveMouse(page);

  // Wait for the chat input
  await page.waitForSelector("#prompt-textarea");

  await page.type("#prompt-textarea", prompt);
  await page.keyboard.press("Enter");

  // Wait until response shows up in code block
  await page.waitForFunction(
    () => {
      const blocks = document.querySelectorAll("code");
      return blocks.length > 0;
    },
    { timeout: 30_000 }
  );

  const result = await page.evaluate(
    () =>
      new Promise((resolve) => {
        const interval = setInterval(() => {
          const code = document.querySelector("code")?.textContent;
          try {
            const json = JSON.parse(code);
            clearInterval(interval);
            resolve(json);
          } catch { }
        }, 2000);
      })
  );

  clearInterval(mouseMoveInterval);
  return result;
}
