export default async function getNewsTexts(page) {
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
