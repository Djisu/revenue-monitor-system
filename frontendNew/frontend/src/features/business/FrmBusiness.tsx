import React, { useState, useEffect } from 'react';
import { Button, Form, FormGroup, Label, Input, Card, CardBody, CardHeader, Col, Row } from 'reactstrap';
import { fetchElectoralAreas } from '../electoralArea/electoralAreaSlice';
import { fetchBusinessTypes } from '../businessType/businessTypeSlice';
import { fetchPropertyClasses } from '../propertyClass/propertyClassSlice';
import { fetchOfficers } from '../officer/officerSlice';
import { createBusiness, fetchBusinesses } from './businessSlice';
import { useAppDispatch, useAppSelector } from '../../app/store';
import { Link } from 'react-router-dom';

// interface ElectoralArea {
//   electoral_area: string;
// }

// interface ElectoralAreaResponse {
//   data: ElectoralArea[];
// }

interface BusinessTypeData {
  Business_Type: string; // Updated to match API response
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
    tot_grade: "",
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
  const [businessTypes, setBusinessTypes] = useState<string[]>([]);
  const [propertyClasses, setPropertyClasses] = useState<string[]>([]);
  const [assessments, setAssessments] = useState<string[]>([]);
  let [busCount, setBusCount] = useState<number>(0);

  const dispatch = useAppDispatch();

  // Fetch data on component mount
  useEffect(() => {
    dispatch(fetchElectoralAreas());
    dispatch(fetchBusinessTypes());
    dispatch(fetchPropertyClasses());
    dispatch(fetchOfficers());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchElectoralAreas());
}, [dispatch]);

// Get businesses from the Redux store
  const business = useAppSelector((state) => state.business.businesses);

// Get electoral areas from the Redux store // as ElectoralArea[];
const electoralAreaData = useAppSelector((state) => state.electoralArea.electoralAreas) ;

console.log('typeof electoralAreaData:', typeof electoralAreaData)

useEffect(() => {
  if (electoralAreaData && Array.isArray(electoralAreaData)) {
      setElectoralAreas(electoralAreaData.map((area) => area.electoral_area));
      console.log('electoralAreas: ', electoralAreas)
  } else {
      console.error('Expected electoralAreaData to be an array but got:', electoralAreaData);
  }
}, [electoralAreaData, setElectoralAreas]);

  const businessType = useAppSelector((state) => state.businessType.businessTypes);
  useEffect(() => {
    if (Array.isArray(businessType)) {
      setBusinessTypes(businessType.map((business: BusinessTypeData) => business.Business_Type));
    } else {
      console.error('Expected businessType to be an array but got:', businessType);
    }
   
  }, [businessType]);

  const propertyClass = useAppSelector((state) => state.propertyClass.propertyClasses);
  useEffect(() => {
    setPropertyClasses(propertyClass.map((classType: any) => classType.property_class));
  }, [propertyClass]);

  const officer = useAppSelector((state) => state.officer.officers);
  useEffect(() => {
    setAssessments(officer.map((officer: any) => `${officer.officer_name}`));
  }, [officer]);

  // Get businesses from the Redux store //${officer.officer_no}
  useEffect(() => {
    if (business) {
      const newBusCount = business.length + 1;
      setBusCount(newBusCount);
      setFormData({
        ...formData,
        buss_no: newBusCount,
      });
      console.log('in FrmBusiness.tsx: busCount:', newBusCount);
    } else {
      setBusCount(0);
      setFormData({
        ...formData,
        buss_no: 0,
      });
      console.log('in FrmBusiness.tsx: busCount:', 0);
    }
  }, [business])

  const getBussNo = () => {
    console.log('getBussNo called')

    dispatch(fetchBusinesses())
    if (business) {
      const newBusCount = business.length + 1;
      busCount
      setBusCount(busCount);
      setFormData({
        ...formData,
        buss_no: newBusCount,
      });
      console.log('in FrmBusiness.tsx: busCount:', newBusCount);
    } else {
      setBusCount(0);
      setFormData({
        ...formData,
        buss_no: 0,
      });
      console.log('in FrmBusiness.tsx: busCount:', 0);
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    console.log('handleChange called with name:', name, 'value:', value)

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddClick = async () => {
    console.log('handleAddClick called')
    try {
      if (!formData.buss_no) {
        alert('Enter the business number');
        return;
      }

      const response = await dispatch(createBusiness(formData));
      console.log(response);

      if (createBusiness.fulfilled.match(response)) {
        alert('Record successfully added');
        setFormData({ ...formData, buss_no: 0 }); // Reset specific fields as needed
      } else {
        throw new Error(response.error.message);
      }
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
      })
    } catch (error) {
      console.error(error);
      alert('Error in adding a record');
    }
  };

  return (
    <Card style={{ backgroundColor: '#add8e6' }}>
      <CardHeader>
        <h3>Business Data Entry</h3>
      </CardHeader>
      <CardBody>
        <Form>
          <Row>
            <Col md={4}>
            <FormGroup>
              <Label for="buss_no">Business Number:</Label>
              <Input
                type="text"
                name="buss_no"
                id="buss_no"
                value={formData.buss_no}
                onChange={handleChange}
                onFocus={getBussNo} // Add onFocus event handler
              />
            </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for="buss_name">Business Name:</Label>
                <Input type="text" name="buss_name" id="buss_name" value={formData.buss_name} onChange={handleChange} />
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for="buss_address">Business Address:</Label>
                <Input type="text" name="buss_address" id="buss_address" value={formData.buss_address} onChange={handleChange} />
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for="street_name">Street Name:</Label>
                <Input type="text" name="street_name" id="street_name" value={formData.street_name} onChange={handleChange} />
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for="buss_town">Town:</Label>
                <Input type="text" name="buss_town" id="buss_town" value={formData.buss_town} onChange={handleChange} />
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for="buss_town">CEO:</Label>
                <Input type="text" name="ceo" id="ceo" value={formData.ceo} onChange={handleChange} />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={4}>
              <FormGroup>
                <Label for="landmark">Land Mark:</Label>
                <Input type="text" name="landmark" id="landmark" value={formData.landmark} onChange={handleChange} />
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for="electoral_area">Electoral Area:</Label>
                <Input 
                    type="select" 
                    name="electroral_area" 
                    id="electoral_area" 
                    value={formData.electroral_area} 
                    onChange={handleChange}>
                      <option>Select...</option>
                      {electoralAreas.map((area, index) => (
                        <option key={index} value={area}>{area}</option>
                      ))}
                </Input>
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for="buss_permitNo">Property No:</Label>
                <Input type="text" name="buss_permitNo" id="buss_permitNo" value={formData.buss_permitNo} onChange={handleChange} />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={4}>
              <FormGroup>
                <Label for="buss_type">Business Type:</Label>
                <Input type="select" name="buss_type" id="buss_type" value={formData.buss_type} onChange={handleChange}>
                  <option>Select...</option>
                  {businessTypes.map((type, index) => (
                    <option key={index} value={type}>{type}</option>
                  ))}
                </Input>
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for="telno">Tel:</Label>
                <Input type="text" name="telno" id="telno" value={formData.telno} onChange={handleChange} />
              </FormGroup>
              <FormGroup>
                  <Label for="electoral_area">Status:</Label>
                  <Input type="select" name="status" id="status" value={formData.status} onChange={handleChange}>
                      <option>Select...</option>
                      <option value="Active">Active</option>
                      <option value="Dormant">Dormant</option>
                  </Input>
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for="emailaddress">Email Address:</Label>
                <Input type="email" name="emailaddress" id="emailaddress" value={formData.emailaddress} onChange={handleChange} />
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for="emailaddress">GPS Address:</Label>
                <Input type="text" name="gps_address" id="gps_address" placeholder="Enter GPS Address" value={formData.gps_address} onChange={handleChange} />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={4}>
              <FormGroup>
                <Label for="property_class">Property Class:</Label>
                <Input type="select" name="property_class" id="property_class" value={formData.property_class} onChange={handleChange}>
                  <option>Select...</option>
                  {propertyClasses.map((classType, index) => (
                    <option key={index} value={classType}>{classType}</option>
                  ))}
                </Input>
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for="assessmentby">Collector:</Label>
                <Input type="select" name="assessmentby" id="assessmentby" value={formData.assessmentby} onChange={handleChange}>
                  <option>Select...</option>
                  {assessments.map((assessment, index) => (
                    <option key={index} value={assessment}>{assessment}</option>
                  ))}
                </Input>
              </FormGroup>
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
      </CardBody>
    </Card>
  );
};