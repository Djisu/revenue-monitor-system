import React, { useState, useEffect } from 'react';
import { Button, Form, Col, Row, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';

interface PropertyData {
  house_no: string;
  electroral_area: string;
  fiscal_year: string;
  current_rate: number;
  amount: number;
}

const FrmProducePropertyRates: React.FC = () => {
  const [electoralArea, setElectoralArea] = useState('');
  const [fiscalYear, setFiscalYear] = useState('');
  const [error, setError] = useState('');
  const [electoralAreas, setElectoralAreas] = useState<string[]>([]);
  const [fiscalYears, setFiscalYears] = useState<string[]>([]);

  const fetchElectoralAreas = async () => {
    try {
      const response = await fetch('/api/electoralAreas');
      const data = await response.json();
      setElectoralAreas(data.map((item: PropertyData) => item.electroral_area));
      setElectoralArea(data[0].electroral_area); // Set first electoral area as default
    } catch (err) {
      setError('No electoral areas found');
    }
  };

  const fetchFiscalYears = async () => {
    try {
      const response = await fetch('/api/fiscalYears');
      const data = await response.json();
      setFiscalYears(data.map((item: PropertyData) => item.fiscal_year));
      setFiscalYear(data[0].fiscal_year); // Set first fiscal year as default
    } catch (err) {
      setError('No payments made yet');
    }
  };

  const handleElectoralAreaChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setElectoralArea(event.target.value);
  };

  const handleFiscalYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFiscalYear(event.target.value);
  };

  const handlePreviewClick = async () => {
    try {
      if (!electoralArea || !fiscalYear) {
        setError('Select an electoral area and fiscal year');
        return;
      }

      // Reset error message
      setError('');

      // Fetch properties and process them
      const response = await fetch(`/api/previewDemandNotices?electoral_area=${electoralArea}&fiscal_year=${fiscalYear}`);
      const data = await response.json();

      if (data) {
        // Handle the response data as needed
        console.log(data);
        alert('Processing completed');
      } else {
        setError('No records found in this electoral area');
      }
    } catch (err) {
      setError('Error generating report');
    }
  };

  const handlePrintClick = () => {
    // Implement print functionality if needed
    alert('Print Demand Notices clicked');
  };

  const handleExitClick = () => {
    // Implement exit functionality if needed
    alert('Exit clicked');
  };

  useEffect(() => {
    fetchElectoralAreas();
    fetchFiscalYears();
  }, []);

  return (
    <div className="container">
      <h3 className="text-center mt-5" style={{ color: '#0000C0', textDecoration: 'underline' }}>
        MARCORY MUNICIPAL ASSEMBLY
      </h3>
      <h4 className="text-center mt-3">
        Business Operating Permit Demand Notice
      </h4>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form>
        <Form.Group controlId="formElectoralArea" className="mb-3">
          <Form.Label>Electoral Area</Form.Label>
          <Form.Select value={electoralArea} onChange={handleElectoralAreaChange}>
            <option value="" disabled>Select an electoral area</option>
            {electoralAreas.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        <Form.Group controlId="formFiscalYear" className="mb-3">
          <Form.Label>Fiscal Year:</Form.Label>
          <Form.Select value={fiscalYear} onChange={handleFiscalYearChange}>
            <option value="" disabled>Select a fiscal year</option>
            {fiscalYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        <Form.Group controlId="formBalance" className="mb-3" style={{ display: 'none' }}>
          <Form.Label>Enter a value greater than 0 to produce Balance BF Report:</Form.Label>
          <Form.Control type="text" value="0" readOnly />
        </Form.Group>
        <Form.Group controlId="formElectoralAreaLabel" className="mb-3">
          <Form.Label className="text-center">
            {electoralArea}
          </Form.Label>
        </Form.Group>
        <Row className="mb-3">
          <Col className="text-center">
            <Button variant="primary" onClick={handlePreviewClick}>
              Preview Demand Notices
            </Button>
            <Button variant="secondary" onClick={handlePrintClick} style={{ display: 'none' }}>
              Print Demand Notices
            </Button>
            <Button variant="danger" onClick={handleExitClick}>
              Exit
            </Button>
          </Col>
        </Row>
        <Row className="mt-3">
            <Col>
            <Link to="/main" className="primary m-3">
                Go Back
            </Link>
            </Col>
        </Row>
      </Form>
    </div>
  );
};

export default FrmProducePropertyRates;
