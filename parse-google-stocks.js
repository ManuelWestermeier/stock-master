export default async function getStockChange(page, name) {
    // Construct URL and set the query parameter
    const url = new URL("https://www.google.com/search?q=stock");
    url.searchParams.set("q", `${name} Aktie`);
    await page.goto(url.href, { waitUntil: "domcontentloaded" });

    let changeElement;
    try {
        // Wait for the element up to 10 seconds
        changeElement = await page.waitForSelector("[jsname=rfaVEf]", { timeout: 10000 });
    } catch (err) {
        // If the element wasn't found in time, return 0
        return 0;
    }

    // Evaluate the element's innerText property in the browser context
    const changeText = await page.evaluate(el => el.innerText, changeElement);

    // Parse and return the numerical value
    const changeToday = parseFloat(
        changeText
            .replace(/[a-z%()]/gi, "")
            .trim()
            .replace(/,/g, ".")
    );

    return isNaN(changeToday) ? 0 : changeToday;
}
