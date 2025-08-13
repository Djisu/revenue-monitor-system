// import React, { useState, useEffect } from 'react';
// import { Button, Form, Col, Row, Alert } from 'react-bootstrap';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import { Link } from 'react-router-dom';

// interface PropertyData {
//   house_no: string;
//   transdate: string;
//   current_rate: number;
//   amount: number;
//   fiscal_year: string;
//   ReceiptNo: string;
// }

// const FrmPropertySavingsStatementX: React.FC = () => {
//   const [loanNo, setLoanNo] = useState('');
//   const [startDate, setStartDate] = useState('');
//   const [endDate, setEndDate] = useState('');
//   //const [houseName, setHouseName] = useState('');
//   const [error, setError] = useState('');

//   const fetchLoanNos = async () => {
//     try {
//       // Replace with your actual API call to fetch loan numbers
//       const response = await fetch('/api/loanNos');
//       const data = await response.json();
//       setLoanNo(data[0].house_no); // Set first loan number as default
//     } catch (err) {
//       setError('No houses found');
//     }
//   };

//   const fetchTransactions = async (dateField: string) => {
//     try {
//       // Replace with your actual API call to fetch transactions
//       const response = await fetch(`/api/transactions?house_no=${loanNo}`);
//       const data = await response.json();
//       const dates = data.map((item: PropertyData) => item.transdate);
//       if (dateField === 'startDate') {
//         setStartDate(dates[0]);
//       } else if (dateField === 'endDate') {
//         setEndDate(dates[dates.length - 1]);
//       }
//     } catch (err) {
//       setError('No payment records date found');
//     }
//   };

//   // const validateLoanNo = async () => {
//   //   try {
//   //     const response = await fetch(`/api/validateLoanNo?house_no=${loanNo}`);
//   //     const data = await response.json();
//   //     if (data) {
//   //       houseName && setHouseName('');
//   //       setHouseName(data.house_no);
//   //     } else {
//   //       setError('A wrong house number');
//   //     }
//   //   } catch (err) {
//   //     setError('Error validating house number');
//   //   }
//   // };

//   const handleLoanNoChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
//     setLoanNo(event.target.value);
//   };

//   const handleStartDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setStartDate(event.target.value);
//   };

//   const handleEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setEndDate(event.target.value);
//   };

//   const handlePreviewClick = async () => {
//     try {
//       if (!loanNo) {
//         setError('Select a house number');
//         return;
//       }

//       // Reset error message
//       setError('');

//       // Fetch transactions and calculate balance
//       const response = await fetch(`/api/calculateBalance?house_no=${loanNo}&start_date=${startDate}&end_date=${endDate}`);
//       const data = await response.json();

//       if (data) {
//         // Show report or handle data as needed
//         console.log(data);
//       } else {
//         setError('No records found');
//       }
//     } catch (err) {
//       setError('Error generating report');
//     }
//   };

//   useEffect(() => {
//     fetchLoanNos();
//     // Fetch start and end dates based on selected loan number
//     fetchTransactions('startDate');
//     fetchTransactions('endDate');
//   }, [loanNo]);

//   useEffect(() => {
//     // Format current date on form load
//     setEndDate(new Date().toLocaleDateString('en-GB'));
//   }, []);

//   return (
//     <div className="container">
//       <h3 className="text-center mt-5">MARCORY MUNICIPAL ASSEMBLY</h3>
//       <h4 className="text-center mt-3">Produce Property House Statement</h4>
//       {error && <Alert variant="danger">{error}</Alert>}
//       <Form>
//         <Form.Group controlId="formLoanNo" className="mb-3">
//           <Form.Label>House Number</Form.Label>
//           <Form.Select value={loanNo} onChange={handleLoanNoChange}>
//             <option value="" disabled>Select a house number</option>
//             {/* Populate with loan numbers fetched from API */}
//             {/* <option value="house1">House 1</option> */}
//             {/* <option value="house2">House 2</option> */}
//           </Form.Select>
//         </Form.Group>
//         <Form.Group controlId="formStartDate" className="mb-3">
//           <Form.Label>Start Date</Form.Label>
//           <Form.Control type="date" value={startDate} onChange={handleStartDateChange} />
//         </Form.Group>
//         <Form.Group controlId="formEndDate" className="mb-3">
//           <Form.Label>End Date</Form.Label>
//           <Form.Control type="date" value={endDate} onChange={handleEndDateChange} />
//         </Form.Group>
//         <Row className="mb-3">
//           <Col>
//             <Form.Label className="text-center">Field Officer</Form.Label>
//             <Form.Control type="text" placeholder="Leave EMPTY for all field officers" disabled />
//           </Col>
//         </Row>
//         <Row>
//           <Col className="text-center">
//             <Button variant="primary" onClick={handlePreviewClick}>
//               Preview
//             </Button>
//             <Button variant="danger" onClick={() => console.log('Exit clicked')}>
//               Exit
//             </Button>
//           </Col>
//         </Row>
//         <Row className="mt-3">
//             <Col>
//             <Link to="/main" className="primary m-3">
//                 Go Back
//             </Link>
//             </Col>
//         </Row>
//       </Form>
//     </div>
//   );
// };

// export default FrmPropertySavingsStatementX;
