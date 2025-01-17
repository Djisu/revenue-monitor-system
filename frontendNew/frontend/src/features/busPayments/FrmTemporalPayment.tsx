import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert, Table } from 'react-bootstrap';
import axios from 'axios';

import 'bootstrap/dist/css/bootstrap.min.css';

interface Business {
  buss_no: number;
  buss_name: string;
  buss_address: string;
  buss_type: string;
  buss_permitno: string;
  street_name: string;
  landmark: string;
  layout: string;
  property_class: string;
  tot_grade: string;
  ceo: string;
  telno: string;
  assessmentby: string;
  transdate: string;
  status: string;
  serialno: string;
  current_rate: number;
  property_rate: number;
}

// interface ClientPayment {
//   buss_no: number;
//   officer_no: string;
//   amount: number;
//   receiptno: string;
//   monthpaid: number;
//   transdate: string;
//   userid: string;
//   fiscal_year: number;
// }

interface TempPayment {
  buss_no: number;
  officer_no: string;
  amount: number;
  receiptno: string;
  monthpaid: number;
  transdate: string;
  userid: string;
  fiscal_year: number;
}

interface Officer {
  officer_no: string;
  officer_name: string;
  electoralarea: string;
}

const TemporalPaymentForm: React.FC = () => {
  const [bussNo, setBussNo] = useState<number | string>('');
  const [bussName, setBussName] = useState<string>('');
  const [fiscalYear, setFiscalYear] = useState<number>(new Date().getFullYear());
  const [correctRate, setCorrectRate] = useState<number>(0);
  const [amount, setAmount] = useState<number>(0);
  const [receiptNo, setReceiptNo] = useState<string>('');
  const [paymentMonth, setPaymentMonth] = useState<number>(0);
  const [officerNo, setOfficerNo] = useState<string>('');
  const [officerName, setOfficerName] = useState<string>('');
  const [electoralArea, setElectoralArea] = useState<string>('');
  const [businessType, setBusinessType] = useState<string>('');
  const [propertyClass, setPropertyClass] = useState<string>('');
  const [propertyRent, setPropertyRent] = useState<number>(0);
  const [balanceBF, setBalanceBF] = useState<number>(0);
  const [totalPayable, setTotalPayable] = useState<number>(0);
  const [totalPayment, setTotalPayment] = useState<number>(0);
  const [currentBalance, setCurrentBalance] = useState<number>(0);
  const [businessList, setBusinessList] = useState<Business[]>([]);
  const [officerList, setOfficerList] = useState<Officer[]>([]);
  const [tempPayments, setTempPayments] = useState<TempPayment[]>([]);
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  useEffect(() => {
    fetchBusinessList();
    fetchOfficerList();
  }, []);

  const fetchBusinessList = async () => {
    try {
      const response = await axios.get<Business[]>('http://your-api-url/tb_business');
      setBusinessList(response.data);
    } catch (error) {
      console.error(error);
      setError('No business found');
    }
  };

  const fetchOfficerList = async () => {
    try {
      const response = await axios.get<Officer[]>('http://your-api-url/tb_officer');
      setOfficerList(response.data);
    } catch (error) {
      console.error(error);
      setError('No officers found');
    }
  };

  const validateBussNo = async (value: string) => {
    try {
      value = value.trim().split(' ')[0];
      const response = await axios.get<Business[]>(`http://your-api-url/tb_business?buss_no=${value}`);
      if (response.data.length > 0) {
        setBussName(response.data[0].buss_name);
        setBusinessType(response.data[0].buss_type);
        setCorrectRate(response.data[0].current_rate);
        setPropertyClass(response.data[0].property_class);
        setPropertyRent(response.data[0].property_rate);
        //setElectoralArea(response.data[0].electroral_area);
        setError('');
        fetchBalanceBF(value);
        fetchTotalPayable(value);
        fetchTotalPayment(value);
      } else {
        setError('A wrong business number');
        setBussName('');
        setBusinessType('');
        setCorrectRate(0);
        setPropertyClass('');
        setPropertyRent(0);
        setElectoralArea('');
      }
    } catch (error) {
      console.error(error);
      setError('A wrong business number');
      setBussName('');
      setBusinessType('');
      setCorrectRate(0);
      setPropertyClass('');
      setPropertyRent(0);
      setElectoralArea('');
    }
  };

  const fetchBalanceBF = async (bussNo: string) => {
    try {
      const response = await axios.get<number>(`http://your-api-url/find_balance_bf?buss_no=${bussNo}`);
      setBalanceBF(response.data);
    } catch (error) {
      console.error(error);
      setError('Error fetching balance BF');
    }
  };

  const fetchTotalPayable = async (bussNo: string) => {
    try {
      const response = await axios.get<number>(`http://your-api-url/find_total_payable?buss_no=${bussNo}&fiscal_year=${fiscalYear}`);
      setTotalPayable(response.data);
    } catch (error) {
      console.error(error);
      setError('Error fetching total payable');
    }
  };

  const fetchTotalPayment = async (bussNo: string) => {
    try {
      const response = await axios.get<number>(`http://your-api-url/find_total_payment?buss_no=${bussNo}&fiscal_year=${fiscalYear}`);
      setTotalPayment(response.data);
      setCurrentBalance(totalPayable - totalPayment - amount);
    } catch (error) {
      console.error(error);
      setError('Error fetching total payment');
    }
  };

  const validateOfficerNo = async (value: string) => {
    try {
      const response = await axios.get<Officer[]>(`http://your-api-url/tb_officer?officer_no=${value}`);
      if (response.data.length > 0) {
        setOfficerName(response.data[0].officer_name);
        setElectoralArea(response.data[0].electoralarea);
        setError('');
      } else {
        setError('A wrong officer number');
      }
    } catch (error) {
      console.error(error);
      setError('A wrong officer number');
    }
  };

  const handleBussNoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setBussNo(e.target.value);
    validateBussNo(e.target.value);
  };

  const handleOfficerNoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setOfficerNo(e.target.value);
    validateOfficerNo(e.target.value);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(Number(e.target.value));
    setCurrentBalance(totalPayable - totalPayment - Number(e.target.value));
  };

  const handleReceiptNoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReceiptNo(e.target.value);
  };

  const handleFiscalYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiscalYear(Number(e.target.value));
  };

  const handleUpdateClick = async () => {
    try {
      if (!bussNo || !fiscalYear || !correctRate || !amount || !receiptNo || !paymentMonth || !officerNo) {
        setError('Please fill in all fields');
        return;
      }

      await axios.put('http://your-api-url/tb_BussCurrBalance', {
        buss_no: bussNo,
        fiscalyear: fiscalYear,
        current_balance: correctRate,
      });

      setSuccessMessage('Last year\'s rate updated successfully');
      setError('');
    } catch (error) {
      console.error(error);
      setError('Error updating last year\'s rate');
      setSuccessMessage('');
    }
  };

  const handlePostClick = async () => {
    try {
      if (!bussNo || !fiscalYear || !correctRate || !amount || !receiptNo || !paymentMonth || !officerNo) {
        setError('Please fill in all fields');
        return;
      }

      await axios.post('http://your-api-url/post_all', {
        buss_no: bussNo,
        officer_no: officerNo,
        amount: amount,
        receiptno: receiptNo,
        monthpaid: paymentMonth,
        transdate: new Date().toISOString().split('T')[0],
        userid: 'yourUserId', // Replace with actual user ID
        fiscal_year: fiscalYear,
      });

      setSuccessMessage('Payments successfully transferred to the SERVER. Supervisor must scrutinize and eventually post them');
      setError('');
      setTempPayments([]);
    } catch (error) {
      console.error(error);
      setError('Error transferring payments');
      setSuccessMessage('');
    }
  };

  const handleExitClick = () => {
    window.location.href = '/'; // Redirect to main page or hide the form
  };

  const handleAddClick = async () => {
    try {
      if (!bussNo || !fiscalYear || !correctRate || !amount || !receiptNo || !paymentMonth || !officerNo) {
        setError('Please fill in all fields');
        return;
      }

      const response = await axios.post<TempPayment>('http://your-api-url/add_rec', {
        buss_no: bussNo,
        officer_no: officerNo,
        amount: amount,
        monthpaid: paymentMonth,
        transdate: new Date().toISOString().split('T')[0],
        userid: 'yourUserId', // Replace with actual user ID
        fiscal_year: fiscalYear,
        receiptno: receiptNo,
      });

      setSuccessMessage('Collection Payment temporally entered!!! Please CONNECT to the server and UPLOAD payment entry.');
      setError('');
      setTempPayments([...tempPayments, response.data]);
    } catch (error) {
      console.error(error);
      setError('Error adding a record');
      setSuccessMessage('');
    }
  };

  const handlePaymentMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPaymentMonth(Number(e.target.value));
  };

  return (
    <Container>
      <h2>Temporal Payment</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {successMessage && <Alert variant="success">{successMessage}</Alert>}
      <Form>
        <Form.Group controlId="formOfficerNo">
          <Form.Label>Collector Code:</Form.Label>
          <Form.Select value={officerNo} onChange={handleOfficerNoChange}>
            <option value="">Select a collector</option>
            {officerList.map((officer) => (
              <option key={officer.officer_no} value={officer.officer_no}>
                {officer.officer_no} {officer.officer_name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group controlId="formBussNo">
          <Form.Label>Business No:</Form.Label>
          <Form.Select value={bussNo} onChange={handleBussNoChange}>
            <option value="">Select a business</option>
            {businessList.map((business) => (
              <option key={business.buss_no} value={business.buss_no}>
                {business.buss_no} {business.buss_name} 
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group controlId="formBussName">
          <Form.Label>Business Name:</Form.Label>
          <Form.Control
            type="text"
            value={bussName}
            readOnly
            style={{ fontWeight: 'bold', color: 'red' }}
          />
        </Form.Group>

        <Form.Group controlId="formPaymentMonth">
          <Form.Label>Payment Month:</Form.Label>
          <Form.Select value={paymentMonth} onChange={handlePaymentMonthChange}>
            <option value="">Select a month</option>
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group controlId="formAmount">
          <Form.Label>Amount to be posted:</Form.Label>
          <Form.Control
            type="number"
            step="0.01"
            value={amount}
            onChange={handleAmountChange}
            style={{ fontWeight: 'bold', color: 'blue' }}
          />
        </Form.Group>

        <Form.Group controlId="formReceiptNo">
          <Form.Label>Receipt No:</Form.Label>
          <Form.Control
            type="text"
            value={receiptNo}
            onChange={handleReceiptNoChange}
          />
        </Form.Group>

        <Form.Group controlId="formFiscalYear">
          <Form.Label>Fiscal Year:</Form.Label>
          <Form.Control
            type="number"
            value={fiscalYear}
            onChange={handleFiscalYearChange}
          />
        </Form.Group>

        <Form.Group controlId="formOfficerName">
          <Form.Label>Officer Name:</Form.Label>
          <Form.Control
            type="text"
            value={officerName}
            readOnly
            style={{ fontWeight: 'bold', color: 'red' }}
          />
        </Form.Group>

        <Form.Group controlId="formElectoralArea">
          <Form.Label>Electoral Area:</Form.Label>
          <Form.Control
            type="text"
            value={electoralArea}
            readOnly
            style={{ fontWeight: 'bold', color: 'red' }}
          />
        </Form.Group>

        <Form.Group controlId="formBusinessType">
          <Form.Label>Business Type:</Form.Label>
          <Form.Control
            type="text"
            value={businessType}
            readOnly
            style={{ fontWeight: 'bold', color: 'red' }}
          />
        </Form.Group>

        <Form.Group controlId="formPropertyClass">
          <Form.Label>Property Class:</Form.Label>
          <Form.Control
            type="text"
            value={propertyClass}
            readOnly
            style={{ fontWeight: 'bold', color: 'red' }}
          />
        </Form.Group>

        <Form.Group controlId="formPropertyRent">
          <Form.Label>Property Fees:</Form.Label>
          <Form.Control
            type="number"
            step="0.01"
            value={propertyRent}
            readOnly
            style={{ fontWeight: 'bold', color: 'blue' }}
          />
        </Form.Group>

        <Form.Group controlId="formBalanceBF">
          <Form.Label>Balance BF:</Form.Label>
          <Form.Control
            type="number"
            step="0.01"
            value={balanceBF}
            readOnly
            style={{ fontWeight: 'bold', color: 'blue' }}
          />
        </Form.Group>

        <Form.Group controlId="formCurrentRate">
          <Form.Label>Current Rate:</Form.Label>
          <Form.Control
            type="number"
            step="0.01"
            value={correctRate}
            readOnly
            style={{ fontWeight: 'bold', color: 'blue' }}
          />
        </Form.Group>

        <Form.Group controlId="formTotalPayable">
          <Form.Label>Total Payable:</Form.Label>
          <Form.Control
            type="number"
            step="0.01"
            value={totalPayable}
            readOnly
            style={{ fontWeight: 'bold', color: 'blue' }}
          />
        </Form.Group>

        <Form.Group controlId="formTotalPayment">
          <Form.Label>Total Payment:</Form.Label>
          <Form.Control
            type="number"
            step="0.01"
            value={totalPayment}
            readOnly
            style={{ fontWeight: 'bold', color: 'blue' }}
          />
        </Form.Group>

        <Form.Group controlId="formCurrentBalance">
          <Form.Label>Current Balance:</Form.Label>
          <Form.Control
            type="number"
            step="0.01"
            value={currentBalance}
            readOnly
            style={{ fontWeight: 'bold', color: 'blue' }}
          />
        </Form.Group>

        <Button variant="primary" onClick={handleAddClick}>
          Add New Record
        </Button>
        <Button variant="success" onClick={handleUpdateClick} style={{ marginLeft: '10px' }}>
          Update last year's rate
        </Button>
        <Button variant="danger" onClick={handleExitClick} style={{ marginLeft: '10px' }}>
          Exit
        </Button>
        <Button variant="secondary" onClick={handlePostClick} style={{ marginLeft: '10px' }}>
          Transfer entries to the Server
        </Button>
      </Form>

      <h3 className="mt-4">SELECT THE TRANSACTION WHICH YOU WANT TO POST. AFTER THE ASSESSMENT, CLICK ON THE POST BUTTON TO POST</h3>
      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>Officer No</th>
            <th>Business No</th>
            <th>Amount</th>
            <th>Receipt No</th>
            <th>Payment Month</th>
            <th>Fiscal Year</th>
          </tr>
        </thead>
        <tbody>
          {tempPayments.map((payment) => (
            <tr key={payment.receiptno}>
              <td>{payment.officer_no}</td>
              <td>{payment.buss_no}</td>
              <td>{payment.amount}</td>
              <td>{payment.receiptno}</td>
              <td>{payment.monthpaid}</td>
              <td>{payment.fiscal_year}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default TemporalPaymentForm;
