// puppeteerHelper.ts
import puppeteer from 'puppeteer';

export async function getBrowser() {
  const isProduction = process.env.NODE_ENV === 'production';

  const executablePath = isProduction
    ? '/opt/render/.cache/puppeteer/chrome/linux-136.0.7103.49/chrome-linux64/chrome' // Your Render path
    : undefined;

  console.log('Launching Puppeteer in', process.env.NODE_ENV);
  console.log('Using executablePath:', executablePath || 'Default');

  return await puppeteer.launch({
    headless: true,
    executablePath,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
}



