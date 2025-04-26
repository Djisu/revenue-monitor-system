import React, { useState, useEffect } from 'react';
import { useAppDispatch } from '../../app/store';
import { Container, Form, Button, Row, Col, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import {fetchAccReceipts, createAccReceipt, AccReceiptData, deleteAccReceipt} from './accReceiptSlice'

// interface Receipt {
//     fiscalyear: number;
//     batchno: number;
//     firstno: number;
//     lastno: number;
// }

export const FrmReceipts: React.FC = () => {
    const [fiscalYear, setFiscalYear] = useState<number>(0);
    const [batchNo, setBatchNo] = useState<string>('');
    const [firstNo, setFirstNo] = useState<number>(0);
    const [lastNo, setLastNo] = useState<number>(0);
    const [receipts, setReceipts] = useState<AccReceiptData[]>([]);

    const dispatch = useAppDispatch();
   
    useEffect(() => {
        // Fetch receipts on form load
        fetchReceipts();
    }, []);

    const fetchReceipts = async () => {
        try {
            const response = await dispatch(fetchAccReceipts()).unwrap();
            console.log('response.data: ', response.data)
            
            if (response.data && response.data.length > 0) {
                setReceipts(response.data);
            } else {
                console.warn("No receipts found");
                alert("No receipts available at the moment.");
            }
        } catch (error) {
            console.error("Error fetching receipts", error);
            alert("An error occurred while fetching receipts");
        }
    };

    const handleFiscalYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFiscalYear(Number(e.target.value));
    };

    const handleBatchNoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBatchNo(e.target.value);
    };

    const handleFirstNoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFirstNo(Number(e.target.value));
    };

    const handleLastNoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLastNo(Number(e.target.value));
    };

    const handleAddClick = async () => {
        if (!fiscalYear) {
            alert("Enter the fiscal year");
            return;
        }
        if (!batchNo) {
            alert("Enter the batch number");
            return;
        }
        if (!firstNo) {
            alert("Enter the first receipt number");
            return;
        }
        if (!lastNo) {
            alert("Enter the last receipt number");
            return;
        }

        try {
            const data: AccReceiptData = {
                fiscalyear: fiscalYear,
                batchno: batchNo,
                firstno: firstNo,
                lastno: lastNo
            }

            const response = await dispatch(createAccReceipt(data));

            if (response.payload.success) {
                alert("Record successfully added");
                // Clear input fields
                setFiscalYear(0);
                setBatchNo('');
                setFirstNo(0);
                setLastNo(0);
                // Refresh the list of receipts
                fetchReceipts();
            } else {
                alert("Record already exists");
            }
        } catch (error) {
            console.error("Error adding receipt", error);
            alert("Error in adding a record");
        }
    };

    const handleDeleteClick = async () => {
        if (!fiscalYear) {
            alert("Enter the fiscal year");
            return;
        }
        if (!batchNo) {
            alert("Enter the batch number");
            return;
        }
        if (!firstNo) {
            alert("Enter the first receipt number");
            return;
        }
        if (!lastNo) {
            alert("Enter the last receipt number");
            return;
        }

        try {
            const response = await dispatch(deleteAccReceipt({
                fiscalyear: fiscalYear,
                batchno: batchNo
            }));

            if (response.payload.success) {
                alert("Record successfully deleted");
                // Clear input fields
                setFiscalYear(0);
                setBatchNo('');
                setFirstNo(0);
                setLastNo(0);
                // Refresh the list of receipts
                fetchReceipts();
            } else {
                alert("Record not found");
            }
        } catch (error) {
            console.error("Error deleting receipt", error);
            alert("Error in deleting a record");
        }
    };

    // const handleExitClick = () => {
    //     // Hide the form and show main form (this can be handled via routing)
    //     console.log("Exit button clicked");
    //     // For example, you might navigate to another route here
    //     // history.push('/main-form');
    // };

    // const handleBatchNoClick = async () => {
    //     if (!fiscalYear) {
    //         alert("Enter the fiscal year");
    //         return;
    //     }

    //     try {
    //         const response = await axios.get('/api/next-batch-no', {
    //             params: { fiscalyear: fiscalYear }
    //         });

    //         if (response.data.nextBatchNo) {
    //             setBatchNo(response.data.nextBatchNo);
    //         } else {
    //             alert("Record not found");
    //         }
    //     } catch (error) {
    //         console.error("Error fetching next batch number", error);
    //         alert("An error occurred while fetching the next batch number");
    //     }
    // };

    return (
        <Container fluid>
            {/* <Row className="mb-3">
                <Col>
                   
                </Col>
            </Row> */}
            <Row>
                <Col>
                {/* <p className="text-center text-primary">MARCORY MUNICIPAL ASSEMBLY</p> */}
                    <Form.Group controlId="formFiscalYear">
                        <Form.Label>Fiscal Year:</Form.Label>
                        <Form.Control
                            type="number"
                            value={fiscalYear}
                            onChange={handleFiscalYearChange}
                            required
                        />
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group controlId="formBatchNo">
                        <Form.Label>Batch Number:</Form.Label>
                        <Form.Control
                            type="number"
                            value={batchNo}
                            onChange={handleBatchNoChange}
                            // onClick={handleBatchNoClick}
                            required
                        />
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Form.Group controlId="formFirstNo">
                        <Form.Label>First Receipt Number:</Form.Label>
                        <Form.Control
                            type="number"
                            value={firstNo}
                            onChange={handleFirstNoChange}
                            required
                        />
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group controlId="formLastNo">
                        <Form.Label>Last Receipt Number:</Form.Label>
                        <Form.Control
                            type="number"
                            value={lastNo}
                            onChange={handleLastNoChange}
                            required
                        />
                    </Form.Group>
                </Col>
            </Row>
            <Row className="mt-3">
                <Col>
                    <Button variant="primary" onClick={handleAddClick}>
                        Add New Record
                    </Button>
                </Col>
                <Col>
                    <Button variant="danger" onClick={handleDeleteClick}>
                        Delete
                    </Button>
                </Col>
                <Col>
                    <Link to="/main" className="primary m-3">
                        Go Back
                    </Link>
                </Col>
            </Row>
            <Row className="mt-3">
                <Col>
                    <h2>List of Receipt Numbers</h2>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Fiscal Year</th>
                                <th>Batch Number</th>
                                <th>First No</th>
                                <th>Last No</th>
                            </tr>
                        </thead>
                        <tbody>
                            {receipts.map((receipt, index) => (
                                <tr key={index} onClick={() => {
                                    setFiscalYear(receipt.fiscalyear);
                                    setBatchNo(receipt.batchno);
                                    setFirstNo(receipt.firstno);
                                    setLastNo(receipt.lastno);
                                }}>
                                    <td>{receipt.fiscalyear}</td>
                                    <td>{receipt.batchno}</td>
                                    <td>{receipt.firstno}</td>
                                    <td>{receipt.lastno}</td>
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
