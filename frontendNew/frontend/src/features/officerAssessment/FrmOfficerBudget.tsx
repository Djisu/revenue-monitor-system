import React, { useState, useEffect } from 'react';
import { Button, Form, Container, Row, Col, Table } from 'react-bootstrap';
import axios from 'axios';

interface Officer {
  officer_no: string;
  officer_name: string;
  electoral_area: string;
}

interface OfficerBudget {
  officer_no: string;
  officer_name: string;
  fiscal_year: number;
  annual_budget: number;
  monthly_budget: number;
  January_budget: number;
  January_Actual: number;
  February_budget: number;
  February_Actual: number;
  March_budget: number;
  March_Actual: number;
  April_budget: number;
  April_Actual: number;
  May_budget: number;
  May_Actual: number;
  June_budget: number;
  June_Actual: number;
  July_budget: number;
  July_Actual: number;
  August_budget: number;
  August_Actual: number;
  September_budget: number;
  September_Actual: number;
  October_budget: number;
  October_Actual: number;
  November_budget: number;
  November_Actual: number;
  December_budget: number;
  December_Actual: number;
  Actual_total: number;
  outstanding: number;
  electoral_area: string;
}

const FrmOfficerBudget: React.FC = () => {
  const [fiscalYear, setFiscalYear] = useState<number>(0);

  const [annualBudget, setAnnualBudget] = useState<number | null>(null);
  const [monthlyBudget, setMonthlyBudget] = useState<number | null>(null);
  const [weeklyBudget, setWeeklyBudget] = useState<number | null >(null);

  const [electoralArea, setElectoralArea] = useState('');
  const [officerName, setOfficerName] = useState('');
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [officerBudgets, setOfficerBudgets] = useState<OfficerBudget[]>([]);
  const [electoralQuantity, setElectoralQuantity] = useState<number>(0);

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

    // Populate ListView on form load
    const populateListView = async () => {
      try {
        const response = await axios.get('/api/officer-budgets');
        setOfficerBudgets(response.data);
      } catch (error) {
        console.error("Error fetching officer budgets:", error);
        alert("No records found to feed the listview");
      }
    };

    // Update current rate on form load
    const updateCurrentRate = async () => {
      try {
        await axios.post('/api/update-current-rate');
      } catch (error) {
        console.error("Error updating current rate:", error);
        alert("Error updating current rate");
      }
    };

    fetchOfficers();
    populateListView();
    updateCurrentRate();
  }, [fiscalYear, electoralArea]);

  const handleOfficerNoChange = async (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
   
    const selectedValue = event.target.value; // Get the selected value
    const [selectedOfficerNo, selectedOfficerName, selectedElectoralArea] = selectedValue.split(' ');

    setElectoralArea(selectedElectoralArea);
    setOfficerName(selectedOfficerName);

    try {
      const response = await axios.get('/api/electoral-areas', {
        params: { officerNo: selectedOfficerNo }
      });

      if (response.data) {
        setElectoralArea(response.data[0].electoral_area);
      } else {
        alert("No electoral area found for the selected officer");
      }
    } catch (error) {
      console.error("Error fetching electoral areas:", error);
      alert("Error fetching electoral areas");
    }
  };

  const handleElectoralAreaChange = async (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>)  => {
    const selectedElectoralArea = event.target.value;
    setElectoralArea(selectedElectoralArea);

    try {
      const response = await axios.get('/api/total-clients', {
        params: { electoralArea, fiscalYear }
      });

      if (response.data) {
        setElectoralQuantity(response.data.totKount.toString());
      } else {
        setElectoralQuantity(0);
      }
    } catch (error) {
      console.error("Error fetching total clients:", error);
      alert("Error fetching total clients");
    }
  };

  const handleFiscalYearChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFiscalYear(parseInt(event.target.value));
  };

  const handleAnnualBudgetChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const annualBudgetValue = parseFloat(event.target.value);
    if (!isNaN(annualBudgetValue)) {
        setAnnualBudget(annualBudgetValue);
        setMonthlyBudget(parseFloat((annualBudgetValue / 12).toFixed(2)));
        setWeeklyBudget(parseFloat((annualBudgetValue / 52).toFixed(2)));
    } else {
        setAnnualBudget(null);
        setMonthlyBudget(null);
        setWeeklyBudget(null);
    }
};

  const handleAddClick = async () => {
    if (!fiscalYear || !annualBudget || !monthlyBudget || !electoralArea) {
      alert("ENTER THE FISCAL YEAR, ANNUAL BUDGET, MONTHLY BUDGET, AND ELECTORAL AREA");
      return;
    }

    try {
      const response = await axios.post('/api/add-budget', {
        officer_no: firstOfficer,
        officer_name: officerName,
        fiscal_year: fiscalYear, 
        annual_budget: annualBudget, 
        monthly_budget: monthlyBudget, 
        January_budget: monthlyBudget,
        February_budget:monthlyBudget,
        March_budget: monthlyBudget,
        April_budget: monthlyBudget,
        May_budget: monthlyBudget,
        June_budget: monthlyBudget,
        July_budget: monthlyBudget,
        August_budget: monthlyBudget,
        September_budget: monthlyBudget,
        October_budget: monthlyBudget,
        November_budget: monthlyBudget,
        December_budget: monthlyBudget,
        electoral_area: electoralArea
      });

      alert(response.data.message);
      populateListView();
    } catch (error) {
      console.error("Error adding budget:", error);
      alert("Error adding budget");
    }
  };

  const handleAddWeeklyClick = async () => {
    if (!fiscalYear || !annualBudget || !weeklyBudget || !electoralArea) {
      alert("ENTER THE FISCAL YEAR, ANNUAL BUDGET, WEEKLY BUDGET, AND ELECTORAL AREA");
      return;
    }

    try {
      const response = await axios.post('/api/add-budget-weekly', {
        officer_no: firstOfficer,
        officer_name: officerName,
        fiscal_year: fiscalYear, 
        annual_budget: annualBudget, 
        weekly_budget: weeklyBudget, 
        electoral_area: electoralArea
      });

      alert(response.data.message);
      populateListView();
    } catch (error) {
      console.error("Error adding weekly budget:", error);
      alert("Error adding weekly budget");
    }
  };

  const handleEditClick = async () => {
    if (!fiscalYear || !annualBudget || !monthlyBudget || !electoralArea) {
      alert("ENTER THE FISCAL YEAR, ANNUAL BUDGET, MONTHLY BUDGET, AND ELECTORAL AREA");
      return;
    }

    // Check if the user is a supervisor
    const userRole = localStorage.getItem('userRole');
    if (userRole !== 'supervisor' && userRole !== 'SUPERVISOR') {
      alert("Only supervisors can edit this budget.!!");
      return;
    }

    try {
      const response = await axios.post('/api/edit-budget', {
        officer_no: firstOfficer,
        officer_name: officerName,
        fiscal_year: fiscalYear,
        annual_budget: annualBudget, 
        monthly_budget: monthlyBudget, 
        electoral_area: electoralArea
      });

      alert(response.data.message);
      populateListView();
    } catch (error) {
      console.error("Error editing budget:", error);
      alert("Error editing budget");
    }
  };

  const handleViewClick = async () => {
    if (!fiscalYear) {
      alert("ENTER THE FISCAL YEAR");
      return;
    }

    try {
      const response = await axios.get('/api/officer-budgets', {
        params: { fiscalYear }
      });

      if (response.data.length > 0) {
        window.open('/report/REPORT ON MONITORING AND EVALUATION EXERCISE.rpt', '_blank');
        alert("Processing completed");
      } else {
        alert("No records found for the specified fiscal year");
      }
    } catch (error) {
      console.error("Error viewing budgets:", error);
      alert("Error viewing budgets");
    }
  };

  const handleExitClick = () => {
    // Assuming you have a way to navigate back to the main page
    window.location.href = '/'; // Redirect to main page or wherever you want
  };

  const populateListView = async () => {
    try {
      const response = await axios.get('/api/officer-budgets');
      setOfficerBudgets(response.data);
    } catch (error) {
      console.error("Error fetching officer budgets:", error);
      alert("No records found to feed the listview");
    }
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
          <h3>Collector's Budget Data Entry</h3>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col>
          <Form.Group controlId="formOfficerNo">
            <Form.Label>Collector No:</Form.Label>
            <Form.Control as="select" value={`${firstOfficer} ${officerName} ${electoralArea}`} 
            onChange={handleOfficerNoChange} // This is now typed correctly
          >
            <option value="">Select a collector</option>
            {officers.map(officer => (
              <option key={officer.officer_no} value={`${officer.officer_no} ${officer.officer_name} ${officer.electoral_area}`}>
                {officer.officer_no} {officer.officer_name}
              </option>
            ))}
          </Form.Control>
          </Form.Group>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col>
          <Form.Group controlId="formFiscalYear">
            <Form.Label>Fiscal Year:</Form.Label>
            <Form.Control type="number" value={fiscalYear} onChange={handleFiscalYearChange} />
          </Form.Group>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col>
          <Form.Group controlId="formAnnualBudget">
            <Form.Label>Annual Budget:</Form.Label>
            <Form.Control type="number" value={annualBudget !== null ? annualBudget : 0} onChange={handleAnnualBudgetChange} />
            <Form.Label>GHC</Form.Label>
          </Form.Group>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col>
          <Form.Group controlId="formMonthlyBudget">
            <Form.Label>Monthly Budget:</Form.Label>
            <Form.Control type="number" value={monthlyBudget !== null ? monthlyBudget : 0} readOnly />
            <Form.Label>GHC</Form.Label>
          </Form.Group>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col>
          <Form.Group controlId="formWeeklyBudget">
            <Form.Label>Weekly Budget:</Form.Label>
            <Form.Control type="number" value={weeklyBudget !== null ? weeklyBudget : 0} readOnly />
            <Form.Label>GHC</Form.Label>
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
                <option key={officer.officer_no} value={officer.electoral_area}>
                  {officer.electoral_area}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col>
          <Form.Label>Total Number of Clients in electoral area:</Form.Label>
          <Form.Control type="number" readOnly value={electoralQuantity} />
        </Col>
      </Row>
      <Row className="mt-3">
        <Col>
          <Form.Label>Collector:</Form.Label>
          <Form.Control type="text" readOnly value={officerName} />
        </Col>
      </Row>
      <Row className="mt-3">
        <Col className="text-center">
          <Button variant="primary" onClick={handleAddClick}>
            Add New Record (Monthly)
          </Button>
        </Col>
        <Col className="text-center">
          <Button variant="success" onClick={handleAddWeeklyClick}>
            Add New Record (Weekly)
          </Button>
        </Col>
        <Col className="text-center">
          <Button variant="warning" onClick={handleEditClick}>
            Edit Old Record
          </Button>
        </Col>
        <Col className="text-center">
          <Button variant="info" onClick={handleViewClick}>
            View Collectors Budgets for Current Year
          </Button>
        </Col>
        <Col className="text-center">
          <Button variant="danger" onClick={handleExitClick}>
            Exit
          </Button>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col>
          <Frame1 officerBudgets={officerBudgets} />
        </Col>
      </Row>
    </Container>
  );
};

interface Frame1Props {
  officerBudgets: OfficerBudget[];
}

const Frame1: React.FC<Frame1Props> = ({ officerBudgets }) => {
  return (
    <div className="border p-3">
      <h4>Activtiy</h4>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>OFFICER NO</th>
            <th>OFFICER NAME</th>
            <th>FISCAL YEAR</th>
            <th>ANNUAL BUDGET</th>
            <th>MONTHLY BUDGET</th>
            <th>JANUARY BUDGET</th>
            <th>JANUARY ACTUAL</th>
            <th>FEBRUARY BUDGET</th>
            <th>FEBRUARY ACTUAL</th>
            <th>MARCH BUDGET</th>
            <th>MARCH ACTUAL</th>
            <th>APRIL BUDGET</th>
            <th>APRIL ACTUAL</th>
            <th>MAY BUDGET</th>
            <th>MAY ACTUAL</th>
            <th>JUNE BUDGET</th>
            <th>JUNE ACTUAL</th>
            <th>JULY BUDGET</th>
            <th>JULY ACTUAL</th>
            <th>AUGUST BUDGET</th>
            <th>AUGUST ACTUAL</th>
            <th>SEPTEMBER BUDGET</th>
            <th>SEPTEMBER ACTUAL</th>
            <th>OCTOBER BUDGET</th>
            <th>OCTOBER ACTUAL</th>
            <th>NOVEMBER BUDGET</th>
            <th>NOVEMBER ACTUAL</th>
            <th>DECEMBER BUDGET</th>
            <th>DECEMBER ACTUAL</th>
            <th>TOTAL ACTUAL</th>
            <th>OUTSTANDING</th>
            <th>ELECTORAL AREA</th>
          </tr>
        </thead>
        <tbody>
          {officerBudgets.map(budget => (
            <tr key={budget.officer_no}>
              <td>{budget.officer_no}</td>
              <td>{budget.officer_name}</td>
              <td>{budget.fiscal_year}</td>
              <td>{budget.annual_budget.toLocaleString()}</td>
              <td>{budget.monthly_budget.toLocaleString()}</td>
              <td>{budget.January_budget.toLocaleString()}</td>
              <td>{budget.January_Actual.toLocaleString()}</td>
              <td>{budget.February_budget.toLocaleString()}</td>
              <td>{budget.February_Actual.toLocaleString()}</td>
              <td>{budget.March_budget.toLocaleString()}</td>
              <td>{budget.March_Actual.toLocaleString()}</td>
              <td>{budget.April_budget.toLocaleString()}</td>
              <td>{budget.April_Actual.toLocaleString()}</td>
              <td>{budget.May_budget.toLocaleString()}</td>
              <td>{budget.May_Actual.toLocaleString()}</td>
              <td>{budget.June_budget.toLocaleString()}</td>
              <td>{budget.June_Actual.toLocaleString()}</td>
              <td>{budget.July_budget.toLocaleString()}</td>
              <td>{budget.July_Actual.toLocaleString()}</td>
              <td>{budget.August_budget.toLocaleString()}</td>
              <td>{budget.August_Actual.toLocaleString()}</td>
              <td>{budget.September_budget.toLocaleString()}</td>
              <td>{budget.September_Actual.toLocaleString()}</td>
              <td>{budget.October_budget.toLocaleString()}</td>
              <td>{budget.October_Actual.toLocaleString()}</td>
              <td>{budget.November_budget.toLocaleString()}</td>
              <td>{budget.November_Actual.toLocaleString()}</td>
              <td>{budget.December_budget.toLocaleString()}</td>
              <td>{budget.December_Actual.toLocaleString()}</td>
              <td>{budget.Actual_total.toLocaleString()}</td>
              <td>{budget.outstanding.toLocaleString()}</td>
              <td>{budget.electoral_area}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default FrmOfficerBudget;
