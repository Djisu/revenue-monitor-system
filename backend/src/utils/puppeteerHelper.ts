import puppeteer from 'puppeteer';

export async function getBrowser() {
  const executablePath =
    process.env.NODE_ENV === 'production'
      ? '/opt/render/.cache/puppeteer/chrome/linux-136.0.7103.49/chrome-linux64/chrome'
      : undefined;

  console.log('Puppeteer executablePath:', executablePath || 'default');

  return await puppeteer.launch({
    headless: true,
    executablePath,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
}


