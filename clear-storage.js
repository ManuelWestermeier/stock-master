export default async function clearStorage(page) {
    // Clear cookies:
    const cookies = await page.cookies();
    if (cookies.length) {
        await page.deleteCookie(...cookies);
    }

    // Clear local and session storage:
    await page.evaluate(() => {
        localStorage.clear();
        sessionStorage.clear();
    });
}