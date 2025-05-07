import React, { useState, useEffect } from 'react';
import { Button, Form, Container, Row, Col, Table } from 'react-bootstrap';
import axios from 'axios';
import { Link } from 'react-router-dom';

interface Business {
  buss_no: string;
  buss_name: string;
  buss_type: string;
  permit_no: string;
  street_name: string;
  landmark: string;
  electoral_area: string;
  property_class: string;
  grade: number;
  owner: string;
  tel_no: string;
  officer_no: string;
  transdate: string;
  status: string;
  serialno: number;
  current_rate: number;
  property_rate: number;
  strategiclocation: number;
  productvariety: number;
  businesspopularity: number;
  businessenvironment: number;
  sizeofbusiness: number;
  numberofworkingdays: number;
  businessoperatingperiod: number;
  competitorsavailable: number;
  totalmarks: number;
}

interface BusinessType {
  buss_type: string;
}

const BusinessBarometersForm: React.FC = () => {
  const [bussNo, setBussNo] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [strategicGrade, setStrategicGrade] = useState(0);
  const [productGrade, setProductGrade] = useState(0);
  const [busPopGrade, setBusPopGrade] = useState(0);
  const [busEnvGrade, setBusEnvGrade] = useState(0);
  const [sizeGrade, setSizeGrade] = useState(0);
  const [noGrade, setNoGrade] = useState(0);
  const [busOpeGrade, setBusOpeGrade] = useState(0);
  const [comAvaGrade, setComAvaGrade] = useState(0);
  const [totalMarks, setTotalMarks] = useState(0);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [businessTypesList, setBusinessTypesList] = useState<BusinessType[]>([]);

  useEffect(() => {
    // Fetch business types
    const fetchBusinessTypes = async () => {
      try {
        const response = await axios.get('/api/business-types');
        setBusinessTypesList(response.data);
      } catch (error) {
        console.error("Error fetching business types:", error);
        alert("No business types found");
      }
    };

    // Populate ListView on form load
    const populateListView = async () => {
      try {
        const response = await axios.get('/api/businesses');
        setBusinesses(response.data);
      } catch (error) {
        console.error("Error fetching businesses:", error);
        alert("No records found to feed the listview");
      }
    };

    // Update current rate on form load
    const updateCurrentRate = async () => {
      try {
        await axios.post('/api/update-current-rate');
      } catch (error) {
        console.error("Error updating current rate:", error);
        alert("Error updating current rate");
      }
    };

    fetchBusinessTypes();
    populateListView();
    updateCurrentRate();
  }, []);

  // const handleStrategicGradeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const value = parseInt(event.target.value, 10);
  //   setStrategicGrade(value);
  //   calculateTotalMarks();
  // };

  // const handleProductGradeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const value = parseInt(event.target.value, 10);
  //   setProductGrade(value);
  //   calculateTotalMarks();
  // };

  // const handleBusPopGradeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const value = parseInt(event.target.value, 10);
  //   setBusPopGrade(value);
  //   calculateTotalMarks();
  // };

  // const handleBusEnvGradeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const value = parseInt(event.target.value, 10);
  //   setBusEnvGrade(value);
  //   calculateTotalMarks();
  // };

  // const handleSizeGradeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const value = parseInt(event.target.value, 10);
  //   setSizeGrade(value);
  //   calculateTotalMarks();
  // };

  // const handleNoGradeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const value = parseInt(event.target.value, 10);
  //   setNoGrade(value);
  //   calculateTotalMarks();
  // };

  // const handleBusOpeGradeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const value = parseInt(event.target.value, 10);
  //   setBusOpeGrade(value);
  //   calculateTotalMarks();
  // };

  // const handleComAvaGradeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const value = parseInt(event.target.value, 10);
  //   setComAvaGrade(value);
  //   calculateTotalMarks();
  // };

  // const calculateTotalMarks = () => {
  //   const totMarks = strategicGrade + productGrade + busPopGrade + busEnvGrade + sizeGrade + noGrade + busOpeGrade + comAvaGrade;
  //   setTotalMarks(totMarks);
  // };

  const handleAddClick = async () => {
    if (!bussNo || !strategicGrade || !productGrade || !busPopGrade || !busEnvGrade || !sizeGrade || !noGrade || !busOpeGrade || !comAvaGrade) {
      alert("ENTER ALL FIELDS");
      return;
    }

    try {
      const response = await axios.post('/api/add-business', {
        buss_no: bussNo,
        buss_name: businessName,
        buss_type: businessType,
        strategiclocation: strategicGrade,
        productvariety: productGrade,
        businesspopularity: busPopGrade,
        businessenvironment: busEnvGrade,
        sizeofbusiness: sizeGrade,
        numberofworkingdays: noGrade,
        businessoperatingperiod: busOpeGrade,
        competitorsavailable: comAvaGrade,
        totalmarks: totalMarks
      });

      alert(response.data.message);
      populateListView();
    } catch (error) {
      console.error("Error adding business:", error);
      alert("Error adding business");
    }
  };

  const handleEditClick = async () => {
    if (!bussNo || !strategicGrade || !productGrade || !busPopGrade || !busEnvGrade || !sizeGrade || !noGrade || !busOpeGrade || !comAvaGrade) {
      alert("ENTER ALL FIELDS");
      return;
    }

    try {
      const response = await axios.post('/api/edit-business', {
        buss_no: bussNo,
        strategiclocation: strategicGrade,
        productvariety: productGrade,
        businesspopularity: busPopGrade,
        businessenvironment: busEnvGrade,
        sizeofbusiness: sizeGrade,
        numberofworkingdays: noGrade,
        businessoperatingperiod: busOpeGrade,
        competitorsavailable: comAvaGrade,
        totalmarks: totalMarks  
      });

      setTotalMarks(totalMarks)
      alert(response.data.message);
      populateListView();
    } catch (error) {
      console.error("Error editing business:", error);
      alert("Error editing business");
    }
  };

  const handleBarometersClick = async () => {
    try {
      // Clear temporary tables
      await axios.delete('/api/tmp-business');

      // Insert businesses into temporary table
      const businessesResponse = await axios.get('/api/businesses');
      for (const business of businessesResponse.data) {
        await axios.post('/api/tmp-business', business);
      }

      // Open the report file
      window.open('/report/BUSINESS RANKINGS.rpt', '_blank');
      alert("Processing completed");
    } catch (error) {
      console.error("Error processing barometers:", error);
      alert("Error processing barometers");
    }
  };

  const handleLoadClick = async () => {
    try {
      populateListView();
    } catch (error) {
      console.error("Error loading spreadsheet:", error);
      alert("Error loading spreadsheet");
    }
  };

  const handleExitClick = () => {
    // Assuming you have a way to navigate back to the main page
    window.location.href = '/'; // Redirect to main page or wherever you want
  };

  const populateListView = async () => {
    try {
      const response = await axios.get('/api/businesses');
      setBusinesses(response.data);
    } catch (error) {
      console.error("Error fetching businesses:", error);
      alert("No records found to feed the listview");
    }
  };

  return (
    <Container fluid className="bg-light">
      <Row className="mt-3">
        <Col className="text-center">
          <h2 style={{ textDecoration: 'underline', color: '#0000C0' }}>MARCORY MUNICIPAL ASSEMBLY</h2>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col className="text-center">
          <h3>Collector Business Barometers</h3>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col>
          <Form.Label>Business Number:</Form.Label>
          <Form.Control type="text" value={bussNo} onChange={(e) => setBussNo(e.target.value)} />
        </Col>
      </Row>
      <Row className="mt-3">
        <Col>
          <Form.Label>Business Name:</Form.Label>
          <Form.Control type="text" value={businessName} onChange={(e) => setBusinessName(e.target.value)} />
        </Col>
      </Row>
      <Row className="mt-3">
        <Col>
          <Form.Label>Business Type:</Form.Label>
          <Form.Select value={businessType} onChange={(e) => setBusinessType(e.target.value)}>
            <option value="">Select a business type</option>
            {businessTypesList.map(type => (
              <option key={type.buss_type} value={type.buss_type}>{type.buss_type}</option>
            ))}
          </Form.Select>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col>
          <Form.Label>Strategic Location:</Form.Label>
          <Form.Check
            type="radio"
            label="Excellent"
            name="strategic"
            onChange={() => setStrategicGrade(1)}
          />
          <Form.Check
            type="radio"
            label="Very Good"
            name="strategic"
            onChange={() => setStrategicGrade(2)}
          />
          <Form.Check
            type="radio"
            label="Good"
            name="strategic"
            onChange={() => setStrategicGrade(3)}
          />
          <Form.Check
            type="radio"
            label="Average"
            name="strategic"
            onChange={() => setStrategicGrade(4)}
          />
          <Form.Check
            type="radio"
            label="L-Average"
            name="strategic"
            onChange={() => setStrategicGrade(5)}
          />
          <Form.Control type="text" value={strategicGrade} readOnly />
        </Col>
      </Row>
      <Row className="mt-3">
        <Col>
          <Form.Label>Product Variety:</Form.Label>
          <Form.Check
            type="radio"
            label="Excellent"
            name="product"
            onChange={() => setProductGrade(1)}
          />
          <Form.Check
            type="radio"
            label="Very Good"
            name="product"
            onChange={() => setProductGrade(2)}
          />
          <Form.Check
            type="radio"
            label="Good"
            name="product"
            onChange={() => setProductGrade(3)}
          />
          <Form.Check
            type="radio"
            label="Average"
            name="product"
            onChange={() => setProductGrade(4)}
          />
          <Form.Check
            type="radio"
            label="L-Average"
            name="product"
            onChange={() => setProductGrade(5)}
          />
          <Form.Control type="text" value={productGrade} readOnly />
        </Col>
      </Row>
      <Row className="mt-3">
        <Col>
          <Form.Label>Business Popularity:</Form.Label>
          <Form.Check
            type="radio"
            label="Best"
            name="busPop"
            onChange={() => setBusPopGrade(1)}
          />
          <Form.Check
            type="radio"
            label="Better"
            name="busPop"
            onChange={() => setBusPopGrade(2)}
          />
          <Form.Check
            type="radio"
            label="Good"
            name="busPop"
            onChange={() => setBusPopGrade(3)}
          />
          <Form.Check
            type="radio"
            label="Average"
            name="busPop"
            onChange={() => setBusPopGrade(4)}
          />
          <Form.Check
            type="radio"
            label="L-Average"
            name="busPop"
            onChange={() => setBusPopGrade(5)}
          />
          <Form.Control type="text" value={busPopGrade} readOnly />
        </Col>
      </Row>
      <Row className="mt-3">
        <Col>
          <Form.Label>Business Environment:</Form.Label>
          <Form.Check
            type="radio"
            label="Excellent"
            name="busEnv"
            onChange={() => setBusEnvGrade(1)}
          />
          <Form.Check
            type="radio"
            label="Very Good"
            name="busEnv"
            onChange={() => setBusEnvGrade(2)}
          />
          <Form.Check
            type="radio"
            label="Good"
            name="busEnv"
            onChange={() => setBusEnvGrade(3)}
          />
          <Form.Check
            type="radio"
            label="Average"
            name="busEnv"
            onChange={() => setBusEnvGrade(4)}
          />
          <Form.Check
            type="radio"
            label="L-Average"
            name="busEnv"
            onChange={() => setBusEnvGrade(5)}
          />
          <Form.Control type="text" value={busEnvGrade} readOnly />
        </Col>
      </Row>
      <Row className="mt-3">
        <Col>
          <Form.Label>Size Of Business:</Form.Label>
          <Form.Check
            type="radio"
            label="XX-Large"
            name="size"
            onChange={() => setSizeGrade(1)}
          />
          <Form.Check
            type="radio"
            label="X-Large"
            name="size"
            onChange={() => setSizeGrade(2)}
          />
          <Form.Check
            type="radio"
            label="Large"
            name="size"
            onChange={() => setSizeGrade(3)}
          />
          <Form.Check
            type="radio"
            label="Medium"
            name="size"
            onChange={() => setSizeGrade(4)}
          />
          <Form.Check
            type="radio"
            label="Small"
            name="size"
            onChange={() => setSizeGrade(5)}
          />
          <Form.Control type="text" value={sizeGrade} readOnly />
        </Col>
      </Row>
      <Row className="mt-3">
        <Col>
          <Form.Label>Number Of Working Days:</Form.Label>
          <Form.Check
            type="radio"
            label="7 Days"
            name="workingDays"
            onChange={() => setNoGrade(1)}
          />
          <Form.Check
            type="radio"
            label="6 Days"
            name="workingDays"
            onChange={() => setNoGrade(2)}
          />
          <Form.Check
            type="radio"
            label="5 Days"
            name="workingDays"
            onChange={() => setNoGrade(3)}
          />
          <Form.Check
            type="radio"
            label="4 Days"
            name="workingDays"
            onChange={() => setNoGrade(4)}
          />
          <Form.Check
            type="radio"
            label="3 Days"
            name="workingDays"
            onChange={() => setNoGrade(5)}
          />
          <Form.Control type="text" value={noGrade} readOnly />
        </Col>
      </Row>
      <Row className="mt-3">
        <Col>
          <Form.Label>Business Operating Period:</Form.Label>
          <Form.Check
            type="radio"
            label="24 Hours"
            name="busOpe"
            onChange={() => setBusOpeGrade(1)}
          />
          <Form.Check
            type="radio"
            label="18 Hours"
            name="busOpe"
            onChange={() => setBusOpeGrade(2)}
          />
          <Form.Check
            type="radio"
            label="12 Hours"
            name="busOpe"
            onChange={() => setBusOpeGrade(3)}
          />
          <Form.Check
            type="radio"
            label="8 Hours"
            name="busOpe"
            onChange={() => setBusOpeGrade(4)}
          />
          <Form.Check
            type="radio"
            label="6 Hours"
            name="busOpe"
            onChange={() => setBusOpeGrade(5)}
          />
          <Form.Control type="text" value={busOpeGrade} readOnly />
        </Col>
      </Row>
      <Row className="mt-3">
        <Col>
          <Form.Label>Competitors Available:</Form.Label>
          <Form.Check
            type="radio"
            label="Pure Mono"
            name="comAva"
            onChange={() => setComAvaGrade(1)}
          />
          <Form.Check
            type="radio"
            label="Mono(3)"
            name="comAva"
            onChange={() => setComAvaGrade(2)}
          />
          <Form.Check
            type="radio"
            label="Moderate(2)"
            name="comAva"
            onChange={() => setComAvaGrade(3)}
          />
          <Form.Check
            type="radio"
            label="Fierce(1)"
            name="comAva"
            onChange={() => setComAvaGrade(4)}
          />
          <Form.Check
            type="radio"
            label="Not Applicable(0)"
            name="comAva"
            onChange={() => setComAvaGrade(5)}
          />
          <Form.Control type="text" value={comAvaGrade} readOnly />
        </Col>
      </Row>
      <Row className="mt-3">
        <Col>
          <Form.Label>Total Marks:</Form.Label>
          <Form.Control type="text" value={totalMarks} readOnly />
        </Col>
      </Row>
      <Row className="mt-3">
        <Col className="text-center">
          <Button variant="primary" onClick={handleAddClick}>
            Add New Record
          </Button>
        </Col>
        <Col className="text-center">
          <Button variant="warning" onClick={handleEditClick}>
            Re-evaluate Client
          </Button>
        </Col>
        <Col className="text-center">
          <Button variant="info" onClick={handleBarometersClick}>
            View Business Barometers
          </Button>
        </Col>
        <Col className="text-center">
          <Button variant="success" onClick={handleLoadClick}>
            Load Spreadsheet
          </Button>
        </Col>
        <Col className="text-center">
          <Button variant="danger" onClick={handleExitClick}>
            Exit
          </Button>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col>
          <Frame1 businesses={businesses} />
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

interface Frame1Props {
  businesses: Business[];
}

const Frame1: React.FC<Frame1Props> = ({ businesses }) => {
  return (
    <div className="border p-3 mt-3">
      <h4>Activity</h4>
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
          {businesses.map(business => (
            <tr key={business.buss_no}>
              <td>{business.buss_no}</td>
              <td>{business.buss_name}</td>
              <td>{business.buss_type}</td>
              <td>{business.permit_no}</td>
              <td>{business.street_name}</td>
              <td>{business.landmark}</td>
              <td>{business.electoral_area}</td>
              <td>{business.property_class}</td>
              <td>{business.grade}</td>
              <td>{business.owner}</td>
              <td>{business.tel_no}</td>
              <td>{business.officer_no}</td>
              <td>{business.transdate}</td>
              <td>{business.status}</td>
              <td>{business.serialno}</td>
              <td>{business.current_rate.toLocaleString()}</td>
              <td>{business.property_rate.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default BusinessBarometersForm;
