export default async function getStockChange(page, name) {
    // Construct URL and set the query parameter
    const url = new URL("https://www.google.com/search?q=stock");
    url.searchParams.set("q", `${name} Aktie`);
    await page.goto(url.href);

    // Wait for the selector and get the element handle
    const changeElement = await page.waitForSelector("[jsname=rfaVEf]");

    // Evaluate the element's innerText property in the browser context
    const changeText = await page.evaluate(el => el.innerText, changeElement);

    // Parse and return the numerical value
    const changeToday = parseFloat(
        changeText
            .replace(/[a-z%()]/gi, "") // Use case insensitive flag if needed
            .trim()
            .replace(/,/g, ".")
    );

    return changeToday;
}