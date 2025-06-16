import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Row, Col, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/store';
import { fetchProperties, createProperty } from './propertySlice';
import { fetchElectoralAreas } from '../electoralArea/electoralAreaSlice';
import { fetchOfficers } from '../officer/officerSlice';
import { fetchPropertyClassesDistinct, fetchPropertyClassesByDescription, fetchPropertyClassDescriptions } from '../propertyClass/propertyClassSlice';

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
}

// Define the type for PropertyClass data
interface PropertyClassData {
    property_class: string;
    description: string;
    frequency: string;
    rate: number;
    assessed: string;
}

// Define the type for distinct property classes
interface PropClassItem {
    property_class: string;
}

const FrmProperty: React.FC = () => {
    const [propertyClassesData, setPropertyClassesData] = useState<string[]>([]);

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
    });

    const electoralAreaData = useAppSelector((state) => state.electoralArea.electoralAreas);
    const dispatch = useAppDispatch();
    const officer = useAppSelector((state) => state.officer.officers);
    const propertyClassesState = useAppSelector((state) => state.propertyClass);
    const { loading, error, propertyClasses } = propertyClassesState;

    const propertyClassesDistinctState = useAppSelector((state) => state.propertyClass.propertyClasses);

    // like this below. below is actually wrong. I want to get the description of the PropertyClassState
    const propertyClassDescriptions = useAppSelector(
        (state) => state.propertyClass.propertyClassDescriptions
      );
      

    console.log('propertyClassDescriptions: ', propertyClassDescriptions);

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
            setPropertyClassesData(propertyClasses.map((propertyClass) => propertyClass.property_class));
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

        try {
            console.log('formData:', formData);
            console.log('about to dispatch createProperty thunk');
            // Dispatch the createProperty thunk with the propertyData
            const response = await dispatch(createProperty(formData));
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

    const assessedOptions = [
        "Assessed/Valued Properties",
        "Unassessed Properties - Flat Rate Categories"
    ];

    type FormControlElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

    const handleChange = (e: React.ChangeEvent<FormControlElement>) => {
        const { name, value } = e.target;

        // Convert value to appropriate type based on FormData interface
        let newValue: string | number = value;

        if (name === 'elevation' || name === 'rate' || name === 'balance' || name === 'PropertyUseRate' || 
            name === 'PropertytypeRate' || name === 'PropertyclassRate' || name === 'no_of_rooms' || name === 'house_value') {
            newValue = parseFloat(value);
        }

        setFormData((prevData) => ({
            ...prevData,
            [name]: newValue,
        }));
    };

    // Function to fetch property class details
    const findPropertyClassDetails = async (desc: string) => {
        try {
            const response: PropertyClassData = await dispatch(fetchPropertyClassesByDescription(desc)).unwrap();
            if (response) {
                setFormData(prevData => ({
                    ...prevData,
                    PropertyclassRate: response.rate,
                    propertyclass_desc: response.description,
                    // Update other fields as needed
                }));
            } else {
                console.warn("No property class details found for description:", desc);
            }
        } catch (error) {
            console.error("Failed to fetch property class details", error);
        }
    };

    return (
        <Container fluid style={{ backgroundColor: '#add8e6' }}>
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
                            name="house_no"
                            value={formData.house_no}
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
                <Col>
                    <Form.Group controlId="formPropertyDesc">
                        <Form.Label>Class of Property Description:</Form.Label>
                        <Form.Select                           
                            name="propertyclass_desc"
                            value={formData.propertyclass_desc}
                            onChange={handleChange}
                            required
                        >
                        <option value="">Select Property Class Description</option>
                            {propertyClassDescriptions.map((desc, index) => (
                                <option key={index} value={desc}>{desc}</option>
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
                            value={formData.elevation || ''}
                            onChange={handleChange}
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
                            name="rate"
                            value={formData.rate}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                </Col>
            </Row>
            <Row className="mt-3">
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
                    <Form.Group controlId="formNoOfRooms">
                        <Form.Label>Number Of Rooms:</Form.Label>
                        <Form.Control
                            type="number"
                            name="no_of_rooms"
                            value={formData.no_of_rooms || ''}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group controlId="formHouseValue">
                        <Form.Label>Value of House:</Form.Label>
                        <Form.Control
                            type="number"
                            name="house_value"
                            value={formData.house_value || ''}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group controlId="formPropertyAssessed">
                        <Form.Label>Property Assessed or Not Assessed Flat Rate:</Form.Label>
                        <Form.Select
                            name="property_assessed"
                            value={formData.property_assessed}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Property Assessed or Not Assessed Flat Rate Category</option>
                            {assessedOptions.map(option => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </Form.Select>
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
            </Row>
        </Container>
    );
};

export default FrmProperty;



























































// import React, { useState, useEffect } from 'react';
// import { Container, Form, Button, Row, Col, Table } from 'react-bootstrap';
// import { Link } from 'react-router-dom';
// import { useAppDispatch, useAppSelector } from '../../app/store';
// import { fetchProperties, createProperty, PropertyData } from './propertySlice';
// import { fetchElectoralAreas } from '../electoralArea/electoralAreaSlice';

// import { fetchOfficers } from '../officer/officerSlice';
// import {fetchPropertyClassesDistinct, fetchPropertyClassesByDescription} from '../propertyClass/propertyClassSlice'


// interface FormData {
//     house_no: string;
//     owner: string;
//     tenant: string;
//     propertyuse: string;
//     propertytype: string;
//     propertyclass: string;
//     electroral_area: string;
//     landmark: string;
//     street_name: string;
//     code?: string;
//     elevation?: string;
//     rate: number;
//     Assessmentby: string;
//     balance?: number;
//     PropertyUseRate?: number;
//     PropertytypeRate?: number;
//     PropertyclassRate?: number;
//     gps_address?: string;
//     propertyclass_desc: string;
//     no_of_rooms?: number;
//     property_assessed: string
//     house_value?: number;
// }

// // Define the type for PropertyClass data
// export interface PropertyClassDatax {
//     property_class: string;
//     description: string;
//     frequency: string;
//     rate: number;
//     assessed: string;
// }

// export interface PropClassItem {
//     property_class: string;
// }


// const FrmProperty: React.FC = () => {
   
//      const [propertyClassesData, setPropertyClassesData] = useState<string[]>([]);
   

//      const [assessments, setAssessments] = useState<string[]>([]);
//      const [properties, setProperties] = useState<FormData[]>([]);
//      const [electoralAreas, setElectoralAreas] = useState<string[]>([]);
    

//     const [formData, setFormData] = useState<FormData>({
//         house_no: '',
//         owner: '',
//         tenant: '',
//         propertyuse: '',
//         propertytype: '',
//         propertyclass: '',
//         electroral_area: '',
//         landmark: '',
//         street_name: '',
//         code: '',
//         elevation: '',
//         rate: 0,
//         Assessmentby: '',
//         balance: 0,
//         PropertyUseRate: 0,
//         PropertytypeRate: 0,
//         PropertyclassRate: 0,
//         gps_address: '',
//         propertyclass_desc: '',
//         no_of_rooms: 0,
//         property_assessed: '',
//         house_value: 0,
//     });
    
//     const electoralAreaData = useAppSelector((state) => state.electoralArea.electoralAreas);

//     const dispatch = useAppDispatch();
//    // const propertiesState = useAppSelector((state) => state.property);

   

//     const officer = useAppSelector((state) => state.officer.officers);

//     useEffect(() => {
//         setAssessments(officer.map((officer) => `${officer.officer_name}`));
//     }, [officer]);

//     const propertyClassesState = useAppSelector((state) => state.propertyClass);
//     const { loading, error, propertyClasses } = propertyClassesState;

//     const propertyClassesDistinctState = useAppSelector((state) => state.propertyClass.propertyClasses);


//     if (loading){
//         <div>Loading...</div>
//     }

//     if (error){
//         <div>Error: {error}</div>
//     }

//     useEffect(() => {
//         // Fetch properties and dropdown options on form load
//         fetchProperties();
//         dispatch(fetchElectoralAreas());
//         dispatch(fetchOfficers());
//     }, []);

//     useEffect(() => {
//         console.log('about to fetch property classes');
//         dispatch(fetchPropertyClassesDistinct()); // Dispatch the thunk to fetch data
//     }, [dispatch]); // Ensure this runs only once

//     useEffect(() => {
//         if (propertyClasses) {
//             console.log('propertyClasses:', propertyClasses);
//             setPropertyClassesData(propertyClasses.map((propertyClass) => propertyClass.property_class));
//         }
//     }, [propertyClasses]); // This will re-run only when propertyClasses changes

//     useEffect(() => {
//         if (electoralAreaData && Array.isArray(electoralAreaData)) {
//             setElectoralAreas(electoralAreaData.map((area) => area.electroral_area));
//         }
//     }, [electoralAreaData]);
  
//     const handleAddClick = async () => {
//         if (!formData.house_no) {
//             alert("Kindly enter the house number");
//             return;
//         }
//         if (!formData.owner) {
//             alert("Kindly enter the owner");
//             return;
//         }
//         if (!formData.tenant) {
//             alert("Kindly enter the tenant");
//             return;
//         }
//         if (!formData.propertyuse) {
//             alert("Kindly select the use of property");
//             return;
//         }
//         if (!formData.propertytype) {
//             alert("Kindly select the type of property");
//             return;
//         }
//         if (!formData.propertyclass) {
//             alert("Kindly select the class of property");
//             return;
//         }
//         if (!formData.electroral_area) {
//             alert("Kindly select the electoral area");
//             return;
//         }
//         if (!formData.landmark) {
//             alert("Kindly enter the landmark");
//             return;
//         }
//         if (!formData.street_name) {
//             alert("Kindly enter the street name");
//             return;
//         }
      
//         // if (!formData.code) {
//         //     alert("Kindly enter the code");
//         //     return;
//         // }
//         // if (!formData.elevation) {
//         //     alert("Kindly enter the elevation");
//         //     return;
//         // }
//         if (!formData.rate) {
//             alert("Kindly enter the property rate");
//             return;
//         }
//         if (!formData.Assessmentby) {
//             alert("Kindly enter the officer in charge of the property");
//             return;
//         }
//         if (!formData.gps_address) {
//             alert("Kindly enter the GPS address");
//             return;
//         }

//         try {
//             console.log('formData:', formData)    
//             console.log('about to dispatch createProperty thunk') 

//             // Dispatch the createProperty thunk with the propertyData
//             const response = dispatch(createProperty(formData));

//             if ((await response).payload) {
//                 alert("Record successfully added");
              
//                 setFormData({
//                     house_no: '',
//                     owner: '',
//                     tenant: '',
//                     propertyuse: '',
//                     propertytype: '',
//                     propertyclass: '',
//                     electroral_area: '',
//                     landmark: '',
//                     street_name: '',
//                     code: '',
//                     elevation: '',
//                     rate: 0,
//                     Assessmentby: '',
//                     balance: 0,
//                     PropertyUseRate: 0,
//                     PropertytypeRate: 0,
//                     PropertyclassRate: 0,
//                     gps_address: '',
//                     propertyclass_desc: '',
//                     no_of_rooms: 0,
//                     property_assessed: '',
//                     house_value: 0,
//                 });
              
//                 setProperties((await response).payload)
            
//                 // Refresh the list of properties
//                 fetchProperties();
//             } else {
//                 alert("Record already exists");
//             }
//         } catch (error) {
//             console.error("Error adding property", error);
//             alert("Error in adding a record");
//         }
//     };

//     const propertyTypeOptions = [
//         "Single Family Home",
//         "Condominium",
//         "Apartment",
//         "Townhouse",
//         "Villa",
//         "Office Building",
//         "Retail Store",
//         "Warehouse",
//         "Factory",
//         "Hotel",
//         "Restaurant",
//         "Mall",
//         "Industrial Building",
//         "Farm",
//         "Ranch",
//         "Resort",
//         "Medical Facility",
//         "Healthcare Center",
//         "Educational Institution",
//         "Religious Building",
//         "Government Building",
//         "Institutional Building",
//         "Mixed Use Building",
//         "Storage Facility"
//     ];

//     const propertyUseOptions = [
//         "Residential",
//         "Commercial",
//         "Industrial",
//         "Agricultural",
//         "Vacant",
//         "Mixed Use",
//         "Government",
//         "Institutional",
//         "Educational",
//         "Religious",
//         "Retail",
//         "Office",
//         "Warehouse",
//         "Storage",
//         "Manufacturing",
//         "Hospitality",
//         "Medical",
//         "Healthcare",
//         "Residential Condominium",
//         "Commercial Condominium",
//         "Industrial Condominium",
//         "Hotel",
//         "Apartment",
//         "Townhouse",
//         "Villa",
//         "Farm",
//         "Ranch",
//         "Resort",
//         "Retirement Community",
//         "Senior Living Facility"
//     ];

//     const assessedOptions = [
//         "Assessed/Valued Properties",
//         "Unassessed Properties - Flat Rate Categories"
//     ];
    
//     type FormControlElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

//     const handleChange = (e: React.ChangeEvent<FormControlElement>) => {
//         e.target.value = e.target.value.trim();
//         console.log('e.target.name:', e.target.name)
        
//         const { name, value } = e.target;
//         setFormData((prevData) => ({
//             ...prevData,
//             [name]: value,
//         }));
//     };


//     return (
//         <Container fluid style={{ backgroundColor: '#add8e6' }}>
//         <Row className="mb-3">
//             <Col>
//                 <h1 className="text-center text-primary">MARCORY MUNICIPAL ASSEMBLY</h1>
//             </Col>
//         </Row>
//         <Row>
//             <Col>
//                 <h3 className="text-center text-danger">PROPERTY DATA ENTRY</h3>
//             </Col>
//         </Row>
//         <Row className="mt-3">
//             <Col>
//                 <Form.Group controlId="formHouseNo">
//                     <Form.Label>House Number:</Form.Label>
//                     <Form.Control
//                         type="text"
//                         value={formData.house_no}
//                         onChange={handleChange}
//                         required
//                     />
//                 </Form.Group>
//             </Col>
//             <Col>
//                 <Form.Group controlId="formOwner">
//                     <Form.Label>Owner:</Form.Label>
//                     <Form.Control
//                         type="text"
//                         value={formData.owner}
//                         onChange={handleChange}
//                         required
//                     />
//                 </Form.Group>
//             </Col>
//         </Row>
//         <Row className="mt-3">
//             <Col>
//                 <Form.Group controlId="formTenant">
//                     <Form.Label>Tenant:</Form.Label>
//                     <Form.Control
//                         type="text"
//                         value={formData.tenant}
//                         onChange={handleChange}
//                         required
//                     />
//                 </Form.Group>
//             </Col>
           
//             <Col>
//                 <Form.Group controlId="formPropertyUse">
//                     <Form.Label>Use of Property:</Form.Label>
//                     <Form.Select
//                         value={formData.propertyuse}
//                         onChange={handleChange}
//                         required
//                     >
//                         <option value="">Select Use of Property</option>
//                         {propertyUseOptions.map(option => (
//                             <option key={option} value={option}>{option}</option>
//                         ))}
//                     </Form.Select>
//                 </Form.Group>
//             </Col>
//         </Row>
//         <Row className="mt-3">
//             <Col>
//                 <Form.Group controlId="formPropertyType">
//                     <Form.Label>Type of Property:</Form.Label>
//                     <Form.Select
//                         value={formData.propertytype}
//                         onChange={handleChange}
//                         required
//                     >
//                         <option value="">Select Type of Property</option>
//                         {propertyTypeOptions.map(option => (
//                             <option key={option} value={option}>{option}</option>
//                         ))}
//                     </Form.Select>
//                 </Form.Group>
//             </Col>
           
//             <Col>
//                 <Form.Group controlId="formPropertyClass">
//                     <Form.Label>Class of Property:</Form.Label>
//                     <Form.Select
//                         value={formData.propertyclass}
//                         onChange={handleChange}
//                         required
//                     >
//                         <option value="">Select Impose (MMDAs)</option>
//                         {propertyClasses.map((option) => (
//                             <option key={option.description} value={option.description}>{option.description}</option>
//                         ))}
//                     </Form.Select>
//                 </Form.Group>
//             </Col>
//             <Col>
//                 <Form.Group controlId="formPropertyTypeRate">
//                     <Form.Label>Select Impose (MMDAs)</Form.Label>
//                     <Form.Select
//                         value={formData.propertyclass_desc}
//                         onChange={handleChange}
//                         required
//                     >
//                         <option value="">Select Type of Property</option>
//                         {propertyClassesDistinctState.map((option, index) => (
//                             <option key={index} value={option.description}>{option.description}</option>
//                         ))}
//                     </Form.Select>
//                 </Form.Group>
//             </Col>
//         </Row>
//         <Row className="mt-3">
//             <Col>
//                 <Form.Group controlId="formElectoralArea">
//                     <Form.Label>Electoral Area:</Form.Label>
//                     <Form.Select
//                         value={formData.electroral_area}
//                         onChange={handleChange}
//                         required
//                     >
//                         <option value="">Select Electoral Area</option>
//                         {electoralAreas.map((area, index) => (
//                             <option key={index} value={area}>{area}</option>
//                         ))}
//                     </Form.Select>
//                 </Form.Group>
//             </Col>
//             <Col>
//                 <Form.Group controlId="formAssessmentBy">
//                     <Form.Label>Officer:</Form.Label>
//                     <Form.Select
//                         value={formData.Assessmentby}
//                         onChange={handleChange}
//                         required
//                     >
//                         <option value="">Select Officer</option>
//                         {assessments.map((assessment, index) => (
//                             <option key={index} value={assessment}>{assessment}</option>
//                         ))}
//                     </Form.Select>
//                 </Form.Group>
//             </Col>
//         </Row>
//         <Row className="mt-3">
//             <Col>
//                 <Form.Group controlId="formLandMark">
//                     <Form.Label>Landmark:</Form.Label>
//                     <Form.Control
//                         type="text"
//                         value={formData.landmark}
//                         onChange={handleChange}
//                         required
//                     />
//                 </Form.Group>
//             </Col>
//             <Col>
//                 <Form.Group controlId="formStreetName">
//                     <Form.Label>Street Name:</Form.Label>
//                     <Form.Control
//                         type="text"
//                         value={formData.street_name}
//                         onChange={handleChange}
//                         required
//                     />
//                 </Form.Group>
//             </Col>
//         </Row>
//         <Row className="mt-3">
//             <Col>
//                 <Form.Group controlId="formCode">
//                     <Form.Label>Code:</Form.Label>
//                     <Form.Control
//                         type="text"
//                         value={formData.code}
//                         onChange={handleChange}
//                         required
//                     />
//                 </Form.Group>
//             </Col>
//             <Col>
//                 <Form.Group controlId="formElevation">
//                     <Form.Label>Elevation:</Form.Label>
//                     <Form.Control
//                         type="number"
//                         value={formData.elevation}
//                         onChange={handleChange}
//                         required
//                     />
//                 </Form.Group>
//             </Col>
//         </Row>
//         <Row className="mt-3">
//             <Col>
//                 <Form.Group controlId="formPropertyRate">
//                     <Form.Label>Property Rate:</Form.Label>
//                     <Form.Control
//                         type="number"
//                         step="0.0001"
//                         value={formData.rate}
//                         onChange={handleChange}
//                         required
//                     />
//                 </Form.Group>
//             </Col>
         
//         </Row>
//         <Row className="mt-3">
          
//             <Col>
//                 <Form.Group controlId="formGpsAddress">
//                     <Form.Label>GPS Address:</Form.Label>
//                     <Form.Control
//                         type="text"
//                         value={formData.gps_address}
//                         onChange={handleChange}
//                         required
//                     />
//                 </Form.Group>
//             </Col>
//             <Col>
//                 <Form.Group controlId="formNoOfRooms">
//                     <Form.Label>Number Of Rooms:</Form.Label>
//                     <Form.Control
//                         type="number"
//                         value={formData.no_of_rooms}
//                         onChange={handleChange}
//                         required
//                     />
//                 </Form.Group>
//             </Col>
//             <Col>
//                 <Form.Group controlId="formNoOfRooms">
//                     <Form.Label>Value of House:</Form.Label>
//                     <Form.Control
//                         type="number"
//                         value={formData.house_value}
//                         onChange={handleChange}
//                         required
//                     />
//                 </Form.Group>
//             </Col>
//             <Col>
//                 <Form.Group controlId="formPropertyAssessed">
//                     <Form.Label>Property Assessed or Not Assessed Flat Rate:</Form.Label>
//                     <Form.Select
//                         value={formData.propertyuse}
//                         onChange={handleChange}
//                         required
//                     >
//                         <option value="">Property Assessed or Not Assessed Flat Rate Category</option>
//                         {assessedOptions.map(option => (
//                             <option key={option} value={option}>{option}</option>
//                         ))}
//                     </Form.Select>
//                 </Form.Group>
//             </Col>

//         </Row>
//         <Row className="mt-3">
//             <Col>
//                 <Button variant="primary" onClick={handleAddClick}>
//                     Add New Record
//                 </Button>
//             </Col>
//         </Row>
//         <Row className="mt-3">
//             <Col>
//                 <h2>List of Properties</h2>
//                 <Table striped bordered hover>
//                     <thead>
//                         <tr>
//                             <th>House No</th>
//                             <th>Owner</th>
//                             <th>Tenant</th>
//                             <th>Use of Property</th>
//                             <th>Electoral Area</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {properties.map((property, index) => (
//                             <tr key={index}>
//                                 <td>{property.house_no}</td>
//                                 <td>{property.owner}</td>
//                                 <td>{property.tenant}</td>
//                                 <td>{property.propertyuse}</td>
//                                 <td>{property.electroral_area}</td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </Table>
//             </Col>
//         </Row>
//         <Row className="mt-3">
//             <Col>
//                 <Link to="/main" className="primary m-3">
//                     Go Back
//                 </Link>
//             </Col>
//         </Row>
//     </Container>
//     );
// };

// export default FrmProperty;

