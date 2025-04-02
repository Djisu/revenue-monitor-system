import React, { useState, useEffect } from 'react';
import {useAppDispatch, useAppSelector} from '../../app/store'

import { Link } from 'react-router-dom';
import { fetchOfficerAssessment } from './officerAssessmentSlice';
import { fetchOfficers } from '../officer/officerSlice'; 
import { Bar } from 'react-chartjs-2';

// interface FiscalYear {
//   fiscal_year: number;
// }

// interface Officer {
//   officer_no: string;
//   officer_name: string;
// }

export interface OfficerAssessment {
  officer_no: string;
  officer_name: string;
  Noofclientsserved: number;
  valueofbillsdistributed: number;
  bus_year: number;

  januaryamount?: number;
  februaryamount?: number;
  marchamount?: number;
  aprilamount?: number;
  mayamount?: number;
  juneamount?: number;
  julyamount?: number;
  augustamount?: number;
  septemberamount?: number;
  octoberamount?: number;
  novemberamount?: number;
  decemberamount?: number;

  totalreceiptstodate?: number;
  balance?: number;
  remarks?: string;
  
  totalValue: number; // Add this line 
} 


interface fetchParamsInt {
  fiscalYear: number,
  officerNo: string,
}

const OfficerBudgetAssessment: React.FC = () => {
  let [firstFiscalDate, setFirstFiscalDate] = useState<string>('');
  let [firstOfficer, setFirstOfficer] = useState<string>('');
  let [fiscalYear, setFiscalYear] = useState<number>(0);
  //let [fiscalYears, setFiscalYears] = useState<FiscalYear[]>([]);
  //let [officers, setOfficers] = useState<Officer[]>([]);
  let [assessmentData, setAssessmentData] = useState<{ month: string; amount: number; }[]>([]);

  let officersData = useAppSelector((state) => state.officer.officers);

  const dispatch = useAppDispatch()

  useEffect(() => {
    // Log assessment data whenever it changes
    console.log('Updated Assessment Data: ', assessmentData);
}, [assessmentData]);

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(fetchOfficers());
    };

    fetchData();
  }, [dispatch]);

  const handleFirstFiscalDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFirstFiscalDate(event.target.value);
  };

  const handleFirstOfficerChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const target = event.target as HTMLSelectElement;
    const selectedOfficer = target.value.split(' ')[0];
    setFirstOfficer(selectedOfficer);
  };

  // const handleExitClick = () => {
  //   // Replace this with the appropriate logic to handle exit
  //   alert('Exit clicked');
  // };

  const handlePreviewClick = async () => {
    let fiscalYearx = new Date(firstFiscalDate).getFullYear()
    fiscalYear = fiscalYearx
    setFiscalYear(fiscalYear)

    const fetchParams: fetchParamsInt = {    
       fiscalYear: fiscalYear, officerNo: firstOfficer 
    }
    try {
      const action = await dispatch(fetchOfficerAssessment(fetchParams));

      // Check if the action was fulfilled
      if (fetchOfficerAssessment.fulfilled.match(action)) {
          const response: OfficerAssessment  = action.payload; // Extract the payload

          if (!response) {
              alert('You have to set budgets for the collects before assessing them');
              return;
          }

          console.log('RESPONSE: ', response.januaryamount, response.februaryamount, response.marchamount, 
          response.aprilamount, response.mayamount, response.juneamount, response.julyamount, response.augustamount, 
          response.septemberamount, response.octoberamount, response.novemberamount, response.decemberamount) 

          // Proceed with your logic using the response
          // await axios.delete('/api/budgetAssess');

          // const varMonthlyValue = response.totalValue / 12;

          const data = [
            { month: 'January', amount: response.januaryamount || 0 },
            { month: 'February', amount: response.februaryamount || 0 },
            { month: 'March', amount: response.marchamount || 0 },
            { month: 'April', amount: response.aprilamount || 0 },
            { month: 'May', amount: response.mayamount || 0 },
            { month: 'June', amount: response.juneamount || 0 },
            { month: 'July', amount: response.julyamount || 0 },
            { month: 'August', amount: response.augustamount || 0 },
            { month: 'September', amount: response.septemberamount || 0 },
            { month: 'October', amount: response.octoberamount || 0 },
            { month: 'November', amount: response.novemberamount || 0 },
            { month: 'December', amount: response.decemberamount || 0 },
          ];
          setAssessmentData(data);
      } else {
          alert('Failed to fetch officer assessment: ' + action.error.message);
      }
  } catch (error) {
      alert((error as Error).message);
  }
  };

  const barColors = [
    'rgba(75, 192, 192, 0.6)', // January
    'rgba(153, 102, 255, 0.6)', // February
    'rgba(255, 159, 64, 0.6)', // March
    'rgba(255, 99, 132, 0.6)', // April
    'rgba(54, 162, 235, 0.6)', // May
    'rgba(255, 206, 86, 0.6)', // June
    'rgba(75, 192, 192, 0.6)', // July
    'rgba(201, 203, 207, 0.6)', // August
    'rgba(255, 99, 132, 0.6)', // September
    'rgba(54, 162, 235, 0.6)', // October
    'rgba(255, 206, 86, 0.6)', // November
    'rgba(153, 102, 255, 0.6)', // December
];

  return (
    <div style={{ backgroundColor: 'white', height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h1>MARCORY MUNICIPAL ASSEMBLY</h1>
      <h2>Collector Performance Trend</h2>
      <div style={{ marginTop: '20px' }}>
        <label style={{ marginRight: '10px', fontWeight: 'bold' }}>First Fiscal Year:</label>
        <input
          type="date"
          value={firstFiscalDate}
          onChange={handleFirstFiscalDateChange}
          style={{ marginRight: '10px' }}
        />
      </div>
      <div style={{ marginTop: '20px' }}>
        <label style={{ marginRight: '10px', fontWeight: 'bold' }}>First Officer:</label>
        <select value={firstOfficer} onChange={handleFirstOfficerChange}>
          <option value="">Select</option>
           {officersData.map(officer => (
                <option key={officer.officer_no} value={`${officer.officer_no} ${officer.officer_name}`}>
                 {officer.officer_no}  {officer.officer_name}
                </option>
              ))}
          {/* {officers.map(officer => (
            <option key={officer.officer_no} value={officer.officer_no}>{officer.officer_no} - {officer.officer_name}</option>
          ))} */}
        </select>
      </div>
      <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-around', width: '50%' }}>
        <button style={{ fontWeight: 'bold', backgroundColor: 'gray', }} onClick={handlePreviewClick}>Preview Monitoring Report (Monthly)</button>
        {/* <button style={{ fontWeight: 'bold' }} onClick={handleExitClick}>Exit</button> */}
      </div>
           
      <Link to="/main" className="primary m-3">
          Go Back
      </Link>
        {/* Render the chart and table if assessment data is available */}
        {assessmentData.length > 0 && (
    <div style={{ width: '80%', marginTop: '30px' }}>
        <h3>Monthly Amount Assessment</h3>
        <Bar 
          data={{
              labels: assessmentData.map(item => item.month),
              datasets: [
                  {
                      label: 'Amount',
                      data: assessmentData.map(item => item.amount),
                      backgroundColor: barColors, // Use the array of colors
                      borderColor: barColors.map(color => color.replace('0.6', '1')), // Make borders fully opaque
                      borderWidth: 1,
                  },
              ],
          }} 
          options={{ scales: { y: { beginAtZero: true } } }} 
      />
        <table style={{ marginTop: '20px', width: '100%', borderCollapse: 'collapse' }}>
            <thead>
                <tr>
                    <th style={{ border: '1px solid #000', padding: '8px' }}>Month</th>
                    <th style={{ border: '1px solid #000', padding: '8px' }}>Amount</th>
                </tr>
            </thead>
            <tbody>
                {assessmentData.map((item, index) => (
                    <tr key={index}>
                        <td style={{ border: '1px solid #000', padding: '8px' }}>{item.month}</td>
                        <td style={{ border: '1px solid #000', padding: '8px' }}>{item.amount}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
)}
    </div>
  );
};

export default OfficerBudgetAssessment;
