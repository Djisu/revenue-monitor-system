import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Row, Col, Table } from 'react-bootstrap';
import axios from 'axios';
import { Link } from 'react-router-dom';

interface BusinessType {
    buss_type: string;
    grade: string;
    description: string;
    fees: string;
}

const ChangeBusinessType: React.FC = () => {
    const [oldBusinessType, setOldBusinessType] = useState<string>('');
    const [newBusinessType, setNewBusinessType] = useState<string>('');
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

    const handleOldBusinessTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setOldBusinessType(e.target.value);
    };

    const handleNewBusinessTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewBusinessType(e.target.value);
    };

    const handleAddClick = async () => {
        if (!oldBusinessType || !newBusinessType) {
            alert("Please select an old business type and enter a new business type.");
            return;
        }

        try {
            const response = await axios.post('/api/change-business-type', {
                oldBusinessType,
                newBusinessType
            });

            if (response.data.success) {
                alert(`Business type '${oldBusinessType}' is changed to '${newBusinessType}'`);
                // Refresh the list of business types
                fetchBusinessTypes();
            } else {
                alert("This business type was not found.");
            }
        } catch (error) {
            console.error("Error changing business type", error);
            alert("An error occurred while changing the business type");
        }
    };

    const handleExitClick = () => {
        // Hide the form and show main form (this can be handled via routing)
        console.log("Exit button clicked");
        // For example, you might navigate to another route here
        // history.push('/main-form');
    };

    const populateBusinessTypeOptions = () => {
        return businessTypes.map(bussType => (
            <option key={bussType.buss_type} value={bussType.buss_type}>
                {bussType.buss_type}
            </option>
        ));
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
                    <Form.Group controlId="formOldBussType">
                        <Form.Label>Old Business Type:</Form.Label>
                        <Form.Select value={oldBusinessType} onChange={handleOldBusinessTypeChange} required>
                            <option value="">Select Old Business Type</option>
                            {populateBusinessTypeOptions()}
                        </Form.Select>
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group controlId="formNewBussType">
                        <Form.Label>New Business Type:</Form.Label>
                        <Form.Control type="text" value={newBusinessType} onChange={handleNewBusinessTypeChange} required />
                    </Form.Group>
                </Col>
            </Row>
            <Row className="mt-3">
                <Col>
                    <Button variant="primary" onClick={handleAddClick}>
                        Change Business Type
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
                    <h2>List of Business Types</h2>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Business Type</th>
                                <th>Grade</th>
                                <th>Description</th>
                                <th>Fees</th>
                            </tr>
                        </thead>
                        <tbody>
                            {businessTypes.map((bussType, index) => (
                                <tr key={index}>
                                    <td>{bussType.buss_type}</td>
                                    <td>{bussType.grade}</td>
                                    <td>{bussType.description}</td>
                                    <td>{bussType.fees}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Col>
            </Row>
            <Row className="mt-3">
                
                <Link to="/main" className="primary m-3">
                    Go Back
                </Link>
                
            </Row>
        </Container>
    );
};

export default ChangeBusinessType;






// const express = require('express');
// const router = express.Router();
// const { Sequelize, DataTypes } = require('sequelize');
// const sequelize = new Sequelize('Saltpond', 'sa', 'Timbuk2tu', {
//     host: 'localhost',
//     dialect: 'mssql'
// });

// const BusinessType = sequelize.define('BusinessType', {
//     buss_type: {
//         type: DataTypes.STRING,
//         primaryKey: true
//     },
//     grade: DataTypes.STRING,
//     description: DataTypes.STRING,
//     fees: DataTypes.STRING
// }, {
//     tableName: 'tb_gradefees',
//     timestamps: false
// });

// router.get('/business-types', async (req, res) => {
//     try {
//         const businessTypes = await BusinessType.findAll({
//             attributes: ['buss_type', 'grade', 'description', 'fees'],
//             order: [['buss_type', 'ASC'], ['grade', 'ASC']]
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

// router.post('/change-business-type', async (req, res) => {
//     const { oldBusinessType, newBusinessType } = req.body;

//     if (!oldBusinessType || !newBusinessType) {
//         return res.status(400).json({ error: "Old and new business types are required" });
//     }

//     try {
//         const [gradefeesCount] = await sequelize.query(`
//             UPDATE tb_gradefees SET buss_type = ?
//             WHERE buss_type = ?
//         `, {
//             replacements: [newBusinessType, oldBusinessType],
//             type: sequelize.QueryTypes.UPDATE
//         });

//         const [businessCount] = await sequelize.query(`
//             UPDATE tb_business SET buss_type = ?
//             WHERE buss_type = ?
//         `, {
//             replacements: [newBusinessType, oldBusinessType],
//             type: sequelize.QueryTypes.UPDATE
//         });

//         if (gradefeesCount > 0 || businessCount > 0) {
//             res.json({ success: true });
//         } else {
//             res.json({ success: false, message: "This business type was not found." });
//         }
//     } catch (error) {
//         console.error("Error changing business type", error);
//         res.status(500).json({ error: "An error occurred while changing the business type" });
//     }
// });

// module.exports = router;
