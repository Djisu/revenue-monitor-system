import React, { useState, useEffect } from 'react';
import { Button, Form, Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { Link } from 'react-router-dom';

interface Officer {
  officer_no: string;
  officer_name: string;
}

interface FiscalYear {
  fiscal_year: number;
}

interface BusinessType {
  buss_type: string;
}

const PropertyOfficerBudgetAssessmentForm: React.FC = () => {
  const [fiscalYear, setFiscalYear] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [electoralArea, setElectoralArea] = useState('');
  const [balance, setBalance] = useState('0');
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [fiscalYears, setFiscalYears] = useState<FiscalYear[]>([]);
  const [businessTypes, setBusinessTypes] = useState<BusinessType[]>([]);
  //const [businesses, setBusinesses] = useState<Business[]>([]);

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
        alert("No payments made yet");
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

  const handleFiscalYearChange = (event: React.ChangeEvent<HTMLElement>) => {
    const target = event.target as HTMLSelectElement;
    setFiscalYear(target.value);
  };

  const handleBusinessTypeChange = (event: React.ChangeEvent<HTMLElement>) => {
    const target = event.target as HTMLSelectElement;
    setBusinessType(target.value);
  };

  const handleElectoralAreaChange = (event: React.ChangeEvent<HTMLElement>) => {
    const target = event.target as HTMLSelectElement;
    const selectedArea = target.value;
    setElectoralArea(selectedArea);
    //businesses = []
    //setBusinesses([]);
  };

  const handleBalanceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBalance(event.target.value);
  };

  // const handleElectoralAreaValidate = () => {
  //   // Update label with selected electoral area
  //   const labelElement = document.getElementById('lblelectoralarea');
  //   if (labelElement) {
  //     labelElement.innerText = electoralArea;
  //   }
  // };

  const handlePreviewClick = async () => {
    if (!fiscalYear || !businessType) {
      alert("ENTER THE FISCAL YEAR AND BUSINESS TYPE");
      return;
    }

    try {
      // Clear temporary tables
      await axios.delete('/api/tmp-business');
      await axios.delete('/api/tmp-busscurrbalance');

      // Fetch businesses based on business type
      const businessesResponse = await axios.get('/api/businesses', {
        params: { businessType }
      });

      if (businessesResponse.data.length === 0) {
        alert("No businesses found with the specified business type");
        return;
      }

      //setBusinesses(businessesResponse.data);
      console.log(businessesResponse.data)

      // Insert businesses into temporary table
      for (const business of businessesResponse.data) {
        await axios.post('/api/tmp-business', {
          buss_no: business.buss_no,
          buss_name: business.buss_name,
          balance: business.balance,
          current_rate: business.current_rate,
          property_rate: business.property_rate,
          totalAmountDue: business.totalAmountDue,
          transdate: business.transdate,
          electoral_area: business.electoral_area
        });
      }

      // Fetch business current balances
      const firstBusiness = businessesResponse.data[0].buss_no;
      const lastBusiness = businessesResponse.data[businessesResponse.data.length - 1].buss_no;

      const currBalancesResponse = await axios.get('/api/business-current-balances', {
        params: { firstBusiness, lastBusiness }
      });

      if (currBalancesResponse.data.length === 0) {
        alert("No current balances found for the specified businesses");
        return;
      }

      // Insert business current balances into temporary table
      for (const balance of currBalancesResponse.data) {
        await axios.post('/api/tmp-busscurrbalance', balance);
      }

      // Open the report file
      const reportResponse = await axios.get('/api/tmp-business');

      if (reportResponse.data.length > 0) {
        window.open('/report/BUSINESS OPERATING PERMIT DEMAND NOTICE1.rpt', '_blank');
        alert("Processing completed");
      } else {
        alert("No records found in this electoral area");
      }
    } catch (error) {
      console.error("Error processing preview:", error);
      alert("Error processing preview");
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

  // const fetchElectoralAreas = async () => {
  //   try {
  //     const response = await axios.get('/api/electoral-areas');
  //     setOfficers(response.data);
  //   } catch (error) {
  //     console.error("Error fetching electoral areas:", error);
  //     alert("No electoral areas found");
  //   }
  // };

  // const findValueOfBillsDistributed = async (officerNo: string, fiscalYear: string): Promise<number> => {
  //   try {
  //     const response = await axios.get('/api/value-of-bills-distributed', {
  //       params: { officerNo, fiscalYear }
  //     });
  //     return response.data || 0;
  //   } catch (error) {
  //     console.error("Error fetching value of bills distributed:", error);
  //     return 0;
  //   }
  // };

  // const findMonthlyAmount = async (officerNo: string, fiscalYear: string, month: string, monthName: string): Promise<number> => {
  //   try {
  //     const response = await axios.get('/api/monthly-amount', {
  //       params: { officerNo, fiscalYear, month, monthName }
  //     });
  //     return response.data || 0;
  //   } catch (error) {
  //     console.error(`Error fetching amount for ${monthName}:`, error);
  //     return 0;
  //   }
  // };

  return (
    <Container fluid className="bg-light">
      <Row className="mt-3">
        <Col className="text-center">
          <h2 style={{ textDecoration: 'underline', color: '#0000C0' }}>MARCORY MUNICIPAL ASSEMBLY</h2>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col className="text-center">
          <h3 style={{ textDecoration: 'underline', color: '#FF0000' }}>Business Operating Permit Demand Notice</h3>
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
          <Form.Group controlId="formElectoralArea">
            <Form.Label>Electoral Area:</Form.Label>
            <Form.Control as="select" value={electoralArea} onChange={handleElectoralAreaChange}>
              <option value="">Select an electoral area</option>
              {officers.map(officer => (
                <option key={officer.officer_no} value={officer.officer_no + ' ' + officer.officer_name}>
                  {officer.officer_no} {officer.officer_name}
                </option>
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
        <Col>
          <Button variant="primary" onClick={handlePreviewClick}>
            Preview Demand Notices
          </Button>
        </Col>
        <Col>
          <Button variant="success" onClick={handlePrintClick}>
            Print Demand Notices
          </Button>
        </Col>
        <Col>
          <Button variant="secondary" onClick={handleExitClick}>
            Exit
          </Button>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col>
          <Form.Label id="lblelectoralarea" style={{ borderStyle: 'solid', borderWidth: 1, padding: 5 }}>
            Electoral Area
          </Form.Label>
        </Col>
      </Row>
            <Row className="mt-3">
                <Col>
                <Link to="/main" className="primary m-3">
                    Go Back
                </Link>
                </Col>
            </Row>
    </Container>
  );
};

export default PropertyOfficerBudgetAssessmentForm;
