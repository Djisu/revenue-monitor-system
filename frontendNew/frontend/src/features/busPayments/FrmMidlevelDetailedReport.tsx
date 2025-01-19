import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert, Table } from 'react-bootstrap';
import axios from 'axios';
import { Link } from 'react-router-dom';

interface Business {
  electroral_area: string;
  buss_no: number;
  buss_name: string;
  buss_type: string;
  current_rate: number;
  tot_grade: string;
}

interface BusinessTypeDetailedReport {
  electroral_area: string;
  buss_no: number;
  buss_name: string;
  buss_type: string;
  amountdue: number;
  amountpaid: number;
  balance: number;
  tot_grade: string;
}

interface ElectoralArea {
  electroral_area: string;
}

interface FiscalYear {
  fiscal_year: number;
}

const FrmMidlevelDetailedReport: React.FC = () => {
  const [zone, setZone] = useState<string>('');
  const [businessType, setBusinessType] = useState<string>('');
  const [firstDate, setFirstDate] = useState<string>('1/1/1900');
  const [lastDate, setLastDate] = useState<string>(new Date().getFullYear().toString());
  const [businessList, setBusinessList] = useState<Business[]>([]);
  const [businessTypeList, setBusinessTypeList] = useState<string[]>([]);
  const [electoralAreaList, setElectoralAreaList] = useState<string[]>([]);
  const [fiscalYearList, setFiscalYearList] = useState<number[]>([]);
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [showFirstDate, setShowFirstDate] = useState<boolean>(false);

  useEffect(() => {
    setShowFirstDate(false)
    
    fetchElectoralAreas();
    fetchBusinessTypes();
    fetchFiscalYears();
  }, []);

  const fetchElectoralAreas = async () => {
    try {
      const response = await axios.get<ElectoralArea[]>('http://your-api-url/electoral_areas');
      setElectoralAreaList(response.data.map(area => area.electroral_area));
    } catch (error) {
      console.error(error);
      setError('Error fetching electoral areas');
    }
  };

  const fetchBusinessTypes = async () => {
    try {
      const response = await axios.get<{ buss_type: string }[]>('http://your-api-url/business_types');
      setBusinessTypeList(response.data.map(type => type.buss_type));
    } catch (error) {
      console.error(error);
      setError('Error fetching business types');
    }
  };

  const fetchFiscalYears = async () => {
    try {
      const response = await axios.get<FiscalYear[]>('http://your-api-url/fiscal_years');
      setFiscalYearList(response.data.map(year => year.fiscal_year));
    } catch (error) {
      console.error(error);
      setError('Error fetching fiscal years');
    }
  };

  const handleZoneChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setZone(e.target.value);
    updateBusinessTypesAndElectoralAreas();
  };

  const handleBusinessTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setBusinessType(e.target.value);
  };

  const handleFirstDateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFirstDate(e.target.value);
  };

  const handleLastDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLastDate(e.target.value);
  };

  const handleViewClick = async () => {
    if (!zone && !businessType) {
      setError('Please fill in at least one field (Zone or Business Type)');
      return;
    }

    try {
      await axios.delete('http://your-api-url/tb_BusTypeDetailedReport');

      const response = await axios.get<Business[]>('http://your-api-url/tb_business', {
        params: {
          status: 'Active',
          electroral_area: zone || undefined,
          buss_type: businessType || undefined,
        },
      });

      if (response.data.length === 0) {
        setError('No records found');
        return;
      }

      const detailedReports: BusinessTypeDetailedReport[] = await Promise.all(
        response.data.map(async (business) => {
          const amountDue = business.current_rate;
          const amountPaidResponse = await axios.get<{ sum: number }>('http://your-api-url/amount_paid', {
            params: {
              buss_no: business.buss_no,
              fiscal_year: lastDate,
            },
          });

          const amountPaid = amountPaidResponse.data.sum || 0;
          const balance = amountDue - amountPaid;

          return {
            electroral_area: business.electroral_area,
            buss_no: business.buss_no,
            buss_name: business.buss_name,
            buss_type: business.buss_type,
            amountdue: amountDue,
            amountpaid: amountPaid,
            balance: balance,
            tot_grade: business.tot_grade,
          };
        })
      );

      await axios.post('http://your-api-url/tb_BusTypeDetailedReport', detailedReports);

      setSuccessMessage('Report produced successfully');
      setError('');
      fetchDetailedReports();
    } catch (error) {
      console.error(error);
      setError('Error producing report');
      setSuccessMessage('');
    }
  };

  const handleExitClick = () => {
    window.location.href = '/'; // Redirect to main page or hide the form
  };

  const updateBusinessTypesAndElectoralAreas = async () => {
    try {
      // Update the business zones in payments
      await axios.put('http://your-api-url/update_busPayments_zones');

      const response = await axios.get<Business[]>('http://your-api-url/tb_business', {
        params: {
          status: 'Active',
          electroral_area: zone || undefined,
        },
      });

      if (response.data.length === 0) {
        setError('No business type found');
        return;
      }

      setBusinessList(response.data);
    } catch (error) {
      console.error(error);
      setError('Error fetching business types');
    }
  };

  const fetchDetailedReports = async () => {
    try {
      const response = await axios.get<BusinessTypeDetailedReport[]>('http://your-api-url/tb_BusTypeDetailedReport');
      setBusinessList(response.data.map(report => ({
        electroral_area: report.electroral_area,
        buss_no: report.buss_no,
        buss_name: report.buss_name,
        buss_type: report.buss_type,
        current_rate: report.amountdue,
        tot_grade: report.tot_grade,
      })));

      if (response.data.length === 0) {
        setError('No records found in detailed report');
      }
    } catch (error) {
      console.error(error);
      setError('Error fetching detailed report');
    }
  };

  return (
    <Container>
      <h2>Mid Level Detailed Report (B)</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {successMessage && <Alert variant="success">{successMessage}</Alert>}
      <Form>
        <Form.Group controlId="formZone">
          <Form.Label>Electoral Area:</Form.Label>
          <Form.Select value={zone} onChange={handleZoneChange}>
            <option value="">Select an electoral area</option>
            {electoralAreaList.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group controlId="formBussType">
          <Form.Label>Business Type/Profession:</Form.Label>
          <Form.Select value={businessType} onChange={handleBusinessTypeChange}>
            <option value="">Select a business type</option>
            {businessTypeList.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </Form.Select>
          <Form.Text className="text-muted">
            Empty means all Business Type/Profession
          </Form.Text>
        </Form.Group>

        {showFirstDate && (
          <Form.Group controlId="formFirstDate">
            <Form.Label>First Payment Date:</Form.Label>
            <Form.Select value={firstDate} onChange={handleFirstDateChange}>
              <option value="1/1/1900">Select a fiscal year</option>
              {fiscalYearList.map((year) => (
                <option key={year} value={year.toString()}>
                  {year}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        )}

        <Form.Group controlId="formLastDate">
          <Form.Label>Current Fiscal Year:</Form.Label>
          <Form.Control
            type="text"
            value={lastDate}
            onChange={handleLastDateChange}
            readOnly={!showFirstDate}
          />
        </Form.Group>

        <Button variant="primary" onClick={handleViewClick} style={{ marginTop: '10px' }}>
          Produce Report
        </Button>
        <Button variant="danger" onClick={handleExitClick} style={{ marginLeft: '10px', marginTop: '10px' }}>
          Exit
        </Button>
      </Form>

      <h3 className="mt-4">List Of Businesses</h3>
      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>Electoral Area</th>
            <th>Business No</th>
            <th>Business Name</th>
            <th>Business Type/Profession</th>
            <th>Current Rate</th>
            <th>Total Grade</th>
          </tr>
        </thead>
        <tbody>
          {businessList.map((business) => (
            <tr key={business.buss_no}>
              <td>{business.electroral_area.toUpperCase()}</td>
              <td>{business.buss_no}</td>
              <td>{business.buss_name.toUpperCase()}</td>
              <td>{business.buss_type.toUpperCase()}</td>
              <td>{business.current_rate.toFixed(2)}</td>
              <td>{business.tot_grade.toUpperCase()}</td>
            </tr>
          ))}
        </tbody>
      </Table>
            
                <Link to="/main" className="primary m-3">
                    Go Back
                </Link>
             
    </Container>
  );
};

export default FrmMidlevelDetailedReport;

