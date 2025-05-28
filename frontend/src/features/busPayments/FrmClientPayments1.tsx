import React, { useState, useEffect } from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAppDispatch } from '../../app/store';
import { fetchBusinessById } from '../business/businessSlice';
import { createBusPayment, fetchBilledAmount, BusPaymentsData, fetchFiscalyearReceiptno } from './busPaymentsSlice';
//import { fetchReceiptById } from '../receipt/receiptSlice';
import { useAppSelector } from '../../hooks';


const FrmClientPayments1 = () => {
  console.log('in FrmClientPayments1 component')

  const [businessNo, setBusinessNo] = useState<number>(0);
  const [billedAmount, setBilledAmount] =  useState<number>(0);
  const [officerNo, setOfficerNo] = useState('');
  const [paidAmount, setPaidAmount] = useState<number>(0);
  const [monthPaid, setMonthPaid] = useState('');
  const transDate = new Date().toISOString().split('T')[0];
  const [fiscalYear, setFiscalYear] = useState('');
  const [receiptNo, setReceiptNo] = useState('');
  const [batchNo, setBatchNo] = useState('');
  const [email, setEmail] = useState('');
  const [electoralArea, setElectoralArea] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [businessName, setBusinessName] = useState('');

  const [isReceiptValid, setIsReceiptValid] = useState<boolean | null>(null);

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
  }, [billedAmountData]); // Dependency array includes    --------fetchReceiptById

  // useEffect(() => {
  //   // This effect will run every time businessNo changes
  //   if (businessNo && businessNo > 0) {
  //     getBusiness(businessNo.toString());
  //   }
  // }, [businessNo]);

  const checkReceiptNo = async (batchNo: string, receiptNo: string) => {
    console.log('fiscalYear: ', fiscalYear)
    console.log('batchNo: ', batchNo)
    console.log('receiptNo:', receiptNo);
    
    try {
      if (receiptNo) {  
        const action = await dispatch(fetchFiscalyearReceiptno({ fiscalyear: fiscalYear, receiptno: receiptNo, batchno: batchNo }));
        console.log('action.payload:', action.payload);
  
        alert(action.payload);

        if (action.payload === 'Fake receipt number') {
          alert(action.payload);
          console.log('about to set isReceiptValid to false');
          setIsReceiptValid(false);
          return false; // Invalid receipt
        }else{
          console.log('about to set isReceiptValid to true');
          setIsReceiptValid(true);
          return true; // Valid receipt
        }    
      }     
    } catch (error) {
      console.error('Error checking receipt number:', error);
      // You can also display an error message to the user here
      return false;
    }
  };

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
     }else{
      console.log('data not found')
     }
    } catch (error: unknown) {
      if (error instanceof Error){
        console.error('Error fetching business:', error);  
        setErrorMessage('Error fetching business. Please try again.' );
      }      
    }
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
    if (businessNo && businessNo <= 0) {
      setErrorMessage('Business Number is required');
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

    console.log('about to valiate receipt number');
    console.log('receiptNo: ', receiptNo)
    console.log('batchNo: ', batchNo)
    console.log('fiscalYear: ', fiscalYear)

    // // Check if receiptNo is valid before proceeding
    // const isReceiptValid = await checkReceiptNo(receiptNo,  batchNo);

     console.log('isReceiptValid: ', isReceiptValid)
  
    if (isReceiptValid === false) {
      setErrorMessage('Invalid receipt number. Please check and try again.');
      return; // Stop further execution if invalid
    }else{
      setErrorMessage('');
      console.log('Genuine receipt number');
    }

    console.log('about to create busPayment object');

    // // Create the busPayment object with the correct field names
    const busPayment: BusPaymentsData = {
      buss_no: businessNo.toString(),
      officer_no: officerNo,
      paidAmount: paidAmount,
      monthpaid: monthPaid,
      transdate: transDate,
      fiscal_year: fiscalYear,
      ReceiptNo: receiptNo,
      email: email,
      electroral_area: electoralArea,
    };

    // console.log('busPayment:', busPayment);
     try {
        const response = await dispatch(createBusPayment(busPayment)).unwrap();
        console.log('XXXXXXXXXXX', response)
        console.log('response.message:', response.message);
        console.log('response.receiptUrl:', response.receiptUrl);

        // Log the response to verify
        console.log('Response.message:', response.message);
        alert(response.message)

        // Check if the response indicates success
        if (response && response.message){     
          setBusinessNo(0);
          setOfficerNo('');
          setPaidAmount(0);
          setMonthPaid('');
          setFiscalYear('');
          setReceiptNo('');
          setEmail('');
          setBilledAmount(0);
          setElectoralArea('');
          setBusinessName(''); 
          setBatchNo(''); 
          setIsReceiptValid(false);
          alert('Payment successfully added');
        } else {
          // Handle unexpected response structure
          setErrorMessage('Unexpected response received.');
      }
    } catch (error: unknown) {
      // Handle error, e.g., show error message
      if (error instanceof Error){
         setErrorMessage('Failed to create payment. Please try again.');
         console.error('Error creating payment:', error);
      }   
    }
  };

  return (
    <div className="container" style={{ backgroundColor: '#add8e6' }}>
      <div>
        <Row className="mb-3">
          <Col>
            <h4 className="text-primary">Collector Payments Entry</h4>
          </Col>
        </Row>
        {errorMessage && (
          <Row className="mb-3">
            <Col>
              <div style={{ color: 'red', fontWeight: 'bold' }}>{errorMessage}</div>
            </Col>
          </Row>
        )}

        <Form onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col>
              <Form.Label>Business Name: <span style={{ color: 'red', fontWeight: 'bold' }}>{businessName}</span></Form.Label>
              <Form.Control
                type="text"
                value={businessNo === 0 ? '' : businessNo.toString()}
                onChange={(e) => {
                  const val = e.target.value;
                  setBusinessNo(val === '' ? 0 : Number(val));
                }}
                onBlur={(e) => {
                  if (e.target.value) {
                    getBusiness(e.target.value);
                  }
                }}
              />
            </Col>
          </Row>
         <Row className="mb-3">
            <Col>
              <Form.Label>
                Amount Payable: <span style={{ color: 'red', fontWeight: 'bold' }}>{billedAmount || 0}</span>
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
              <Form.Label>Batch Number:</Form.Label>
              <Form.Control
                type="text"
                value={batchNo}
                onChange={(e) => setBatchNo(e.target.value)}
                onBlur={(e) => checkReceiptNo(e.target.value, receiptNo)}
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

export default FrmClientPayments1;

































