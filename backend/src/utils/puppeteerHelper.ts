// puppeteerHelper.ts
import puppeteer from 'puppeteer';


export async function getBrowser() {
  return await puppeteer.launch({
    headless: true, 
    args: ['--no-sandbox', '--disable-setuid-sandbox'], 
  });
}

