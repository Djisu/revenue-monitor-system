import PDFDocument from 'pdfkit';
import fs from 'fs';

const doc = new PDFDocument();

// Create a write stream for the PDF
const stream = fs.createWriteStream('test-output.pdf');

// Pipe the PDF document to the file stream
doc.pipe(stream);

// Add some content to the document
doc.text('Test text');

// End the document
doc.end();

// Listen for the 'finish' event to confirm the PDF was written
stream.on('finish', () => {
  console.log('PDF generated successfully: test-output.pdf');
});
