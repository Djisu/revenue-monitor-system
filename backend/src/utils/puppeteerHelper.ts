// puppeteerHelper.ts
import puppeteer from 'puppeteer';

export async function getBrowser() {
    return await puppeteer.launch({
        executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
        headless: true
    });
}
