import React, { useState, useEffect } from 'react';
import { useAppDispatch } from '../../app/store';
import { Container, Form, Button,  Alert } from 'react-bootstrap';

import { Link } from 'react-router-dom';
import { fetchBusinesses, fetchBusinessById } from './businessSlice';
import { billOneBusiness } from '../busPayments/busPaymentsSlice';

export const FrmBillClient: React.FC = () => {
  const [bussNo, setBussNo] = useState<number>(0);
  const [bussName, setBussName] = useState<string>('');
  const [amount, setAmount] = useState<number>(0);
  const [error, setError] = useState<string>('');
  //let [businessExists, setBusinessExists] = useState(false)

  //const businessesData = useAppSelector((state) => state.business.businesses)

  const dispatch = useAppDispatch()

  useEffect(() => {
    fetchBusinessList();
  }, []);

  const fetchBusinessList = async () => {
    try {
      await dispatch(fetchBusinesses()).unwrap()

    } catch (error) {
      console.error(error);
      setError('No business found');
    }
  };

  const handleBillClick = async () => {
    console.log('in handleBillClick')

    try {
    
      
      const response = await dispatch(billOneBusiness(bussNo)).unwrap()

      if (response){
        alert('Billing successful');
        setAmount(0);
      }
        
     
    } catch (error) {
      console.error(error);
      setError('Error billing client');
    }
  };

  const getBusiness = async (businessId: string) => {
    console.log('in getBusiness, onBlur triggered with:', businessId);
  
    try {
      // Convert businessId to a number if necessary
      const id = Number(businessId);
  
      console.log('before  dispatch(fetchBusinessById(id)).unwrap();')
      // Dispatch the async thunk and unwrap the result
      const response = await dispatch(fetchBusinessById(id)).unwrap();

      console.log('after  dispatch(fetchBusinessById(id)).unwrap(); response:', response.data)

      console.log('response: ', response.data)
        
     if (response) {
          setBussNo(response.data.buss_no || ''); // This can now be an empty string
          setBussName(response.data.buss_name || '');
          setAmount(response.data.current_rate || 0)
      } else {
        alert('record not found')
      }

    } catch (error: any) {     
      console.error('Error fetching businesses:', error);
      if (fetchBusinessById.rejected.match(error)) {
        alert('Error fetching business');
      }
    }
  };
  

  return (
    <Container>
     
      {error && <Alert variant="danger">{error}</Alert>}
      <Form>
      <p className="bold-blue">Bill a Business for Current Fiscal Year</p>
        <Form.Group controlId="formBussNo">
          <Form.Label>Business Number:</Form.Label>
          <Form.Control
            type="number"
            value={bussNo}
            onChange={(e) => setBussNo(Number(e.target.value))}
            onBlur={(e) => getBusiness(e.target.value)}
            placeholder="Click to get the next business number"
            min="0" // Optional: set minimum value
          />
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
        {/* <Button variant="danger" onClick={handleExitClick} style={{ marginLeft: '10px' }}>
          Exit
        </Button> */}
      </Form>
      <Link to="/main" className="primary m-3">
          Go Back
      </Link>        
    </Container>
  );
};

//export default FrmBillClient;

