import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Row, Col, Table } from 'react-bootstrap';
import axios from 'axios';

interface Property {
    house_no: string;
    owner: string;
    tenant: string;
    propertyuse: string;
    propertytype: string;
    propertyclass: string;
    electroral_area: string;
    landmark: string;
    street_name: string;
    lattitude: string;
    longitude: string;
    code: string;
    elevation: string;
    rate: number;
    Assessmentby: string;
    balance: number;
    PropertyUseRate: number;
    PropertytypeRate: number;
    PropertyclassRate: number;
}

interface ComboBoxOption {
    value: string;
    label: string;
}

const FrmProperty: React.FC = () => {
    const [houseNo, setHouseNo] = useState<string>('');
    const [owner, setOwner] = useState<string>('');
    const [tenant, setTenant] = useState<string>('');
    const [propertyUse, setPropertyUse] = useState<string>('');
    const [propertyType, setPropertyType] = useState<string>('');
    const [propertyClass, setPropertyClass] = useState<string>('');
    const [electoralArea, setElectoralArea] = useState<string>('');
    const [landMark, setLandMark] = useState<string>('');
    const [streetName, setStreetName] = useState<string>('');
    const [lattitude, setLattitude] = useState<string>('');
    const [longitude, setLongitude] = useState<string>('');
    const [code, setCode] = useState<string>('');
    const [elevation, setElevation] = useState<string>('');
    const [propertyRate, setPropertyRate] = useState<number>(0.0000);
    const [propertyUseRate, setPropertyUseRate] = useState<number>(0.0000);
    const [propertyTypeRate, setPropertyTypeRate] = useState<number>(0.0000);
    const [propertyClassRate, setPropertyClassRate] = useState<number>(0.0000);
    const [assessmentBy, setAssessmentBy] = useState<string>('');
    const [properties, setProperties] = useState<Property[]>([]);
    const [electoralAreaOptions, setElectoralAreaOptions] = useState<ComboBoxOption[]>([]);
    const [propertyTypeOptions, setPropertyTypeOptions] = useState<ComboBoxOption[]>([]);
    const [propertyClassOptions, setPropertyClassOptions] = useState<ComboBoxOption[]>([]);
    const [assessmentByOptions, setAssessmentByOptions] = useState<ComboBoxOption[]>([]);

    useEffect(() => {
        // Fetch properties and dropdown options on form load
        fetchProperties();
        fetchElectoralAreaOptions();
        fetchPropertyTypeOptions();
        fetchPropertyClassOptions();
        fetchAssessmentByOptions();
    }, []);

    const fetchProperties = async () => {
        try {
            const response = await axios.get('/api/properties');
            setProperties(response.data);
        } catch (error) {
            console.error("Error fetching properties", error);
            alert("An error occurred while fetching properties");
        }
    };

    const fetchElectoralAreaOptions = async () => {
        try {
            const response = await axios.get('/api/electoral-area-options');
            setElectoralAreaOptions(response.data.map((area: any) => ({
                value: area.electoral_area,
                label: area.electoral_area
            })));
        } catch (error) {
            console.error("Error fetching electoral area options", error);
            alert("No electoral area entered yet");
        }
    };

    const fetchPropertyTypeOptions = async () => {
        try {
            const response = await axios.get('/api/property-type-options');
            setPropertyTypeOptions(response.data.map((type: any) => ({
                value: type.property_type,
                label: type.property_type
            })));
        } catch (error) {
            console.error("Error fetching property type options", error);
            alert("Error fetching property type options");
        }
    };

    const fetchPropertyClassOptions = async () => {
        try {
            const response = await axios.get('/api/property-class-options');
            setPropertyClassOptions(response.data.map((cls: any) => ({
                value: cls.property_class,
                label: cls.property_class
            })));
        } catch (error) {
            console.error("Error fetching property class options", error);
            alert("Error fetching property class options");
        }
    };

    const fetchAssessmentByOptions = async () => {
        try {
            const response = await axios.get('/api/assessment-by-options');
            setAssessmentByOptions(response.data.map((officer: any) => ({
                value: `${officer.officer_no} ${officer.officer_name}`,
                label: `${officer.officer_no} ${officer.officer_name}`
            })));
        } catch (error) {
            console.error("Error fetching assessment by options", error);
            alert("No officer entered yet");
        }
    };

    const handleElectoralAreaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setElectoralArea(e.target.value);
        fetchPropertyUseRate(e.target.value);
    };

    const handlePropertyTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setPropertyType(e.target.value);
        fetchPropertyTypeRate(e.target.value);
    };

    const handlePropertyUseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setPropertyUse(e.target.value);
    };

    const handlePropertyClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setPropertyClass(e.target.value);
        fetchPropertyClassRate(e.target.value);
    };

    const handleAssessmentByChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setAssessmentBy(e.target.value);
    };

    const fetchPropertyUseRate = async (electoralArea: string) => {
        if (!electoralArea) {
            return;
        } 

        try {
            const response = await axios.get('/api/property-use-rate', {
                params: { electoral_area: electoralArea }
            });

            if (response.data.length > 0) {
                setPropertyUseRate(response.data[0].propertyrate);
            } else {
                alert("No rate found");
            }
        } catch (error) {
            console.error("Error fetching property use rate", error);
            alert("Error fetching property use rate");
        }
    };

    const fetchPropertyTypeRate = async (propertyType: string) => {
        if (!propertyType) {
            return;
        } 

        try {
            const response = await axios.get('/api/property-type-rate', {
                params: { propertyType }
            });

            if (response.data.length > 0) {
                setPropertyTypeRate(response.data[0].rate);
            } else {
                alert("No rate found");
            }
        } catch (error) {
            console.error("Error fetching property type rate", error);
            alert("Error fetching property type rate");
        }
    };

    const fetchPropertyClassRate = async (propertyClass: string) => {
        if (!propertyClass) {
           return;
        }
        try {
            const response = await axios.get('/api/property-class-rate', {
                params: { propertyClass }
            });

            if (response.data.length > 0) {
                setPropertyClassRate(response.data[0].rate);
            } else {
                alert("No rate found");
            }
        } catch (error) {
            console.error("Error fetching property class rate", error);
            alert("Error fetching property class rate");
        }
    };

    const handleAddClick = async () => {
        if (!houseNo) {
            alert("Kindly enter the house number");
            return;
        }
        if (!owner) {
            alert("Kindly enter the owner");
            return;
        }
        if (!tenant) {
            alert("Kindly enter the tenant");
            return;
        }
        if (!propertyUse) {
            alert("Kindly select the use of property");
            return;
        }
        if (!propertyType) {
            alert("Kindly select the type of property");
            return;
        }
        if (!propertyClass) {
            alert("Kindly select the class of property");
            return;
        }
        if (!electoralArea) {
            alert("Kindly select the electoral area");
            return;
        }
        if (!landMark) {
            alert("Kindly enter the landmark");
            return;
        }
        if (!streetName) {
            alert("Kindly enter the street name");
            return;
        }
        if (!lattitude) {
            alert("Kindly enter the Lattitude");
            return;
        }
        if (!longitude) {
            alert("Kindly enter the Longitude");
            return;
        }
        if (!code) {
            alert("Kindly enter the code");
            return;
        }
        if (!elevation) {
            alert("Kindly enter the elevation");
            return;
        }
        if (!propertyRate) {
            alert("Kindly enter the property rate");
            return;
        }
        if (!assessmentBy) {
            alert("Kindly enter the officer in charge of the property");
            return;
        }

        try {
            const response = await axios.post('/api/add-property', {
                house_no: houseNo,
                owner,
                tenant,
                propertyuse: propertyUse,
                propertytype: propertyType,
                propertyclass: propertyClass,
                electroral_area: electoralArea,
                landmark: landMark,
                street_name: streetName,
                lattitude,
                longitude,
                code,
                elevation,
                rate: propertyRate,
                Assessmentby: assessmentBy,
                balance: 0,
                PropertyUseRate: propertyUseRate,
                PropertytypeRate: propertyTypeRate,
                PropertyclassRate: propertyClassRate
            });

            if (response.data.success) {
                alert("Record successfully added");
                // Clear input fields
                setHouseNo('');
                setOwner('');
                setTenant('');
                setPropertyUse('');
                setPropertyType('');
                setPropertyClass('');
                setElectoralArea('');
                setLandMark('');
                setStreetName('');
                setLattitude('');
                setLongitude('');
                setCode('');
                setElevation('');
                setPropertyRate(0.0000);
                setAssessmentBy('');
                // Refresh the list of properties
                fetchProperties();
            } else {
                alert("Record already exists");
            }
        } catch (error) {
            console.error("Error adding property", error);
            alert("Error in adding a record");
        }
    };

    const handleExitClick = () => {
        // Hide the form and show main form (this can be handled via routing)
        console.log("Exit button clicked");
        // For example, you might navigate to another route here
        // history.push('/main-form');
    };

    const handleRowClick = (property: Property) => {
        setHouseNo(property.house_no);
        setOwner(property.owner);
        setTenant(property.tenant);
        setPropertyUse(property.propertyuse);
        setPropertyType(property.propertytype);
        setPropertyClass(property.propertyclass);
        setElectoralArea(property.electroral_area);
        setLandMark(property.landmark);
        setStreetName(property.street_name);
        setLattitude(property.lattitude);
        setLongitude(property.longitude);
        setCode(property.code);
        setElevation(property.elevation);
        setPropertyRate(property.rate);
        setAssessmentBy(property.Assessmentby);
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
                    <h3 className="text-center text-danger">PROPERTY DATA ENTRY</h3>
                </Col>
            </Row>
            <Row className="mt-3">
                <Col>
                    <Form.Group controlId="formHouseNo">
                        <Form.Label>House Number:</Form.Label>
                        <Form.Control
                            type="text"
                            value={houseNo}
                            onChange={(e) => setHouseNo(e.target.value)}
                            required
                        />
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group controlId="formOwner">
                        <Form.Label>Owner:</Form.Label>
                        <Form.Control
                            type="text"
                            value={owner}
                            onChange={(e) => setOwner(e.target.value)}
                            required
                        />
                    </Form.Group>
                </Col>
            </Row>
            <Row className="mt-3">
                <Col>
                    <Form.Group controlId="formTenant">
                        <Form.Label>Tenant:</Form.Label>
                        <Form.Control
                            type="text"
                            value={tenant}
                            onChange={(e) => setTenant(e.target.value)}
                            required
                        />
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group controlId="formPropertyUse">
                        <Form.Label>Use of Property:</Form.Label>
                        <Form.Select
                            value={propertyUse}
                            onChange={handlePropertyUseChange}
                            required
                        >
                            <option value="">Select Use of Property</option>
                            {propertyClassOptions.map(option => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </Col>
            </Row>
            <Row className="mt-3">
                <Col>
                    <Form.Group controlId="formPropertyType">
                        <Form.Label>Type of Property:</Form.Label>
                        <Form.Select
                            value={propertyType}
                            onChange={handlePropertyTypeChange}
                            required
                        >
                            <option value="">Select Type of Property</option>
                            {propertyTypeOptions.map(option => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group controlId="formPropertyClass">
                        <Form.Label>Class of Property:</Form.Label>
                        <Form.Select
                            value={propertyClass}
                            onChange={handlePropertyClassChange}
                            required
                        >
                            <option value="">Select Class of Property</option>
                            {propertyClassOptions.map(option => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </Col>
            </Row>
            <Row className="mt-3">
                <Col>
                    <Form.Group controlId="formElectoralArea">
                        <Form.Label>Electoral Area:</Form.Label>
                        <Form.Select
                            value={electoralArea}
                            onChange={handleElectoralAreaChange}
                            required
                        >
                            <option value="">Select Electoral Area</option>
                            {electoralAreaOptions.map(option => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group controlId="formAssessmentBy">
                        <Form.Label>Officer:</Form.Label>
                        <Form.Select
                            value={assessmentBy}
                            onChange={handleAssessmentByChange}
                            required
                        >
                            <option value="">Select Officer</option>
                            {assessmentByOptions.map(option => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </Col>
            </Row>
            <Row className="mt-3">
                <Col>
                    <Form.Group controlId="formLandMark">
                        <Form.Label>Landmark:</Form.Label>
                        <Form.Control
                            type="text"
                            value={landMark}
                            onChange={(e) => setLandMark(e.target.value)}
                            required
                        />
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group controlId="formStreetName">
                        <Form.Label>Street Name:</Form.Label>
                        <Form.Control
                            type="text"
                            value={streetName}
                            onChange={(e) => setStreetName(e.target.value)}
                            required
                        />
                    </Form.Group>
                </Col>
            </Row>
            <Row className="mt-3">
                <Col>
                    <Form.Group controlId="formLattitude">
                        <Form.Label>Lattitude:</Form.Label>
                        <Form.Control
                            type="text"
                            value={lattitude}
                            onChange={(e) => setLattitude(e.target.value)}
                            required
                        />
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group controlId="formLongitude">
                        <Form.Label>Longitude:</Form.Label>
                        <Form.Control
                            type="text"
                            value={longitude}
                            onChange={(e) => setLongitude(e.target.value)}
                            required
                        />
                    </Form.Group>
                </Col>
            </Row>
            <Row className="mt-3">
                <Col>
                    <Form.Group controlId="formCode">
                        <Form.Label>Code:</Form.Label>
                        <Form.Control
                            type="text"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            required
                        />
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group controlId="formElevation">
                        <Form.Label>Elevation:</Form.Label>
                        <Form.Control
                            type="text"
                            value={elevation}
                            onChange={(e) => setElevation(e.target.value)}
                            required
                        />
                    </Form.Group>
                </Col>
            </Row>
            <Row className="mt-3">
                <Col>
                    <Form.Group controlId="formPropertyRate">
                        <Form.Label>Property Rate:</Form.Label>
                        <Form.Control
                            type="number"
                            step="0.0001"
                            value={propertyRate}
                            onChange={(e) => setPropertyRate(parseFloat(e.target.value))}
                            required
                        />
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group controlId="formPropertyUseRate">
                        <Form.Label>Use of Property Rate:</Form.Label>
                        <Form.Control
                            type="number"
                            step="0.0001"
                            value={propertyUseRate}
                            onChange={(e) => setPropertyUseRate(parseFloat(e.target.value))}
                            readOnly
                        />
                    </Form.Group>
                </Col>
            </Row>
            <Row className="mt-3">
                <Col>
                    <Form.Group controlId="formPropertyTypeRate">
                        <Form.Label>Type of Property Rate:</Form.Label>
                        <Form.Control
                            type="number"
                            step="0.0001"
                            value={propertyTypeRate}
                            onChange={(e) => setPropertyTypeRate(parseFloat(e.target.value))}
                            readOnly
                        />
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group controlId="formPropertyClassRate">
                        <Form.Label>Class of Property Rate:</Form.Label>
                        <Form.Control
                            type="number"
                            step="0.0001"
                            value={propertyClassRate}
                            onChange={(e) => setPropertyClassRate(parseFloat(e.target.value))}
                            readOnly
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
                    <Button variant="danger" onClick={handleExitClick}>
                        Exit to Main Menu
                    </Button>
                </Col>
            </Row>
            <Row className="mt-3">
                <Col>
                    <h2>List of Properties</h2>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>House No</th>
                                <th>Owner</th>
                                <th>Tenant</th>
                                <th>Use of Property</th>
                                <th>Electoral Area</th>
                            </tr>
                        </thead>
                        <tbody>
                            {properties.map((property, index) => (
                                <tr key={index} onClick={() => handleRowClick(property)}>
                                    <td>{property.house_no}</td>
                                    <td>{property.owner}</td>
                                    <td>{property.tenant}</td>
                                    <td>{property.propertyuse}</td>
                                    <td>{property.electroral_area}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Col>
            </Row>
        </Container>
    );
};

export default FrmProperty;

// const express = require('express');
// const router = express.Router();
// const { Sequelize, DataTypes } = require('sequelize');
// const sequelize = new Sequelize('Saltpond', 'sa', 'Timbuk2tu', {
//     host: 'localhost',
//     dialect: 'mssql'
// });

// const Property = sequelize.define('Property', {
//     house_no: {
//         type: DataTypes.STRING,
//         primaryKey: true
//     },
//     owner: DataTypes.STRING,
//     tenant: DataTypes.STRING,
//     propertyuse: DataTypes.STRING,
//     propertytype: DataTypes.STRING,
//     propertyclass: DataTypes.STRING,
//     electroral_area: DataTypes.STRING,
//     landmark: DataTypes.STRING,
//     street_name: DataTypes.STRING,
//     lattitude: DataTypes.STRING,
//     longitude: DataTypes.STRING,
//     code: DataTypes.STRING,
//     elevation: DataTypes.STRING,
//     rate: DataTypes.DECIMAL(13, 2),
//     Assessmentby: DataTypes.STRING,
//     balance: DataTypes.DECIMAL(13, 2),
//     PropertyUseRate: DataTypes.DECIMAL(13, 4),
//     PropertytypeRate: DataTypes.DECIMAL(13, 4),
//     PropertyclassRate: DataTypes.DECIMAL(13, 4)
// }, {
//     tableName: 'tb_Property',
//     timestamps: false
// });

// router.get('/properties', async (req, res) => {
//     try {
//         const properties = await Property.findAll({
//             order: [['electroral_area', 'ASC']]
//         });
//         res.json(properties);
//     } catch (error) {
//         console.error("Error fetching properties", error);
//         res.status(500).json({ error: "An error occurred while fetching properties" });
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

// const ElectoralArea = sequelize.define('ElectoralArea', {
//     electoral_area: {
//         type: DataTypes.STRING,
//         primaryKey: true
//     }
// }, {
//     tableName: 'tb_ElectoralArea',
//     timestamps: false
// });

// router.get('/electoral-area-options', async (req, res) => {
//     try {
//         const electoralAreas = await ElectoralArea.findAll({
//             order: [['electoral_area', 'ASC']]
//         });
//         res.json(electoralAreas);
//     } catch (error) {
//         console.error("Error fetching electoral area options", error);
//         res.status(500).json({ error: "An error occurred while fetching electoral area options" });
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
//     rate: DataTypes.DECIMAL(13, 4)
// }, {
//     tableName: 'tb_Propertytype',
//     timestamps: false
// });

// router.get('/property-type-options', async (req, res) => {
//     try {
//         const propertyTypes = await PropertyType.findAll({
//             order: [['property_type', 'ASC']]
//         });
//         res.json(propertyTypes);
//     } catch (error) {
//         console.error("Error fetching property type options", error);
//         res.status(500).json({ error: "An error occurred while fetching property type options" });
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

// const PropertyClass = sequelize.define('PropertyClass', {
//     property_class: {
//         type: DataTypes.STRING,
//         primaryKey: true
//     },
//     rate: DataTypes.DECIMAL(13, 4)
// }, {
//     tableName: 'tb_Propertyclass',
//     timestamps: false
// });

// router.get('/property-class-options', async (req, res) => {
//     try {
//         const propertyClasses = await PropertyClass.findAll({
//             order: [['property_class', 'ASC']]
//         });
//         res.json(propertyClasses);
//     } catch (error) {
//         console.error("Error fetching property class options", error);
//         res.status(500).json({ error: "An error occurred while fetching property class options" });
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

// const PropertyOfficer = sequelize.define('PropertyOfficer', {
//     officer_no: {
//         type: DataTypes.STRING,
//         primaryKey: true
//     },
//     officer_name: DataTypes.STRING
// }, {
//     tableName: 'tb_Propertyofficer',
//     timestamps: false
// });

// router.get('/assessment-by-options', async (req, res) => {
//     try {
//         const officers = await PropertyOfficer.findAll({
//             order: [['officer_no', 'ASC']]
//         });
//         res.json(officers);
//     } catch (error) {
//         console.error("Error fetching assessment by options", error);
//         res.status(500).json({ error: "An error occurred while fetching assessment by options" });
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

// const PropertyUse = sequelize.define('PropertyUse', {
//     propertyuse: {
//         type: DataTypes.STRING,
//         primaryKey: true
//     },
//     propertyrate: DataTypes.DECIMAL(13, 4)
// }, {
//     tableName: 'tb_Propertyuse',
//     timestamps: false
// });

// router.get('/property-use-rate', async (req, res) => {
//     const { electoral_area } = req.query;

//     if (!electoral_area) {
//         return res.status(400).json({ error: "Electoral area is required" });
//     }

//     try {
//         const propertyUse = await PropertyUse.findOne({
//             where: {
//                 propertyuse: electoral_area
//             }
//         });

//         if (propertyUse) {
//             res.json(propertyUse);
//         } else {
//             res.json([]);
//         }
//     } catch (error) {
//         console.error("Error fetching property use rate", error);
//         res.status(500).json({ error: "An error occurred while fetching property use rate" });
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
//     rate: DataTypes.DECIMAL(13, 4)
// }, {
//     tableName: 'tb_Propertytype',
//     timestamps: false
// });

// router.get('/property-type-rate', async (req, res) => {
//     const { property_type } = req.query;

//     if (!property_type) {
//         return res.status(400).json({ error: "Property type is required" });
//     }

//     try {
//         const propertyType = await PropertyType.findOne({
//             where: {
//                 property_type
//             }
//         });

//         if (propertyType) {
//             res.json(propertyType);
//         } else {
//             res.json([]);
//         }
//     } catch (error) {
//         console.error("Error fetching property type rate", error);
//         res.status(500).json({ error: "An error occurred while fetching property type rate" });
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

// const PropertyClass = sequelize.define('PropertyClass', {
//     property_class: {
//         type: DataTypes.STRING,
//         primaryKey: true
//     },
//     rate: DataTypes.DECIMAL(13, 4)
// }, {
//     tableName: 'tb_Propertyclass',
//     timestamps: false
// });

// router.get('/property-class-rate', async (req, res) => {
//     const { property_class } = req.query;

//     if (!property_class) {
//         return res.status(400).json({ error: "Property class is required" });
//     }

//     try {
//         const propertyClass = await PropertyClass.findOne({
//             where: {
//                 property_class
//             }
//         });

//         if (propertyClass) {
//             res.json(propertyClass);
//         } else {
//             res.json([]);
//         }
//     } catch (error) {
//         console.error("Error fetching property class rate", error);
//         res.status(500).json({ error: "An error occurred while fetching property class rate" });
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

// const Property = sequelize.define('Property', {
//     house_no: {
//         type: DataTypes.STRING,
//         primaryKey: true
//     },
//     owner: DataTypes.STRING,
//     tenant: DataTypes.STRING,
//     propertyuse: DataTypes.STRING,
//     propertytype: DataTypes.STRING,
//     propertyclass: DataTypes.STRING,
//     electroral_area: DataTypes.STRING,
//     landmark: DataTypes.STRING,
//     street_name: DataTypes.STRING,
//     lattitude: DataTypes.STRING,
//     longitude: DataTypes.STRING,
//     code: DataTypes.STRING,
//     elevation: DataTypes.STRING,
//     rate: DataTypes.DECIMAL(13, 2),
//     Assessmentby: DataTypes.STRING,
//     balance: DataTypes.DECIMAL(13, 2),
//     PropertyUseRate: DataTypes.DECIMAL(13, 4),
//     PropertytypeRate: DataTypes.DECIMAL(13, 4),
//     PropertyclassRate: DataTypes.DECIMAL(13, 4)
// }, {
//     tableName: 'tb_Property',
//     timestamps: false
// });

// const PropertyBilling = sequelize.define('PropertyBilling', {
//     house_no: {
//         type: DataTypes.STRING,
//         primaryKey: true
//     },
//     fiscalyear: DataTypes.INTEGER,
//     balancebf: DataTypes.DECIMAL(13, 2),
//     current_rate: DataTypes.DECIMAL(13, 4),
//     transdate: DataTypes.DATE,
//     electoralarea: DataTypes.STRING,
//     assessmentby: DataTypes.STRING
// }, {
//     tableName: 'tb_PropertyBilling',
//     timestamps: false
// });

// router.post('/add-property', async (req, res) => {
//     const { house_no, owner, tenant, propertyuse, propertytype, propertyclass, electroral_area, landmark, street_name, lattitude, longitude, code, elevation, rate, Assessmentby, balance, PropertyUseRate, PropertytypeRate, PropertyclassRate } = req.body;

//     if (!house_no || !owner || !tenant || !propertyuse || !propertytype || !propertyclass || !electroral_area || !landmark || !street_name || !lattitude || !longitude || !code || !elevation || !rate || !Assessmentby) {
//         return res.status(400).json({ error: "All fields are required" });
//     }

//     try {
//         const existingProperty = await Property.findOne({
//             where: {
//                 house_no
//             }
//         });

//         if (existingProperty) {
//             return res.json({ success: false, message: "Record already exists" });
//         }

//         await Property.create({
//             house_no,
//             owner,
//             tenant,
//             propertyuse,
//             propertytype,
//             propertyclass,
//             electroral_area,
//             landmark,
//             street_name,
//             lattitude,
//             longitude,
//             code,
//             elevation,
//             rate,
//             Assessmentby,
//             balance,
//             PropertyUseRate,
//             PropertytypeRate,
//             PropertyclassRate
//         });

//         const varFiscalYear = new Date().getFullYear();

//         const existingBilling = await PropertyBilling.findOne({
//             where: {
//                 house_no,
//                 fiscalyear: varFiscalYear
//             }
//         });

//         if (!existingBilling) {
//             await PropertyBilling.create({
//                 house_no,
//                 fiscalyear: varFiscalYear,
//                 balancebf: 0,
//                 current_rate: PropertyUseRate,
//                 transdate: new Date(),
//                 electoralarea: electroral_area,
//                 assessmentby: Assessmentby
//             });
//         }

//         res.json({ success: true });
//     } catch (error) {
//         console.error("Error adding property", error);
//         res.status(500).json({ error: "Error in adding a record" });
//     }
// });

// module.exports = router;
