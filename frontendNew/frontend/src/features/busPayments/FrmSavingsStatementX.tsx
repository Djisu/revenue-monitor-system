import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Row, Col, Table } from 'react-bootstrap';
import axios from 'axios';
import { Link } from 'react-router-dom';

const SavingsStatementX: React.FC = () => {
    const [loanNo, setLoanNo] = useState<string>('');
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    // @ts-ignore
    const [businessName, setBusinessName] = useState<string>('');
    const [dates, setDates] = useState<string[]>([]);
    const [records, setRecords] = useState<any[]>([]);

    useEffect(() => {
        // Set default end date to today
        setEndDate(new Date().toLocaleDateString('en-GB'));
    }, []);

    const handleLoanNoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setLoanNo(e.target.value);

        // Fetch dates based on loan number
        fetchDates(e.target.value);
    };

    // const handleLoanNoValidate = async () => {
    //     if (!loanNo) {
    //         alert("Select a business number");
    //         return;
    //     }

    //     try {
    //         const response = await axios.get(`/api/business/${loanNo}`);
    //         if (response.data.length > 0) {
    //             setBusinessName(response.data[0].buss_name);
    //         } else {
    //             alert("A wrong business number");
    //         }
    //     } catch (error) {
    //         console.error("Error validating loan number", error);
    //         alert("An error occurred while validating the loan number");
    //     }
    // };

    const fetchDates = async (bussNo: string) => {
        try {
            const response = await axios.get(`/api/dates`, {
                params: { buss_no: bussNo }
            });
            setDates(response.data.map((rec: any) => rec.transdate));
        } catch (error) {
            console.error("Error fetching dates", error);
            alert("No payment records date found");
        }
    };

    const handleStartDateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setStartDate(e.target.value);
    };

    const handleEndDateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setEndDate(e.target.value);
    };

    const handlePreviewClick = async () => {
        if (!loanNo) {
            alert("Select a business number");
            return;
        }

        try {
            const response = await axios.get(`/api/records`, {
                params: { buss_no: loanNo, start_date: startDate, end_date: endDate }
            });
            setRecords(response.data);
        } catch (error) {
            console.error("Error fetching records", error);
            alert("No records found");
        }
    };

    const handleExitClick = () => {
        // Hide the form and show main form (this can be handled via routing)
        console.log("Exit button clicked");
    };

    return (
        <Container>
            <Row>
                <Col>
                    <h1 className="text-center text-primary">MARCORY MUNICIPAL ASSEMBLY</h1>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Form.Group controlId="formLoanNo">
                        <Form.Label>Business Number</Form.Label>
                        <Form.Select value={loanNo} onChange={handleLoanNoChange} required>
                            <option value="">Select Business Number</option>
                            {/* Populate with business numbers from database */}
                        </Form.Select>
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group controlId="formBusinessName">
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" value={businessName} readOnly />
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Form.Group controlId="formStartDate">
                        <Form.Label>Start Date</Form.Label>
                        <Form.Select value={startDate} onChange={handleStartDateChange} required>
                            <option value="">Select Start Date</option>
                            {dates.map(date => (
                                <option key={date} value={date}>{date}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group controlId="formEndDate">
                        <Form.Label>End Date</Form.Label>
                        <Form.Select value={endDate} onChange={handleEndDateChange} required>
                            <option value="">Select End Date</option>
                            {dates.map(date => (
                                <option key={date} value={date}>{date}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </Col>
            </Row>
            <Row className="mt-3">
                <Col>
                    <Button variant="primary" onClick={handlePreviewClick}>
                        Preview
                    </Button>
                </Col>
                <Col>
                    <Button variant="danger" onClick={handleExitClick}>
                        Exit
                    </Button>
                </Col>
            </Row>
            <Row className="mt-3">
                <Col>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Business Number</th>
                                <th>Date</th>
                                <th>Details</th>
                                <th>Debit</th>
                                <th>Credit</th>
                                <th>Balance</th>
                            </tr>
                        </thead>
                        <tbody>
                            {records.map((rec, index) => (
                                <tr key={index}>
                                    <td>{rec.buss_no}</td>
                                    <td>{rec.transdate}</td>
                                    <td>{rec.details}</td>
                                    <td>{rec.debit}</td>
                                    <td>{rec.credit}</td>
                                    <td>{rec.balance}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Col>
            </Row>
            <Row className="mt-3">
                <Col>
                <Link to="/main" className="primary m-3">
                    Go Back
                </Link>
                </Col>
            </Row>
        </Container>
    );
};

export default SavingsStatementX;
