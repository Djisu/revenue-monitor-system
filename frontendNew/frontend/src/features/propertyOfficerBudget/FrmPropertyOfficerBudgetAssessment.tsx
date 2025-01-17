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

const PropertyOfficerBudgetAssessmentForm: React.FC = () => {
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

  const handleFirstFiscalYearChange = (event: React.ChangeEvent<HTMLElement>) => {
    const target = event.target as HTMLSelectElement;
    setFiscalYear(target.value);
  };

  const handleFirstOfficerChange = (event: React.ChangeEvent<HTMLElement>) => {
    const target = event.target as HTMLSelectElement;
    const selectedOfficer = target.value.split(' ')[0];
    setFirstOfficer(selectedOfficer);
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

      await axios.delete('/api/budget-assess');

      for (const officer of officers) {
        const valueOfBillsDistributed = await findValueOfBillsDistributed(officer.officer_no);
        const januaryAmount = await findJanuaryAmount(officer.officer_no);
        const februaryAmount = await findFebruaryAmount(officer.officer_no);
        const marchAmount = await findMarchAmount(officer.officer_no);
        const aprilAmount = await findAprilAmount(officer.officer_no);
        const mayAmount = await findMayAmount(officer.officer_no);
        const juneAmount = await findJuneAmount(officer.officer_no);
        const julyAmount = await findJulyAmount(officer.officer_no);
        const augustAmount = await findAugustAmount(officer.officer_no);
        const septemberAmount = await findSeptemberAmount(officer.officer_no);
        const octoberAmount = await findOctoberAmount(officer.officer_no);
        const novemberAmount = await findNovemberAmount(officer.officer_no);
        const decemberAmount = await findDecemberAmount(officer.officer_no);

        const monthlyValue = valueOfBillsDistributed / 12;

        if (januaryAmount > 0) {
          await axios.post('/api/budget-assess', {
            month: 'January',
            budget: monthlyValue,
            amount: januaryAmount,
            variance: monthlyValue - januaryAmount,
            fiscalyear: fiscalYear,
            assessmentby: officer.officer_name
          });
        }

        if (februaryAmount > 0) {
          await axios.post('/api/budget-assess', {
            month: 'February',
            budget: monthlyValue,
            amount: februaryAmount,
            variance: monthlyValue - februaryAmount,
            fiscalyear: fiscalYear,
            assessmentby: officer.officer_name
          });
        }

        if (marchAmount > 0) {
          await axios.post('/api/budget-assess', {
            month: 'March',
            budget: monthlyValue,
            amount: marchAmount,
            variance: monthlyValue - marchAmount,
            fiscalyear: fiscalYear,
            assessmentby: officer.officer_name
          });
        }

        if (aprilAmount > 0) {
          await axios.post('/api/budget-assess', {
            month: 'April',
            budget: monthlyValue,
            amount: aprilAmount,
            variance: monthlyValue - aprilAmount,
            fiscalyear: fiscalYear,
            assessmentby: officer.officer_name
          });
        }

        if (mayAmount > 0) {
          await axios.post('/api/budget-assess', {
            month: 'May',
            budget: monthlyValue,
            amount: mayAmount,
            variance: monthlyValue - mayAmount,
            fiscalyear: fiscalYear,
            assessmentby: officer.officer_name
          });
        }

        if (juneAmount > 0) {
          await axios.post('/api/budget-assess', {
            month: 'June',
            budget: monthlyValue,
            amount: juneAmount,
            variance: monthlyValue - juneAmount,
            fiscalyear: fiscalYear,
            assessmentby: officer.officer_name
          });
        }

        if (julyAmount > 0) {
          await axios.post('/api/budget-assess', {
            month: 'July',
            budget: monthlyValue,
            amount: julyAmount,
            variance: monthlyValue - julyAmount,
            fiscalyear: fiscalYear,
            assessmentby: officer.officer_name
          });
        }

        if (augustAmount > 0) {
          await axios.post('/api/budget-assess', {
            month: 'August',
            budget: monthlyValue,
            amount: augustAmount,
            variance: monthlyValue - augustAmount,
            fiscalyear: fiscalYear,
            assessmentby: officer.officer_name
          });
        }

        if (septemberAmount > 0) {
          await axios.post('/api/budget-assess', {
            month: 'September',
            budget: monthlyValue,
            amount: septemberAmount,
            variance: monthlyValue - septemberAmount,
            fiscalyear: fiscalYear,
            assessmentby: officer.officer_name
          });
        }

        if (octoberAmount > 0) {
          await axios.post('/api/budget-assess', {
            month: 'October',
            budget: monthlyValue,
            amount: octoberAmount,
            variance: monthlyValue - octoberAmount,
            fiscalyear: fiscalYear,
            assessmentby: officer.officer_name
          });
        }

        if (novemberAmount > 0) {
          await axios.post('/api/budget-assess', {
            month: 'November',
            budget: monthlyValue,
            amount: novemberAmount,
            variance: monthlyValue - novemberAmount,
            fiscalyear: fiscalYear,
            assessmentby: officer.officer_name
          });
        }

        if (decemberAmount > 0) {
          await axios.post('/api/budget-assess', {
            month: 'December',
            budget: monthlyValue,
            amount: decemberAmount,
            variance: monthlyValue - decemberAmount,
            fiscalyear: fiscalYear,
            assessmentby: officer.officer_name
          });
        }
      }

      const assessmentResponse = await axios.get('/api/budget-assess');

      if (assessmentResponse.data.length > 0) {
        window.open('/report/Property Collector Perfomance Trend.rpt', '_blank');
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

      for (const officer of officers) {
        const valueOfBillsDistributed = await findValueOfBillsDistributed(officer.officer_no);
        const januaryAmount = await findJanuaryAmount(officer.officer_no);
        const februaryAmount = await findFebruaryAmount(officer.officer_no);
        const marchAmount = await findMarchAmount(officer.officer_no);
        const aprilAmount = await findAprilAmount(officer.officer_no);
        const mayAmount = await findMayAmount(officer.officer_no);
        const juneAmount = await findJuneAmount(officer.officer_no);
        const julyAmount = await findJulyAmount(officer.officer_no);
        const augustAmount = await findAugustAmount(officer.officer_no);
        const septemberAmount = await findSeptemberAmount(officer.officer_no);
        const octoberAmount = await findOctoberAmount(officer.officer_no);
        const novemberAmount = await findNovemberAmount(officer.officer_no);
        const decemberAmount = await findDecemberAmount(officer.officer_no);

        const monthlyValue = valueOfBillsDistributed / 12;

        if (januaryAmount > 0) {
          await axios.post('/api/officer-budget-weekly', {
            month: 'January',
            budget: monthlyValue,
            amount: januaryAmount,
            variance: monthlyValue - januaryAmount,
            fiscalyear: fiscalYear,
            assessmentby: officer.officer_name
          });
        }

        if (februaryAmount > 0) {
          await axios.post('/api/officer-budget-weekly', {
            month: 'February',
            budget: monthlyValue,
            amount: februaryAmount,
            variance: monthlyValue - februaryAmount,
            fiscalyear: fiscalYear,
            assessmentby: officer.officer_name
          });
        }

        if (marchAmount > 0) {
          await axios.post('/api/officer-budget-weekly', {
            month: 'March',
            budget: monthlyValue,
            amount: marchAmount,
            variance: monthlyValue - marchAmount,
            fiscalyear: fiscalYear,
            assessmentby: officer.officer_name
          });
        }

        if (aprilAmount > 0) {
          await axios.post('/api/officer-budget-weekly', {
            month: 'April',
            budget: monthlyValue,
            amount: aprilAmount,
            variance: monthlyValue - aprilAmount,
            fiscalyear: fiscalYear,
            assessmentby: officer.officer_name
          });
        }

        if (mayAmount > 0) {
          await axios.post('/api/officer-budget-weekly', {
            month: 'May',
            budget: monthlyValue,
            amount: mayAmount,
            variance: monthlyValue - mayAmount,
            fiscalyear: fiscalYear,
            assessmentby: officer.officer_name
          });
        }

        if (juneAmount > 0) {
          await axios.post('/api/officer-budget-weekly', {
            month: 'June',
            budget: monthlyValue,
            amount: juneAmount,
            variance: monthlyValue - juneAmount,
            fiscalyear: fiscalYear,
            assessmentby: officer.officer_name
          });
        }

        if (julyAmount > 0) {
          await axios.post('/api/officer-budget-weekly', {
            month: 'July',
            budget: monthlyValue,
            amount: julyAmount,
            variance: monthlyValue - julyAmount,
            fiscalyear: fiscalYear,
            assessmentby: officer.officer_name
          });
        }

        if (augustAmount > 0) {
          await axios.post('/api/officer-budget-weekly', {
            month: 'August',
            budget: monthlyValue,
            amount: augustAmount,
            variance: monthlyValue - augustAmount,
            fiscalyear: fiscalYear,
            assessmentby: officer.officer_name
          });
        }

        if (septemberAmount > 0) {
          await axios.post('/api/officer-budget-weekly', {
            month: 'September',
            budget: monthlyValue,
            amount: septemberAmount,
            variance: monthlyValue - septemberAmount,
            fiscalyear: fiscalYear,
            assessmentby: officer.officer_name
          });
        }

        if (octoberAmount > 0) {
          await axios.post('/api/officer-budget-weekly', {
            month: 'October',
            budget: monthlyValue,
            amount: octoberAmount,
            variance: monthlyValue - octoberAmount,
            fiscalyear: fiscalYear,
            assessmentby: officer.officer_name
          });
        }

        if (novemberAmount > 0) {
          await axios.post('/api/officer-budget-weekly', {
            month: 'November',
            budget: monthlyValue,
            amount: novemberAmount,
            variance: monthlyValue - novemberAmount,
            fiscalyear: fiscalYear,
            assessmentby: officer.officer_name
          });
        }

        if (decemberAmount > 0) {
          await axios.post('/api/officer-budget-weekly', {
            month: 'December',
            budget: monthlyValue,
            amount: decemberAmount,
            variance: monthlyValue - decemberAmount,
            fiscalyear: fiscalYear,
            assessmentby: officer.officer_name
          });
        }
      }

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

  const findValueOfBillsDistributed = async (officerNo: string): Promise<number> => {
    try {
      const response = await axios.get('/api/value-of-bills-distributed', {
        params: { officerNo, fiscalYear }
      });
      return response.data || 0;
    } catch (error) {
      console.error("Error fetching value of bills distributed:", error);
      return 0;
    }
  };

  const findMonthlyAmount = async (officerNo: string, month: string, monthName: string): Promise<number> => {
    try {
      const response = await axios.get('/api/monthly-amount', {
        params: { officerNo, fiscalYear, month, monthName }
      });
      return response.data || 0;
    } catch (error) {
      console.error(`Error fetching amount for ${monthName}:`, error);
      return 0;
    }
  };

  const findJanuaryAmount = async (officerNo: string) => {
    return findMonthlyAmount(officerNo, '1', 'January');
  };

  const findFebruaryAmount = async (officerNo: string) => {
    return findMonthlyAmount(officerNo, '2', 'February');
  };

  const findMarchAmount = async (officerNo: string) => {
    return findMonthlyAmount(officerNo, '3', 'March');
  };

  const findAprilAmount = async (officerNo: string) => {
    return findMonthlyAmount(officerNo, '4', 'April');
  };

  const findMayAmount = async (officerNo: string) => {
    return findMonthlyAmount(officerNo, '5', 'May');
  };

  const findJuneAmount = async (officerNo: string) => {
    return findMonthlyAmount(officerNo, '6', 'June');
  };

  const findJulyAmount = async (officerNo: string) => {
    return findMonthlyAmount(officerNo, '7', 'July');
  };

  const findAugustAmount = async (officerNo: string) => {
    return findMonthlyAmount(officerNo, '8', 'August');
  };

  const findSeptemberAmount = async (officerNo: string) => {
    return findMonthlyAmount(officerNo, '9', 'September');
  };

  const findOctoberAmount = async (officerNo: string) => {
    return findMonthlyAmount(officerNo, '10', 'October');
  };

  const findNovemberAmount = async (officerNo: string) => {
    return findMonthlyAmount(officerNo, '11', 'November');
  };

  const findDecemberAmount = async (officerNo: string) => {
    return findMonthlyAmount(officerNo, '12', 'December');
  };

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
            <Form.Control as="select" value={fiscalYear} onChange={handleFirstFiscalYearChange}>
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
            <Form.Control as="select" value={firstOfficer} onChange={handleFirstOfficerChange}>
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

export default PropertyOfficerBudgetAssessmentForm;
