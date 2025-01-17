import React, { useState, useEffect } from 'react';
import { Button, Form, Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';

const DefaulterPrepaymentForm: React.FC = () => {
  const [fiscalYear, setFiscalYear] = useState('');
  const [electoralArea, setElectoralArea] = useState('');
  const [electoralAreas, setElectoralAreas] = useState<string[]>([]);

  useEffect(() => {
    const fetchElectoralAreas = async () => {
      try {
        const response = await axios.get('/api/electoral-areas');
        setElectoralAreas(response.data);
      } catch (error) {
        console.error("Error fetching electoral areas:", error);
        alert("Error fetching electoral areas");
      }
    };

    fetchElectoralAreas();
  }, []);

  const handleDefaultersClick = async () => {
    if (!fiscalYear) {
      alert("ENTER THE FISCAL YEAR");
      return;
    }

    try {
      const response = await axios.get('/api/defaulters-list', {
        params: { fiscalYear, electoralArea }
      });

      if (response.data.length > 0) {
        window.open('/report/defaulters-list.rpt', '_blank');
        alert(`This is the report for ${electoralArea}`);
      } else {
        alert("No records found");
      }
    } catch (error) {
      console.error("Error fetching defaulters list:", error);
      alert("Error fetching defaulters list");
    }
  };

  const handleFullyPaidBusinessesClick = async () => {
    try {
      const response = await axios.get('/api/fully-paid-businesses', {
        params: { electoralArea }
      });

      if (response.data.length > 0) {
        window.open('/report/fully-paid-businesses.rpt', '_blank');
        alert(`This is the report for ${electoralArea}`);
      } else {
        alert("No records found");
      }
    } catch (error) {
      console.error("Error fetching fully paid businesses:", error);
      alert("Error fetching fully paid businesses");
    }
  };

  const handlePaymentDefaultersClick = async () => {
    try {
      const response = await axios.get('/api/payment-defaulters', {
        params: { electoralArea }
      });

      if (response.data.length > 0) {
        window.open('/report/payment-defaulters.rpt', '_blank');
        alert(`This is the report for ${electoralArea}`);
      } else {
        alert("No records found");
      }
    } catch (error) {
      console.error("Error fetching payment defaulters:", error);
      alert("Error fetching payment defaulters");
    }
  };

  const handlePaymentsClick = async () => {
    try {
      const response = await axios.get('/api/payments', {
        params: { electoralArea }
      });

      if (response.data.length > 0) {
        window.open('/report/businesses-payments.rpt', '_blank');
        alert(`This is the report for ${electoralArea}`);
      } else {
        alert("No records found");
      }
    } catch (error) {
      console.error("Error fetching payments:", error);
      alert("Error fetching payments");
    }
  };

  const handlePrepaymentsClick = async () => {
    if (!fiscalYear) {
      alert("ENTER THE FISCAL YEAR");
      return;
    }

    try {
      const response = await axios.get('/api/over-payments-list', {
        params: { fiscalYear, electoralArea }
      });

      if (response.data.length > 0) {
        window.open('/report/over-payments-list.rpt', '_blank');
        alert(`This is the report for ${electoralArea}`);
      } else {
        alert("No records found");
      }
    } catch (error) {
      console.error("Error fetching over payments list:", error);
      alert("Error fetching over payments list");
    }
  };

  const handleExitClick = () => {
    // Assuming you have a way to navigate back to the main page
    window.location.href = '/'; // Redirect to main page or wherever you want
  };

  return (
    <Container fluid className="bg-light">
      <Row className="mt-3">
        <Col className="text-center">
          <h2 style={{ textDecoration: 'underline', color: '#0000C0' }}>MARCORY MUNICIPAL ASSEMBLY</h2>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col>
          <Form.Group controlId="formElectoralArea">
            <Form.Label>Electoral Area:</Form.Label>
            <Form.Control as="select" value={electoralArea} onChange={e => setElectoralArea(e.target.value)}>
              <option value="">Select an area</option>
              {electoralAreas.map(area => (
                <option key={area} value={area}>{area}</option>
              ))}
            </Form.Control>
          </Form.Group>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col>
          <Form.Group controlId="formFiscalYear">
            <Form.Label>Enter the fiscal year:</Form.Label>
            <Form.Control type="text" value={fiscalYear} onChange={e => setFiscalYear(e.target.value)} />
          </Form.Group>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col className="text-center">
          <Button variant="primary" onClick={handleDefaultersClick}>
            Defaulters List
          </Button>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col className="text-center">
          <Button variant="success" onClick={handlePrepaymentsClick}>
            Over Payments List
          </Button>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col className="text-center">
          <Button variant="warning" onClick={handlePaymentsClick}>
            Payments
          </Button>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col className="text-center">
          <Button variant="danger" onClick={handlePaymentDefaultersClick}>
            Payment And Receivables
          </Button>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col className="text-center">
          <Button variant="secondary" onClick={handleFullyPaidBusinessesClick}>
            Fully Paid Businesses (No Arrears)
          </Button>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col className="text-center">
          <Button variant="outline-dark" onClick={handleExitClick}>
            Exit
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default DefaulterPrepaymentForm;
