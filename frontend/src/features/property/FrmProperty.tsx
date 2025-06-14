import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Row, Col, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/store';
import { fetchProperties, createProperty, PropertyData } from './propertySlice';
import { fetchElectoralAreas } from '../electoralArea/electoralAreaSlice';

import { fetchOfficers } from '../officer/officerSlice';
import {fetchPropertyClassesDistinct} from '../propertyClass/propertyClassSlice'


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
   
    code: string;
    elevation: string;
    rate: number;
    Assessmentby: string;
    balance: number;
    PropertyUseRate: number;
    PropertytypeRate: number;
    PropertyclassRate: number;
    gps_address: string;
}

// interface ComboBoxOption {
//     value: string;
//     label: string;
// }

const FrmProperty: React.FC = () => {
    const [houseNo, setHouseNo] = useState<string>('');
    const [owner, setOwner] = useState<string>('');
    const [tenant, setTenant] = useState<string>('');
    const [propertyUse, setPropertyUse] = useState<string>('');
    const [propertyType, setPropertyType] = useState<string>('');
    const [propertyClass, setPropertyClass] = useState<string>('');
    const [propertyClassesData, setPropertyClassesData] = useState<string[]>([]);
    const [electoralArea, setElectoralArea] = useState<string>('');
    const [landMark, setLandMark] = useState<string>('');
    const [streetName, setStreetName] = useState<string>('');
   
    const [code, setCode] = useState<string>('');
    const [elevation, setElevation] = useState<number>(0);
    const [propertyRate, setPropertyRate] = useState<number>(0.0000);
    const [propertyUseRate, setPropertyUseRate] = useState<number>(0);
    const [propertyTypeRate, setPropertyTypeRate] = useState<number>(0);
    const [propertyClassRate, setPropertyClassRate] = useState<number>(0);
   
    const [gpsAddress, setGpsAddress] = useState<string>('');
    const [assessments, setAssessments] = useState<string[]>([]);
    const [properties, setProperties] = useState<Property[]>([]);
    //const [electoralAreaOptions, setElectoralAreaOptions] = useState<ComboBoxOption[]>([]);
    // const [propertyTypeOptions, setPropertyTypeOptions] = useState<ComboBoxOption[]>([]);
    // const [propertyClassOptions, setPropertyClassOptions] = useState<ComboBoxOption[]>([]);
   // const [assessmentByOptions, setAssessmentByOptions] = useState<ComboBoxOption[]>([]);
    const [assessment, setAssessment] = useState('')

    const electoralAreaData = useAppSelector((state) => state.electoralArea.electoralAreas);

    const dispatch = useAppDispatch();
    const propertiesState = useAppSelector((state) => state.property);

    const [electoralAreas, setElectoralAreas] = useState<string[]>([]);

    const officer = useAppSelector((state) => state.officer.officers);

    useEffect(() => {
        setAssessments(officer.map((officer) => `${officer.officer_name}`));
    }, [officer]);

    const propertyClassesState = useAppSelector((state) => state.propertyClass);
    const { loading, error, propertyClasses } = propertyClassesState;

    if (loading){
        <div>Loading...</div>
    }

    if (error){
        <div>Error: {error}</div>
    }

    useEffect(() => {
        // Fetch properties and dropdown options on form load
        fetchProperties();
        dispatch(fetchElectoralAreas());
        dispatch(fetchOfficers());
    }, []);

    useEffect(() => {
        console.log('about to fetch property classes');
        dispatch(fetchPropertyClassesDistinct()); // Dispatch the thunk to fetch data
    }, [dispatch]); // Ensure this runs only once

    useEffect(() => {
        if (propertyClasses) {
            console.log('propertyClasses:', propertyClasses);
            setPropertyClassesData(propertyClasses.map((propertyClass) => propertyClass.property_class));
        }
    }, [propertyClasses]); // This will re-run only when propertyClasses changes

    useEffect(() => {
        if (electoralAreaData && Array.isArray(electoralAreaData)) {
            setElectoralAreas(electoralAreaData.map((area) => area.electroral_area));
        }
    }, [electoralAreaData]);
     
    const handleElectoralAreaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setElectoralArea(e.target.value);
    };

    const handlePropertyTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setPropertyType(e.target.value);
    };

    const handlePropertyUseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setPropertyUse(e.target.value);
    };

    const handlePropertyClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setPropertyClass(e.target.value);
    };

    const handleAssessmentByChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setAssessment(e.target.value);
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
        if (!assessments) {
            alert("Kindly enter the officer in charge of the property");
            return;
        }
        if (!gpsAddress) {
            alert("Kindly enter the GPS address");
            return;
        }

        try {
            const propertyData: PropertyData  = {
                house_no: houseNo,
                owner,
                tenant,
                propertyuse: propertyUse,
                propertytype: propertyType,
                propertyclass: propertyClass,
                electroral_area: electoralArea,
                landmark: landMark,
                street_name: streetName,
                code,
                elevation,
                rate: propertyRate,
                Assessmentby: assessment,
                balance: 0,
                PropertyUseRate: propertyUseRate,
                PropertytypeRate: propertyTypeRate,
                PropertyclassRate: propertyClassRate,
                gps_address: gpsAddress
            };
        
            // Dispatch the createProperty thunk with the propertyData
            const response = dispatch(createProperty(propertyData));

            if ((await response).payload) {
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
                setProperties((await response).payload)
             
                setCode('');
                setElevation(0);
                setPropertyRate(0.0000);
                setAssessment('');
                setGpsAddress('');
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
      
        setCode(property.code);
        setElevation(parseInt(property.elevation, 10));
        setPropertyRate(property.rate);
        setAssessment(property.Assessmentby);
        setGpsAddress(property.gps_address);
    };

    const propertyTypeOptions = [
        "Single Family Home",
        "Condominium",
        "Apartment",
        "Townhouse",
        "Villa",
        "Office Building",
        "Retail Store",
        "Warehouse",
        "Factory",
        "Hotel",
        "Restaurant",
        "Mall",
        "Industrial Building",
        "Farm",
        "Ranch",
        "Resort",
        "Medical Facility",
        "Healthcare Center",
        "Educational Institution",
        "Religious Building",
        "Government Building",
        "Institutional Building",
        "Mixed Use Building",
        "Storage Facility"
    ];

    const propertyUseOptions = [
        "Residential",
        "Commercial",
        "Industrial",
        "Agricultural",
        "Vacant",
        "Mixed Use",
        "Government",
        "Institutional",
        "Educational",
        "Religious",
        "Retail",
        "Office",
        "Warehouse",
        "Storage",
        "Manufacturing",
        "Hospitality",
        "Medical",
        "Healthcare",
        "Residential Condominium",
        "Commercial Condominium",
        "Industrial Condominium",
        "Hotel",
        "Apartment",
        "Townhouse",
        "Villa",
        "Farm",
        "Ranch",
        "Resort",
        "Retirement Community",
        "Senior Living Facility"
    ];
    
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
                            {propertyUseOptions.map(option => (
                                <option key={option} value={option}>{option}</option>
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
                            <option key={option} value={option}>{option}</option>
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
                            {propertyClasses.map((option, index) => (
                                <option key={index} value={option.property_class}>{option.property_class}</option>
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
                            {electoralAreas.map((area, index) => (
                                <option key={index} value={area}>{area}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group controlId="formAssessmentBy">
                        <Form.Label>Officer:</Form.Label>
                        <Form.Select
                            value={assessment}
                            onChange={handleAssessmentByChange}
                            required
                        >
                            <option value="">Select Officer</option>
                            {assessments.map((assessment, index) => (
                                        <option key={index} value={assessment}>{assessment}</option>
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
                            type="number"
                            value={elevation}
                            onChange={(e) => setElevation(parseInt(e.target.value, 10))}
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
                <Col>
                    <Form.Group controlId="formPropertyClassRate">
                        <Form.Label>GPS Address:</Form.Label>
                        <Form.Control
                            type="text"
                            step="0.0001"
                            value={gpsAddress}
                            onChange={(e) => setGpsAddress(e.target.value)}
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

