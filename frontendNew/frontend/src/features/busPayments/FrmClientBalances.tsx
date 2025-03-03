import React, { useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';

import { Link } from 'react-router-dom';
import { billAllBusinesses } from './busPaymentsSlice'
import { useAppDispatch } from '../../app/store';

const ClientBalancesForm: React.FC = () => {
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  const dispatch = useAppDispatch(); // Get the dispatch function

  const handleProcessClick = async () => {
    try {
      const response = await dispatch(billAllBusinesses())

      console.log('after billAllBusinesses thunk, Response data:', response.payload.data)

      setSuccessMessage('after billAllBusinesses thunk, Response data:')
    } catch (error) {
      console.error(error);

      setError('Error processing new balances');
      setSuccessMessage('');
    }
  };

  return (
    <Container>
      {error && <Alert variant="danger">{error}</Alert>}
      {successMessage && <Alert variant="success">{successMessage}</Alert>}      
      <Form>
      <div>
          <h6 className="mt-3" style={{ color: '#C00000' }}> 
            MARCORY MUNICIPAL ASSEMBLY
          </h6>
          <h6 className="mt-3" style={{ color: 'green' }}>UPDATE BUSINESS BALANCES</h6>
        </div>
        <div>
          <Button variant="primary" onClick={handleProcessClick} style={{ marginTop: '10px' }}>
            Process New
          </Button>
        </div>  
        <div>
          <Link to="/main" className="primary m-3">
              Go Back
          </Link>
        </div>
        
       
      </Form>

      
    </Container>
  );
};

export default ClientBalancesForm;


