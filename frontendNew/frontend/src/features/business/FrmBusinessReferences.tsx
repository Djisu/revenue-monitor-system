import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Table } from 'react-bootstrap';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';

interface Business {
    buss_no: number;
    buss_name: string;
    buss_address: string;
    buss_type: string;
    buss_permitno: string;
    street_name: string;
    landmark: string;
    layout: string;
    property_class: string;
    tot_grade: string;
    ceo: string;
    telno: string;
    assessmentby: string;
    transdate: string;
    status: string;
    serialno: string;
    current_rate: number;
    property_rate: number;
  }

  const BusinessReferencesForm: React.FC = () => {
    const [bussName, setBussName] = useState<string>('');
    const [bussType, setBussType] = useState<string>('');
    const [electoralArea, setElectoralArea] = useState<string>('');
    const [grade, setGrade] = useState<string>('');
    const [landmark, setLandmark] = useState<string>('');
    const [propertyClass, SetPropertyClass] = useState<string>('');
    const [totNumber, setTotNumber] = useState<number>(0);
    const [currentRates, setCurrentRates] = useState<number>(0);
    const [businessList, setBusinessList] = useState<Business[]>([]);
  
    useEffect(() => {
      fetchBusinessList();
    }, []);
  
    const fetchBusinessList = async () => {
      try {
        const response = await axios.get<Business[]>('http://your-api-url/tb_business');
        setBusinessList(response.data);
        setTotNumber(response.data.length);
        setCurrentRates(response.data.reduce((sum, business) => sum + business.current_rate, 0));
      } catch (error) {
        console.error(error);
      }
    };
  
    const handleInputChange = async (field: string, value: string) => {
      try {
        let query = `http://your-api-url/tb_business?${field}=${value}`;
        const response = await axios.get<Business[]>(query);
        setBusinessList(response.data);
        setTotNumber(response.data.length);
        setCurrentRates(response.data.reduce((sum, business) => sum + business.current_rate, 0));
      } catch (error) {
        console.error(error);
      }
    };
  
    return (
      <Container>
        <h2>Business References</h2>
        <Form>
          <Form.Group controlId="formBussName">
            <Form.Label>Business Name:</Form.Label>
            <Form.Control
              type="text"
              value={bussName}
              onChange={(e) => {
                setBussName(e.target.value);
                handleInputChange('buss_name', e.target.value);
              }}
            />
          </Form.Group>
  
          <Form.Group controlId="formBussType">
            <Form.Label>Business Type:</Form.Label>
            <Form.Control
              type="text"
              value={bussType}
              onChange={(e) => {
                setBussType(e.target.value);
                handleInputChange('buss_type', e.target.value);
              }}
            />
          </Form.Group>
  
          <Form.Group controlId="formElectoralArea">
            <Form.Label>Electoral Area:</Form.Label>
            <Form.Control
              type="text"
              value={electoralArea}
              onChange={(e) => {
                setElectoralArea(e.target.value);
                handleInputChange('electoral_area', e.target.value);
              }}
            />
          </Form.Group>
  
          <Form.Group controlId="formGrade">
            <Form.Label>Grade:</Form.Label>
            <Form.Control
              type="text"
              value={grade}
              onChange={(e) => {
                setGrade(e.target.value);
                handleInputChange('tot_grade', e.target.value);
              }}
            />
          </Form.Group>
  
          <Form.Group controlId="formLandmark">
            <Form.Label>Landmark:</Form.Label>
            <Form.Control
              type="text"
              value={landmark}
              onChange={(e) => {
                setLandmark(e.target.value);
                handleInputChange('landmark', e.target.value);
              }}
            />
          </Form.Group>
  
          <Form.Group controlId="formPropertyClass">
            <Form.Label>Property Class:</Form.Label>
            <Form.Control
              type="text"
              value={propertyClass}
              onChange={(e) => {
                SetPropertyClass(e.target.value);
                handleInputChange('property_class', e.target.value);
              }}
            />
          </Form.Group>
  
          <Form.Group controlId="formTotNumber">
            <Form.Label>Total Number of Businesses:</Form.Label>
            <Form.Control
              type="number"
              value={totNumber}
              readOnly
            />
          </Form.Group>
  
          <Form.Group controlId="formCurrentRates">
            <Form.Label>Total Current Rates GHC:</Form.Label>
            <Form.Control
              type="number"
              value={currentRates}
              readOnly
            />
          </Form.Group>
  
          <Button variant="danger" onClick={fetchBusinessList}>
            Empty Records
          </Button>
          <Button variant="primary" onClick={() => window.location.href = '/'}>
            Exit
          </Button>
        </Form>
  
        <h3>List of Business Clients</h3>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Buss No</th>
              <th>Buss Name</th>
              <th>Address</th>
              <th>Type</th>
              <th>Permit No</th>
              <th>Street Name</th>
              <th>Landmark</th>
              <th>Layout</th>
              <th>Property Class</th>
              <th>Grade</th>
              <th>CEO</th>
              <th>Tel No</th>
              <th>Assessed By</th>
              <th>Reg Date</th>
              <th>Status</th>
              <th>Serial No</th>
              <th>Current Rate</th>
              <th>Property Rate</th>
            </tr>
          </thead>
          <tbody>
            {businessList.map((business) => (
              <tr key={business.buss_no}>
                <td>{business.buss_no}</td>
                <td>{business.buss_name.toUpperCase()}</td>
                <td>{business.buss_address.toUpperCase()}</td>
                <td>{business.buss_type.toUpperCase()}</td>
                <td>{business.buss_permitno.toUpperCase()}</td>
                <td>{business.street_name.toUpperCase()}</td>
                <td>{business.landmark.toUpperCase()}</td>
                <td>{business.layout.toUpperCase()}</td>
                <td>{business.property_class.toUpperCase()}</td>
                <td>{business.tot_grade.toUpperCase()}</td>
                <td>{business.ceo.toUpperCase()}</td>
                <td>{business.telno}</td>
                <td>{business.assessmentby.toUpperCase()}</td>
                <td>{business.transdate}</td>
                <td>{business.status.toUpperCase()}</td>
                <td>{business.serialno}</td>
                <td>{business.current_rate}</td>
                <td>{business.property_rate}</td>
              </tr>
            ))}
          </tbody>
        </Table>       
        <Link to="/main" className="primary m-3">
            Go Back
        </Link>   
      </Container>
    );
  };
  
  export default BusinessReferencesForm;
  
