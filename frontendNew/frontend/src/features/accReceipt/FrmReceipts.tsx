import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Row, Col, Table } from 'react-bootstrap';
import axios from 'axios';

interface Receipt {
    fiscalyear: number;
    batchno: number;
    firstno: number;
    lastno: number;
}

export const FrmReceipts: React.FC = () => {
    const [fiscalYear, setFiscalYear] = useState<number>(0);
    const [batchNo, setBatchNo] = useState<number>(0);
    const [firstNo, setFirstNo] = useState<number>(0);
    const [lastNo, setLastNo] = useState<number>(0);
    const [receipts, setReceipts] = useState<Receipt[]>([]);

    useEffect(() => {
        // Fetch receipts on form load
        fetchReceipts();
    }, []);

    const fetchReceipts = async () => {
        try {
            const response = await axios.get('/api/receipts');
            setReceipts(response.data);
        } catch (error) {
            console.error("Error fetching receipts", error);
            alert("An error occurred while fetching receipts");
        }
    };

    const handleFiscalYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFiscalYear(Number(e.target.value));
    };

    const handleBatchNoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBatchNo(Number(e.target.value));
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
            const response = await axios.post('/api/add-receipt', {
                fiscalyear: fiscalYear,
                batchno: batchNo,
                firstno: firstNo,
                lastno: lastNo
            });

            if (response.data.success) {
                alert("Record successfully added");
                // Clear input fields
                setFiscalYear(0);
                setBatchNo(0);
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
            const response = await axios.post('/api/delete-receipt', {
                fiscalyear: fiscalYear,
                batchno: batchNo,
                firstno: firstNo,
                lastno: lastNo
            });

            if (response.data.success) {
                alert("Record successfully deleted");
                // Clear input fields
                setFiscalYear(0);
                setBatchNo(0);
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

    const handleExitClick = () => {
        // Hide the form and show main form (this can be handled via routing)
        console.log("Exit button clicked");
        // For example, you might navigate to another route here
        // history.push('/main-form');
    };

    const handleBatchNoClick = async () => {
        if (!fiscalYear) {
            alert("Enter the fiscal year");
            return;
        }

        try {
            const response = await axios.get('/api/next-batch-no', {
                params: { fiscalyear: fiscalYear }
            });

            if (response.data.nextBatchNo) {
                setBatchNo(response.data.nextBatchNo);
            } else {
                alert("Record not found");
            }
        } catch (error) {
            console.error("Error fetching next batch number", error);
            alert("An error occurred while fetching the next batch number");
        }
    };

    return (
        <Container fluid>
            <Row className="mb-3">
                <Col>
                    <h1 className="text-center text-primary">MARCORY MUNICIPAL ASSEMBLY</h1>
                </Col>
            </Row>
            <Row>
                <Col>
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
                            onClick={handleBatchNoClick}
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
                    <Button variant="secondary" onClick={handleExitClick}>
                        Exit
                    </Button>
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
        </Container>
    );
};

// export default Receipts;
// const express = require('express');
// const router = express.Router();
// const { Sequelize, DataTypes } = require('sequelize');
// const sequelize = new Sequelize('Saltpond', 'sa', 'Timbuk2tu', {
//     host: 'localhost',
//     dialect: 'mssql'
// });

// const Receipt = sequelize.define('Receipt', {
//     fiscalyear: {
//         type: DataTypes.DECIMAL(13, 2),
//         primaryKey: true
//     },
//     batchno: {
//         type: DataTypes.DECIMAL(13, 2),
//         primaryKey: true
//     },
//     firstno: {
//         type: DataTypes.DECIMAL(13, 2),
//         primaryKey: true
//     },
//     lastno: {
//         type: DataTypes.DECIMAL(13, 2),
//         primaryKey: true
//     }
// }, {
//     tableName: 'tb_AccReceipt',
//     timestamps: false
// });

// router.get('/receipts', async (req, res) => {
//     try {
//         const receipts = await Receipt.findAll({
//             order: [['fiscalyear', 'ASC'], ['batchno', 'ASC']]
//         });
//         res.json(receipts);
//     } catch (error) {
//         console.error("Error fetching receipts", error);
//         res.status(500).json({ error: "An error occurred while fetching receipts" });
//     }
// });

// module.exports = router;

// const express = require('express');
// const router = express.Router();
// const { Sequelize, DataTypes } = require('sequelize');
// const sequelize = new Sequelize('Saltpond', 'sa', 'Timbuk2tu', {
//     host: 'localhost',
//     dialect: 'mssql'
// });

// const Receipt = sequelize.define('Receipt', {
//     fiscalyear: {
//         type: DataTypes.DECIMAL(13, 2),
//         primaryKey: true
//     },
//     batchno: {
//         type: DataTypes.DECIMAL(13, 2),
//         primaryKey: true
//     },
//     firstno: {
//         type: DataTypes.DECIMAL(13, 2),
//         primaryKey: true
//     },
//     lastno: {
//         type: DataTypes.DECIMAL(13, 2),
//         primaryKey: true
//     }
// }, {
//     tableName: 'tb_AccReceipt',
//     timestamps: false
// });

// router.post('/add-receipt', async (req, res) => {
//     const { fiscalyear, batchno, firstno, lastno } = req.body;

//     if (!fiscalyear || !batchno || !firstno || !lastno) {
//         return res.status(400).json({ error: "All fields are required" });
//     }

//     try {
//         const existingReceipt = await Receipt.findOne({
//             where: {
//                 fiscalyear,
//                 batchno,
//                 firstno,
//                 lastno
//             }
//         });

//         if (existingReceipt) {
//             return res.json({ success: false, message: "Record already exists" });
//         }

//         await Receipt.create({
//             fiscalyear,
//             batchno,
//             firstno,
//             lastno
//         });

//         res.json({ success: true });
//     } catch (error) {
//         console.error("Error adding receipt", error);
//         res.status(500).json({ error: "Error in adding a record" });
//     }
// });

// module.exports = router;

// const express = require('express');
// const router = express.Router();
// const { Sequelize, DataTypes } = require('sequelize');
// const sequelize = new Sequelize('Saltpond', 'sa', 'Timbuk2tu', {
//     host: 'localhost',
//     dialect: 'mssql'
// });

// const Receipt = sequelize.define('Receipt', {
//     fiscalyear: {
//         type: DataTypes.DECIMAL(13, 2),
//         primaryKey: true
//     },
//     batchno: {
//         type: DataTypes.DECIMAL(13, 2),
//         primaryKey: true
//     },
//     firstno: {
//         type: DataTypes.DECIMAL(13, 2),
//         primaryKey: true
//     },
//     lastno: {
//         type: DataTypes.DECIMAL(13, 2),
//         primaryKey: true
//     }
// }, {
//     tableName: 'tb_AccReceipt',
//     timestamps: false
// });

// router.post('/delete-receipt', async (req, res) => {
//     const { fiscalyear, batchno, firstno, lastno } = req.body;

//     if (!fiscalyear || !batchno || !firstno || !lastno) {
//         return res.status(400).json({ error: "All fields are required" });
//     }

//     try {
//         const deletedReceipt = await Receipt.destroy({
//             where: {
//                 fiscalyear,
//                 batchno,
//                 firstno,
//                 lastno
//             }
//         });

//         if (deletedReceipt > 0) {
//             res.json({ success: true });
//         } else {
//             res.json({ success: false, message: "Record not found" });
//         }
//     } catch (error) {
//         console.error("Error deleting receipt", error);
//         res.status(500).json({ error: "Error in deleting a record" });
//     }
// });

// module.exports = router;


// const express = require('express');
// const router = express.Router();
// const { Sequelize, DataTypes } = require('sequelize');
// const sequelize = new Sequelize('Saltpond', 'sa', 'Timbuk2tu', {
//     host: 'localhost',
//     dialect: 'mssql'
// });

// const Receipt = sequelize.define('Receipt', {
//     fiscalyear: {
//         type: DataTypes.DECIMAL(13, 2),
//         primaryKey: true
//     },
//     batchno: {
//         type: DataTypes.DECIMAL(13, 2),
//         primaryKey: true
//     },
//     firstno: {
//         type: DataTypes.DECIMAL(13, 2),
//         primaryKey: true
//     },
//     lastno: {
//         type: DataTypes.DECIMAL(13, 2),
//         primaryKey: true
//     }
// }, {
//     tableName: 'tb_AccReceipt',
//     timestamps: false
// });

// router.get('/next-batch-no', async (req, res) => {
//     const { fiscalyear } = req.query;

//     if (!fiscalyear) {
//         return res.status(400).json({ error: "Fiscal year is required" });
//     }

//     try {
//         const result = await sequelize.query(`
//             SELECT MAX(batchno) AS maxBatchNo
//             FROM tb_AccReceipt
//             WHERE fiscalyear = ${fiscalyear}
//         `);

//         const maxBatchNo = result[0][0].maxBatchNo || 0;
//         const nextBatchNo = maxBatchNo + 1;

//         res.json({ nextBatchNo });
//     } catch (error) {
//         console.error("Error fetching next batch number", error);
//         res.status(500).json({ error: "An error occurred while fetching the next batch number" });
//     }
// });

// module.exports = router;


