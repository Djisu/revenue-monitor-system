import React, { useState, useEffect } from 'react';
import { Button, Form, Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';

interface Officer {
  officer_no: string;
  officer_name: string;
}

interface FiscalYear {
  fiscal_year: number;
}

const OfficerAssessmentForm: React.FC = () => {
  const [fiscalYear, setFiscalYear] = useState('');
  const [firstOfficer, setFirstOfficer] = useState('');
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [fiscalYears, setFiscalYears] = useState<FiscalYear[]>([]);

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

    fetchOfficers();
    fetchFiscalYears();

    // Show alert on form load
    alert("Make sure that client payments are correctly updated else you will not get the report");

  }, []);

  const handleOfficerChange = (event: React.ChangeEvent<HTMLElement>) => {
    const target = event.target as HTMLSelectElement;
    const selectedOfficer = target.value.split(' ')[0];
    setFirstOfficer(selectedOfficer);
  };

  const handleFiscalYearChange = (event: React.ChangeEvent<HTMLElement>) => {
    const target = event.target as HTMLSelectElement;
    setFiscalYear(target.value);
  };

  const handlePreviewClick = async () => {
    if (!fiscalYear) {
      alert("ENTER THE FISCAL YEAR");
      return;
    }

    try {
      const budgetResponse = await axios.get('/api/officer-budget', {
        params: { fiscalYear }
      });

      if (budgetResponse.data.length === 0) {
        alert("You have to set budgets for the collectors before assessing them");
        return;
      }

      await axios.delete('/api/officer-assessment');

      // const processedOfficers = await Promise.all(officers.map(async officer => {
      //   const noOfClientsServed = await findNoOfClientsServed(officer.officer_no);
      //   const valueOfBillsDistributed = await findValueOfBillsDistributed(officer.officer_no);

      //   if (valueOfBillsDistributed === 0) {
      //     alert("No bills found for the fiscal year. Use a previous year");
      //     return null;
      //   }

      //   const januaryAmount = await findJanuaryAmount(officer.officer_no);
      //   const februaryAmount = await findFebruaryAmount(officer.officer_no);
      //   const marchAmount = await findMarchAmount(officer.officer_no);
      //   const aprilAmount = await findAprilAmount(officer.officer_no);
      //   const mayAmount = await findMayAmount(officer.officer_no);
      //   const juneAmount = await findJuneAmount(officer.officer_no);
      //   const julyAmount = await findJulyAmount(officer.officer_no);
      //   const augustAmount = await findAugustAmount(officer.officer_no);
      //   const septemberAmount = await findSeptemberAmount(officer.officer_no);
      //   const octoberAmount = await findOctoberAmount(officer.officer_no);
      //   const novemberAmount = await findNovemberAmount(officer.officer_no);
      //   const decemberAmount = await findDecemberAmount(officer.officer_no);

      //   const totalReceiptToDate = januaryAmount + februaryAmount + marchAmount + aprilAmount +
      //                             mayAmount + juneAmount + julyAmount + augustAmount +
      //                             septemberAmount + octoberAmount + novemberAmount + decemberAmount;

      //   const balance = valueOfBillsDistributed - totalReceiptToDate;
      //   const remarks = (totalReceiptToDate / valueOfBillsDistributed) * 100;

      //   await axios.post('/api/officer-assessment', {
      //     officer_no: officer.officer_no,
      //     officer_name: officer.officer_name,
      //     Noofclientsserved: noOfClientsServed,
      //     valueofbillsdistributed: valueOfBillsDistributed,
      //     bus_year: fiscalYear,
      //     JanuaryAmount: januaryAmount,
      //     FebruaryAmount: februaryAmount,
      //     MarchAmount: marchAmount,
      //     AprilAmount: aprilAmount,
      //     MayAmount: mayAmount,
      //     JuneAmount: juneAmount,
      //     JulyAmount: julyAmount,
      //     AugustAmount: augustAmount,
      //     SeptemberAmount: septemberAmount,
      //     OctoberAmount: octoberAmount,
      //     NovemberAmount: novemberAmount,
      //     DecemberAmount: decemberAmount,
      //     totalReceiptTodate: totalReceiptToDate,
      //     balance: balance,
      //     remarks: remarks
      //   });
      // }));

      const assessmentResponse = await axios.get('/api/officer-assessment');

      if (assessmentResponse.data.length > 0) {
        window.open('/report/REPORT ON MONITORING AND EVALUATION EXERCISE.rpt', '_blank');
        alert(`This is the report for ${fiscalYear}`);
      } else {
        alert("No records found");
      }
    } catch (error) {
      console.error("Error processing preview:", error);
      alert("Error processing preview");
    }
  };

  const handlePrintClick = async () => {
    if (!fiscalYear) {
      alert("ENTER THE FISCAL YEAR");
      return;
    }

    try {
      const budgetResponse = await axios.get('/api/officer-budget-weekly', {
        params: { fiscalYear }
      });

      if (budgetResponse.data.length === 0) {
        alert("You have to set budgets for the collectors before assessing them");
        return;
      }

      await axios.delete('/api/officer-budget-weekly');

      // const processedOfficers = await Promise.all(officers.map(async officer => {
      //   const noOfClientsServed = await findNoOfClientsServed(officer.officer_no);
      //   const valueOfBillsDistributed = await findValueOfBillsDistributed(officer.officer_no);

      //   if (valueOfBillsDistributed === 0) {
      //     alert("No bills found for the fiscal year. Use a previous year");
      //     return null;
      //   }

      //   const januaryAmount = await findJanuaryAmount(officer.officer_no);
      //   const februaryAmount = await findFebruaryAmount(officer.officer_no);
      //   const marchAmount = await findMarchAmount(officer.officer_no);
      //   const aprilAmount = await findAprilAmount(officer.officer_no);
      //   const mayAmount = await findMayAmount(officer.officer_no);
      //   const juneAmount = await findJuneAmount(officer.officer_no);
      //   const julyAmount = await findJulyAmount(officer.officer_no);
      //   const augustAmount = await findAugustAmount(officer.officer_no);
      //   const septemberAmount = await findSeptemberAmount(officer.officer_no);
      //   const octoberAmount = await findOctoberAmount(officer.officer_no);
      //   const novemberAmount = await findNovemberAmount(officer.officer_no);
      //   const decemberAmount = await findDecemberAmount(officer.officer_no);

      //   const totalReceiptToDate = januaryAmount + februaryAmount + marchAmount + aprilAmount +
      //                             mayAmount + juneAmount + julyAmount + augustAmount +
      //                             septemberAmount + octoberAmount + novemberAmount + decemberAmount;

      //   const balance = valueOfBillsDistributed - totalReceiptToDate;
      //   const remarks = (totalReceiptToDate / valueOfBillsDistributed) * 100;

      //   await axios.post('/api/officer-budget-weekly', {
      //     officer_no: officer.officer_no,
      //     officer_name: officer.officer_name,
      //     Noofclientsserved: noOfClientsServed,
      //     valueofbillsdistributed: valueOfBillsDistributed,
      //     bus_year: fiscalYear,
      //     JanuaryAmountweek1: 0, JanuaryAmountweek2: 0, JanuaryAmountweek3: 0, JanuaryAmountweek4: 0,
      //     FebruaryAmountweek1: 0, FebruaryAmountweek2: 0, FebruaryAmountweek3: 0, FebruaryAmountweek4: 0,
      //     MarchAmountweek1: 0, MarchAmountweek2: 0, MarchAmountweek3: 0, MarchAmountweek4: 0,
      //     AprilAmountweek1: 0, AprilAmountweek2: 0, AprilAmountweek3: 0, AprilAmountweek4: 0,
      //     MayAmountweek1: 0, MayAmountweek2: 0, MayAmountweek3: 0, MayAmountweek4: 0,
      //     JuneAmountweek1: 0, JuneAmountweek2: 0, JuneAmountweek3: 0, JuneAmountweek4: 0,
      //     JulyAmountweek1: 0, JulyAmountweek2: 0, JulyAmountweek3: 0, JulyAmountweek4: 0,
      //     AugustAmountweek1: 0, AugustAmountweek2: 0, AugustAmountweek3: 0, AugustAmountweek4: 0,
      //     SeptemberAmountweek1: 0, SeptemberAmountweek2: 0, SeptemberAmountweek3: 0, SeptemberAmountweek4: 0,
      //     OctoberAmountweek1: 0, OctoberAmountweek2: 0, OctoberAmountweek3: 0, OctoberAmountweek4: 0,
      //     NovemberAmountweek1: 0, NovemberAmountweek2: 0, NovemberAmountweek3: 0, NovemberAmountweek4: 0,
      //     DecemberAmountweek1: 0, DecemberAmountweek2: 0, DecemberAmountweek3: 0, DecemberAmountweek4: 0,
      //     totalReceiptTodate: totalReceiptToDate,
      //     balance: balance,
      //     remarks: remarks
      //   });
      // }));

      const weeklyBudgetResponse = await axios.get('/api/officer-budget-weekly');

      if (weeklyBudgetResponse.data.length > 0) {
        window.open('/report/REPORT ON MONITORING AND EVALUATION EXERCISE WEEKLY.rpt', '_blank');
        alert(`This is the report for ${fiscalYear}`);
      } else {
        alert("No records found");
      }
    } catch (error) {
      console.error("Error processing print:", error);
      alert("Error processing print");
    }
  };

  const handleExitClick = () => {
    // Assuming you have a way to navigate back to the main page
    window.location.href = '/'; // Redirect to main page or wherever you want
  };

  // const findNoOfClientsServed = async (officerNo: string): Promise<number> => {
  //   try {
  //     const response = await axios.get('/api/no-of-clients-served', {
  //       params: { officerNo, fiscalYear }
  //     });
  //     return response.data || 0;
  //   } catch (error) {
  //     console.error("Error fetching no of clients served:", error);
  //     return 0;
  //   }
  // };

  // const findValueOfBillsDistributed = async (officerNo: string): Promise<number> => {
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

  // const findJanuaryAmount = async (officerNo: string): Promise<number> => {
  //   return findMonthlyAmount(officerNo, '1', 'January');
  // };

  // const findFebruaryAmount = async (officerNo: string): Promise<number> => {
  //   return findMonthlyAmount(officerNo, '2', 'February');
  // };

  // const findMarchAmount = async (officerNo: string): Promise<number> => {
  //   return findMonthlyAmount(officerNo, '3', 'March');
  // };

  // const findAprilAmount = async (officerNo: string): Promise<number> => {
  //   return findMonthlyAmount(officerNo, '4', 'April');
  // };

  // const findMayAmount = async (officerNo: string): Promise<number> => {
  //   return findMonthlyAmount(officerNo, '5', 'May');
  // };

  // const findJuneAmount = async (officerNo: string): Promise<number> => {
  //   return findMonthlyAmount(officerNo, '6', 'June');
  // };

  // const findJulyAmount = async (officerNo: string): Promise<number> => {
  //   return findMonthlyAmount(officerNo, '7', 'July');
  // };

  // const findAugustAmount = async (officerNo: string): Promise<number> => {
  //   return findMonthlyAmount(officerNo, '8', 'August');
  // };

  // const findSeptemberAmount = async (officerNo: string): Promise<number> => {
  //   return findMonthlyAmount(officerNo, '9', 'September');
  // };

  // const findOctoberAmount = async (officerNo: string): Promise<number> => {
  //   return findMonthlyAmount(officerNo, '10', 'October');
  // };

  // const findNovemberAmount = async (officerNo: string): Promise<number> => {
  //   return findMonthlyAmount(officerNo, '11', 'November');
  // };

  // const findDecemberAmount = async (officerNo: string): Promise<number> => {
  //   return findMonthlyAmount(officerNo, '12', 'December');
  // };

  // const findMonthlyAmount = async (officerNo: string, month: string, monthName: string): Promise<number> => {
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
        <Col>
          <Form.Group controlId="formFiscalYear">
            <Form.Label>First Fiscal Year:</Form.Label>
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
          <Form.Group controlId="formFirstOfficer">
            <Form.Label>First Officer:</Form.Label>
            <Form.Control as="select" value={firstOfficer} onChange={handleOfficerChange}>
              <option value="">Select an officer</option>
              {officers.map(officer => (
                <option key={officer.officer_no} value={`${officer.officer_no} ${officer.officer_name}`}>
                  {officer.officer_no} {officer.officer_name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col className="text-center">
          <Button variant="primary" onClick={handlePreviewClick}>
            Preview Monitoring Report (Monthly)
          </Button>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col className="text-center">
          <Button variant="success" onClick={handlePrintClick}>
            Print Monitoring Report (Weekly)
          </Button>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col className="text-center">
          <Button variant="secondary" onClick={handleExitClick}>
            Exit
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default OfficerAssessmentForm;
