import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface FiscalYear {
  fiscal_year: number;
}

interface Officer {
  officer_no: string;
  officer_name: string;
}

interface OfficerBudget {
  januaryAmount: number;
  februaryAmount: number;
  marchAmount: number;
  aprilAmount: number;
  mayAmount: number;
  juneAmount: number;
  julyAmount: number;
  augustAmount: number;
  septemberAmount: number;
  octoberAmount: number;
  novemberAmount: number;
  decemberAmount: number;
  totalValue: number;
}

const OfficerBudgetAssessment: React.FC = () => {
  const [firstFiscalYear, setFirstFiscalYear] = useState<number | ''>('');
  const [firstOfficer, setFirstOfficer] = useState<string>('');
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

  const handleExitClick = () => {
    // Replace this with the appropriate logic to handle exit
    alert('Exit clicked');
  };

  const handlePreviewClick = async () => {
    try {
      const response = await axios.get<OfficerBudget[]>('/api/officerbudget', {
        params: { fiscalYear: firstFiscalYear, officerNo: firstOfficer }
      });

      if (response.data.length === 0) {
        alert('You have to set budgets for the collects before assessing them');
        return;
      }

      await axios.delete('/api/budgetAssess');

      const assessmentData = response.data.map(officer => {
        const varMonthlyValue = officer.totalValue / 12;
        return [
          { month: 'January', amount: officer.januaryAmount, budget: varMonthlyValue },
          { month: 'February', amount: officer.februaryAmount, budget: varMonthlyValue },
          { month: 'March', amount: officer.marchAmount, budget: varMonthlyValue },
          { month: 'April', amount: officer.aprilAmount, budget: varMonthlyValue },
          { month: 'May', amount: officer.mayAmount, budget: varMonthlyValue },
          { month: 'June', amount: officer.juneAmount, budget: varMonthlyValue },
          { month: 'July', amount: officer.julyAmount, budget: varMonthlyValue },
          { month: 'August', amount: officer.augustAmount, budget: varMonthlyValue },
          { month: 'September', amount: officer.septemberAmount, budget: varMonthlyValue },
          { month: 'October', amount: officer.octoberAmount, budget: varMonthlyValue },
          { month: 'November', amount: officer.novemberAmount, budget: varMonthlyValue },
          { month: 'December', amount: officer.decemberAmount, budget: varMonthlyValue },
        ];
      }).flat();

      await axios.post('/api/budgetAssess', assessmentData);

      // Replace this with the appropriate logic to display the report
      alert('Monitoring Report Previewed');
    } catch (error) {
      alert((error as Error).message);
    }
  };

  return (
    <div style={{ backgroundColor: '#FFC0C0', height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h1 style={{ textDecoration: 'underline', color: '#0000C0', fontSize: '24px' }}>MARCORY MUNICIPAL ASSEMBLY</h1>
      <h2 style={{ textDecoration: 'underline', color: '#400000', fontSize: '20px' }}>Collector Performance Trend</h2>
      <div style={{ marginTop: '20px' }}>
        <label style={{ marginRight: '10px', fontWeight: 'bold' }}>First Fiscal Year:</label>
        <select value={firstFiscalYear} onChange={handleFirstFiscalYearChange}>
          <option value="">Select</option>
          {fiscalYears.map(year => (
            <option key={year.fiscal_year} value={year.fiscal_year}>{year.fiscal_year}</option>
          ))}
        </select>
      </div>
      <div style={{ marginTop: '20px' }}>
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

export default OfficerBudgetAssessment;
