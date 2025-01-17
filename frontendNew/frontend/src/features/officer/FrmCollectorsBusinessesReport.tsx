import React, { useState, useEffect } from 'react';
import { Button, Form, Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';

interface Officer {
  officer_no: string;
  officer_name: string;
  electoral_area: string;
}

interface FiscalYear {
  fiscal_year: number;
}

interface BusinessType {
  buss_type: string;
}

// interface Business {
//   buss_no: string;
//   buss_name: string;
//   balance: number;
//   current_rate: number;
//   property_rate: number;
//   totalAmountDue: number;
//   transdate: string;
//   electoral_area: string;
// }

const CollectorsBusinessesReportForm: React.FC = () => {
  const [fiscalYear, setFiscalYear] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [electoralArea, setElectoralArea] = useState('');
  const [officerName, setOfficerName] = useState('');
  const [balance, setBalance] = useState('0');
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [fiscalYears, setFiscalYears] = useState<FiscalYear[]>([]);
  const [businessTypes, setBusinessTypes] = useState<BusinessType[]>([]);

  useEffect(() => {
    // Fetch officers
    const fetchOfficers = async () => {
      try {
        const response = await axios.get('/api/officers');
        setOfficers(response.data);
      } catch (error) {
        console.error("Error fetching officers:", error);
        alert("No officer details entered yet");
      }
    };

    // Fetch fiscal years
    const fetchFiscalYears = async () => {
      try {
        const response = await axios.get('/api/fiscal-years');
        setFiscalYears(response.data);
      } catch (error) {
        console.error("Error fetching fiscal years:", error);
        const currentYear = new Date().getFullYear();
        alert(`No officer budget details entered FOR the year ${currentYear}`);
      }
    };

    // Fetch business types
    const fetchBusinessTypes = async () => {
      try {
        const response = await axios.get('/api/business-types');
        setBusinessTypes(response.data);
      } catch (error) {
        console.error("Error fetching business types:", error);
        alert("No business types found");
      }
    };

    fetchOfficers();
    fetchFiscalYears();
    fetchBusinessTypes();

    // Clear fiscal year on form load
    setFiscalYear('');
  }, []);

  const handleOfficerNoChange = async (event: React.ChangeEvent<HTMLElement>) => {
     const target = event.target as HTMLSelectElement;

  //   const handleElectoralAreaChange = (event: React.ChangeEvent<HTMLElement>) => {
  //     const target = event.target as HTMLSelectElement;
  //     const selectedElectoralArea = target.value;
  //     setElectoralArea(selectedElectoralArea);
  // };


    const selectedOfficerNo = target.value.split(' ')[0];
    setElectoralArea('');
    setOfficerName('');

    try {
      const response = await axios.get('/api/officer-details', {
        params: { officerNo: selectedOfficerNo }
      });

      if (response.data) {
        setElectoralArea(response.data.electoral_area);
        setOfficerName(response.data.officer_name);
      } else {
        alert("No officer details found");
      }
    } catch (error) {
      console.error("Error fetching officer details:", error);
      alert("Error fetching officer details");
    }
  };

  const handleBusinessTypeChange = async (event: React.ChangeEvent<HTMLElement>) => {
    const target = event.target as HTMLSelectElement;
    const selectedBusinessType = target.value;
    setBusinessType(selectedBusinessType);

    if (!electoralArea) {
      alert("Select the collector before selecting the business type");
      return;
    }

    try {
      const response = await axios.get('/api/businesses-by-type', {
        params: { officerNo: firstOfficer, businessType: selectedBusinessType }
      });

      if (response.data) {
        setBusinessTypes(response.data);
      } else {
        alert("No business types found");
      }
    } catch (error) {
      console.error("Error fetching business types:", error);
      alert("Error fetching business types");
    }
  };

  const handleFiscalYearChange = (event: React.ChangeEvent<HTMLElement>) => {
    const target = event.target as HTMLSelectElement;
    setFiscalYear(target.value);
  };

  const handleBalanceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBalance(event.target.value);
  };

  const handleViewClick = async () => {
    if (!fiscalYear || !businessType || !electoralArea) {
      alert("ENTER THE FISCAL YEAR, BUSINESS TYPE, AND ELECTORAL AREA");
      return;
    }

    try {
      // Clear temporary tables
      await axios.delete('/api/tmp-business');

      const businessesResponse = await axios.get('/api/businesses', {
        params: { electoralArea, businessType, fiscalYear }
      });

      if (businessesResponse.data.length === 0) {
        alert("No businesses found with the specified criteria");
        return;
      }

      // Insert businesses into temporary table
      for (const business of businessesResponse.data) {
        await axios.post('/api/tmp-business', business);
      }

      // Update the current rate
      await axios.post('/api/update-current-rate', {
        electoralArea,
        businessType,
        fiscalYear
      });

      // Open the report file
      const reportResponse = await axios.get('/api/tmp-business');

      if (reportResponse.data.length > 0) {
        window.open('/report/COLLECTORS BUSINESSES REPORTS.rpt', '_blank');
        alert("Processing completed");
      } else {
        alert("No records found in this electoral area");
      }
    } catch (error) {
      console.error("Error processing view:", error);
      alert("Error processing view");
    }
  };

  const handleSummaryClick = async () => {
    if (!fiscalYear || !businessType || !electoralArea) {
      alert("ENTER THE FISCAL YEAR, BUSINESS TYPE, AND ELECTORAL AREA");
      return;
    }

    try {
      // Clear temporary tables
      await axios.delete('/api/tmp-business');

      const businessesResponse = await axios.get('/api/businesses-by-area', {
        params: { electoralArea, businessType, fiscalYear }
      });

      if (businessesResponse.data.length === 0) {
        alert("No businesses found with the specified criteria");
        return;
      }

      // Insert businesses into temporary table
      for (const business of businessesResponse.data) {
        await axios.post('/api/tmp-business', business);
      }

      // Open the report file
      const reportResponse = await axios.get('/api/tmp-business');

      if (reportResponse.data.length > 0) {
        window.open('/report/SUMMARY OF BUSINESSES IN ELECTORAL AREA.rpt', '_blank');
        alert("Processing completed");
      } else {
        alert("No records found in this electoral area");
      }
    } catch (error) {
      console.error("Error processing summary:", error);
      alert("Error processing summary");
    }
  };

  const handleViewDebtorClick = async () => {
    if (!fiscalYear || !businessType || !electoralArea) {
      alert("ENTER THE FISCAL YEAR, BUSINESS TYPE, AND ELECTORAL AREA");
      return;
    }

    try {
      // Clear temporary tables
      await axios.delete('/api/tmp-business');

      const businessesResponse = await axios.get('/api/debtor-businesses', {
        params: { electoralArea, businessType, fiscalYear }
      });

      if (businessesResponse.data.length === 0) {
        alert("No debtor businesses found with the specified criteria");
        return;
      }

      // Insert businesses into temporary table
      for (const business of businessesResponse.data) {
        await axios.post('/api/tmp-business', business);
      }

      // Open the report file
      const reportResponse = await axios.get('/api/tmp-business');

      if (reportResponse.data.length > 0) {
        window.open('/report/COLLECTORS BUSINESSES REPORT.rpt', '_blank');
        alert("Processing completed");
      } else {
        alert("No records found in this electoral area");
      }
    } catch (error) {
      console.error("Error processing debtor view:", error);
      alert("Error processing debtor view");
    }
  };

  const handlePrintClick = async () => {
    alert("Print functionality is not implemented yet.");
    // Implement print functionality as needed
  };

  const handleExitClick = () => {
    // Assuming you have a way to navigate back to the main page
    window.location.href = '/'; // Redirect to main page or wherever you want
  };

  const firstOfficer = officers.find(officer => officer.officer_no === electoralArea.split(' ')[0])?.officer_no || '';

  return (
    <Container fluid className="bg-light">
      <Row className="mt-3">
        <Col className="text-center">
          <h2 style={{ textDecoration: 'underline', color: '#0000C0' }}>MARCORY MUNICIPAL ASSEMBLY</h2>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col className="text-center">
          <h3>Collector's Businesses Report</h3>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col>
          <Form.Group controlId="formOfficerNo">
            <Form.Label>Collector Code:</Form.Label>
            <Form.Control as="select" value={electoralArea} onChange={handleOfficerNoChange}>
              <option value="">Select a collector</option>
              {officers.map(officer => (
                <option key={officer.officer_no} value={`${officer.officer_no} ${officer.electoral_area}`}>
                  {officer.officer_no} {officer.officer_name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col>
          <Form.Group controlId="formBusinessType">
            <Form.Label>Business Types:</Form.Label>
            <Form.Control as="select" value={businessType} onChange={handleBusinessTypeChange}>
              <option value="">Select a business type</option>
              {businessTypes.map(type => (
                <option key={type.buss_type} value={type.buss_type}>{type.buss_type}</option>
              ))}
            </Form.Control>
          </Form.Group>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col>
          <Form.Group controlId="formFiscalYear">
            <Form.Label>Fiscal Year:</Form.Label>
            <Form.Control as="select" value={fiscalYear} onChange={handleFiscalYearChange}>
              <option value="">Select a fiscal year</option>
              {fiscalYears.map(year => (
                <option key={year.fiscal_year} value={year.fiscal_year}>{year.fiscal_year}</option>
              ))}
            </Form.Control>
          </Form.Group>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col>
          <Form.Label>Enter a value greater than 0 to produce Balance BF Report:</Form.Label>
          <Form.Control type="text" value={balance} onChange={handleBalanceChange} />
        </Col>
      </Row>
      <Row className="mt-3">
        <Col className="text-center">
          <Button variant="primary" onClick={handleViewClick}>
            View Detailed Report
          </Button>
        </Col>
        <Col className="text-center">
          <Button variant="success" onClick={handleSummaryClick}>
            View Summarized Report
          </Button>
        </Col>
        <Col className="text-center">
          <Button variant="warning" onClick={handleViewDebtorClick}>
            View Detailed Debtor Report
          </Button>
        </Col>
        <Col className="text-center">
          <Button variant="danger" onClick={handlePrintClick}>
            Print Demand Notices
          </Button>
        </Col>
        <Col className="text-center">
          <Button variant="secondary" onClick={handleExitClick}>
            Exit
          </Button>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col>
          <Form.Label id="lblelectoralarea" style={{ borderStyle: 'solid', borderWidth: 1, padding: 5 }}>
            {electoralArea ? `Electoral Area: ${electoralArea.split(' ')[1]}` : 'Electoral Area'}
          </Form.Label>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col>
          <Form.Label id="lblOfficername" style={{ borderStyle: 'solid', borderWidth: 1, padding: 5 }}>
            {officerName ? `Collector Name: ${officerName}` : 'Collector Name'}
          </Form.Label>
        </Col>
      </Row>
    </Container>
  );
};

export default CollectorsBusinessesReportForm;
