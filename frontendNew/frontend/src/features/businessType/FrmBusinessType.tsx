import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Row, Col, Table } from 'react-bootstrap';
import axios from 'axios';

interface BusinessType {
    business_type: string;
}

const BusinessTypeForm: React.FC = () => {
    const [businessType, setBusinessType] = useState<string>('');
    const [businessTypes, setBusinessTypes] = useState<BusinessType[]>([]);

    useEffect(() => {
        // Fetch business types on form load
        fetchBusinessTypes();
    }, []);

    const fetchBusinessTypes = async () => {
        try {
            const response = await axios.get('/api/business-types');
            setBusinessTypes(response.data);
        } catch (error) {
            console.error("Error fetching business types", error);
            alert("An error occurred while fetching business types");
        }
    };

    const handleBusinessTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBusinessType(e.target.value);
    };

    const handleAddClick = async () => {
        if (!businessType) {
            alert("Enter a business type");
            return;
        }

        try {
            const response = await axios.post('/api/add-business-type', {
                business_type: businessType
            });

            if (response.data.success) {
                alert("Record successfully added");
                // Clear input field
                setBusinessType('');
                // Refresh the list of business types
                fetchBusinessTypes();
            } else {
                alert("Record already exists");
            }
        } catch (error) {
            console.error("Error adding business type", error);
            alert("Error in adding a record");
        }
    };

    const handleDeleteClick = async () => {
        if (!businessType) {
            alert("Enter a business type");
            return;
        }

        try {
            const response = await axios.post('/api/delete-business-type', {
                business_type: businessType
            });

            if (response.data.success) {
                alert("Record successfully deleted");
                // Clear input field
                setBusinessType('');
                // Refresh the list of business types
                fetchBusinessTypes();
            } else {
                alert("Record not found");
            }
        } catch (error) {
            console.error("Error deleting business type", error);
            alert("Error in deleting a record");
        }
    };

    const handleExitClick = () => {
        // Hide the form and show main form (this can be handled via routing)
        console.log("Exit button clicked");
        // For example, you might navigate to another route here
        // history.push('/main-form');
    };

    const handleRowClick = (bussType: BusinessType) => {
        setBusinessType(bussType.business_type);
    };

    return (
        <Container fluid>
            <Row className="mb-3">
                <Col>
                    <h1 className="text-center text-primary">MFANTSEMAN MUNICIPAL ASSEMBLY</h1>
                </Col>
            </Row>
            <Row>
                <Col>
                    <h3 className="text-center text-danger">BUSINESS TYPE DATA ENTRY</h3>
                </Col>
            </Row>
            <Row className="mt-3">
                <Col>
                    <Form.Group controlId="formBusinessType">
                        <Form.Label>Business Type:</Form.Label>
                        <Form.Control
                            type="text"
                            value={businessType}
                            onChange={handleBusinessTypeChange}
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
                        Delete Old Record
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
                    <h2>List of Business Types</h2>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Business Type</th>
                            </tr>
                        </thead>
                        <tbody>
                            {businessTypes.map((bussType, index) => (
                                <tr key={index} onClick={() => handleRowClick(bussType)}>
                                    <td>{bussType.business_type}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Col>
            </Row>
        </Container>
    );
};

export default BusinessTypeForm;

// const express = require('express');
// const router = express.Router();
// const { Sequelize, DataTypes } = require('sequelize');
// const sequelize = new Sequelize('Saltpond', 'sa', 'Timbuk2tu', {
//     host: 'localhost',
//     dialect: 'mssql'
// });

// const BusinessType = sequelize.define('BusinessType', {
//     business_type: {
//         type: DataTypes.STRING,
//         primaryKey: true
//     }
// }, {
//     tableName: 'tb_businesstype',
//     timestamps: false
// });

// router.get('/business-types', async (req, res) => {
//     try {
//         const businessTypes = await BusinessType.findAll({
//             order: [['business_type', 'ASC']]
//         });
//         res.json(businessTypes);
//     } catch (error) {
//         console.error("Error fetching business types", error);
//         res.status(500).json({ error: "An error occurred while fetching business types" });
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

// const BusinessType = sequelize.define('BusinessType', {
//     business_type: {
//         type: DataTypes.STRING,
//         primaryKey: true
//     }
// }, {
//     tableName: 'tb_businesstype',
//     timestamps: false
// });

// router.post('/add-business-type', async (req, res) => {
//     const { business_type } = req.body;

//     if (!business_type) {
//         return res.status(400).json({ error: "Business type is required" });
//     }

//     try {
//         const existingBusinessType = await BusinessType.findOne({
//             where: {
//                 business_type
//             }
//         });

//         if (existingBusinessType) {
//             return res.json({ success: false, message: "Record already exists" });
//         }

//         await BusinessType.create({
//             business_type
//         });

//         res.json({ success: true });
//     } catch (error) {
//         console.error("Error adding business type", error);
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

// const BusinessType = sequelize.define('BusinessType', {
//     business_type: {
//         type: DataTypes.STRING,
//         primaryKey: true
//     }
// }, {
//     tableName: 'tb_businesstype',
//     timestamps: false
// });

// router.post('/delete-business-type', async (req, res) => {
//     const { business_type } = req.body;

//     if (!business_type) {
//         return res.status(400).json({ error: "Business type is required" });
//     }

//     try {
//         const deletedBusinessType = await BusinessType.destroy({
//             where: {
//                 business_type
//             }
//         });

//         if (deletedBusinessType > 0) {
//             res.json({ success: true });
//         } else {
//             res.json({ success: false, message: "Record not found" });
//         }
//     } catch (error) {
//         console.error("Error deleting business type", error);
//         res.status(500).json({ error: "Error in deleting a record" });
//     }
// });

// module.exports = router;





