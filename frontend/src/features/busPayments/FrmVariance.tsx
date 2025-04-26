import React, { useState, useEffect } from 'react';
import { Button, Form, Col, Row, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';

interface PropertyData {
  buss_no: string;
  buss_type: string;
  electoral_area: string;
  transdate: string;
  current_balance: number;
  amount: number;
}

const VarianceAnalysis: React.FC = () => {
  const [businessType, setBusinessType] = useState('');
  const [electoralArea, setElectoralArea] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState('');
  const [businessTypes, setBusinessTypes] = useState<string[]>([]);
  const [electoralAreas, setElectoralAreas] = useState<string[]>([]);
  const [dates, setDates] = useState<string[]>([]);

  const fetchBusinessTypes = async () => {
    try {
      const response = await fetch('/api/businessTypes');
      const data = await response.json();
      setBusinessTypes(data.map((item: PropertyData) => item.buss_type));
      setBusinessType(data[0].buss_type); // Set first business type as default
    } catch (err) {
      setError('No business types found');
    }
  };

  const fetchElectoralAreas = async () => {
    try {
      const response = await fetch('/api/electoralAreas');
      const data = await response.json();
      setElectoralAreas(data.map((item: PropertyData) => item.electoral_area));
    } catch (err) {
      setError('No electoral areas found');
    }
  };

  const fetchDates = async () => {
    try {
      const response = await fetch('/api/dates');
      const data = await response.json();
      setDates(data.map((item: PropertyData) => item.transdate));
      setStartDate(data[0].transdate);
      setEndDate(data[data.length - 1].transdate);
    } catch (err) {
      setError('No payment records date found');
    }
  };

  const handleBusinessTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setBusinessType(event.target.value);
  };

  const handleElectoralAreaChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setElectoralArea(event.target.value);
  };

  const handleStartDateChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setEndDate(event.target.value);
  };

  const handlePreviewClick = async () => {
    try {
      if (!startDate || !endDate) {
        setError('Select both start and end dates');
        return;
      }

      // Reset error message
      setError('');

      // Fetch properties and process them
      const response = await fetch(`/api/detailedPreview?business_type=${businessType}&electoral_area=${electoralArea}&start_date=${startDate}&end_date=${endDate}`);
      const data = await response.json();

      if (data) {
        // Handle the response data as needed
        console.log(data);
        alert('Detailed Preview generated successfully');
      } else {
        setError('No records found');
      }
    } catch (err) {
      setError('Error generating detailed preview');
    }
  };

  const handleSummaryClick = async () => {
    try {
      if (!startDate || !endDate) {
        setError('Select both start and end dates');
        return;
      }

      // Reset error message
      setError('');

      // Fetch properties and process them
      const response = await fetch(`/api/summaryPreview?business_type=${businessType}&electoral_area=${electoralArea}&start_date=${startDate}&end_date=${endDate}`);
      const data = await response.json();

      if (data) {
        // Handle the response data as needed
        console.log(data);
        alert('Summary Preview generated successfully');
      } else {
        setError('No records found');
      }
    } catch (err) {
      setError('Error generating summary preview');
    }
  };

  const handleExitClick = () => {
    // Implement exit functionality if needed
    alert('Exit clicked');
  };

  useEffect(() => {
    fetchBusinessTypes();
  }, []);

  useEffect(() => {
    fetchElectoralAreas();
  }, []);

  useEffect(() => {
    fetchDates();
  }, []);

  useEffect(() => {
    // Format current date on form load
    setEndDate(new Date().toLocaleDateString('en-GB'));
  }, []);

  return (
    <div className="container">
      <h3 className="text-center mt-5" style={{ color: '#0000C0', textDecoration: 'underline' }}>
        MARCORY MUNICIPAL ASSEMBLY
      </h3>
      <h4 className="text-center mt-3">
        Business Types Variance Analysis
      </h4>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form>
        <Form.Group controlId="formBusinessType" className="mb-3">
          <Form.Label>Business Type:</Form.Label>
          <Form.Select value={businessType} onChange={handleBusinessTypeChange}>
            <option value="" disabled>Select a business type</option>
            {businessTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </Form.Select>
          <Form.Label className="mt-2" style={{ color: '#0000C0' }}>
            Leave Business Type empty to show all business types
          </Form.Label>
        </Form.Group>
        <Form.Group controlId="formElectoralArea" className="mb-3">
          <Form.Label>Electoral Area:</Form.Label>
          <Form.Select value={electoralArea} onChange={handleElectoralAreaChange}>
            <option value="" disabled>Select an electoral area</option>
            {electoralAreas.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </Form.Select>
          <Form.Label className="mt-2" style={{ color: '#0000C0' }}>
            Leave Electoral Area empty to show all electoral areas
          </Form.Label>
        </Form.Group>
        <Form.Group controlId="formStartDate" className="mb-3">
          <Form.Label>Start Date</Form.Label>
          <Form.Select value={startDate} onChange={handleStartDateChange}>
            <option value="" disabled>Select a start date</option>
            {dates.map((date) => (
              <option key={date} value={date}>
                {date}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        <Form.Group controlId="formEndDate" className="mb-3">
          <Form.Label>End Date</Form.Label>
          <Form.Select value={endDate} onChange={handleEndDateChange}>
            <option value="" disabled>Select an end date</option>
            {dates.map((date) => (
              <option key={date} value={date}>
                {date}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        <Form.Group controlId="formFieldOfficer" className="mb-3" style={{ display: 'none' }}>
          <Form.Label>Field Officer</Form.Label>
          <Form.Control type="text" placeholder="Leave EMPTY for all field officers" disabled />
        </Form.Group>
        <Form.Group controlId="formFieldOfficerLabel" className="mb-3" style={{ display: 'none' }}>
          <Form.Label>Leave Field Officer EMPTY for all field officers</Form.Label>
        </Form.Group>
        <Row className="mb-3">
          <Col className="text-center">
            <Button variant="primary" onClick={handlePreviewClick}>
              Detailed Preview
            </Button>
            <Button variant="secondary" onClick={handleSummaryClick}>
              Summerized Preview
            </Button>
            <Button variant="danger" onClick={handleExitClick}>
              Exit
            </Button>
          </Col>
        </Row>
      </Form>
            
      <Link to="/main" className="primary m-3">
          Go Back
      </Link>
              
    </div>
  );
};

export default VarianceAnalysis;
