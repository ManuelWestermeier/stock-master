export default async function getNewsTexts(page) {
  // Navigate to the website
  await page.goto("https://news.google.com/");

  // Wait for the "Accept" button and click it
  const acceptButton = await page.waitForSelector("[jsname=b3VHJd]");
  await acceptButton.click();

  // Wait for headlines to be rendered (ensuring the page is loaded)
  await page.waitForSelector("h2");

  // Helper function to get the current selection text
  async function getSelection() {
    return page.evaluate(() => {
      // Select all the text in the document
      document.execCommand("selectAll", false, null);
      // Return the selected text as a string
      return window.getSelection().toString();
    });
  }

  // Wait until the selection remains unchanged for 5 consecutive seconds.
  let previousSelection = "";
  let stableCount = 0;
  let currentSelection = "";

  while (stableCount < 5) {
    // Wait 1 second between checks
    await new Promise((resolve) => setTimeout(resolve, 1000));

    currentSelection = await getSelection();

    if (currentSelection === previousSelection) {
      stableCount++;
    } else {
      stableCount = 0;
    }
    previousSelection = currentSelection;
  }

  return currentSelection;
}
