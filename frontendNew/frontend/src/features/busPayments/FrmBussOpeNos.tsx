import React, { useEffect, useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';

const FrmBussOpeNos: React.FC = () => {
  const [fiscalYear, setFiscalYear] = useState<string>('');
  const [firstBusinessNo, setFirstBusinessNo] = useState<string>('');
  const [secondBusinessNo, setSecondBusinessNo] = useState<string>('');
  const [businessNumbers, setBusinessNumbers] = useState<string[]>([]);
  const [error, setError] = useState<string>('');

  // Fetch business numbers
  const fetchBusinessNumbers = async () => {
    try {
      const response = await axios.get('/api/business'); // Replace with your API endpoint
      setBusinessNumbers(response.data);
    } catch (err) {
      setError('Error fetching business numbers');
    }
  };

  useEffect(() => {
    fetchBusinessNumbers();
  }, []);

  const handlePreview = () => {
    if (!firstBusinessNo && !secondBusinessNo) {
      setError('Select the business numbers');
      return;
    }

    // Logic for processing preview (similar to VB6 cmdPreview_Click)
    console.log("Previewing Demand Notices for", firstBusinessNo, secondBusinessNo);
  };

  const handlePrint = () => {
    // Logic for printing notices
    console.log("Printing Demand Notices for", firstBusinessNo, secondBusinessNo);
  };

  return (
    <div style={{ backgroundColor: '#FFC0C0', padding: '20px', borderRadius: '5px' }}>
      <h2 style={{ color: '#FF0000', textAlign: 'center' }}>Business Operating Permit Demand Notice</h2>
      <h4 style={{ color: '#0000C0', textAlign: 'center' }}>MARCORY MUNICIPAL ASSEMBLY</h4>

      {error && <Alert variant="danger">{error}</Alert>}

      <Form>
        <Form.Group controlId="formFiscalYear">
          <Form.Label>Fiscal Year:</Form.Label>
          <Form.Control
            as="select"
            value={fiscalYear}
            onChange={(e) => setFiscalYear(e.target.value)}
          >
            <option value="">Select Fiscal Year</option>
            {/* Populate fiscal years dynamically */}
            <option value="2023">2023</option>
            <option value="2024">2024</option>
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="formFirstBusinessNo">
          <Form.Label>First Business Number:</Form.Label>
          <Form.Control
            as="select"
            value={firstBusinessNo}
            onChange={(e) => setFirstBusinessNo(e.target.value)}
          >
            <option value="">Select First Business No</option>
            {businessNumbers.map((b, index) => (
              <option key={index} value={b}>{b}</option>
            ))}
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="formSecondBusinessNo">
          <Form.Label>Second Business Number:</Form.Label>
          <Form.Control
            as="select"
            value={secondBusinessNo}
            onChange={(e) => setSecondBusinessNo(e.target.value)}
          >
            <option value="">Select Second Business No</option>
            {businessNumbers.map((b, index) => (
              <option key={index} value={b}>{b}</option>
            ))}
          </Form.Control>
        </Form.Group>

        <div className="d-flex justify-content-between">
          <Button variant="primary" onClick={handlePreview}>Preview Demand Notices</Button>
          <Button variant="secondary" onClick={handlePrint}>Print Demand Notices</Button>
          <Button variant="danger" onClick={() => console.log('Exit')}>Exit</Button>
        </div>
      </Form>
    </div>
  );
};

export default FrmBussOpeNos;