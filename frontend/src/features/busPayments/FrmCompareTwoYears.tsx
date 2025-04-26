import React, { useState, useEffect } from 'react';
import { Form, FormGroup, Label, Input, Button, Alert } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';

const CompareTwoYears: React.FC = () => {
    const [firstFiscalYear, setFirstFiscalYear] = useState<string>('');
    const [secondFiscalYear, setSecondFiscalYear] = useState<string>('');
    const [firstOfficer, setFirstOfficer] = useState<string>('');
    //const [lastOfficer, setLastOfficer] = useState<string>('');
    const [officerName, setOfficerName] = useState<string>('');
    const [fiscalYears, setFiscalYears] = useState<string[]>([]);
    const [officers, setOfficers] = useState<string[]>([]);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        fetchFiscalYears();
        fetchOfficers();
    }, []);

    const fetchFiscalYears = async () => {
        try {
            // Replace with your API call to fetch fiscal years
            const response = await fetch('/api/fiscal-years');
            const data = await response.json();
            setFiscalYears(data);
        } catch (error: any) {
            setError(error.message);
        }
    };

    const fetchOfficers = async () => {
        try {
            // Replace with your API call to fetch officers
            const response = await fetch('/api/officers');
            const data = await response.json();
            setOfficers(data);
        } catch (error: any) {
            setError(error.message);
        }
    };

    const handleFirstOfficerChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const officerNo = e.target.value.trim().split(' ')[0];
        setFirstOfficer(officerNo);

        try {
            // Replace with your API call to fetch officer name
            const response = await fetch(`/api/officer/${officerNo}`);
            const data = await response.json();
            if (data) {
                setOfficerName(data.officer_name);
            } else {
                setError("No officer details found for this collector.");
            }
        } catch (error: any) {
            setError(error.message);
        }
    };

    const handlePreviewClick = async () => {
        if (!firstOfficer) {
            setOfficerName('');
            return;
        }

        try {
            // Replace with your API call to process and fetch the report
            const response = await fetch('/api/preview-report', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ firstFiscalYear, secondFiscalYear, firstOfficer }),
            });

            const data = await response.json();
            if (data.success) {
                // Logic to display the report (e.g., redirect to a report page)
                window.location.href = '/reports/two-year-comparison';
            } else {
                setError("Error processing the report.");
            }
        } catch (error: any) {
            setError(error.message);
        }
    };

    const handleExitClick = () => {
        // Logic to hide the form and show the main form
        // This can be managed by routing or state in a larger application
        window.location.href = '/'; // Redirect to main page or handle as needed
    };

    return (
        <div className="container mt-5">
            {error && <Alert color="danger">{error}</Alert>}
            <h1 className="text-center text-underline">Collector Performance Trend</h1>
            <h2 className="text-center">MARCORY MUNICIPAL ASSEMBLY</h2>
            <Form>
                <FormGroup>
                    <Label for="firstFiscalYear" className="font-weight-bold">First Fiscal Year:</Label>
                    <Input type="select" name="firstFiscalYear" id="firstFiscalYear" value={firstFiscalYear} onChange={(e) => setFirstFiscalYear(e.target.value)}>
                        <option value="">Select Year</option>
                        {fiscalYears.map((year) => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </Input>
                </FormGroup>
                <FormGroup>
                    <Label for="firstOfficer" className="font-weight-bold">First Officer:</Label>
                    <Input type="select" name="firstOfficer" id="firstOfficer" value={firstOfficer} onChange={handleFirstOfficerChange}>
                        <option value="">Select Officer</option>
                        {officers.map((officer) => (
                            <option key={officer} value={officer.split(' ')[0]}>{officer}</option>
                        ))}
                    </Input>
                </FormGroup>
                <FormGroup>
                    <Label for="secondFiscalYear" className="font-weight-bold">Second Fiscal Year:</Label>
                    <Input type="select" name="secondFiscalYear" id="secondFiscalYear" value={secondFiscalYear} onChange={(e) => setSecondFiscalYear(e.target.value)}>
                        <option value="">Select Year</option>
                        {fiscalYears.map((year) => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </Input>
                </FormGroup>
                <FormGroup>
                    <Label className="font-weight-bold">{officerName}</Label>
                </FormGroup>
                <FormGroup>
                    <div className="d-flex justify-content-between">
                        <Button color="primary" onClick={handlePreviewClick}>Preview Monitoring Report (Monthly)</Button>
                        {/* <Button color="success" onClick={handlePrintClick} style={{ display: 'none' }}>Print Monitoring Report (Weekly)</Button> */}
                        <Button color="danger" onClick={handleExitClick}>Exit</Button>
                    </div>
                </FormGroup>
            </Form>
           
                <Link to="/main" className="primary m-3">
                    Go Back
                </Link>
               
        </div>
    );
};

export default CompareTwoYears;
