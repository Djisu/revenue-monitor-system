// import React, { useState, useEffect } from 'react';
// import axios from 'axios'; // For making HTTP requests
// import { Button, Form, Table } from 'react-bootstrap'; // Bootstrap components
// import { Link } from 'react-router-dom';

// interface PropertyBillPaymentsProps {
//   MDImain: React.RefObject<object>; // Adjust the type based on your actual MDImain component
// }

// const PropertyBillPayments: React.FC<PropertyBillPaymentsProps> = ({ MDImain }) => {
//   const [cboBussType, setCboBussType] = useState<string>('');
//   const [cboZone, setCboZone] = useState<string>('');
//   const [cboFirstDate, setCboFirstDate] = useState<string>('');
//   const [cboLastDate, setCboLastDate] = useState<string>('');
//   const [lstViewItems, setListViewItems] = useState<string[]>([]);

//   const [zones, setZones] = useState<string[]>([]);

//   useEffect(() => {
//     setListViewItems([]);
//     // Fetch zones for ComboBox
//     const fetchZones = async () => {
//       try {
//         const response = await axios.get('http://your-api-url/get-zones', {
//           params: {
//             dsn: 'dsnSaltpond',
//             uid: 'sa',
//             pwd: 'Timbuk2tu'
//           }
//         });
//         setZones(response.data.map((zone: string) => zone.buss_type));
//       } catch (error: unknown) {
//         if (error instanceof Error){
//            console.error(error);
//            alert(`Error in fetching zones: ${error.message}`);
//         }
       
//       }
//     };

//     fetchZones();
//   }, []);

//   const cmdExitClick = () => {
//     // Hide the current form and show the main form
//     if (MDImain.current) {
//       MDImain.current.show();
//     }
//   };

//   const cmdViewClick = async () => {
//     try {
//       // Set the screen pointer to hourglass
//       document.body.style.cursor = 'wait';

//       // Clear previous data
//       await axios.delete('http://your-api-url/delete-tb-BusTypeDetailedReport', {
//         params: {
//           dsn: 'dsnSaltpond',
//           uid: 'sa',
//           pwd: 'Timbuk2tu'
//         }
//       });

//       // Fetch data based on the selected zone
//       let recSource = "set dateformat dmy select electroral_area,buss_no,buss_name, buss_type,current_rate,Tot_grade from tb_Business where status='Active' order by electroral_area asc";
//       if (cboZone) {
//         recSource = `set dateformat dmy select electroral_area,buss_no,buss_name, buss_type,current_rate,Tot_grade from tb_Business where buss_type=convert(varchar(50),'${cboZone}') and status='Active' order by electroral_area asc`;
//       }

//       const recResponse = await axios.get('http://your-api-url/get-tb_Business', {
//         params: {
//           dsn: 'dsnSaltpond',
//           uid: 'sa',
//           pwd: 'Timbuk2tu',
//           sql: recSource
//         }
//       });

//       const recData = recResponse.data;
//       if (recData.length === 0) {
//         alert("No records found");
//         return;
//       }

//       for (const rec of recData) {
//         let varCurrRate = 0;
//         let varPayment = 0;

//         // Fetch current balance
//         const recSummResponse1 = await axios.get('http://your-api-url/get-tb_BussCurrBalance', {
//           params: {
//             dsn: 'dsnSaltpond',
//             uid: 'sa',
//             pwd: 'Timbuk2tu',
//             buss_no: rec.buss_no
//           }
//         });

//         const recSummData1 = recSummResponse1.data;
//         if (recSummData1.length > 0 && recSummData1[0].totsum) {
//           varCurrRate = recSummData1[0].totsum;
//         }

//         // Fetch total payments
//         const recSummResponse2 = await axios.get('http://your-api-url/get-tb_busPayments', {
//           params: {
//             dsn: 'dsnSaltpond',
//             uid: 'sa',
//             pwd: 'Timbuk2tu',
//             buss_no: rec.buss_no
//           }
//         });

//         const recSummData2 = recSummResponse2.data;
//         if (recSummData2.length > 0 && recSummData2[0].totpayments) {
//           varPayment = recSummData2[0].totpayments;
//         } else {
//           varPayment = 0;
//         }

//         // Fetch 2014 balance
//         const recSummResponse3 = await axios.get('http://your-api-url/get-tb_business', {
//           params: {
//             dsn: 'dsnSaltpond',
//             uid: 'sa',
//             pwd: 'Timbuk2tu',
//             buss_no: rec.buss_no
//           }
//         });

//         const recSummData3 = recSummResponse3.data;
//         let val2014Balance = 0;
//         if (recSummData3.length > 0 && recSummData3[0].balance) {
//           val2014Balance = recSummData3[0].balance;
//         }

//         // Fetch business type
//         const recSummResponse4 = await axios.get('http://your-api-url/get-tb_business', {
//           params: {
//             dsn: 'dsnSaltpond',
//             uid: 'sa',
//             pwd: 'Timbuk2tu',
//             buss_no: rec.buss_no
//           }
//         });

//         const recSummData4 = recSummResponse4.data;
//         const varBussType = recSummData4.length > 0 ? recSummData4[0].buss_type : '';

//         // Insert into detailed report table
//         await axios.post('http://your-api-url/insert-tb_BusTypeDetailedReport', {
//           dsn: 'dsnSaltpond',
//           uid: 'sa',
//           pwd: 'Timbuk2tu',
//           electroral_area: rec.electroral_area,
//           buss_no: rec.buss_no,
//           buss_name: rec.buss_name,
//           buss_type: rec.buss_type,
//           balance2014: val2014Balance,
//           amountdue: varCurrRate,
//           amountpaid: varPayment,
//           balance: val2014Balance + varCurrRate - varPayment,
//           Tot_grade: varBussType
//         });
//       }

//       // Fetch and display the report
//       const recSummResponse5 = await axios.get('http://your-api-url/get-tb_BusTypeDetailedReport', {
//         params: {
//           dsn: 'dsnSaltpond',
//           uid: 'sa',
//           pwd: 'Timbuk2tu'
//         }
//       });

//       const recSummData5 = recSummResponse5.data;
//       if (recSummData5.length > 0) {
//         // Assuming frmDisplay.CrystalReport1 is a component or method to display the report
//         // This part will depend on your actual implementation
//         alert("This is the report");
//       } else {
//         alert("No records found in detailed report Error in operations");
//       }
//     } catch (error: any) {
//       console.error(error);
//       alert(`Error in operations: ${error.message}`);
//     } finally {
//       // Set the screen pointer back to default
//       document.body.style.cursor = 'default';
//     }
//   };

//   return (
//     <div className="container-fluid" style={{ backgroundColor: '#FFC0C0', height: '100vh', paddingTop: '20px' }}>
//       <h3 className="text-center">Annual Client Balances</h3>
//       <div className="row mb-3">
//         <div className="col-md-6">
//           <Form.Label className="text-right">Electoral Area</Form.Label>
//           <Form.Control
//             as="select"
//             value={cboZone}
//             onChange={(e: any) => setCboZone(e.target.value)}
//             style={{ width: '300px' }}
//           >
//             <option value="">Select Zone</option>
//             {zones.map((zone, index) => (
//               <option key={index} value={zone}>
//                 {zone}
//               </option>
//             ))}
//           </Form.Control>
//           <Form.Text className="text-right text-muted" style={{ display: 'none' }}>
//             Empty means all Electoral Area
//           </Form.Text>
//         </div>
//         <div className="col-md-6">
//           <Form.Label className="text-right">Business Type/Profession</Form.Label>
//           <Form.Control
//             as="select"
//             value={cboBussType}
//             onChange={(e: any   ) => setCboBussType(e.target.value)}
//             style={{ width: '300px', display: 'none' }}
//           >
//             <option value="">Select Business Type</option>
//             {/* Options will be populated dynamically */}
//           </Form.Control>
//           <Form.Text className="text-right text-muted" style={{ display: 'none' }}>
//             Empty means all Business Type/Profession
//           </Form.Text>
//         </div>
//       </div>
//       <div className="row mb-3">
//         <div className="col-md-6">
//           <Form.Label className="text-right">First Payment Date</Form.Label>
//           <Form.Control
//             as="select"
//             value={cboFirstDate}
//             onChange={(e) => setCboFirstDate(e.target.value)}
//             style={{ width: '300px', display: 'none' }}
//           >
//             <option value="">Select Date</option>
//             {/* Options will be populated dynamically */}
//           </Form.Control>
//         </div>
//         <div className="col-md-6">
//           <Form.Label className="text-right">Last Payment Date</Form.Label>
//           <Form.Control
//             as="select"
//             value={cboLastDate}
//             onChange={(e) => setCboLastDate(e.target.value)}
//             style={{ width: '300px', display: 'none' }}
//           >
//             <option value="">Select Date</option>
//             {/* Options will be populated dynamically */}
//           </Form.Control>
//         </div>
//       </div>
//       <div className="row mb-3">
//         <div className="col-md-6">
//           <Button variant="primary" onClick={cmdViewClick} style={{ width: '395px' }}>
//             Produce Report
//           </Button>
//         </div>
//         <div className="col-md-6">
//           <Button variant="danger" onClick={cmdExitClick} style={{ width: '395px' }}>
//             Exit
//           </Button>
//         </div>
//       </div>
//       <Table striped bordered hover responsive>
//         <thead>
//           <tr>
//             <th>Electoral Area</th>
//             <th>Business No</th>
//             <th>Business Name</th>
//             <th>Business Type</th>
//             <th>Current Rate</th>
//             <th>Total Grade</th>
//           </tr>
//         </thead>
//         <tbody>
//           {lstViewItems.map((item, index) => (
//             <tr key={index}>
//               <td>{item.electroral_area}</td>
//               <td>{item.buss_no}</td>
//               <td>{item.buss_name}</td>
//               <td>{item.buss_type}</td>
//               <td>{item.current_rate}</td>
//               <td>{item.Tot_grade}</td>
//             </tr>
//           ))}
//         </tbody>
//       </Table>
            
//       <Link to="/main" className="primary m-3">
//           Go Back
//       </Link>
               
//     </div>
//   );
// };

// export default PropertyBillPayments;
