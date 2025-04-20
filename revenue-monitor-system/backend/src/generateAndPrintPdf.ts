import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts'; // Correct path to the actual module
import printer from 'pdf-to-printer'; // Import the library for printing
import fs from 'fs'; // File system module
import path from 'path'; // Path module
import axios from 'axios';

// Load fonts for pdfmake
pdfMake.vfs = pdfFonts.vfs; // Access the 'vfs' property directly from pdfFonts

// Function to generate and print PDF from Handlebars template
export async function generateAndPrintPdf(data: any): Promise<void> {
    // Define the document structure for pdfMake
    const templateJson = {
        content: [
            { text: 'Business Operating Permit', style: 'header' },
            { text: `Business No: ${data.buss_no}` },
            { text: `Business Name: ${data.buss_name}` },
            { text: `Address: ${data.buss_address}` },
            { text: `Type: ${data.buss_type}` },
            { text: `Town: ${data.buss_town}` },
            { text: `Street Name: ${data.street_name}` },
            { text: `Landmark: ${data.landmark}` },
            { text: `Electoral Area: ${data.electroral_area}` },
            { text: `Property Class: ${data.property_class}` },
            { text: `Total Grade: ${data.tot_grade}` },
            { text: `CEO: ${data.ceo}` },
            { text: `Tel No: ${data.telno}` },
            { text: `Strategic Location: ${data.strategiclocation}` },
            { text: `Product Variety: ${data.productvariety}` },
            { text: `Business Popularity: ${data.businesspopularity}` },
            { text: `Business Environment: ${data.businessenvironment}` },
            { text: `Size of Business: ${data.sizeofbusiness}` },
            { text: `Number of Working Days: ${data.numberofworkingdays}` },
            { text: `Business Operating Period: ${data.businessoperatingperiod}` },
            { text: `Competitors Available: ${data.competitorsavailable}` },
            { text: `Assessment By: ${data.assessmentby}` },
            { text: `Transaction Date: ${data.transdate}` },
            { text: `Balance: ${data.balance}` },
            { text: `Status: ${data.status}` },
            { text: `Current Rate: ${data.current_rate}` },
            { text: `Property Rate: ${data.property_rate}` },
            { text: `Total Marks: ${data.totalmarks}` },
            { text: `Email Address: ${data.emailaddress}` },
            { text: `No of Employees: ${data.noofemployees}` },
            { text: `No of Branches: ${data.noofbranches}` },
            { text: `Balance New: ${data.BALANCENEW}` },
            { text: `GPS Address: ${data.gps_address}` },
            { text: `Serial No: ${data.serialNo}` }
        ],
        styles: {
            header: {
                fontSize: 18,
                bold: true,
                margin: [0, 0, 0, 10] as [number, number, number, number] // Explicitly casting the margin
            }
        }
    };

    // Generate the PDF
    const pdfDoc = pdfMake.createPdf(templateJson);

    // Get the buffer and print it
    pdfDoc.getBuffer((buffer: Buffer) => {
        // Save buffer to a temporary file
        const tempFilePath = path.join(__dirname, 'temp', 'document.pdf'); // Adjust this path as needed

        // Ensure the 'temp' directory exists
        const tempDir = path.join(__dirname, 'temp');
        if (!fs.existsSync(tempDir)){
            fs.mkdirSync(tempDir, { recursive: true });
        }

        fs.writeFileSync(tempFilePath, buffer);

        // Print the PDF
        printer.print(tempFilePath)
            .then(() => {
                console.log('Printed successfully!');
                // Optionally delete the temporary file here
                fs.unlinkSync(tempFilePath);
            })
            .catch((error: Error) => {
                console.error('Error printing:', error);
            });
    });
}





// import pdfMake from 'pdfmake/build/pdfmake';
// import pdfFonts from 'pdfmake/build/vfs_fonts'; // Correct path to the actual module
// import printer from 'pdf-to-printer'; // Import the library for printing

// // Load fonts for pdfmake
// pdfMake.vfs = pdfFonts.vfs; // Access the 'vfs' property directly from pdfFonts

// // Function to generate and print PDF from Handlebars template
// export async function generateAndPrintPdf(data: any): Promise<void> {
//     // Define the document structure for pdfMake
//     const templateJson = {
//         content: [
//             { text: 'Business Operating Permit', style: 'header' },
//             { text: `Business No: ${data.buss_no}` },
//             { text: `Business Name: ${data.buss_name}` },
//             { text: `Address: ${data.buss_address}` },
//             { text: `Type: ${data.buss_type}` },
//             { text: `Town: ${data.buss_town}` },
//             { text: `Street Name: ${data.street_name}` },
//             { text: `Landmark: ${data.landmark}` },
//             { text: `Electoral Area: ${data.electroral_area}` },
//             { text: `Property Class: ${data.property_class}` },
//             { text: `Total Grade: ${data.tot_grade}` },
//             { text: `CEO: ${data.ceo}` },
//             { text: `Tel No: ${data.telno}` },
//             { text: `Strategic Location: ${data.strategiclocation}` },
//             { text: `Product Variety: ${data.productvariety}` },
//             { text: `Business Popularity: ${data.businesspopularity}` },
//             { text: `Business Environment: ${data.businessenvironment}` },
//             { text: `Size of Business: ${data.sizeofbusiness}` },
//             { text: `Number of Working Days: ${data.numberofworkingdays}` },
//             { text: `Business Operating Period: ${data.businessoperatingperiod}` },
//             { text: `Competitors Available: ${data.competitorsavailable}` },
//             { text: `Assessment By: ${data.assessmentby}` },
//             { text: `Transaction Date: ${data.transdate}` },
//             { text: `Balance: ${data.balance}` },
//             { text: `Status: ${data.status}` },
//             { text: `Current Rate: ${data.current_rate}` },
//             { text: `Property Rate: ${data.property_rate}` },
//             { text: `Total Marks: ${data.totalmarks}` },
//             { text: `Email Address: ${data.emailaddress}` },
//             { text: `No of Employees: ${data.noofemployees}` },
//             { text: `No of Branches: ${data.noofbranches}` },
//             { text: `Balance New: ${data.BALANCENEW}` },
//             { text: `GPS Address: ${data.gps_address}` },
//             { text: `Serial No: ${data.serialNo}` }
//         ],
//         styles: {
//             header: {
//                 fontSize: 18,
//                 bold: true,
//                 margin: [0, 0, 0, 10] as [number, number, number, number] // Explicitly casting the margin
//             }
//         }
//     };

//     // Generate the PDF
//     const pdfDoc = pdfMake.createPdf(templateJson);

//     // Get the buffer and print it
//     pdfDoc.getBuffer((buffer: Buffer) => {
//         // Save buffer to a temporary file
//         const tempFilePath = '/path/to/temp/document.pdf'; // Adjust this path as needed
//         require('fs').writeFileSync(tempFilePath, buffer);

//         // Print the PDF
//         printer.print(tempFilePath)
//             .then(() => {
//                 console.log('Printed successfully!');
//                 // Optionally delete the temporary file here
//             })
//             .catch((error: Error) => {
//                 console.error('Error printing:', error);
//             });
//     });
// }