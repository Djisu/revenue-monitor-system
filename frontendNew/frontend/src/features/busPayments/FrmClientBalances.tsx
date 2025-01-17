import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert, Table } from 'react-bootstrap';
import axios from 'axios';

interface Business {
  buss_no: number;
  electroral_area: string;
  buss_name: string;
  current_rate: number;
  tot_grade: string;
}

interface BussCurrBalance {
  buss_no: number;
  fiscalyear: number;
  balancebf: number;
  current_balance: number;
  property_rate: number;
  totalAmountDue: number;
  transdate: string;
  electoralarea: string;
}

interface FiscalYear {
  fiscal_year: number;
}

// interface AddRecResponse {
//   message: string;
// }

interface FindBalanceBFResponse {
  balancebf: number;
}

const ClientBalancesForm: React.FC = () => {
  const [fiscalYear, setFiscalYear] = useState<number>(new Date().getFullYear());
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [bussCurrBalances, setBussCurrBalances] = useState<BussCurrBalance[]>([]);
  const [fiscalYearList, setFiscalYearList] = useState<number[]>([]);
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  useEffect(() => {
    fetchFiscalYears();
  }, []);

  const fetchFiscalYears = async () => {
    try {
      const response = await axios.get<FiscalYear[]>('http://your-api-url/fiscal_years');
      setFiscalYearList(response.data.map(year => year.fiscal_year));
    } catch (error) {
      console.error(error);
      setError('Error fetching fiscal years');
    }
  };

  const fetchBusinesses = async () => {
    try {
      const response = await axios.get<Business[]>('http://your-api-url/tb_business', {
        params: {
          status: 'Active',
          current_rate: { $gt: 0 },
        },
      });
      setBusinesses(response.data);
    } catch (error) {
      console.error(error);
      setError('Error fetching businesses');
    }
  };

  const fetchBussCurrBalances = async () => {
    try {
      const response = await axios.get<BussCurrBalance[]>('http://your-api-url/tb_BussCurrBalance', {
        params: {
          fiscalyear: fiscalYear,
        },
      });
      setBussCurrBalances(response.data);
    } catch (error) {
      console.error(error);
      setError('Error fetching business balances');
    }
  };

  const handleFiscalYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const year = Number(e.target.value);
    setFiscalYear(year);
    fetchBusinesses();
  };

  const handleProcessClick = async () => {
    try {
      // Delete previous records for the current fiscal year
      await axios.delete('http://your-api-url/tb_BussCurrBalance', {
        params: {
          fiscalyear: fiscalYear,
        },
      });

      const detailedBalances: BussCurrBalance[] = await Promise.all(
        businesses.map(async (business) => {
          const balanceBF = await findBalanceBF(business.buss_no);
          const totalAmountDue = balanceBF + business.current_rate;

          return {
            buss_no: business.buss_no,
            fiscalyear: fiscalYear,
            balancebf: balanceBF,
            current_balance: business.current_rate,
            property_rate: 0,
            totalAmountDue: totalAmountDue,
            transdate: new Date().toISOString().split('T')[0],
            electoralarea: business.electroral_area,
          };
        })
      );

      // Insert new records
      await axios.post('http://your-api-url/tb_BussCurrBalance', detailedBalances);

      setSuccessMessage('All electoral areas processed');
      setError('');
      fetchBussCurrBalances();
    } catch (error) {
      console.error(error);
      setError('Error processing new balances');
      setSuccessMessage('');
    }
  };

  const handleExitClick = () => {
    window.location.href = '/'; // Redirect to main page or hide the form
  };

  const findBalanceBF = async (bussNo: number): Promise<number> => {
    try {
      const varPrevFiscalYear = fiscalYear - 1;
      const response = await axios.get<FindBalanceBFResponse>('http://your-api-url/find_balancebf', {
        params: {
          buss_no: bussNo,
          fiscal_year: varPrevFiscalYear,
        },
      });

      return response.data.balancebf || 0;
    } catch (error) {
      console.error(error);
      setError('Error finding balance BF');
      return 0;
    }
  };

  return (
    <Container>
      <h2>UPDATE BUSINESS BALANCES</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {successMessage && <Alert variant="success">{successMessage}</Alert>}
      <Form>
        <Form.Group controlId="formFiscalYear">
          <Form.Label>Current Fiscal Year:</Form.Label>
          <Form.Select value={fiscalYear} onChange={handleFiscalYearChange}>
            {fiscalYearList.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Button variant="primary" onClick={handleProcessClick} style={{ marginTop: '10px' }}>
          Process New
        </Button>
        <Button variant="danger" onClick={handleExitClick} style={{ marginLeft: '10px', marginTop: '10px' }}>
          Exit
        </Button>
        <Button variant="secondary" onClick={() => window.alert('Report functionality not implemented')} style={{ marginLeft: '10px', marginTop: '10px' }}>
          Report
        </Button>
      </Form>

      <h3 className="mt-4">List of Business Types</h3>
      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>Business No</th>
            <th>Electoral Area</th>
            <th>Business Name</th>
            <th>Business Type/Profession</th>
            <th>Current Rate (GHC)</th>
          </tr>
        </thead>
        <tbody>
          {businesses.map((business) => (
            <tr key={business.buss_no}>
              <td>{business.buss_no}</td>
              <td>{business.electroral_area.toUpperCase()}</td>
              <td>{business.buss_name.toUpperCase()}</td>
              <td>{business.tot_grade.toUpperCase()}</td>
              <td>{business.current_rate.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <h3 className="mt-4">List of Business Balances</h3>
      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>Business No</th>
            <th>Fiscal Year</th>
            <th>Balance Brought Forward (GHC)</th>
            <th>Current Balance (GHC)</th>
            <th>Property Rate (GHC)</th>
            <th>Total Amount Due (GHC)</th>
            <th>Transaction Date</th>
            <th>Electoral Area</th>
          </tr>
        </thead>
        <tbody>
          {bussCurrBalances.map((balance) => (
            <tr key={balance.buss_no}>
              <td>{balance.buss_no}</td>
              <td>{balance.fiscalyear}</td>
              <td>{balance.balancebf.toFixed(2)}</td>
              <td>{balance.current_balance.toFixed(2)}</td>
              <td>{balance.property_rate.toFixed(2)}</td>
              <td>{balance.totalAmountDue.toFixed(2)}</td>
              <td>{balance.transdate}</td>
              <td>{balance.electoralarea.toUpperCase()}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <h6 className="mt-3" style={{ color: '#C00000' }}>
        MARCORY MUNICIPAL ASSEMBLY
      </h6>
    </Container>
  );
};

export default ClientBalancesForm;


// interface FindBFResponse {
//   balancebf: number;
// }
