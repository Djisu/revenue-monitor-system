// puppeteerHelper.ts
import puppeteer from 'puppeteer';

export async function getBrowser() {
  return await puppeteer.launch({
    headless: true, // make sure headless mode is enabled
    args: ['--no-sandbox', '--disable-setuid-sandbox'], // important for Linux environments like Render
  });
}

