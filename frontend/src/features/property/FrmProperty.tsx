import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Row, Col, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/store';
import { fetchProperties, createProperty } from './propertySlice';
import { fetchElectoralAreas } from '../electoralArea/electoralAreaSlice';
import { fetchOfficers } from '../officer/officerSlice';
import { fetchPropertyClassesDistinct, fetchRate, fetchPropertyClassDescriptions, fetchDescription } from '../propertyClass/propertyClassSlice';

interface FormData {
    house_no: string;
    owner: string;
    tenant: string;
    propertyuse: string;
    propertytype: string;
    propertyclass: string;
    electroral_area: string;
    landmark: string;
    street_name: string;
    code?: string;
    elevation?: number;
    rate: number;
    Assessmentby: string;
    balance?: number;
    PropertyUseRate?: number;
    PropertytypeRate?: number;
    PropertyclassRate?: number;
    gps_address?: string;
    propertyclass_desc: string;
    no_of_rooms?: number;
    property_assessed: string;
    house_value?: number;
    property_rate: number;
}

// Define the type for PropertyClass data
// interface PropertyClassData {
//     property_class: string;
//     description: string;
//     frequency: string;
//     rate: number;
//     assessed: string;
// }

// // Define the type for distinct property classes
// interface PropClassItem {
//     property_class: string;
// }

const FrmProperty: React.FC = () => {
    const [propertyClassesData, setPropertyClassesData] = useState<string[]>([]);

    const [isFrozen, setIsFrozen] = useState(true);

    const [propertyClassesDesc, setPropertyClassesDesc] = useState<string[]>([]);

    const [assessments, setAssessments] = useState<string[]>([]);
    const [properties, setProperties] = useState<FormData[]>([]);
    const [electoralAreas, setElectoralAreas] = useState<string[]>([]);
    const [formData, setFormData] = useState<FormData>({
        house_no: '',
        owner: '',
        tenant: '',
        propertyuse: '',
        propertytype: '',
        propertyclass: '',
        electroral_area: '',
        landmark: '',
        street_name: '',
        code: '',
        elevation: 0,
        rate: 0,
        Assessmentby: '',
        balance: 0,
        PropertyUseRate: 0,
        PropertytypeRate: 0,
        PropertyclassRate: 0,
        gps_address: '',
        propertyclass_desc: '',
        no_of_rooms: 0,
        property_assessed: '',
        house_value: 0,
        property_rate: 0,
    });

    setProperties(properties)

    const dispatch = useAppDispatch();

        const electoralAreaData = useAppSelector((state) => state.electoralArea.electoralAreas);
    const officer = useAppSelector((state) => state.officer.officers);

    const propertyClassesState = useAppSelector((state) => state.propertyClass);
    const { propertyClasses } = propertyClassesState;

    //const propertyClassesDistinctState = useAppSelector((state) => state.propertyClass.propertyClasses);

    // like this below. below is actually wrong. I want to get the description of the PropertyClassState
    const propertyClassDescriptions = useAppSelector(
        (state) => state.propertyClass.propertyClassDescriptions
      );
      

    console.log('propertyClassDescriptions: ', propertyClassDescriptions);

    // if (loading) {
    //     return <div>Loading...</div>;
    // }

    // if (error) {
    //     return <div>Error: {error}</div>;
    // }



    useEffect(() => {
        setAssessments(officer.map((officer) => officer.officer_name));
    }, [officer]);

    useEffect(() => {
        // Fetch properties and dropdown options on form load
        dispatch(fetchProperties());
        dispatch(fetchElectoralAreas());
        dispatch(fetchOfficers());
        dispatch(fetchPropertyClassDescriptions())
    }, [dispatch]);

    useEffect(() => {
        console.log('about to fetch property classes');
        dispatch(fetchPropertyClassesDistinct()); // Dispatch the thunk to fetch data
    }, [dispatch]); // Ensure this runs only once

    useEffect(() => {
        if (propertyClasses) {
            console.log('propertyClasses:', propertyClasses);
            const propertyClassesData = propertyClasses.map((propertyClass) => propertyClass.property_class)
            setPropertyClassesData(propertyClassesData);
        }
    }, [propertyClasses]); // This will re-run only when propertyClasses changes

    useEffect(() => {
        if (propertyClasses) {
            
            setPropertyClassesDesc(propertyClasses.map((propertyClass) => propertyClass.description));
            console.log('propertyClassesDesc:', propertyClassesDesc);
        }
    }, [propertyClasses]); // This will re-run only when propertyClasses changes



    useEffect(() => {
        if (electoralAreaData && Array.isArray(electoralAreaData)) {
            setElectoralAreas(electoralAreaData.map((area) => area.electroral_area)); // Corrected key here
        }
    }, [electoralAreaData]);




    const handleAddClick = async () => {
        console.log('in handleAddClick');

        setIsFrozen(false);

        if (!formData.house_no) {
            alert("Kindly enter the house number");
            return;
        }
        if (!formData.owner) {
            alert("Kindly enter the owner");
            return;
        }
        if (!formData.tenant) {
            alert("Kindly enter the tenant");
            return;
        }
        if (!formData.propertyuse) {
            alert("Kindly select the use of property");
            return;
        }
        if (!formData.propertytype) {
            alert("Kindly select the type of property");
            return;
        }
        if (!formData.propertyclass) {
            alert("Kindly select the class of property");
            return;
        }
        if (!formData.electroral_area) {
            alert("Kindly select the electoral area");
            return;
        }
        if (!formData.landmark) {
            alert("Kindly enter the landmark");
            return;
        }
        if (!formData.street_name) {
            alert("Kindly enter the street name");
            return;
        }
        if (!formData.rate) {
            alert("Kindly enter the property rate");
            return;
        }
        if (!formData.Assessmentby) {
            alert("Kindly enter the officer in charge of the property");
            return;
        }
        if (!formData.gps_address) {
            alert("Kindly enter the GPS address");
            return;
        }
        if (!formData.property_rate) {
            alert("Kindly enter the property rate");
            return;
        }

        try {
            console.log('formData:', formData);
            console.log('about to dispatch createProperty thunk');

            // Dispatch the createProperty thunk with the propertyData
            const response = await dispatch(createProperty(formData));
            console.log('createProperty response:', response);
            console.log('createProperty response.payload:', response.payload);

            if (response.payload) {
                alert("Record successfully added");
                setFormData({
                    house_no: '',
                    owner: '',
                    tenant: '',
                    propertyuse: '',
                    propertytype: '',
                    propertyclass: '',
                    electroral_area: '',
                    landmark: '',
                    street_name: '',
                    code: '',
                    elevation: 0,
                    rate: 0,
                    Assessmentby: '',
                    balance: 0,
                    PropertyUseRate: 0,
                    PropertytypeRate: 0,
                    PropertyclassRate: 0,
                    gps_address: '',
                    propertyclass_desc: '',
                    no_of_rooms: 0,
                    property_assessed: '',
                    house_value: 0,
                    property_rate: 0,
                });

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

    // const assessedOptions = [
    //     "Assessed Valued Properties",
    //     "Unassessed Properties - Flat Rate Categories"
    // ];

    type FormControlElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

    const handleChange = (e: React.ChangeEvent<FormControlElement>) => {
        const { name, value } = e.target;

        // Convert value to appropriate type based on FormData interface
        let newValue: string | number = value;

        if (name === 'elevation' || name === 'rate' || name === 'balance' || name === 'PropertyUseRate' || 
            name === 'PropertytypeRate' || name === 'PropertyclassRate' || name === 'no_of_rooms' || name === 'house_value' || name === 'property_rate') {
            newValue = parseFloat(value);
        }

        setFormData((prevData) => ({
            ...prevData,
            [name]: newValue,
        }));
    };

    const findRate = async (propertyAssessed: string, propertyClassDesc: string): Promise<number | null> => {
        console.log('in findRate: ', propertyAssessed, propertyClassDesc)

        

        if (propertyAssessed && propertyClassDesc) {
            try {
                const rate = await dispatch(fetchRate({ propertyAssessed, propertyClassDesc })).unwrap();
                console.log('rate:', rate.rate);
                return rate.rate;
            } catch (error) {
                console.error('Error fetching rate:', error);
                return null;
            }
        } else {
            //alert("Please select the correct property assessed and property class description (Impose MMDAs)");
            return 0;
        }
    };

    const handleBlur = async () => {
        console.log('in handleBlur');

        if (formData.property_assessed && formData.propertyclass_desc) {
            const rate = await findRate(formData.property_assessed, formData.propertyclass_desc);
            console.log('rate:', rate);

            if (rate !== null) {
                setFormData((prevData) => ({
                    ...prevData,
                    rate: rate,
                }));
            } else {
                setFormData((prevData) => ({
                    ...prevData,
                    rate: 0,
                }));
            }
        } else {
            //alert("Please select the property assessed and property class description (Impose MMDAs)"); 
        }
    };
    
    const handleBlurdDescription = async () => {
        console.log('in handleBlurdDescription');
        console.log(' formData.property_assessed:', formData.property_assessed);

        if (formData.property_assessed) {

            const propertyClassDesc = await dispatch(fetchDescription(formData.property_assessed)).unwrap();
           

            if (propertyClassDesc) {
                setPropertyClassesDesc(propertyClassDesc)
            } else {
                alert('Property description not found')
            }
        } else {
            alert("Please select the property class");
        }
    };

    const calcPropertyRate = async () => {
        console.log('in calcPropertyRate');  // 

        if (formData.property_assessed == 'Assessed Valued Properties' && formData.house_value) {
            const proprate = formData.rate * formData.house_value;
            
            console.log('proprate:', proprate);
            if (formData.property_rate !== null) {
                setFormData((prevData) => ({
                    ...prevData,
                     property_rate: proprate,
                }));
            } else {
                setFormData((prevData) => ({
                    ...prevData,
                     property_rate: 0,
                }));
            }
        } else if (formData.property_assessed == 'Unassessed Properties - Flat Rate Categories' && formData.no_of_rooms) {
            const proprate = formData.rate * formData.no_of_rooms;
            
            console.log('proprate:', proprate);
            if (formData.property_rate !== null) {
                setFormData((prevData) => ({
                    ...prevData,
                     property_rate: proprate,
                }));
            } else {
                setFormData((prevData) => ({
                    ...prevData,
                     property_rate: 0,
                }));
            }
        } else {
            //alert("Please select the property assessed and property class description (Impose MMDAs)");
        }
    }


    return (
        <Container fluid style={{ backgroundColor: '#add8e6' }}>
            <Row className="mb-3">
                <Col>
                    <h1 className="text-center text-primary">MARCORY MUNICIPAL ASSEMBLY</h1>
                </Col>
            </Row>
            <Row>
                <Col>
                    <h5 className="text-center text-danger">PROPERTY DATA ENTRY</h5>
                </Col>
            </Row>
            <Row className="mt-3">
                <Col>
                    <Form.Group controlId="formHouseNo">
                        <Form.Label>House Number:</Form.Label>
                        <Form.Control
                            type="text"
                            name="house_no"
                            value={formData.house_no}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group controlId="formGpsAddress">
                        <Form.Label>GPS Address:</Form.Label>
                        <Form.Control
                            type="text"
                            name="gps_address"
                            value={formData.gps_address || ''}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                </Col>

                <Col>
                    <Form.Group controlId="formOwner">
                        <Form.Label>Owner:</Form.Label>
                        <Form.Control
                            type="text"
                            name="owner"
                            value={formData.owner}
                            onChange={handleChange}
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
                            name="tenant"
                            value={formData.tenant}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group controlId="formPropertyUse">
                        <Form.Label>Use of Property:</Form.Label>
                        <Form.Select
                            name="propertyuse"
                            value={formData.propertyuse}
                            onChange={handleChange}
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
                            name="propertytype"
                            value={formData.propertytype}
                            onChange={handleChange}
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
                            name="propertyclass"
                            value={formData.propertyclass}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Property Class</option>
                            {propertyClasses.map((option) => (
                                <option key={option.property_class} value={option.property_class}>{option.property_class}</option>
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
                            name="electroral_area"
                            value={formData.electroral_area}
                            onChange={handleChange}
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
                            name="Assessmentby"
                            value={formData.Assessmentby}
                            onChange={handleChange}
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
                            name="landmark"
                            value={formData.landmark}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group controlId="formStreetName">
                        <Form.Label>Street Name:</Form.Label>
                        <Form.Control
                            type="text"
                            name="street_name"
                            value={formData.street_name}
                            onChange={handleChange}
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
                            name="code"
                            value={formData.code || ''}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group controlId="formElevation">
                        <Form.Label>Elevation:</Form.Label>
                        <Form.Control
                            type="number"
                            name="elevation"
                            value={formData.elevation || 0}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                </Col>
            </Row>
            <Row className="mt-3">
                <Col>
                    <Form.Group controlId="formPropertyAssessed">
                        <Form.Label>Property Assessed or Not Assessed Flat Rate:</Form.Label>
                        <Form.Control
                            as="select"
                            name="property_assessed"
                            value={formData.property_assessed}
                            onChange={(e) => {
                                const selectedValue = e.target.value;
                                setFormData({
                                    ...formData,
                                    property_assessed: selectedValue,
                                    no_of_rooms: 0, // Initialize no_of_rooms to zero
                                    house_value: 0 // Initialize house_value to zero
                                });
                                // Freeze the fields when selection changes to an empty value
                                setIsFrozen(selectedValue === '');
                            }}
                            onBlur={handleBlurdDescription}
                            required
                        >
                            <option value="">Select</option>
                            <option value="Assessed Valued Properties">Assessed Valued Properties</option>
                            <option value="Unassessed Properties - Flat Rate Categories">Unassessed Properties - Flat Rate Categories</option>
                        </Form.Control>
                    </Form.Group>
                </Col>
            </Row>

            <Row className="mt-3">
                <Col>
                    <Form.Group controlId="formPropertyDesc">
                        <Form.Label>Impose (MMDAs):</Form.Label>
                        <Form.Select                           
                            name="propertyclass_desc"
                            value={formData.propertyclass_desc}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            required
                        >
                        <option value="">Select Impose (MMDAs)</option>
                            {propertyClassesDesc.map((desc, index) => (
                                <option key={index} value={desc}>{desc}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </Col>
            </Row>   

            <Row className="mt-3">            
                <Col>
                    <Form.Group controlId="formNoOfRooms">
                        <Form.Label>No: Of Rooms:</Form.Label>
                        <Form.Control
                            type="number"
                            name="no_of_rooms"
                            value={formData.no_of_rooms || 0}
                            onChange={handleChange}
                            onBlur={calcPropertyRate}
                            required
                            readOnly={isFrozen || formData.property_assessed == "Assessed Valued Properties"}
                        />
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group controlId="formHouseValue">
                        <Form.Label>Value of House:</Form.Label>
                        <Form.Control
                              type="number"
                              name="house_value"
                              value={formData.house_value || 0}
                              onChange={handleChange}
                              onBlur={calcPropertyRate}
                              required
                              readOnly={isFrozen || formData.property_assessed == "Unassessed Properties - Flat Rate Categories"}
                        />
                    </Form.Group>
                </Col>

                <Col>
                    <Form.Group controlId="formRate">
                        <Form.Label>Charges:</Form.Label>
                        <Form.Control
                            type="number"
                            name="rate"
                            value={formData.rate || 0}
                            onChange={handleChange}
                            readOnly
                        />
                    </Form.Group>
                </Col>

                <Col>
                    <Form.Group controlId="formPropertyRate">
                        <Form.Label>Property Rate:</Form.Label>
                        <Form.Control
                            type="text"
                            name="property_rate"
                            value={formData.property_rate || 0}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                </Col>
               
            </Row>
            <Row className="mt-3">
                <Col>
                    <Button variant="primary" onClick={handleAddClick} disabled={isFrozen}>
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
                                <tr key={index}>
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
                {propertyClassesData}
            </Row>
        </Container>
    );
};

export default FrmProperty;



























































