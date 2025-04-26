import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Table } from 'react-bootstrap';
import axios from 'axios';

interface Officer {
    officer_no: string;
    officer_name: string;
    electoralarea: string;
}

interface BudgetItem {
    officer_no: string;
    officer_name: string;
    fiscal_year: number;
    annual_budget: number;
    monthly_budget: number;
    actual_total: number;
    outstanding: number;
    electoral_area: string;
}

const FrmPropertyOfficerBudget: React.FC = () => {
    const [officers, setOfficers] = useState<Officer[]>([]);
    const [officerNo, setOfficerNo] = useState<string>('');
    const [officerName, setOfficerName] = useState<string>('');
    const [fiscalYear, setFiscalYear] = useState<number>(0);
    const [annualBudget, setAnnualBudget] = useState<number>(0);
    const [monthlyBudget, setMonthlyBudget] = useState<number>(0);
    const [WeeklyBudget, setWeeklyBudget] = useState<number>(0);
    const [electoralArea, setElectoralArea] = useState<string>('');
    const [electoralQuantity, setElectoralQuantity] = useState<number>(0);
    const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([]);

    useEffect(() => {
        fetchOfficers();
        fetchBudgetItems();
    }, []);

    const fetchOfficers = async () => {
        try {
            const response = await axios.get<Officer[]>('/api/officers');
            setOfficers(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchBudgetItems = async () => {
        try {
            const response = await axios.get<BudgetItem[]>('/api/budget-items');
            setBudgetItems(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleOfficerNoChange = (event: React.ChangeEvent<HTMLElement>) => {
        let target = event.target as HTMLSelectElement;
        const selectedOfficerNo = target.value;
        setOfficerNo(selectedOfficerNo);

        const officer = officers.find(o => o.officer_no === selectedOfficerNo);
        if (officer) {
            setOfficerName(officer.officer_name);
            fetchElectoralAreas(officer.officer_no);
        }
    };

    const fetchElectoralAreas = async (officerNo: string) => {
        try {
            const response = await axios.get<string[]>('/api/electoral-areas', { params: { officer_no: officerNo } });
            setElectoralArea(response.data[0]);
        } catch (error) {
            console.error(error);
        }
    };

    const handleElectoralAreaChange = (event: React.ChangeEvent<HTMLElement>) => {
        let target = event.target as HTMLSelectElement;
        const selectedElectoralArea = target.value;
        setElectoralArea(selectedElectoralArea);
        fetchElectoralQuantity(selectedElectoralArea);
    };

    const fetchElectoralQuantity = async (electoralArea: string) => {
        try {
            const response = await axios.get<number>('/api/electoral-quantity', { params: { electoralarea: electoralArea } });
            setElectoralQuantity(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleFiscalYearChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const fiscalYear = parseInt(event.target.value, 10);
        setFiscalYear(fiscalYear);
    };

    const handleAnnualBudgetChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const annualBudget = parseFloat(event.target.value);
        setAnnualBudget(annualBudget);
        setMonthlyBudget(annualBudget / 12);
        setWeeklyBudget(annualBudget / 52);
    };

    const handleMonthlyBudgetChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const monthlyBudget = parseFloat(event.target.value);
        setMonthlyBudget(monthlyBudget);
    };

    const handleWeeklyBudgetChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const weeklyBudget = parseFloat(event.target.value);
        setWeeklyBudget(weeklyBudget);
    };

    const addRecord = async () => {
        if (fiscalYear === 0) {
            alert("Enter the fiscal year");
            return;
        }
        if (annualBudget === 0) {
            alert("Enter the annual budgeted figure");
            return;
        }
        if (monthlyBudget === 0) {
            alert("Enter the monthly budgeted figure");
            return;
        }

        try {
            await axios.post('/api/add-record', {
                officer_no: officerNo,
                officer_name: officerName,
                fiscal_year: fiscalYear,
                annual_budget: annualBudget,
                monthly_budget: monthlyBudget,
                electoral_area: electoralArea,
            });
            alert("Collection budget made successfully");
            fetchBudgetItems();
        } catch (error) {
            console.error(error);
            alert("Error in adding a record");
        }
    };

    const editRecord = async () => {
        // Add logic to check if the user is a supervisor
        if (fiscalYear === 0) {
            alert("Enter the fiscal year");
            return;
        }
        if (annualBudget === 0) {
            alert("Enter the annual budgeted figure");
            return;
        }
        if (monthlyBudget === 0) {
            alert("Enter the monthly budgeted figure");
            return;
        }

        try {
            await axios.post('/api/edit-record', {
                officer_no: officerNo,
                officer_name: officerName,
                fiscal_year: fiscalYear,
                annual_budget: annualBudget,
                monthly_budget: monthlyBudget,
                electoral_area: electoralArea,
            });
            alert("Record successfully added");
            fetchBudgetItems();
        } catch (error) {
            console.error(error);
            alert("Error in adding a record");
        }
    };

    const viewCollectorsBudgets = async () => {
        try {
            const response = await axios.get<BudgetItem[]>('/api/view-budgets');
            if (response.data.length === 0) {
                alert("You have have to set budgets for the collects before assessing them");
                return;
            }

            // Logic to generate and show the report
            alert("Collectors budgets for the current year fetched successfully");
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Container>
            <Row>
                <Col className="text-center mt-3">
                    <h2 className="text-primary">PROPERTY RATES COLLECTOR'S BUDGET DATA ENTRY</h2>
                    <h4 className="text-info">MARCORY MUNICIPAL ASSEMBLY</h4>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Form.Group controlId="formOfficerNo">
                        <Form.Label className="font-weight-bold">Collector No:</Form.Label>
                        <Form.Control as="select" value={officerNo} onChange={handleOfficerNoChange}>
                            <option value="">Select...</option>
                            {officers.map(officer => (
                                <option key={officer.officer_no} value={officer.officer_no}>
                                    {officer.officer_no} - {officer.officer_name} - {officer.electoralarea}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Form.Label className="font-weight-bold">Fiscal Year</Form.Label>
                    <Form.Control type="number" value={fiscalYear} onChange={handleFiscalYearChange} />
                </Col>
            </Row>
            <Row>
                <Col>
                    <Form.Label className="font-weight-bold">Electoral Area</Form.Label>
                    <Form.Control as="select" value={electoralArea} onChange={handleElectoralAreaChange}>
                        <option value="">Select...</option>
                        {/* Options will be populated dynamically */}
                    </Form.Control>
                </Col>
                <Col>
                    <Form.Label className="font-weight-bold">Total Number of Clients in Electoral Area</Form.Label>
                    <Form.Control type="text" value={electoralQuantity} readOnly />
                </Col>
            </Row>
            <Row>
                <Col>
                    <Form.Label className="font-weight-bold">Annual Budget (GHC)</Form.Label>
                    <Form.Control type="number" step="0.01" value={annualBudget} onChange={handleAnnualBudgetChange} />
                </Col>
            </Row>
            <Row>
                <Col>
                    <Form.Label className="font-weight-bold">Monthly Budget (GHC)</Form.Label>
                    <Form.Control type="number" step="0.01" value={monthlyBudget} onChange={handleMonthlyBudgetChange} />
                </Col>
            </Row>
            <Row>
                <Col>
                    <Form.Label className="font-weight-bold">Weekly Budget (GHC)</Form.Label>
                    <Form.Control type="number" step="0.01" value={WeeklyBudget} onChange={handleWeeklyBudgetChange} />
                </Col>
            </Row>
            <Row className="mt-3">
                <Col>
                    <Button variant="primary" onClick={addRecord}>
                        Add New Record (Monthly)
                    </Button>
                </Col>
                <Col>
                    <Button variant="primary" onClick={editRecord}>
                        Edit Old Record
                    </Button>
                </Col>
                <Col>
                    <Button variant="primary" onClick={viewCollectorsBudgets}>
                        View Collectors Budgets for Current Year
                    </Button>
                </Col>
                <Col>
                    <Button variant="danger" onClick={() => window.close()}>
                        Exit
                    </Button>
                </Col>
            </Row>
            <Row className="mt-3">
                <Col>
                    <h3 className="font-weight-bold">Collectors Budget</h3>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>OFFICER NO</th>
                                <th>OFFICER NAME</th>
                                <th>FISCAL YEAR</th>
                                <th>ANNUAL BUDGET</th>
                                <th>MONTHLY BUDGET</th>
                                <th>ACTUAL TOTAL</th>
                                <th>OUTSTANDING</th>
                                <th>ELECTORAL AREA</th>
                            </tr>
                        </thead>
                        <tbody>
                            {budgetItems.map(item => (
                                <tr key={item.officer_no}>
                                    <td>{item.officer_no}</td>
                                    <td>{item.officer_name}</td>
                                    <td>{item.fiscal_year}</td>
                                    <td>{item.annual_budget.toFixed(2)}</td>
                                    <td>{item.monthly_budget.toFixed(2)}</td>
                                    <td>{item.actual_total.toFixed(2)}</td>
                                    <td>{item.outstanding.toFixed(2)}</td>
                                    <td>{item.electoral_area}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Col>
            </Row>
        </Container>
    );
};

export default FrmPropertyOfficerBudget;
