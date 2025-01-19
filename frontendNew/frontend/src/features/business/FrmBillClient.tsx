import React, { useState, useEffect } from 'react';
import { Container, Form, Button,  Alert } from 'react-bootstrap';
import axios from 'axios';
import { Link } from 'react-router-dom';

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

interface ClientBalance {
  buss_no: number;
  fiscalyear: number;
  balancebf: number;
  current_balance: number;
  totalAmountDue: number;
  transdate: string;
}

export const FrmBillClient: React.FC = () => {
  const [bussNo, setBussNo] = useState<number | string>('');
  const [bussName, setBussName] = useState<string>('');
  const [amount, setAmount] = useState<number>(0);
  const [businessList, setBusinessList] = useState<Business[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetchBusinessList();
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

  const handleLoanNoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setBussNo(e.target.value);
    validateLoanNo(e.target.value);
  };

  const validateLoanNo = async (value: string) => {
    try {
      value = value.trim().split(' ')[0];
      const response = await axios.get<Business[]>(`http://your-api-url/tb_business?buss_no=${value}`);
      if (response.data.length > 0) {
        setBussName(response.data[0].buss_name);
        setError('');
      } else {
        setError('A wrong business number');
        setBussName('');
      }
    } catch (error) {
      console.error(error);
      setError('A wrong business number');
      setBussName('');
    }
  };

  const handleBillClick = async () => {
    try {
      const fiscalYear = new Date().getFullYear();
      const response = await axios.get<ClientBalance[]>(`http://your-api-url/tb_BussCurrBalance?buss_no=${bussNo}`);
      if (response.data.length > 0) {
        await axios.post('http://your-api-url/tb_BussCurrBalance', {
          buss_no: bussNo,
          fiscalyear: fiscalYear,
          balancebf: 0,
          current_balance: amount,
          totalAmountDue: 0,
          transdate: new Date().toISOString().split('T')[0],
        });
        alert('Billing successful');
        setAmount(0);
      } else {
        setError('Business not found in client balances');
      }
    } catch (error) {
      console.error(error);
      setError('Error billing client');
    }
  };

  const handleExitClick = () => {
    window.location.href = '/'; // Redirect to main page or hide the form
  };

  return (
    <Container>
      <h2>Bill a Client</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form>
        <Form.Group controlId="formBussNo">
          <Form.Label>Business Number:</Form.Label>
          <Form.Select value={bussNo} onChange={handleLoanNoChange}>
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
          />
        </Form.Group>

        <Form.Group controlId="formAmount">
          <Form.Label>Amount to be posted:</Form.Label>
          <Form.Control
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            style={{ fontWeight: 'bold', color: 'blue' }}
          />
        </Form.Group>

        <Button variant="primary" onClick={handleBillClick}>
          Click to Bill a Client
        </Button>
        <Button variant="danger" onClick={handleExitClick} style={{ marginLeft: '10px' }}>
          Exit
        </Button>
      </Form>
      <Link to="/main" className="primary m-3">
          Go Back
      </Link>        
    </Container>
  );
};

//export default FrmBillClient;

