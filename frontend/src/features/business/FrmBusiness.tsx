import React, { useState, useEffect } from 'react';
import { Button, Form, Col, Row, Spinner, Card } from 'react-bootstrap';

import { fetchElectoralAreas } from '../electoralArea/electoralAreaSlice';
import { fetchBusinessTypes } from '../businessType/businessTypeSlice';
import { fetchPropertyClasses } from '../propertyClass/propertyClassSlice';
import { fetchOfficers } from '../officer/officerSlice';
import { createBusiness, fetchLastBussNo } from './businessSlice';
import { useAppDispatch, useAppSelector } from '../../app/store';
import { Link } from 'react-router-dom';

interface BusinessTypeData {
    Business_Type: string;
    buss_type?: string;
    business_type?: string;
}

type FormData = {
    buss_no: number;
    buss_name?: string;
    buss_address?: string;
    buss_type?: string;
    buss_town?: string;
    buss_permitNo?: string;
    street_name?: string;
    landmark?: string;
    electroral_area?: string;
    property_class?: string;
    tot_grade?: string;
    ceo?: string;
    telno?: string;
    strategiclocation?: number;
    productvariety?: number;
    businesspopularity?: number;
    businessenvironment?: number;
    sizeofbusiness?: number;
    numberofworkingdays?: number;
    businessoperatingperiod?: number;
    competitorsavailable?: number;
    assessmentby?: string;
    transdate?: Date;
    balance?: number;
    status?: string;
    current_rate?: number;
    property_rate?: number;
    totalmarks?: number;
    emailaddress?: string; 
    postaladdress?: string;
    gps_address?: string; 
    noofemployees?: number;
    noofbranches?: number;
    BALANCENEW?: number;
};

export const FrmBusiness: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        buss_no: 0,
        buss_name: '',
        buss_address: '',
        buss_type: '',
        buss_town: '',
        buss_permitNo: '',
        street_name: '',
        landmark: '',
        electroral_area: '',
        property_class: '',
        tot_grade: '',
        ceo: '',
        telno: '',
        strategiclocation: 0,
        productvariety: 0,
        businesspopularity: 0,
        businessenvironment: 0,
        sizeofbusiness: 0,
        numberofworkingdays: 0,
        businessoperatingperiod: 0,
        competitorsavailable: 0,
        assessmentby: '',
        transdate: new Date(),
        balance: 0,
        status: 'Active',
        current_rate: 0,
        property_rate: 0,
        totalmarks: 0,  
        emailaddress: '',  
        postaladdress: '',   
        noofemployees: 0,
        noofbranches: 0,   
        BALANCENEW: 0,
        gps_address: '',
    });

    const [electoralAreas, setElectoralAreas] = useState<string[]>([]);
    const [bussTypes, setBussTypes] = useState<BusinessTypeData[]>([]);
    const [propertyClasses, setPropertyClasses] = useState<string[]>([]);
    const [assessments, setAssessments] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(false); // Loading state

    const dispatch = useAppDispatch();

    // Fetch data on component mount
    useEffect(() => {
        dispatch(fetchElectoralAreas());
        dispatch(fetchBusinessTypes());
        dispatch(fetchPropertyClasses());
        dispatch(fetchOfficers());
    }, [dispatch]);

    const electoralAreaData = useAppSelector((state) => state.electoralArea.electoralAreas);
    const businessTypes = useAppSelector((state) => state.businessType.businessTypes);
    const propertyClass = useAppSelector((state) => state.propertyClass.propertyClasses);
    const officer = useAppSelector((state) => state.officer.officers);

    useEffect(() => {
        if (electoralAreaData && Array.isArray(electoralAreaData)) {
            setElectoralAreas(electoralAreaData.map((area) => area.electoral_area));
        }
    }, [electoralAreaData]);

    useEffect(() => {
        if (Array.isArray(businessTypes)) {
            setBussTypes(businessTypes);
        }
    }, [businessTypes]);

    useEffect(() => {
        setPropertyClasses(propertyClass.map((classType) => classType.property_class));
    }, [propertyClass]);

    useEffect(() => {
        setAssessments(officer.map((officer) => `${officer.officer_name}`));
    }, [officer]);

    const getBussNo = async () => {
        console.log('getBussNo called');
        setLoading(true); // Set loading to true
        try {
            const newBussNo = await dispatch(fetchLastBussNo()).unwrap();
            setFormData((prevData) => ({
                ...prevData,
                buss_no: newBussNo,
            }));
            console.log('in FrmBusiness.tsx: buss_no:', newBussNo);
        } catch (error) {
            console.error('Failed to fetch last buss_no:', error);
            setFormData((prevData) => ({
                ...prevData,
                buss_no: 0,
            }));
            console.log('in FrmBusiness.tsx: buss_no:', 0);
        } finally {
            setLoading(false); // Set loading to false
        }
    };

    type FormControlElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

    const handleChange = (e: React.ChangeEvent<FormControlElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };


    // const handleChange: React.ChangeEventHandler<FormControlElement> = (e) => {
    //     const { name, value } = e.target;
    //     setFormData((prevData) => ({
    //       ...prevData,
    //       [name]: value,
    //     }));
    //   };

    const handleAddClick = async () => {
        try {
            if (!formData.buss_no) {
                alert('Enter the business number');
                return;
            }

            const response = await dispatch(createBusiness(formData));
            if (createBusiness.fulfilled.match(response)) {
                alert('Record successfully added');
                setFormData({
                    buss_no: 0,
                    buss_name: '',
                    buss_address: '',
                    buss_type: '',
                    buss_town: '',
                    buss_permitNo: '',
                    street_name: '',
                    landmark: '',
                    electroral_area: '',
                    property_class: '',
                    tot_grade: '',
                    ceo: '',
                    telno: '',
                    strategiclocation: 0,
                    productvariety: 0,
                    businesspopularity: 0,
                    businessenvironment: 0,
                    sizeofbusiness: 0,
                    numberofworkingdays: 0,
                    businessoperatingperiod: 0,
                    competitorsavailable: 0,
                    assessmentby: '',
                    transdate: new Date(),
                    balance: 0,
                    status: 'Active',
                    current_rate: 0,
                    property_rate: 0,
                    totalmarks: 0,  
                    emailaddress: '',  
                    postaladdress: '',   
                    noofemployees: 0,
                    noofbranches: 0,   
                    BALANCENEW: 0,
                    gps_address: '',
                });
            } else {
                throw new Error(response.error.message);
            }
        } catch (error) {
            console.error(error);
            alert('Error in adding a record');
        }
    };

    return (
        <Card style={{ backgroundColor: '#add8e6' }}>
            <Card.Header>
                <h3>New Business Data Entry</h3>
            </Card.Header>
            <Card.Body>
                <Form>
                    <Row>
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label for="buss_no">Business Number:</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="buss_no"
                                    id="buss_no"
                                    value={formData.buss_no}
                                    onChange={handleChange}
                                    onFocus={getBussNo} // Add onFocus event handler
                                />
                                {loading && <Spinner size="sm" color="primary" />}   {/* Spinner while loading */}
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label for="buss_name">Business Name:</Form.Label>
                                <Form.Control type="text" name="buss_name" id="buss_name" value={formData.buss_name} onChange={handleChange} />           
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label for="buss_address">Business Address:</Form.Label>
                                <Form.Control type="text" name="buss_address" id="buss_address" value={formData.buss_address} onChange={handleChange} />
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label for="street_name">Street Name:</Form.Label>
                                <Form.Control type="text" name="street_name" id="street_name" value={formData.street_name} onChange={handleChange} />
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label for="buss_town">Town:</Form.Label>
                                <Form.Control type="text" name="buss_town" id="buss_town" value={formData.buss_town} onChange={handleChange} />
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label for="ceo">CEO:</Form.Label>
                                <Form.Control type="text" name="ceo" id="ceo" value={formData.ceo} onChange={handleChange} />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label for="landmark">Land Mark:</Form.Label>
                                <Form.Control type="text" name="landmark" id="landmark" value={formData.landmark} onChange={handleChange} />
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label for="electoral_area">Electoral Area:</Form.Label>
                                <Form.Control 
                                    type="select" 
                                    name="electroral_area" 
                                    id="electoral_area" 
                                    value={formData.electroral_area} 
                                    onChange={handleChange}>
                                    <option>Select...</option>
                                    {electoralAreas.map((area, index) => (
                                        <option key={index} value={area}>{area}</option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label for="buss_permitNo">Property No:</Form.Label>
                                <Form.Control type="text" name="buss_permitNo" id="buss_permitNo" value={formData.buss_permitNo} onChange={handleChange} />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label for="buss_type">Business Type:</Form.Label>
                                <Form.Control type="select" name="buss_type" id="buss_type" value={formData.buss_type} onChange={handleChange}>
                                    <option>Select...</option>
                                    {bussTypes.map((businessType, index) => (
                                        <option key={index} value={businessType.business_type}>
                                            {businessType.business_type}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label for="telno">Tel:</Form.Label>
                                <Form.Control type="text" name="telno" id="telno" value={formData.telno} onChange={handleChange} />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label for="status">Status:</Form.Label>
                                <Form.Control type="select" name="status" id="status" value={formData.status} onChange={handleChange}>
                                    <option>Select...</option>
                                    <option value="Active">Active</option>
                                    <option value="Dormant">Dormant</option>
                                </Form.Control>
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label for="emailaddress">Email Address:</Form.Label>
                                <Form.Control type="email" name="emailaddress" id="emailaddress" value={formData.emailaddress} onChange={handleChange} />
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label for="gps_address">GPS Address:</Form.Label>
                                <Form.Control type="text" name="gps_address" id="gps_address" placeholder="Enter GPS Address" value={formData.gps_address} onChange={handleChange} />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label for="property_class">Property Class:</Form.Label>
                                <Form.Control type="select" name="property_class" id="property_class" value={formData.property_class} onChange={handleChange}>
                                    <option>Select...</option>
                                    {propertyClasses.map((classType, index) => (
                                        <option key={index} value={classType}>{classType}</option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label for="assessmentby">Collector:</Form.Label>
                                <Form.Control type="select" name="assessmentby" id="assessmentby" value={formData.assessmentby} onChange={handleChange}>
                                    <option>Select...</option>
                                    {assessments.map((assessment, index) => (
                                        <option key={index} value={assessment}>{assessment}</option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row className="mt-3">
                        <Col md={12}>
                            <Button color="primary" onClick={handleAddClick}>Add New Record</Button>
                        </Col>
                    </Row>
                    <Row className="mt-3">
                        <Col>
                            <Link to="/main" className="primary m-3">
                                Go Back
                            </Link>
                        </Col>
                    </Row>
                </Form>
            </Card.Body>
        </Card>
    );
};



