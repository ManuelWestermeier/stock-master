import puppeteer, { Browser } from "puppeteer";

/**
 * 
 * @returns {Promise<Browser>}
 */
export default async function getBrowser() {
  return await puppeteer.launch({
    headless: false,
    // Adjust the executablePath for your system. For Windows:
    defaultViewport: null,
    args: [
      "--disable-blink-features=AutomationControlled", // Helps bypass some bot detections.
      "--start-maximized",
    ],
  });
}
