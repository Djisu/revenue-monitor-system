import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Row, Col, Table } from 'react-bootstrap';
import axios from 'axios';

interface PropertyTypex {
    property_type: string;
    rate: number;
}

const PropertyTypeForm: React.FC = () => {
    const [propertyType, setPropertyType] = useState<string>('');
    const [rate, setRate] = useState<number>(0.0000);
    const [propertyTypes, setPropertyTypes] = useState<PropertyTypex[]>([]);

    useEffect(() => {
        // Fetch property types on form load
        fetchPropertyTypes();
    }, []);

    const fetchPropertyTypes = async () => {
        try {
            const response = await axios.get('/api/property-types');
            setPropertyTypes(response.data);
        } catch (error) {
            console.error("Error fetching property types", error);
            alert("An error occurred while fetching property types");
        }
    };

    const handlePropertyTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPropertyType(e.target.value);
    };

    const handleRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(e.target.value);
        if (!isNaN(value)) {
            setRate(value);
        }
    };

    const handleAddClick = async () => {
        if (!propertyType) {
            alert("Kindly enter the type of property");
            return;
        }
        if (isNaN(rate) || rate <= 0) {
            alert("Kindly enter a valid rate");
            return;
        }

        try {
            const response = await axios.post('/api/add-property-type', {
                propertyType,
                rate
            });

            if (response.data.success) {
                alert("Record successfully added");
                // Clear input fields
                setPropertyType('');
                setRate(0.0000);
                // Refresh the list of property types
                fetchPropertyTypes();
            } else {
                alert("Record already exists");
            }
        } catch (error) {
            console.error("Error adding property type", error);
            alert("Error in adding a record");
        }
    };

    const handleEditClick = async () => {
        if (!propertyType) {
            alert("Kindly enter the type of property");
            return;
        }
        if (isNaN(rate) || rate <= 0) {
            alert("Kindly enter a valid rate");
            return;
        }

        try {
            const response = await axios.post('/api/edit-property-type', {
                propertyType,
                rate
            });

            if (response.data.success) {
                alert("Record successfully edited");
                // Clear input fields
                setPropertyType('');
                setRate(0.0000);
                // Refresh the list of property types
                fetchPropertyTypes();
            } else {
                alert("Record does not exist!!");
            }
        } catch (error) {
            console.error("Error editing property type", error);
            alert("Error in editing a record");
        }
    };

    const handleExitClick = () => {
        // Hide the form and show main form (this can be handled via routing)
        console.log("Exit button clicked");
        // For example, you might navigate to another route here
        // history.push('/main-form');
    };

    const handleRowClick = (propertyType: PropertyTypex) => {
        setPropertyType(propertyType.property_type);
        setRate(propertyType.rate);
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
                    <h3 className="text-center text-danger">PROPERTY TYPE DATA ENTRY</h3>
                </Col>
            </Row>
            <Row className="mt-3">
                <Col>
                    <Form.Group controlId="formPropertyType">
                        <Form.Label>Property Type:</Form.Label>
                        <Form.Control
                            type="text"
                            value={propertyType}
                            onChange={handlePropertyTypeChange}
                            required
                        />
                    </Form.Group>
                </Col>
            </Row>
            <Row className="mt-3">
                <Col>
                    <Form.Group controlId="formRate">
                        <Form.Label>Rate:</Form.Label>
                        <Form.Control
                            type="number"
                            step="0.0001"
                            value={rate}
                            onChange={handleRateChange}
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
                    <Button variant="warning" onClick={handleEditClick}>
                        Edit Old Record
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
                    <h2>List of Property Classes</h2>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Property Type</th>
                                <th>Rate</th>
                            </tr>
                        </thead>
                        <tbody>
                            {propertyTypes.map((propertyType, index) => (
                                <tr key={index} onClick={() => handleRowClick(propertyType)}>
                                    <td>{propertyType.property_type}</td>
                                    <td>{propertyType.rate.toFixed(4)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Col>
            </Row>
        </Container>
    );
};

export default PropertyTypeForm;


// const express = require('express');
// const router = express.Router();
// const { Sequelize, DataTypes } = require('sequelize');
// const sequelize = new Sequelize('Saltpond', 'sa', 'Timbuk2tu', {
//     host: 'localhost',
//     dialect: 'mssql'
// });

// const PropertyType = sequelize.define('PropertyType', {
//     property_type: {
//         type: DataTypes.STRING,
//         primaryKey: true
//     },
//     rate: {
//         type: DataTypes.DECIMAL(13, 4),
//         allowNull: false
//     }
// }, {
//     tableName: 'tb_Propertytype',
//     timestamps: false
// });

// router.get('/property-types', async (req, res) => {
//     try {
//         const propertyTypes = await PropertyType.findAll({
//             order: [['property_type', 'ASC']]
//         });
//         res.json(propertyTypes);
//     } catch (error) {
//         console.error("Error fetching property types", error);
//         res.status(500).json({ error: "An error occurred while fetching property types" });
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

// const PropertyType = sequelize.define('PropertyType', {
//     property_type: {
//         type: DataTypes.STRING,
//         primaryKey: true
//     },
//     rate: {
//         type: DataTypes.DECIMAL(13, 4),
//         allowNull: false
//     }
// }, {
//     tableName: 'tb_Propertytype',
//     timestamps: false
// });

// router.post('/add-property-type', async (req, res) => {
//     const { property_type, rate } = req.body;

//     if (!property_type || isNaN(rate)) {
//         return res.status(400).json({ error: "Property type and rate are required" });
//     }

//     try {
//         const existingPropertyType = await PropertyType.findOne({
//             where: {
//                 property_type
//             }
//         });

//         if (existingPropertyType) {
//             return res.json({ success: false, message: "Record already exists" });
//         }

//         await PropertyType.create({
//             property_type,
//             rate
//         });

//         res.json({ success: true });
//     } catch (error) {
//         console.error("Error adding property type", error);
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

// const PropertyType = sequelize.define('PropertyType', {
//     property_type: {
//         type: DataTypes.STRING,
//         primaryKey: true
//     },
//     rate: {
//         type: DataTypes.DECIMAL(13, 4),
//         allowNull: false
//     }
// }, {
//     tableName: 'tb_Propertytype',
//     timestamps: false
// });

// router.post('/edit-property-type', async (req, res) => {
//     const { property_type, rate } = req.body;

//     if (!property_type || isNaN(rate)) {
//         return res.status(400).json({ error: "Property type and rate are required" });
//     }

//     try {
//         const updatedRows = await PropertyType.update({
//             rate
//         }, {
//             where: {
//                 property_type
//             }
//         });

//         if (updatedRows[0] > 0) {
//             res.json({ success: true });
//         } else {
//             res.json({ success: false, message: "Record does not exist!!" });
//         }
//     } catch (error) {
//         console.error("Error editing property type", error);
//         res.status(500).json({ error: "Error in editing a record" });
//     }
// });

// module.exports = router;


