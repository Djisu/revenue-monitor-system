// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Button, Form, Table } from 'react-bootstrap';
// import { Link } from 'react-router-dom';

// // interface PropertyBillPaymentsProps {
// //   //uid: string;
// //   MDImain: React.RefObject<any>; // Adjust the type based on your actual MDImain component {  MDImain }<PropertyBillPaymentsProps>
// // }

// const FrmDailyPropertyPaymentsReport: React.FC = () => {
//   const [cboZone, setCboZone] = useState<string>('');
//   const [cboBussType, setCboBussType] = useState<string>('');
//   const [cboFirstDate, setCboFirstDate] = useState<string>('');
//   const [cboLastDate, setCboLastDate] = useState<string>('');
//   const [zoneOptions, setZoneOptions] = useState<string[]>([]);
//   const [bussTypeOptions, setBussTypeOptions] = useState<string[]>([]);
//   const [firstDateOptions, setFirstDateOptions] = useState<string[]>([]);
//   const [lastDateOptions, setLastDateOptions] = useState<string[]>([]);
//   const [lstViewItems, setListViewItems] = useState<any[]>([]);

//   useEffect(() => {
//     setListViewItems([])
//     // Update business zones in payments
//     updateBusinessZones();

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
//         setZoneOptions(response.data.map((zone: any) => zone.electroral_area));
//       } catch (error: any) {
//         console.error(error);
//         alert(`Error in fetching zones: ${error.message}`);
//       }
//     };

//     fetchZones();
//   }, []);

//   const updateBusinessZones = async () => {
//     try {
//       await axios.post('http://your-api-url/update-business-zones', {
//         dsn: 'dsnSaltpond',
//         uid: 'sa',
//         pwd: 'Timbuk2tu'
//       });

//       await axios.post('http://your-api-url/update-business-zones-var', {
//         dsn: 'dsnSaltpond',
//         uid: 'sa',
//         pwd: 'Timbuk2tu'
//       });

//       await axios.post('http://your-api-url/update-propertyuse-in-tb_PropertyPayments', {
//         dsn: 'dsnSaltpond',
//         uid: 'sa',
//         pwd: 'Timbuk2tu'
//       });

//       await axios.post('http://your-api-url/update-propertyuse-in-var_PropertyPayments', {
//         dsn: 'dsnSaltpond',
//         uid: 'sa',
//         pwd: 'Timbuk2tu'
//       });
//     } catch (error: any) {
//       console.error(error);
//       alert(`Error in updating business zones: ${error.message}`);
//     }
//   };

//   const cmdExitClick = () => {
//     // Hide the current form and show the main form
//     // if (MDImain.current) {
//     //   MDImain.current.show();
//     // }
//   };

//   const cmdViewClick = async () => {
//     try {
//       // Set the screen pointer to hourglass
//       document.body.style.cursor = 'wait';

//       // Clear previous data
//       await axios.delete('http://your-api-url/delete-tmp_PropertyPayments', {
//         params: {
//           dsn: 'dsnSaltpond',
//           uid: 'sa',
//           pwd: 'Timbuk2tu'
//         }
//       });

//       let recSource = '';
//       if (cboZone && cboBussType) {
//         recSource = `set dateformat dmy select * from var_PropertyPayments where transdate between convert(datetime,'${cboFirstDate}') and 
//                       convert(datetime,'${cboLastDate}') and electroral_area=convert(varchar(50),'${cboZone}') and propertyuse=convert(varchar(50),'${cboBussType}')`;
//       } else if (cboZone) {
//         recSource = `set dateformat dmy select * from var_PropertyPayments where transdate between convert(datetime,'${cboFirstDate}') and 
//                       convert(datetime,'${cboLastDate}') and electroral_area=convert(varchar(50),'${cboZone}')`;
//       } else if (cboBussType) {
//         recSource = `set dateformat dmy select * from var_PropertyPayments where transdate between convert(datetime,'${cboFirstDate}') and 
//                       convert(datetime,'${cboLastDate}') and propertyuse=convert(varchar(50),'${cboBussType}')`;
//       } else {
//         recSource = `set dateformat dmy select * from var_PropertyPayments where transdate between convert(datetime,'${cboFirstDate}') and 
//                       convert(datetime,'${cboLastDate}')`;
//       }

//       const recResponse = await axios.get('http://your-api-url/get-property-payments', {
//         params: {
//           dsn: 'dsnSaltpond',
//           uid: 'sa',
//           pwd: 'Timbuk2tu',
//           sql: recSource
//         }
//       });

//       const recData = recResponse.data;
//       if (recData.length === 0) {
//         alert("Record not found");
//         return;
//       }

//       await axios.post('http://your-api-url/insert-tmp_PropertyPayments', {
//         dsn: 'dsnSaltpond',
//         uid: 'sa',
//         pwd: 'Timbuk2tu',
//         data: recData
//       });

//       const tmpResponse = await axios.get('http://your-api-url/get-tmp_PropertyPayments', {
//         params: {
//           dsn: 'dsnSaltpond',
//           uid: 'sa',
//           pwd: 'Timbuk2tu'
//         }
//       });

//       const tmpData = tmpResponse.data;
//       if (tmpData.length > 0) {
//         // Assuming frmDisplay.CrystalReport1 is a component or method to display the report
//         // This part will depend on your actual implementation
//         alert("Processing completed");
//       } else {
//         alert("No payments found");
//       }
//     } catch (error: any) {
//       console.error(error);
//       alert(`Error in operations: ${error.message}`);
//     } finally {
//       // Set the screen pointer back to default
//       document.body.style.cursor = 'default';
//     }
//   };

//   const command1Click = async () => {
//     try {
//       // Set the screen pointer to hourglass
//       document.body.style.cursor = 'wait';

//       // Clear previous data
//       await axios.delete('http://your-api-url/delete-tmp_PropertyPayments', {
//         params: {
//           dsn: 'dsnSaltpond',
//           uid: 'sa',
//           pwd: 'Timbuk2tu'
//         }
//       });

//       let recSource = '';
//       if (cboZone && cboBussType) {
//         recSource = `set dateformat dmy select * from tb_PropertyPayments where transdate between convert(datetime,'${cboFirstDate}') and 
//                       convert(datetime,'${cboLastDate}') and electroral_area=convert(varchar(50),'${cboZone}') and propertyuse like '%${cboBussType}%'`;
//       } else if (cboZone) {
//         recSource = `set dateformat dmy select * from tb_PropertyPayments where transdate between convert(datetime,'${cboFirstDate}') and 
//                       convert(datetime,'${cboLastDate}') and electroral_area=convert(varchar(50),'${cboZone}')`;
//       } else if (cboBussType) {
//         recSource = `set dateformat dmy select * from tb_PropertyPayments where transdate between convert(datetime,'${cboFirstDate}') and 
//                       convert(datetime,'${cboLastDate}') and propertyuse like '%${cboBussType}%'`;
//       } else {
//         recSource = `set dateformat dmy select * from tb_PropertyPayments where transdate between convert(datetime,'${cboFirstDate}') and 
//                       convert(datetime,'${cboLastDate}')`;
//       }

//       const recResponse = await axios.get('http://your-api-url/get-property-payments', {
//         params: {
//           dsn: 'dsnSaltpond',
//           uid: 'sa',
//           pwd: 'Timbuk2tu',
//           sql: recSource
//         }
//       });

//       const recData = recResponse.data;
//       if (recData.length === 0) {
//         alert("Record not found");
//         return;
//       }

//       await axios.post('http://your-api-url/insert-tmp_PropertyPayments', {
//         dsn: 'dsnSaltpond',
//         uid: 'sa',
//         pwd: 'Timbuk2tu',
//         data: recData
//       });

//       const tmpResponse = await axios.get('http://your-api-url/get-tmp_PropertyPayments', {
//         params: {
//           dsn: 'dsnSaltpond',
//           uid: 'sa',
//           pwd: 'Timbuk2tu'
//         }
//       });

//       const tmpData = tmpResponse.data;
//       if (tmpData.length > 0) {
//         // Assuming frmDisplay.CrystalReport1 is a component or method to display the report
//         // This part will depend on your actual implementation
//         alert("Processing completed");
//       } else {
//         alert("No payments found");
//       }
//     } catch (error: any) {
//       console.error(error);
//       alert(`Error in operations: ${error.message}`);
//     } finally {
//       // Set the screen pointer back to default
//       document.body.style.cursor = 'default';
//     }
//   };

//   const cboZoneDropDown = async () => {
//     try {
//       if (!cboZone) {
//         alert("Select a zone");
//         return;
//       }

//       const recResponse = await axios.get('http://your-api-url/get-buss-types', {
//         params: {
//           dsn: 'dsnSaltpond',
//           uid: 'sa',
//           pwd: 'Timbuk2tu',
//           electroral_area: cboZone
//         }
//       });

//       const recData = recResponse.data;
//       if (recData.length > 0) {
//         setBussTypeOptions(recData.map((bussType: any) => bussType.propertyuse));
//       } else {
//         alert("No business type found");
//       }
//     } catch (error: any) {
//       console.error(error);
//       alert(`Error in fetching business types: ${error.message}`);
//     }
//   };

//   const cboFirstDateDropDown = async () => {
//     try {
//       const recResponse = await axios.get('http://your-api-url/get-first-dates', {
//         params: {
//           dsn: 'dsnSaltpond',
//           uid: 'sa',
//           pwd: 'Timbuk2tu',
//           electroral_area: cboZone
//         }
//       });

//       const recData = recResponse.data;
//       if (recData.length > 0) {
//         setFirstDateOptions(recData.map((date: any) => date.transdate));
//       } else {
//         alert("No dates found");
//       }
//     } catch (error: any) {
//       console.error(error);
//       alert(`Error in fetching first dates: ${error.message}`);
//     }
//   };

//   const cboLastDateDropDown = async () => {
//     try {
//       const recResponse = await axios.get('http://your-api-url/get-last-dates', {
//         params: {
//           dsn: 'dsnSaltpond',
//           uid: 'sa',
//           pwd: 'Timbuk2tu',
//           electroral_area: cboZone
//         }
//       });

//       const recData = recResponse.data;
//       if (recData.length > 0) {
//         setLastDateOptions(recData.map((date: any) => date.transdate));
//       } else {
//         alert("No dates found");
//       }
//     } catch (error: any) {
//       console.error(error);
//       alert(`Error in fetching last dates: ${error.message}`);
//     }
//   };

//   const formLoad = async () => {
//     try {
//       // Update business zones in payments
//       await updateBusinessZones();
//     } catch (error: any) {
//       console.error(error);
//       alert(`Error in updating business zones: ${error.message}`);
//     }
//   };

//   useEffect(() => {
//     formLoad();
//   }, []);

//   return (
//     <div className="container-fluid" style={{ backgroundColor: '#FFC0C0', height: '100vh', paddingTop: '20px' }}>
//       <h3 className="text-center">Daily Property Payments</h3>
//       <div className="row mb-3">
//         <div className="col-md-6">
//           <Form.Label className="text-right">Electoral Area</Form.Label>
//           <Form.Select
//             value={cboZone}
//             onChange={(e) => setCboZone(e.target.value)}
//             style={{ width: '300px' }}
//             onClick={cboZoneDropDown}
//           >
//             <option value="">Select Zone</option>
//             {zoneOptions.map((zone, index) => (
//               <option key={index} value={zone}>
//                 {zone}
//               </option>
//             ))}
//           </Form.Select>
//           <Form.Text className="text-right text-muted">
//             Empty means all Electoral Area
//           </Form.Text>
//         </div>
//         <div className="col-md-6">
//           <Form.Label className="text-right">Business Type/Profession</Form.Label>
//           <Form.Select
//             value={cboBussType}
//             onChange={(e) => setCboBussType(e.target.value)}
//             style={{ width: '300px', display: 'none' }}
//           >
//             <option value="">Select Business Type</option>
//             {bussTypeOptions.map((bussType, index) => (
//               <option key={index} value={bussType}>
//                 {bussType}
//               </option>
//             ))}
//           </Form.Select>
//           <Form.Text className="text-right text-muted">
//             Empty means all Business Type/Profession
//           </Form.Text>
//         </div>
//       </div>
//       <div className="row mb-3">
//         <div className="col-md-6">
//           <Form.Label className="text-right">First Payment Date</Form.Label>
//           <Form.Select
//             value={cboFirstDate}
//             onChange={(e) => setCboFirstDate(e.target.value)}
//             style={{ width: '300px' }}
//             onClick={cboFirstDateDropDown}
//           >
//             <option value="">Select Date</option>
//             {firstDateOptions.map((date, index) => (
//               <option key={index} value={date}>
//                 {date}
//               </option>
//             ))}
//           </Form.Select>
//         </div>
//         <div className="col-md-6">
//           <Form.Label className="text-right">Last Payment Date</Form.Label>
//           <Form.Select
//             value={cboLastDate}
//             onChange={(e) => setCboLastDate(e.target.value)}
//             style={{ width: '300px' }}
//             onClick={cboLastDateDropDown}
//           >
//             <option value="">Select Date</option>
//             {lastDateOptions.map((date, index) => (
//               <option key={index} value={date}>
//                 {date}
//               </option>
//             ))}
//           </Form.Select>
//         </div>
//       </div>
//       <div className="row mb-3">
//         <div className="col-md-6">
//           <Button variant="primary" onClick={cmdViewClick} style={{ width: '395px' }}>
//             Produce Report (unposted payments)
//           </Button>
//         </div>
//         <div className="col-md-6">
//           <Button variant="danger" onClick={cmdExitClick} style={{ width: '181px', marginTop: '180px' }}>
//             Exit
//           </Button>
//         </div>
//       </div>
//       <div className="row mb-3">
//         <div className="col-md-6">
//           <Button variant="primary" onClick={command1Click} style={{ width: '395px' }}>
//             Produce Report (posted payments)
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
           
//                 <Link to="/main" className="primary m-3">
//                     Go Back
//                 </Link>
               
//     </div>
//   );
// };

// export default FrmDailyPropertyPaymentsReport;
