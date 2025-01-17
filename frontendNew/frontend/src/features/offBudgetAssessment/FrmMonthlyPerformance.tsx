import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface FiscalYear {
  fiscal_year: number;
}

interface Officer {
  officer_no: string;
  officer_name: string;
}

interface OfficerMonthlyPerformance {
  officer_name: string;
  month: string;
  amount: number;
  fiscalyear: number;
}

const OfficerMonthlyPerformance: React.FC = () => {
  const [firstFiscalYear, setFirstFiscalYear] = useState<number | ''>('');
  const [firstOfficer, setFirstOfficer] = useState<string>('');
  const [monthPaid, setMonthPaid] = useState<string>('');
  const [fiscalYears, setFiscalYears] = useState<FiscalYear[]>([]);
  const [officers, setOfficers] = useState<Officer[]>([]);

  useEffect(() => {
    fetchFiscalYears();
    fetchOfficers();
  }, []);

  const fetchFiscalYears = async () => {
    try {
      const response = await axios.get<FiscalYear[]>('/api/fiscalYears');
      setFiscalYears(response.data);
    } catch (error) {
      alert((error as Error).message);
    }
  };

  const fetchOfficers = async () => {
    try {
      const response = await axios.get<Officer[]>('/api/officers');
      setOfficers(response.data);
    } catch (error) {
      alert((error as Error).message);
    }
  };

  const handleFirstFiscalYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFirstFiscalYear(Number(event.target.value));
  };

  const handleFirstOfficerChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFirstOfficer(event.target.value);
  };

  const handleMonthPaidChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setMonthPaid(event.target.value);
  };

  const handleExitClick = () => {
    // Replace this with the appropriate logic to handle exit
    alert('Exit clicked');
  };

  const handlePreviewClick = async () => {
    try {
      if (!firstFiscalYear || !monthPaid) {
        alert('Please select First Fiscal Year and Month Paid');
        return;
      }

      await axios.delete('/api/officerMonthAssess');

      const response = await axios.get<Officer[]>('/api/officers');
      const officerMonthlyPerformances: OfficerMonthlyPerformance[] = [];

      for (const officer of response.data) {
        const recofficerResponse = await axios.get<{ totsum: number | null }>('/api/amountByOfficerAndMonth', {
          params: { officerNo: officer.officer_no, fiscalYear: firstFiscalYear, monthPaid: monthPaid }
        });

        if (recofficerResponse.data.totsum && recofficerResponse.data.totsum > 0) {
          officerMonthlyPerformances.push({
            officer_name: officer.officer_name,
            month: monthPaid,
            amount: recofficerResponse.data.totsum!,
            fiscalyear: firstFiscalYear
          });
        }
      }

      if (officerMonthlyPerformances.length > 0) {
        await axios.post('/api/officerMonthAssess', officerMonthlyPerformances);

        // Replace this with the appropriate logic to display the report
        alert('Monitoring Report Previewed');
      } else {
        alert('No records found');
      }
    } catch (error) {
      alert((error as Error).message);
    }
  };

  return (
    <div style={{ backgroundColor: '#FFC0C0', height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
      <h1 style={{ textDecoration: 'underline', color: '#0000C0', fontSize: '24px' }}>MARCORY MUNICIPAL ASSEMBLY</h1>
      <h2 style={{ textDecoration: 'underline', color: '#400000', fontSize: '20px' }}>Collector Monthly Performance Trend</h2>
      <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center' }}>
        <label style={{ marginRight: '10px', fontWeight: 'bold' }}>First Fiscal Year:</label>
        <select value={firstFiscalYear} onChange={handleFirstFiscalYearChange}>
          <option value="">Select</option>
          {fiscalYears.map(year => (
            <option key={year.fiscal_year} value={year.fiscal_year}>{year.fiscal_year}</option>
          ))}
        </select>
      </div>
      <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center' }}>
        <label style={{ marginRight: '10px', fontWeight: 'bold' }}>Month:</label>
        <select value={monthPaid} onChange={handleMonthPaidChange}>
          <option value="">Select</option>
          <option value="January">January</option>
          <option value="February">February</option>
          <option value="March">March</option>
          <option value="April">April</option>
          <option value="May">May</option>
          <option value="June">June</option>
          <option value="July">July</option>
          <option value="August">August</option>
          <option value="September">September</option>
          <option value="October">October</option>
          <option value="November">November</option>
          <option value="December">December</option>
        </select>
      </div>
      <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center' }}>
        <label style={{ marginRight: '10px', fontWeight: 'bold' }}>First Officer:</label>
        <select value={firstOfficer} onChange={handleFirstOfficerChange}>
          <option value="">Select</option>
          {officers.map(officer => (
            <option key={officer.officer_no} value={officer.officer_no}>{officer.officer_no} - {officer.officer_name}</option>
          ))}
        </select>
      </div>
      <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-around', width: '50%' }}>
        <button style={{ fontWeight: 'bold' }} onClick={handlePreviewClick}>Preview Monitoring Report (Monthly)</button>
        <button style={{ fontWeight: 'bold' }} onClick={handleExitClick}>Exit</button>
      </div>
    </div>
  );
};

export default OfficerMonthlyPerformance;
