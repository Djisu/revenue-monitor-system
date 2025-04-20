import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
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

// interface ClientBalance {
//   buss_no: number;
//   fiscalyear: number;
//   balancebf: number;
//   current_balance: number;
//   totalAmountDue: number;
//   transdate: string;
// }

const ChangeRevRateForm: React.FC = () => {
  const [bussNo, setBussNo] = useState<number | string>('');
  const [bussName, setBussName] = useState<string>('');
  const [fiscalYear, setFiscalYear] = useState<number>(0);
  const [correctRate, setCorrectRate] = useState<number>(0);
  let [businessList, setBusinessList] = useState<Business[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetchBusinessList();
  }, []);

  const fetchBusinessList = async () => {
    try {
      const response = await axios.get<Business[]>('http://your-api-url/tb_business');
      businessList = response.data;
      setBusinessList(businessList);
    } catch (error) {
      console.error(error);
      setError('No business found');
    }
  };

  const handleBussNoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBussNo(e.target.value);
    validateBussNo(e.target.value);
  };

  const validateBussNo = async (value: string) => {
    try {
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

  const handleFiscalYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiscalYear(Number(e.target.value));
  };

  const handleCorrectRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCorrectRate(Number(e.target.value));
  };

  const handleUpdateClick = async () => {
    try {
      if (!bussNo || !fiscalYear || !correctRate) {
        setError('Please fill in all fields');
        return;
      }

      await axios.put('http://your-api-url/tb_BussCurrBalance', {
        buss_no: bussNo,
        fiscalyear: fiscalYear,
        current_balance: correctRate,
      });

      alert('Last year\'s rate updated successfully');
      setCorrectRate(0);
    } catch (error) {
      console.error(error);
      setError('Error updating last year\'s rate');
    }
  };

  const handleExitClick = () => {
    window.location.href = '/'; // Redirect to main page or hide the form
  };

  return (
    <Container>
      <h2>Change Last Year's Rate</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form>
        <Form.Group controlId="formBussNo">
          <Form.Label>Business Number:</Form.Label>
          <Form.Control
            type="text"
            value={bussNo}
            onChange={handleBussNoChange}
          />
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

        <Form.Group controlId="formFiscalYear">
          <Form.Label>Fiscal Year:</Form.Label>
          <Form.Control
            type="number"
            value={fiscalYear}
            onChange={handleFiscalYearChange}
          />
        </Form.Group>

        <Form.Group controlId="formCorrectRate">
          <Form.Label>Correct Rate:</Form.Label>
          <Form.Control
            type="number"
            step="0.01"
            value={correctRate}
            onChange={handleCorrectRateChange}
            style={{ fontWeight: 'bold', color: 'blue' }}
          />
        </Form.Group>

        <Button variant="primary" onClick={handleUpdateClick}>
          Update last year's rate
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

export default ChangeRevRateForm;
