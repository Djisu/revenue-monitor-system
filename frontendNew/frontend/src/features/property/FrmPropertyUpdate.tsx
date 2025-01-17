import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Table } from 'react-bootstrap';
import axios from 'axios';

interface Officer {
    officer_no: string;
    officer_name: string;
}

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
    rate: string;
    propertyuserate: string;
    propertytyperate: string;
    propertyclassrate: string;
    assessmentby: string;
}

interface PropertyType {
    property_type: string;
    rate: string;
}

interface PropertyUse {
    propertyuse: string;
    propertyrate: string;
}

interface PropertyClass {
    property_class: string;
    rate: string;
}

const PropertyUpdate: React.FC = () => {
    const [officers, setOfficers] = useState<Officer[]>([]);
    const [properties, setProperties] = useState<Property[]>([]);
    const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([]);
    const [propertyUses, setPropertyUses] = useState<PropertyUse[]>([]);
    const [propertyClasses, setPropertyClasses] = useState<PropertyClass[]>([]);
    const [electoralAreas, setElectoralAreas] = useState<string[]>([]);

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
    const [rate, setRate] = useState<string>('0.0000');
    const [propertyUseRate, setPropertyUseRate] = useState<string>('0.0000');
    const [propertyTypeRate, setPropertyTypeRate] = useState<string>('0.0000');
    const [propertyClassRate, setPropertyClassRate] = useState<string>('0.0000');
    const [assessmentBy, setAssessmentBy] = useState<string>('');

    useEffect(() => {
        fetchOfficers();
        fetchProperties();
        fetchPropertyTypes();
        fetchPropertyUses();
        fetchPropertyClasses();
        fetchElectoralAreas();
    }, []);

    const fetchOfficers = async () => {
        try {
            const response = await axios.get<Officer[]>('/api/officers');
            setOfficers(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchProperties = async () => {
        try {
            const response = await axios.get<Property[]>('/api/properties');
            setProperties(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchPropertyTypes = async () => {
        try {
            const response = await axios.get<PropertyType[]>('/api/property-types');
            setPropertyTypes(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchPropertyUses = async () => {
        try {
            const response = await axios.get<PropertyUse[]>('/api/property-uses');
            setPropertyUses(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchPropertyClasses = async () => {
        try {
            const response = await axios.get<PropertyClass[]>('/api/property-classes');
            setPropertyClasses(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchElectoralAreas = async () => {
        try {
            const response = await axios.get<string[]>('/api/electoral-areas');
            setElectoralAreas(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleOfficerNoChange = (event: React.ChangeEvent<HTMLElement>) => {
        const target = event.target as HTMLSelectElement;
        const selectedOfficerNo = target.value;
        setAssessmentBy(selectedOfficerNo);
    };

    const handlePropertyUseChange = (event: React.ChangeEvent<HTMLElement>) => {
        const target = event.target as HTMLSelectElement;
        const selectedPropertyUse = target.value;
        setPropertyUse(selectedPropertyUse);

        const propertyUseItem = propertyUses.find(pu => pu.propertyuse === selectedPropertyUse);
        if (propertyUseItem) {
            setPropertyUseRate(propertyUseItem.propertyrate);
            calculateRate();
        }
    };

    const handlePropertyTypeChange = (event: React.ChangeEvent<HTMLElement>) => {
        const target = event.target as HTMLSelectElement;
        const selectedPropertyType = target.value;
        setPropertyType(selectedPropertyType);

        const propertyTypeItem = propertyTypes.find(pt => pt.property_type === selectedPropertyType);
        if (propertyTypeItem) {
            setPropertyTypeRate(propertyTypeItem.rate);
            calculateRate();
        }
    };

    const handlePropertyClassChange = (event: React.ChangeEvent<HTMLElement>) => {
        const target = event.target as HTMLSelectElement;
        const selectedPropertyClass = target.value;
        setPropertyClass(selectedPropertyClass);

        const propertyClassItem = propertyClasses.find(pc => pc.property_class === selectedPropertyClass);
        if (propertyClassItem) {
            setPropertyClassRate(propertyClassItem.rate);
            calculateRate();
        }
    };

    const handleElectoralAreaChange = (event: React.ChangeEvent<HTMLElement>) => {
        const target = event.target as HTMLSelectElement;
        const selectedElectoralArea = target.value;
        setElectoralArea(selectedElectoralArea);
    };

    const handleHouseNoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const houseNo = event.target.value;
        setHouseNo(houseNo);
        fetchPropertyDetails(houseNo);
    };

    const fetchPropertyDetails = async (houseNo: string) => {
        try {
            const response = await axios.get<Property>('/api/property-details', { params: { house_no: houseNo } });
            const property = response.data;

            if (property) {
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
                setRate(property.rate);
                setPropertyUseRate(property.propertyuserate);
                setPropertyTypeRate(property.propertytyperate);
                setPropertyClassRate(property.propertyclassrate);
                setAssessmentBy(property.assessmentby);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const calculateRate = () => {
        const useRate = parseFloat(propertyUseRate || '0');
        const typeRate = parseFloat(propertyTypeRate || '0');
        const classRate = parseFloat(propertyClassRate || '0');

        const calculatedRate = useRate * typeRate * classRate;
        setRate(calculatedRate.toFixed(4));
    };

    const handleEditProperty = async () => {
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
            alert("Kindly enter the land mark");
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
        if (!rate) {
            alert("Kindly enter the property rate");
            return;
        }
        if (!assessmentBy) {
            alert("Kindly enter the officer in charge of the property");
            return;
        }

        try {
            await axios.post('/api/edit-property', {
                house_no: houseNo,
                owner: owner,
                tenant: tenant,
                propertyuse: propertyUse,
                propertytype: propertyType,
                propertyclass: propertyClass,
                electroral_area: electoralArea,
                landmark: landMark,
                street_name: streetName,
                lattitude: lattitude,
                longitude: longitude,
                code: code,
                elevation: elevation,
                rate: rate,
                propertyuserate: propertyUseRate,
                propertytyperate: propertyTypeRate,
                propertyclassrate: propertyClassRate,
                assessmentby: assessmentBy,
            });
            alert("Record successfully edited");
            fetchProperties();
        } catch (error) {
            console.error(error);
            alert("Error in editing a record");
        }
    };

    return (
        <Container>
            <Row>
                <Col className="text-center mt-3">
                    <h2 className="text-primary">Update a Property</h2>
                    <h4 className="text-info">MARCORY MUNICIPAL ASSEMBLY</h4>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Form.Label className="font-weight-bold">House Number:</Form.Label>
                    <Form.Control type="text" value={houseNo} onChange={handleHouseNoChange} />
                </Col>
            </Row>
            <Row className="mt-3">
                <Col>
                    <Form.Label className="font-weight-bold">Owner:</Form.Label>
                    <Form.Control type="text" value={owner} onChange={(e) => setOwner(e.target.value)} />
                </Col>
                <Col>
                    <Form.Label className="font-weight-bold">Tenant:</Form.Label>
                    <Form.Control type="text" value={tenant} onChange={(e) => setTenant(e.target.value)} />
                </Col>
            </Row>
            <Row className="mt-3">
                <Col>
                    <Form.Label className="font-weight-bold">Use Of Property:</Form.Label>
                    <Form.Control as="select" value={propertyUse} onChange={handlePropertyUseChange}>
                        <option value="">Select...</option>
                        {propertyUses.map(pu => (
                            <option key={pu.propertyuse} value={pu.propertyuse}>
                                {pu.propertyuse}
                            </option>
                        ))}
                    </Form.Control>
                </Col>
                <Col>
                    <Form.Label className="font-weight-bold">Property Type:</Form.Label>
                    <Form.Control as="select" value={propertyType} onChange={handlePropertyTypeChange}>
                        <option value="">Select...</option>
                        {propertyTypes.map(pt => (
                            <option key={pt.property_type} value={pt.property_type}>
                                {pt.property_type}
                            </option>
                        ))}
                    </Form.Control>
                </Col>
            </Row>
            <Row className="mt-3">
                <Col>
                    <Form.Label className="font-weight-bold">Class Of Property:</Form.Label>
                    <Form.Control as="select" value={propertyClass} onChange={handlePropertyClassChange}>
                        <option value="">Select...</option>
                        {propertyClasses.map(pc => (
                            <option key={pc.property_class} value={pc.property_class}>
                                {pc.property_class}
                            </option>
                        ))}
                    </Form.Control>
                </Col>
                <Col>
                    <Form.Label className="font-weight-bold">Electoral Area:</Form.Label>
                    <Form.Control as="select" value={electoralArea} onChange={handleElectoralAreaChange}>
                        <option value="">Select...</option>
                        {electoralAreas.map(area => (
                            <option key={area} value={area}>
                                {area}
                            </option>
                        ))}
                    </Form.Control>
                </Col>
            </Row>
            <Row className="mt-3">
                <Col>
                    <Form.Label className="font-weight-bold">Landmark:</Form.Label>
                    <Form.Control type="text" value={landMark} onChange={(e) => setLandMark(e.target.value)} />
                </Col>
                <Col>
                    <Form.Label className="font-weight-bold">Street Name:</Form.Label>
                    <Form.Control type="text" value={streetName} onChange={(e) => setStreetName(e.target.value)} />
                </Col>
            </Row>
            <Row className="mt-3">
                <Col>
                    <Form.Label className="font-weight-bold">Lattitude:</Form.Label>
                    <Form.Control type="text" value={lattitude} onChange={(e) => setLattitude(e.target.value)} />
                </Col>
                <Col>
                    <Form.Label className="font-weight-bold">Longitude:</Form.Label>
                    <Form.Control type="text" value={longitude} onChange={(e) => setLongitude(e.target.value)} />
                </Col>
            </Row>
            <Row className="mt-3">
                <Col>
                    <Form.Label className="font-weight-bold">Code:</Form.Label>
                    <Form.Control type="text" value={code} onChange={(e) => setCode(e.target.value)} />
                </Col>
                <Col>
                    <Form.Label className="font-weight-bold">Elevation:</Form.Label>
                    <Form.Control type="text" value={elevation} onChange={(e) => setElevation(e.target.value)} />
                </Col>
            </Row>
            <Row className="mt-3">
                <Col>
                    <Form.Label className="font-weight-bold">Value of Property:</Form.Label>
                    <Form.Control type="text" value={rate} readOnly />
                </Col>
                <Col>
                    <Form.Label className="font-weight-bold">Officer:</Form.Label>
                    <Form.Control as="select" value={assessmentBy} onChange={handleOfficerNoChange}>
                        <option value="">Select...</option>
                        {officers.map(officer => (
                            <option key={officer.officer_no} value={officer.officer_no}>
                                {officer.officer_no} - {officer.officer_name}
                            </option>
                        ))}
                    </Form.Control>
                </Col>
            </Row>
            <Row className="mt-3">
                <Col>
                    <Form.Label className="font-weight-bold">Use Of Property Rate:</Form.Label>
                    <Form.Control type="text" value={propertyUseRate} readOnly />
                </Col>
                <Col>
                    <Form.Label className="font-weight-bold">Type Of Property Rate:</Form.Label>
                    <Form.Control type="text" value={propertyTypeRate} readOnly />
                </Col>
                <Col>
                    <Form.Label className="font-weight-bold">Class Of Property Rate:</Form.Label>
                    <Form.Control type="text" value={propertyClassRate} readOnly />
                </Col>
            </Row>
            <Row className="mt-3">
                <Col>
                    <Button variant="primary" onClick={handleEditProperty}>
                        Edit a Property
                    </Button>
                </Col>
                <Col>
                    <Button variant="danger" onClick={() => window.close()}>
                        Exit to Main Menu
                    </Button>
                </Col>
            </Row>
            <Row className="mt-3">
                <Col>
                    <h3 className="font-weight-bold">List of Properties</h3>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>BUSS NO</th>
                                <th>BUSS NAME</th>
                                <th>BUSS TYPE</th>
                                <th>PERMIT NO</th>
                                <th>STREET NAME</th>
                                <th>LANDMARK</th>
                                <th>ELECTORAL AREA</th>
                                <th>PROPERTY CLASS</th>
                                <th>GRADE</th>
                                <th>OWNER</th>
                                <th>TEL NO</th>
                                <th>OFFICER NO</th>
                                <th>TRANSDATE</th>
                                <th>STATUS</th>
                                <th>SERIALNO</th>
                                <th>CURRENT RATE</th>
                                <th>PROPERTY RATE</th>
                            </tr>
                        </thead>
                        <tbody>
                            {properties.map(property => (
                                <tr key={property.house_no}>
                                    <td>{property.house_no}</td>
                                    <td>{property.owner}</td>
                                    <td>{property.propertyuse}</td>
                                    <td>{property.house_no}</td>
                                    <td>{property.street_name}</td>
                                    <td>{property.landmark}</td>
                                    <td>{property.electroral_area}</td>
                                    <td>{property.propertyclass}</td>
                                    <td>{property.propertyclass}</td>
                                    <td>{property.owner}</td>
                                    <td>{property.propertyclass}</td>
                                    <td>{property.assessmentby}</td>
                                    <td>{property.house_no}</td>
                                    <td>{property.house_no}</td>
                                    <td>{property.house_no}</td>
                                    <td>{parseFloat(property.rate).toFixed(4)}</td>
                                    <td>{parseFloat(property.rate).toFixed(4)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Col>
            </Row>
        </Container>
    );
};

export default PropertyUpdate;
