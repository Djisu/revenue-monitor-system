import pdfMake from 'pdfmake/build/pdfmake.js';
import pdfFonts from 'pdfmake/build/vfs_fonts.js'; // Correct path to the actual module
import printer from 'pdf-to-printer'; // Import the library for printing
// Load fonts for pdfmake
pdfMake.vfs = pdfFonts.vfs; // Access the 'vfs' property directly from pdfFonts
// Function to generate PDF from Handlebars template
export async function generatePdf(data) {
    console.log('in generatePdf');
    // Calculate the total payable amount
    const currentRate = parseFloat(data.current_rate);
    const propertyRate = parseFloat(data.property_rate);
    const totalPayable = currentRate + propertyRate;
    // Ensure data.serialno is defined and convert to a number
    const baseSerialNo = data.serialno !== undefined ? parseInt(data.serialno, 10) : 0;
    // Pad the serial number with leading zeros to make it 10 characters long
    const varSerialNo = baseSerialNo.toString().padStart(10, '0');
    // // Define the document structure for pdfMake
    // const templateJson = {
    //     content: [
    //         { text: 'Business Operating Permit', style: 'header' },
    //         { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 550, y2: 0, lineWidth: 1 }] },
    //         { text: `Serial No: ${varSerialNo}`, color: 'red' }, // Set the font color to red
    //         { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 550, y2: 0, lineWidth: 1 }] },
    //         { text: `Account No: ${data.buss_no}` },
    //         { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 550, y2: 0, lineWidth: 1 }] },
    //         { text: `Business Name: ${data.buss_name}` },
    //         { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 550, y2: 0, lineWidth: 1 }] },
    //         { text: `Type: ${data.buss_type}` },
    //         { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 550, y2: 0, lineWidth: 1 }] },
    //         { text: `Property Class: ${data.property_class}` },
    //         { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 550, y2: 0, lineWidth: 1 }] },
    //         { text: `Landmark: ${data.landmark}` },
    //         { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 550, y2: 0, lineWidth: 1 }] },
    //         { text: `Electoral Area: ${data.electroral_area}` },
    //         { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 550, y2: 0, lineWidth: 1 }] },
    //         { text: `Total Grade: ${data.tot_grade}` },
    //         { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 550, y2: 0, lineWidth: 1 }] },
    //         { text: `Current Rate: ${data.current_rate}` },
    //         { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 550, y2: 0, lineWidth: 1 }] },
    //         { text: `Property Rate: ${data.property_rate}` },
    //         { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 550, y2: 0, lineWidth: 1 }] },
    //         { text: `Total Payable GHC: ${totalPayable.toFixed(2)}` } // Display the calculated total
    //     ],
    //     styles: {
    //         header: {
    //             fontSize: 18,
    //             bold: true,
    //             margin: [0, 0, 0, 10] // Explicitly casting the margin
    //         }
    //     }
    // };
    const templateJson = {
        content: [
            { text: 'Business Operating Permit', style: 'header' },
            { text: `Serial No: ${varSerialNo}`, color: 'red' }, // Set the font color to red
            { text: `Account No: ${data.buss_no}` },
            { text: `Business Name: ${data.buss_name}` },
            { text: `Type: ${data.buss_type}` },
            { text: `Property Class: ${data.property_class}` },
            { text: `Landmark: ${data.landmark}` },
            { text: `Electoral Area: ${data.electroral_area}` },
            { text: `Total Grade: ${data.tot_grade}` },
            { text: `Current Rate: ${data.current_rate}` },
            { text: `Property Rate: ${data.property_rate}` },
            { text: `Total Payable GHC: ${totalPayable.toFixed(2)}` } // Display the calculated total
        ],
        styles: {
            header: {
                fontSize: 18,
                bold: true,
                margin: [0, 0, 0, 10] // Explicitly casting the margin
            }
        }
    };
    console.log('in generatePdf: about to enter const pdfDoc = pdfMake.createPdf(templateJson);');
    // Generate the PDF
    const pdfDoc = pdfMake.createPdf(templateJson);
    return new Promise((resolve, reject) => {
        pdfDoc.getBuffer((result) => {
            if (result instanceof Error) {
                reject(result); // If result is an error, reject the promise
            }
            else {
                resolve(result); // Otherwise, resolve with the buffer
            }
        });
    }).catch((error) => {
        console.error('Error generating PDF:', error);
        throw error; // or handle the error as needed
    });
}
// Function to generate and print PDF from Handlebars template
export async function generateAndPrintPdf(data) {
    console.log('in generateAndPrintPdf');
    try {
        // Generate the PDF
        const pdfBuffer = await generatePdf(data);
        // Save buffer to a temporary file
        const fs = require('fs');
        const path = require('path');
        const tempFilePath = path.join(__dirname, 'temp', 'document.pdf'); // Adjust this path as needed
        // Ensure the temp directory exists
        const tempDir = path.join(__dirname, 'temp');
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir);
        }
        fs.writeFileSync(tempFilePath, pdfBuffer);
        // Print the PDF
        await printer.print(tempFilePath);
        console.log('Printed successfully!');
        // Optionally delete the temporary file here
        fs.unlinkSync(tempFilePath);
    }
    catch (error) {
        console.error('Error printing PDF:', error);
        throw error;
    }
}
// import pdfMake from 'pdfmake/build/pdfmake.js';
// import pdfFonts from 'pdfmake/build/vfs_fonts.js'; // Correct path to the actual module
// // Load fonts for pdfmake
// pdfMake.vfs = pdfFonts.vfs; // Access the 'vfs' property directly from pdfFonts
// // Function to generate PDF from Handlebars template
// export async function generatePdf(data: any): Promise<Buffer> {
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
//        const pdfDoc = pdfMake.createPdf(templateJson);
//        return new Promise<Buffer>((resolve, reject) => {
//         pdfDoc.getBuffer((result: Buffer) => {
//                 if (result instanceof Error) {
//                     reject(result); // If result is an error, reject the promise
//                 } else {
//                     resolve(result); // Otherwise, resolve with the buffer
//                 }
//             });
//         }).catch((error: Error) => {
//             console.error('Error generating PDF:', error);
//             throw error; // or handle the error as needed
//         });
// }
//# sourceMappingURL=generatePdf.js.map