import React, { useState, useEffect } from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAppDispatch } from '../../app/store';
import { fetchBusinessById } from '../../features/business/businessSlice';
import { createBusPayment, fetchBilledAmount, BusPaymentsData } from '../busPayments/busPaymentsSlice';
import { useAppSelector } from '../../hooks';


const FrmClientPayments = () => {
  let [businessNo, setBusinessNo] = useState<number>(0);
  let [billedAmount, setBilledAmount] =  useState<number | null>(null);
  let [officerNo, setOfficerNo] = useState('');
  let [paidAmount, setPaidAmount] = useState<number>(0);
  let [monthPaid, setMonthPaid] = useState('');
  let transDate = new Date().toISOString().split('T')[0];
  let [fiscalYear, setFiscalYear] = useState('');
  let [receiptNo, setReceiptNo] = useState('');
  let [email, setEmail] = useState('');
  let [electoralArea, setElectoralArea] = useState('');
  let [errorMessage, setErrorMessage] = useState('');
  let [businessName, setBusinessName] = useState('');

  const dispatch = useAppDispatch();
  const billedAmountData = useAppSelector(state => state.busPayments.billedAmount);

  console.log('billedAmountData:', billedAmountData);

  useEffect(() => {
    const currentMonthNumber = new Date().getMonth();
    setMonthPaid(setMonthString(currentMonthNumber));
  }, []);

  useEffect(() => {
    // This effect will run every time the component is mounted or businessNo changes
    console.log('billedAmountData:', billedAmountData);

    // Update the component's billedAmount state when Redux state changes
    if (billedAmountData !== undefined) {
      setBilledAmount(billedAmountData as number);
    }
  }, [billedAmountData]); // Dependency array includes billedAmountData

  useEffect(() => {
    // This effect will run every time businessNo changes
    if (businessNo > 0) {
      getBusiness(businessNo.toString());
    }
  }, [businessNo]);

  const getBusiness = async (businessNo: string) => {
    console.log('in getBusiness')

    try {
      const response = await dispatch(fetchBusinessById(Number(businessNo))).unwrap();
      
      console.log('Response from slice:', response.data)

       if ( response) {
         console.log('there is response:', response.data);

        // Set response fields to the following state variables
        setOfficerNo(response.data.assessmentby);
        console.log(officerNo)

        setElectoralArea(response.data.electroral_area);
        console.log(electoralArea)

        setEmail(response.data.emailaddress);
        console.log(email)

        setBusinessName(response.data.buss_name);
        console.log(businessName)

        setFiscalYear(new Date().getFullYear().toString());

        console.log('response.buss_no: ', response.data.buss_no)


       await  dispatch(fetchBilledAmount(response.data.buss_no)).unwrap();

        if (fetchBilledAmount.fulfilled.match(response)){
          console.log('Billed Amount:', response.payload.billedAmount);
          setBilledAmount(response.payload.billedAmount);
        }else{
          console.log('Billed Amount not found in response')
        }

        // Generate a unique receipt number
        const uniqueReceiptNo = generateUniqueNumber();
        setReceiptNo(uniqueReceiptNo);
     }else{
      console.log('data not found')
     }
    } catch (error: any) {
      console.error('Error fetching business:', error);
      errorMessage = 'Error fetching business. Please try again.' 
      
      setErrorMessage(errorMessage);
    }
  };

  const generateUniqueNumber = () => {
    const randomNumber = Math.floor(Math.random() * 1000000) + 1;
    const salt = Math.random().toString(36).substring(2, 15); // Generates a random string as a salt
    return `${randomNumber}-${salt}`;
  };

  const setMonthString = (monthNumber: number) => {
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    return monthNames[monthNumber];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('in handleSubmit');

    // Validation checks
    if (businessNo <= 0) {
       errorMessage= 'Business Number is required'
      setErrorMessage(errorMessage || "");
     
      return;
    }
    if (!officerNo) {
      setErrorMessage('Officer Number is required');
      return;
    }
    if (paidAmount <= 0) {
      setErrorMessage('Amount is required');
      return;
    }
    if (!monthPaid) {
      setErrorMessage('Month Paid is required');
      return;
    }
    if (!transDate) {
      setErrorMessage('Transaction Date is required');
      return;
    }
    if (!fiscalYear) {
      setErrorMessage('Fiscal Year is required');
      return;
    }
    if (!receiptNo) {
      setErrorMessage('Receipt Number is required');
      return;
    }
    if (!email) {
      setErrorMessage('Email is required');
      return;
    }
    if (!electoralArea) {
      setErrorMessage('Electoral Area is required');
      return;
    }

    // Create the busPayment object with the correct field names
    const busPayment: BusPaymentsData = {
      buss_no: businessNo.toString(),
      officer_no: officerNo,
      paidAmount: paidAmount,
      monthpaid: monthPaid,
      transdate: transDate,
      fiscal_year: fiscalYear,
      ReceiptNo: receiptNo,
      email: email,
      electoral_area: electoralArea,
    };

    console.log('busPayment:', busPayment);
    try {
      const response = await dispatch(createBusPayment(busPayment)).unwrap();
      // Handle success, e.g., clear form, show success message, etc.
      setErrorMessage('');
      console.log(response);

      if (createBusPayment.fulfilled.match(response)) {
        setBusinessNo(0);
        setOfficerNo('');
        setPaidAmount(0);
        setMonthPaid('');
        setFiscalYear('');
        setReceiptNo('');
        setEmail('');
        setBilledAmount(0);

        alert('Payment successfully added');
      }
    } catch (error: any) {
      // Handle error, e.g., show error message
      setErrorMessage('Failed to create payment. Please try again.');
      console.error('Error creating payment:', error);
    }
  };

  return (
    <div className="container" style={{ backgroundColor: '#add8e6' }}>
      <div>
        <Row className="mb-3">
          <Col>
            <h4 className="text-primary">Collector's Payments Entry</h4>
          </Col>
        </Row>
        <Form onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col>
              <Form.Label>Business Number: {businessName}</Form.Label>
              <Form.Control
                type="text"
                value={businessNo}
                onChange={(e) => setBusinessNo(Number(e.target.value))}
                onBlur={(e) => getBusiness(e.target.value)}
              />
            </Col>
          </Row>
         <Row className="mb-3">
            <Col>
              <Form.Label>
                Amount Payable: <span style={{ color: 'red', fontWeight: 'bold' }}>{billedAmount}</span>
              </Form.Label>
              <Form.Control
                type="number"
                value={paidAmount}
                onChange={(e) => setPaidAmount(Number(e.target.value))}
              />
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <Form.Label>Receipt Number:</Form.Label>
              <Form.Control
                type="text"
                value={receiptNo}
                onChange={(e) => setReceiptNo(e.target.value)}
              />
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <Form.Label>Officer Number:</Form.Label>
              <Form.Control
                type="text"
                value={officerNo}
                onChange={(e) => setOfficerNo(e.target.value)}
                readOnly // Make the input read-only
              />
            </Col>
          </Row>
          
          <Row className="mb-3">
            <Col>
              <Form.Label>Month Paid:</Form.Label>
              <Form.Control
                value={monthPaid}
                readOnly // If you want it to be read-only
              />
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <Form.Label>Transaction Date:</Form.Label>
              <Form.Control
                value={transDate}
                readOnly
              />
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <Form.Label>Fiscal Year:</Form.Label>
              <Form.Control value={fiscalYear} readOnly />
            </Col>
          </Row>
          
          <Row className="mb-3">
            <Col>
              <Form.Label>Email:</Form.Label>
              <Form.Control
                value={email}
                readOnly
              />
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <Form.Label>Electoral Area:</Form.Label>
              <Form.Control
                value={electoralArea}
                readOnly
              />
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <Button type="submit" variant="primary">
                Click to pay
              </Button>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col>
              <Link to="/main" style={{ textDecoration: "none" }}>
                Go Back
              </Link>
            </Col>
          </Row>
        </Form>
      </div>
    </div>
  );
};

export default FrmClientPayments;

































// import React, { useState, useEffect } from 'react';
// import {  Row, Col, Form, Button } from 'react-bootstrap';
// import { Link } from 'react-router-dom';
// import { useAppDispatch } from '../../app/store';
// import { fetchBusinessById } from '../../features/business/businessSlice';
// import { createBusPayment, fetchBilledAmount } from '../busPayments/busPaymentsSlice'
// import { useAppSelector } from '../../hooks';

// interface BusPaymentsData {
//     buss_no: string;
//     officer_no: string;
//     paidAmount: number;
//     monthpaid: string;
//     transdate: string;
//     fiscal_year: string;
//     ReceiptNo: string;
//     email: string;
//     electoral_area: string;
// }

// const FrmClientPayments = () => {
//   let [businessNo, setBusinessNo] = useState<number>(0);
//   let [officerNo, setOfficerNo] = useState('');
//   let [billedAmount, setBilledAmount] = useState<number>(0);
//   let [paidAmount, setPaidAmount] = useState<number>(0);
//   let [monthPaid, setMonthPaid] = useState('');
//   const transDate = new Date().toISOString().split('T')[0];
//   let [fiscalYear, setFiscalYear] = useState('');
//   let [receiptNo, setReceiptNo] = useState('');
//   let [email, setEmail] = useState('');
//   let [electoralArea, setElectoralArea] = useState('');
//   let [errorMessage, setErrorMessage] = useState('');
//   let [businessName, setBusinessName] = useState('');

//   const dispatch = useAppDispatch()
//   const billedAmountData= useAppSelector(state => state.busPayments.billedAmount);

//   console.log(billedAmountData)

//   useEffect(() => {
//     const currentMonthNumber = new Date().getMonth()// + 1;
//     setMonthPaid(setMonthString(currentMonthNumber));
//   }, []);

//   useEffect(() => {
//     if (billedAmountData) {
//       billedAmount = billedAmountData
//       setBilledAmount(billedAmount)
//     }
//   }, [billedAmountData])

//   const getBusiness = async (businessNo: string) => {
//       const response = await dispatch(fetchBusinessById(Number(businessNo))).unwrap();

//       console.log('after  dispatch(fetchBusinessById(id)).unwrap(); response:')

//       // Check if response is an array or an object
//       if (Array.isArray(response)) {
//         console.log('Response is an array:', response[0]);

//         // set response fields to the following state variables
//         setOfficerNo(response[0].assessmentby);
//         setElectoralArea(response[0].electroral_area)
//         setEmail(response[0].emailaddress)  
//         businessName = response[0].buss_name
//         setBusinessName(businessName)
//         setFiscalYear(new Date().getFullYear().toString())
//         await dispatch(fetchBilledAmount(response[0].buss_no)) 
//        // setBilledAmount(billedAmount)

//         receiptNo = generateUniqueNumber()
//         setReceiptNo(receiptNo)
//      };
//  }

//  const generateUniqueNumber = () => {
//     const randomNumber = Math.floor(Math.random() * 1000000) + 1;
//     const salt = Math.random().toString(36).substring(2, 15); // Generates a random string as a salt
//     return `${randomNumber}-${salt}`;
//   };
  
// //   const uniqueNumber = generateUniqueNumber();
// //   console.log(uniqueNumber)


// const setMonthString = (monthNumber: number) => {
//     const monthNames = [
//         "January",
//         "February",
//         "March",
//         "April",
//         "May",
//         "June",
//         "July",
//         "August",
//         "September",
//         "October",
//         "November",
//         "December"
//     ];
//     return monthNames[monthNumber];
// }

// const handleSubmit = async (e: React.FormEvent) => {
//     console.log('in handleSubmit')
//     e.preventDefault();
  
//     // Validation checks
//     if (businessNo <= 0) {
//       errorMessage = 'Business Number is required'
//       setErrorMessage(errorMessage);
//       return;
//     }
//     if (!officerNo) {
//       errorMessage = 'Officer Number is required'
//       setErrorMessage(errorMessage);
//       return;
//     }
//     if (paidAmount <= 0) {
//       errorMessage = 'Amount is required'
//       setErrorMessage(errorMessage);
//       return;
//     }
//     if (!monthPaid) {
//       errorMessage = 'Month Paid is required'
//       setErrorMessage(errorMessage);
//       return;
//     }
//     if (!transDate) {
//       errorMessage = 'Transaction Date is required'
//       setErrorMessage(errorMessage);
//       return;
//     }
//     if (!fiscalYear) {
//       errorMessage = 'Fiscal Year is required'
//       setErrorMessage(errorMessage);
//       return;
//     }
//     if (!receiptNo) {
//       errorMessage = 'Receipt Number is required'
//       setErrorMessage(errorMessage);
//       return;
//     }
//     if (!email) {
//       errorMessage = 'Email is required'
//       setErrorMessage(errorMessage);
//       return;
//     }
//     if (!electoralArea) {
//       errorMessage = 'Electoral Area is required'
//       setErrorMessage(errorMessage);
//       return;
//     }
  
//     // Create the busPayment object with the correct field names
//     const busPayment: BusPaymentsData = {
//       buss_no: businessNo.toString(),
//       officer_no: officerNo,
//       paidAmount: paidAmount,
//       monthpaid: monthPaid,
//       transdate: transDate,
//       fiscal_year: fiscalYear,
//       ReceiptNo: receiptNo,
//       email: email,
//       electoral_area: electoralArea, 
//     };

//     console.log('busPayment:', busPayment)
//      try {
//     //   // Dispatch to the busPaymentSlice
//       const response = await dispatch(createBusPayment(busPayment)).unwrap();
//       // Handle success, e.g., clear form, show success message, etc.
//       setErrorMessage('');
//       console.log(response);

//       if (createBusPayment.fulfilled.match(response)) {      
//         setBusinessNo(0); 
//         setOfficerNo('');
//         setPaidAmount(0);
//         setMonthPaid('');
//         setFiscalYear('');
//         setReceiptNo('');
//         setEmail('');
//         billedAmount = 0
//         setBilledAmount(billedAmount);

//         alert('Payment successfully added');
//       }   
//     } catch (error: any) {
//       // Handle error, e.g., show error message
//       setErrorMessage('Failed to create payment. Please try again.');
//       console.error('Error creating payment:', error);
//     }
//   };

//   return (
//     <div className="container" style={{ backgroundColor: '#add8e6' }}>
//       <div>
//         <Row className="mb-3">
//           <Col>
//             <h4 className="text-primary">Collector's Payments Entry</h4>
//           </Col>
//         </Row>
//         <Form onSubmit={handleSubmit}>
//           <Row className="mb-3">
//             <Col>
//               <Form.Label>Business Number: {businessName}</Form.Label>
//               <Form.Control 
//                 type="number"
//                 value={businessNo} 
//                 onChange={(e) => setBusinessNo(Number(e.target.value))} 
//                 onBlur={(e) => getBusiness(e.target.value)}
//               />
//             </Col>
//           </Row>
//           <Row className="mb-3">
//             <Col>
//               <Form.Label>Officer Number:</Form.Label>
//               <Form.Control 
//                 type="text"
//                 value={officerNo} 
//                 onChange={(e) => setOfficerNo(e.target.value)} 
//               />
//             </Col>
//           </Row>
          
//           <Row className="mb-3">
//             <Col>
//               <Form.Label>Amount Payable: {billedAmountData}</Form.Label>
//               <Form.Control 
//                 type="number"
//                 value={paidAmount} 
//                 onChange={(e) => setPaidAmount(Number(e.target.value))} 
//               />
//             </Col>
//           </Row>
//           <Row className="mb-3">
//             <Col>
//               <Form.Label>Month Paid:</Form.Label>
//               <Form.Control             
//                 value={monthPaid} 
//                 readOnly // If you want it to be read-only
//               />
//             </Col>
//           </Row>
//           <Row className="mb-3">
//             <Col>
//               <Form.Label>Transaction Date:</Form.Label>
//               <Form.Control                
//                 value={transDate} 
//                 readOnly
//               />
//             </Col>
//           </Row>
      
//           <Row className="mb-3">
//             <Col>
//                 <Form.Label>Fiscal Year:</Form.Label>
//                 <Form.Control value={fiscalYear} readOnly />
//             </Col>
//           </Row>
       
//           <Row className="mb-3">
//             <Col>
//               <Form.Label>Receipt Number:</Form.Label>
//               <Form.Control 
//                 type="text"
//                 value={receiptNo} 
//                 onChange={(e) => setReceiptNo(e.target.value)} 
//               />
//             </Col>
//           </Row>
//           <Row className="mb-3">
//             <Col>
//               <Form.Label>Email:</Form.Label>
//               <Form.Control               
//                 value={email} 
//                 readOnly 
//               />
//             </Col>
//           </Row>
//           <Row className="mb-3">
//             <Col>
//               <Form.Label>Electoral Area:</Form.Label>
//               <Form.Control                
//                 value={electoralArea} 
//                 readOnly
//               />
//             </Col>
//           </Row>
//           <Row className="mb-3">
//             <Col>
//                 <Button type="submit" variant="primary">
//                   Click to pay
//                 </Button>
//             </Col>
//             </Row>
//           <Row className="mt-3">
//             <Col>
//                 <Link to="/main" style={{ textDecoration: "none" }}>  
//                 Go Back
//                 </Link>
//             </Col>
//           </Row>
//         </Form>
//       </div>
//     </div>
//   );
// };

// export default FrmClientPayments;

























// // import React, { useState } from 'react'
// // import { Button, Col, Form, Row, Table } from 'react-bootstrap';
// // import { Link } from 'react-router-dom';
// // import { useAppDispatch, useAppSelector } from '../../app/store';
// // import { fetchBusinessById } from '../../features/business/businessSlice';

// // interface BusPaymentsData {
// //     buss_no: string;
// //     officer_no: string;
// //     amount: number;
// //     monthpaid: string;
// //     transdate: string;
// //     userid: string;
// //     fiscal_year: string;
// //     ReceiptNo: string;
// // }

// // const FrmClientPayments = () => {
// //     const [businessNo, setBusinessNo] = useState<number>(0);
// //     const [officerNo, setOfficerNo] = useState('');
// //     const [amount, setAmount] = useState<number>(0);
// //     const [monthPaid, setMonthPaid] = useState('');
// //     const [transDate, setTransDate] = useState('');
// //     const [userId, setUserId] = useState('');
// //     const [fiscalYear, setFiscalYear] = useState('');
// //     const [receiptNo, setReceiptNo] = useState('');
// //     const [email, setEmail] = useState('');
// //     const [electoralArea, setElectoralArea] = useState('');
 
// //   const dispatch = useAppDispatch()
// //   const client = useAppSelector(state => state.client)


// //   const handleSubmit = (e: React.FormEvent) => {
// //     e.preventDefault();

// //     // Add logic here to handle form submission
// //     console.log('Form submitted with:', {
// //       businessNo,
// //       officerNo,
// //       amount,
// //       monthPaid,
// //       transDate,
// //       userId,
// //       fiscalYear,
// //       receiptNo,
// //       email,
// //       electoralArea,
// //     });
// //   }

// // //   const [businessNo, setBusinessNo] = useState<number>(0);
// // //   const [officerNo, setOfficerNo] = useState('');
// // //   const [amount, setAmount] = useState<number>(0);
// // //   const [monthPaid, setMonthPaid] = useState('');
// // //   const [transDate, setTransDate] = useState('');
// // //   const [userId, setUserId] = useState('');
// // //   const [fiscalYear, setFiscalYear] = useState('');
// // //   const [receiptNo, setReceiptNo] = useState('');
// // //   const [email, setEmail] = useState('');
// // //   const [electoralArea, setElectoralArea] = useState('');

// //   const getBusiness = async (businessId: string) => {
// //     console.log('in getBusiness, onBlur triggered with:', businessId);
  
// //     try {
// //       // Convert businessId to a number if necessary
// //       const id = Number(businessId);
  
// //       console.log('before  dispatch(fetchBusinessById(id)).unwrap();')
// //       // Dispatch the async thunk and unwrap the result
// //       const response = await dispatch(fetchBusinessById(id)).unwrap();

// //       console.log('after  dispatch(fetchBusinessById(id)).unwrap(); response:')

// //       // Check if response is an array or an object
// //       if (Array.isArray(response)) {
// //         console.log('Response is an array:', response[0]);

// //         // set response fields to the following state variables
// //         setBusinessNo(response[0].buss_no);
// //         setOfficerNo(response[0].officer_no);
// //         setAmount(response[0].amount);
// //         setMonthPaid(response[0].monthpaid);
// //         setTransDate((new Date().toString()))    
      
// //         // setSelectedBusinessType(response[0].buss_type);
// //         console.log('buss_town:', response[0].BUSS_TOWN)
// //         setBussTown(response[0].BUSS_TOWN);
       
// //         setStreetName(response[0].street_name);
// //         setLandMark(response[0].landmark);
// //         setElectoralArea(response[0].electroral_area);
// //         setPropertyClass(response[0].property_class);

// //         getRate(response[0].property_class)
      
// //         setCeo(response[0].ceo);
// //         setTelNo(response[0].telno);
// //       console.log('response[0].assessmentby:  ', response[0].assessmentby)
// //         selectedOfficer = response[0].assessmentby;
// //         setSelectedOfficer(response[0].assessmentby);
// //         setAssessment(response[0].assessmentby);

// //         console.log('selectedOfficer:  ', selectedOfficer)
// //         console.log('assessments:  ', assessments)
// //         console.log('assessment:  ', assessment)
// //         setAssessments(response[0].assessmentby);
      
// //         setTransDate(response[0].transdate);
      
// //         setStatus(response[0].status);
        
        
// //         setEmailAddress(response[0].emailaddress);
// //         setSelectedBusinessType(response[0].buss_type)
      
// //         setGpsAddress(response[0].gps_address);
// //          // alert("Business found")
// //       } else if (response) {
// //         console.log('Response is an object:', response);
// //       } 
// //     } catch (error: any) {
     
// //       console.error('Error fetching businesses:', error);

// //       if (fetchBusinessById.rejected.match(error)) {
// //         alert('Error fetching business');
// //       }
// //     }
// //   };
  


// //   return (
// //     <div className="container" style={{ backgroundColor: '#add8e6' }}>
// //         <div>
// //         <Row className="mb-3">
// //             <Col>
// //               <h4 className="text-primary">Update Old Business Client</h4>
// //             </Col>
// //           </Row>
// //           <Row className="mb-3">
// //             <Col>
// //               <Form.Label>Business Number:</Form.Label>
// //               <Form.Control 
// //                     value={businessNo} 
// //                     onChange={(e) => setBusinessNo(Number(e.target.value))} 
// //                     onBlur={(e) => getBusiness(e.target.value)}
// //               />
// //             </Col>
// //           </Row>
// //         </div>
// //     </div>
// //   )
// // }

// // export default FrmClientPayments