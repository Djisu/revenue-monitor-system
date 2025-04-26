import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Row, Col, Table } from 'react-bootstrap';
import axios from 'axios';
import { Link } from 'react-router-dom';

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

export default FrmProperty;

