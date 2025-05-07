import { getBrowser } from './utils/puppeteerHelper.js';
import { printPdf } from './utils/printHelper.js';

import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface ReceiptData {
  buss_no: string;
  buss_name: string;
  buss_type: string;
  property_class: string;
  landmark: string;
  electroral_area: string;
  tot_grade: string;
  current_rate: string;
  property_rate: string;
  serialno?: string;
}

// Function to generate PDF using Puppeteer
export async function generatePdf(data: ReceiptData): Promise<Buffer> {
  console.log('in generatePdf');

  const currentRate = parseFloat(data.current_rate);
  const propertyRate = parseFloat(data.property_rate);
  const totalPayable = currentRate + propertyRate;

  const baseSerialNo = data.serialno !== undefined ? parseInt(data.serialno, 10) : 0;
  const varSerialNo = baseSerialNo.toString().padStart(10, '0');

  const receiptHTML = `
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        h1 { text-align: center; }
        .receipt-info { margin-top: 20px; font-size: 16px; }
        .receipt-info p { margin: 5px 0; }
        .line { border-bottom: 1px solid #000; margin: 10px 0; }
      </style>
    </head>
    <body>
      <h1>Business Operating Permit</h1>
      <div class="receipt-info">
        <p><strong>Serial No:</strong> ${varSerialNo}</p>
        <div class="line"></div>
        <p><strong>Account No:</strong> ${data.buss_no}</p>
        <p><strong>Business Name:</strong> ${data.buss_name}</p>
        <p><strong>Type:</strong> ${data.buss_type}</p>
        <p><strong>Property Class:</strong> ${data.property_class}</p>
        <p><strong>Landmark:</strong> ${data.landmark}</p>
        <p><strong>Electoral Area:</strong> ${data.electroral_area}</p>
        <p><strong>Total Grade:</strong> ${data.tot_grade}</p>
        <p><strong>Current Rate:</strong> ${data.current_rate}</p>
        <p><strong>Property Rate:</strong> ${data.property_rate}</p>
        <p><strong>Total Payable GHC:</strong> ${totalPayable.toFixed(2)}</p>
      </div>
    </body>
    </html>
  `;

  try {
    const browser = await getBrowser();

    
    const page = await browser.newPage();
    await page.setContent(receiptHTML);
    const pdfBuffer = await page.pdf({ format: 'A4' });
    await browser.close();
    console.log('PDF generated successfully');
    return Buffer.from(pdfBuffer);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
}

// Generate PDF and send it to the printer
export async function generatePdfToPrinter(data: ReceiptData): Promise<void> {
  console.log('in generatePdfToPrinter');

  const currentRate = parseFloat(data.current_rate);
  const propertyRate = parseFloat(data.property_rate);
  const totalPayable = currentRate + propertyRate;

  const baseSerialNo = data.serialno !== undefined ? parseInt(data.serialno, 10) : 0;
  const varSerialNo = baseSerialNo.toString().padStart(10, '0');

  const receiptHTML = `
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        h1 { text-align: center; }
        .receipt-info { margin-top: 20px; font-size: 16px; }
        .receipt-info p { margin: 5px 0; }
        .line { border-bottom: 1px solid #000; margin: 10px 0; }
      </style>
    </head>
    <body>
      <h1>Business Operating Permit</h1>
      <div class="receipt-info">
        <p><strong>Serial No:</strong> ${varSerialNo}</p>
        <div class="line"></div>
        <p><strong>Account No:</strong> ${data.buss_no}</p>
        <p><strong>Business Name:</strong> ${data.buss_name}</p>
        <p><strong>Type:</strong> ${data.buss_type}</p>
        <p><strong>Property Class:</strong> ${data.property_class}</p>
        <p><strong>Landmark:</strong> ${data.landmark}</p>
        <p><strong>Electoral Area:</strong> ${data.electroral_area}</p>
        <p><strong>Total Grade:</strong> ${data.tot_grade}</p>
        <p><strong>Current Rate:</strong> ${data.current_rate}</p>
        <p><strong>Property Rate:</strong> ${data.property_rate}</p>
        <p><strong>Total Payable GHC:</strong> ${totalPayable.toFixed(2)}</p>
      </div>
    </body>
    </html>
  `;

  try {
    const browser = await getBrowser();

    
    const page = await browser.newPage();
    await page.setContent(receiptHTML);

    const outputDir = path.join(__dirname, 'receipts');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const pdfPath = path.join(outputDir, `receipt-${varSerialNo}.pdf`);
    await page.pdf({ path: pdfPath, format: 'A4' });
    await browser.close();
    console.log(`PDF generated successfully at ${pdfPath}`);

    await printPdf(pdfPath);
  } catch (error) {
    console.error('Error generating or printing the PDF:', error);
    throw error;
  }
}

// Example usage
async function generateAndPrintReceipt(data: ReceiptData): Promise<void> {
  try {
    await generatePdfToPrinter(data);
  } catch (error) {
    console.error('Error generating or printing the PDF:', error);
  }
}

// Example data
const receiptData: ReceiptData = {
  buss_no: '12345',
  buss_name: 'My Business',
  buss_type: 'Retail',
  property_class: 'Commercial',
  landmark: 'Near Park',
  electroral_area: 'Area 1',
  tot_grade: 'A',
  current_rate: '100.00',
  property_rate: '50.00',
  serialno: '12345',
};

generateAndPrintReceipt(receiptData);
