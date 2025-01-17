import React, { useState, useEffect } from 'react';
import { Button, Col, Form, Row, Table } from 'react-bootstrap';

const UpdateClientForm: React.FC = () => {
  // State management for form fields
  const [businessNo, setBusinessNo] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [ceo, setCeo] = useState('');
  const [businessAddress, setBusinessAddress] = useState('');
  const [telNo, setTelNo] = useState('');
  const [businessType, setBusinessType] = useState('');
  // @ts-ignore
  let [bussPermitNo, setBussPermitNo] = useState<string | undefined>('');
  const [streetName, setStreetName] = useState('');
  const [landMark, setLandMark] = useState('');
  const [electoralArea, setElectoralArea] = useState('');
  const [propertyClass, setPropertyClass] = useState('');
  const [grade, setGrade] = useState('');
  const [siteNo, setSiteNo] = useState('');
  const [rate, setRate] = useState('');
  const [currentRate, setCurrentRate] = useState('');
  const [balanceBF, setBalanceBF] = useState('');
  const [serialNo, setSerialNo] = useState('');
  const [status, setStatus] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [floorRoomNo, setFloorRoomNo] = useState('');
  const [suburb, setSuburb] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [contactTelno, setContactTelno] = useState('');
  const [noOfBranches, setNoOfBranches] = useState('');
  const [branchLocation, setBranchLocation] = useState('');
  const [noOfEmployees, setNoOfEmployees] = useState('');
  const [blockDivision, setBlockDivision] = useState('');
  const [blockLayout, setBlockLayout] = useState('');

  // State management for checkboxes
  const [strategicGrade, setStrategicGrade] = useState(0);
  const [productGrade, setProductGrade] = useState(0);
  const [busPopGrade, setBusPopGrade] = useState(0);
  const [busEnvGrade, setBusEnvGrade] = useState(0);
  const [sizeGrade, setSizeGrade] = useState(0);
  const [noGrade, setNoGrade] = useState(0);
  const [busOpeGrade, setBusOpeGrade] = useState(0);
  const [comAvaGrade, setComAvaGrade] = useState(0);

  // State management for total marks and grade
  const [totalMarks, setTotalMarks] = useState(0);
  const [finalGrade, setFinalGrade] = useState('');

  // State management for dropdowns
  const [assessmentBy, setAssessmentBy] = useState<string[]>([]);
  const [businessTypes, setBusinessTypes] = useState<string[]>([]);
  const [electoralAreas, setElectoralAreas] = useState<string[]>([]);
  const [propertyClasses, setPropertyClasses] = useState<string[]>([]);
  // @ts-ignore
  let [transdate, setTransDate] = useState(new Date());

  // State management for ListView equivalent
  const [businesses, setBusinesses] = useState<any[]>([]);

  // Simulate database fetch for dropdowns
  useEffect(() => {
    // Fetch assessments, business types, electoral areas, and property classes from the database
    fetchAssessments();
    fetchBusinessTypes();
    fetchElectoralAreas();
    fetchPropertyClasses();
    fetchBusinesses();
  }, []);

  const fetchAssessments = async () => {
    // Simulate fetching assessments from a database
    const response = await fetch('/api/assessments'); // Replace with your API endpoint
    const data = await response.json();
    setAssessmentBy(data.map((item: any) => item.officer_no + ' '.repeat(10) + item.officer_name));
  };

  const fetchBusinessTypes = async () => {
    // Simulate fetching business types from a database
    const response = await fetch('/api/businessTypes'); // Replace with your API endpoint
    const data = await response.json();
    setBusinessTypes(data.map((item: any) => item.buss_type));
  };

  const fetchElectoralAreas = async () => {
    // Simulate fetching electoral areas from a database
    const response = await fetch('/api/electoralAreas'); // Replace with your API endpoint
    const data = await response.json();
    setElectoralAreas(data.map((item: any) => item.electoral_area));
  };

  const fetchPropertyClasses = async () => {
    // Simulate fetching property classes from a database
    const response = await fetch('/api/propertyClasses'); // Replace with your API endpoint
    const data = await response.json();
    setPropertyClasses(data.map((item: any) => item.propertyclass));
  };

  const fetchBusinesses = async () => {
    // Simulate fetching businesses from a database
    const response = await fetch('/api/businesses'); // Replace with your API endpoint
    const data = await response.json();
    setBusinesses(data);
  };

  const handleCheckboxChange = (value: number, setter: React.Dispatch<React.SetStateAction<number>>) => {
    setter(value);
    updateTotalMarks();
  };

  const updateTotalMarks = () => {
    const marks = strategicGrade + productGrade + busPopGrade + busEnvGrade + sizeGrade + noGrade + busOpeGrade + comAvaGrade;
    setTotalMarks(marks);
    determineFinalGrade(marks);
  };

  const determineFinalGrade = (marks: number) => {
    // Define your grading logic here
    if (marks >= 90) {
      setFinalGrade('Excellent');
    } else if (marks >= 75) {
      setFinalGrade('Very Good');
    } else if (marks >= 60) {
      setFinalGrade('Good');
    } else if (marks >= 45) {
      setFinalGrade('Average');
    } else {
      setFinalGrade('L-Average');
    }
  };

  const handleAddClick = () => {
    // Add your logic to add a new record here
    console.log('Add new record');
  };

  const handleEditClick = () => {
    // Add your logic to edit a record here
    console.log('Edit record');
  };

  const handleExitClick = () => {
    // Add your logic to exit here
    console.log('Exit');
  };

  const handleViewClick = () => {
    // Add your logic to reload spreadsheet here
    console.log('Reload spreadsheet');
  };

  const handleListViewItemClick = (item: any) => {
    // Populate form fields with selected item data
    setBusinessNo(item.buss_no);
    setBusinessName(item.buss_name);
    setBusinessAddress(item.buss_address);
    setBusinessType(item.buss_type);
    let value: string = item.buss_permitno
    bussPermitNo = value
    setBussPermitNo(item.buss_permitno);
    setStreetName(item.street_name);
    setLandMark(item.landmark);
    setElectoralArea(item.electroral_area);
    setPropertyClass(item.property_class);
    setGrade(item.tot_grade);
    setCeo(item.ceo);
    setTelNo(item.telno);
    setStrategicGrade(item.strategiclocation);
    setProductGrade(item.productvariety);
    setBusPopGrade(item.businesspopularity);
    setBusEnvGrade(item.businessenvironment);
    setSizeGrade(item.sizeofbusiness);
    setNoGrade(item.numberofworkingdays);
    setBusOpeGrade(item.businessoperatingperiod);
    setComAvaGrade(item.competitorsavailable);
    setAssessmentBy(item.assessmentby);
    transdate=item.transdate
    setTransDate(item.transdate);
    setBalanceBF(item.balance);
    setStatus(item.status);
    setSerialNo(item.serialno);
    setCurrentRate(item.current_rate);
    setSiteNo(item.site_no);
    setRate(item.property_rate);
    setEmailAddress(item.emailaddress);
    setFloorRoomNo(item.floorroomno);
    setSuburb(item.suburb);
    setContactPerson(item.contactperson);
    setContactTelno(item.contacttelno);
  };

  return (
    <div className="container">
      <Row className="mb-3">
        <Col>
          <h2 className="text-primary">Re-Evaluate Business Client</h2>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col>
          <Form.Label>Business Number:</Form.Label>
          <Form.Control value={businessNo} onChange={(e) => setBusinessNo(e.target.value)} />
        </Col>
        <Col>
          <Form.Label>Business Name:</Form.Label>
          <Form.Control value={businessName} onChange={(e) => setBusinessName(e.target.value)} />
        </Col>
        <Col>
          <Form.Label>CEO:</Form.Label>
          <Form.Control value={ceo} onChange={(e) => setCeo(e.target.value)} />
        </Col>
      </Row>
      <Row className="mb-3">
        <Col>
          <Form.Label>Business Address:</Form.Label>
          <Form.Control value={businessAddress} onChange={(e) => setBusinessAddress(e.target.value)} />
        </Col>
        <Col>
          <Form.Label>Tel No:</Form.Label>
          <Form.Control value={telNo} onChange={(e) => setTelNo(e.target.value)} />
        </Col>
        <Col>
          <Form.Label>Business Type:</Form.Label>
          <Form.Select value={businessType} onChange={(e) => setBusinessType(e.target.value)}>
            <option>Select Business Type</option>
            {businessTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </Form.Select>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col>
          <Form.Label>Street Name:</Form.Label>
          <Form.Control value={streetName} onChange={(e) => setStreetName(e.target.value)} />
        </Col>
        <Col>
          <Form.Label>Land Mark:</Form.Label>
          <Form.Control value={landMark} onChange={(e) => setLandMark(e.target.value)} />
        </Col>
        <Col>
          <Form.Label>Electoral Area:</Form.Label>
          <Form.Select value={electoralArea} onChange={(e) => setElectoralArea(e.target.value)}>
            <option>Select Electoral Area</option>
            {electoralAreas.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </Form.Select>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col>
          <Form.Label>Property Class:</Form.Label>
          <Form.Select value={propertyClass} onChange={(e) => setPropertyClass(e.target.value)}>
            <option>Select Property Class</option>
            {propertyClasses.map((cls) => (
              <option key={cls} value={cls}>
                {cls}
              </option>
            ))}
          </Form.Select>
        </Col>
        <Col>
          <Form.Label>Grade:</Form.Label>
          <Form.Control value={grade} onChange={(e) => setGrade(e.target.value)} />
        </Col>
        <Col>
          <Form.Label>Site No:</Form.Label>
          <Form.Control value={siteNo} onChange={(e) => setSiteNo(e.target.value)} />
        </Col>
      </Row>
      <Row className="mb-3">
        <Col>
          <Form.Label>Rate:</Form.Label>
          <Form.Control value={rate} onChange={(e) => setRate(e.target.value)} />
        </Col>
        <Col>
          <Form.Label>Current Rate:</Form.Label>
          <Form.Control value={currentRate} onChange={(e) => setCurrentRate(e.target.value)} />
        </Col>
        <Col>
          <Form.Label>Balance BF:</Form.Label>
          <Form.Control value={balanceBF} onChange={(e) => setBalanceBF(e.target.value)} />
        </Col>
      </Row>
      <Row className="mb-3">
        <Col>
          <Form.Label>Serial No:</Form.Label>
          <Form.Control value={serialNo} onChange={(e) => setSerialNo(e.target.value)} />
        </Col>
        <Col>
          <Form.Label>Status:</Form.Label>
          <Form.Control value={status} onChange={(e) => setStatus(e.target.value)} />
        </Col>
        <Col>
          <Form.Label>Assessment By:</Form.Label>
          <Form.Select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option>Select Assessment Officer</option>
            {assessmentBy.map((assessment) => (
              <option key={assessment} value={assessment}>
                {assessment}
              </option>
            ))}
          </Form.Select>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col>
          <Form.Label>Email Address:</Form.Label>
          <Form.Control value={emailAddress} onChange={(e) => setEmailAddress(e.target.value)} />
        </Col>
        <Col>
          <Form.Label>Floor/Room No:</Form.Label>
          <Form.Control value={floorRoomNo} onChange={(e) => setFloorRoomNo(e.target.value)} />
        </Col>
        <Col>
          <Form.Label>Suburb:</Form.Label>
          <Form.Select value={suburb} onChange={(e) => setSuburb(e.target.value)} disabled>
            <option>Select Suburb</option>
            {electoralAreas.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </Form.Select>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col>
          <Form.Label>Contact Person:</Form.Label>
          <Form.Control value={contactPerson} onChange={(e) => setContactPerson(e.target.value)} />
        </Col>
        <Col>
          <Form.Label>Contact Telno:</Form.Label>
          <Form.Control value={contactTelno} onChange={(e) => setContactTelno(e.target.value)} />
        </Col>
        <Col>
          <Form.Label>No Of Branches:</Form.Label>
          <Form.Control value={noOfBranches} onChange={(e) => setNoOfBranches(e.target.value)} />
        </Col>
        <Col>
          <Form.Label>Branch Location:</Form.Label>
          <Form.Control value={branchLocation} onChange={(e) => setBranchLocation(e.target.value)} />
        </Col>
      </Row>
      <Row className="mb-3">
        <Col>
          <Form.Label>No Of Employees:</Form.Label>
          <Form.Control value={noOfEmployees} onChange={(e) => setNoOfEmployees(e.target.value)} />
        </Col>
        <Col>
          <Form.Label>Block Division:</Form.Label>
          <Form.Control value={blockDivision} onChange={(e) => setBlockDivision(e.target.value)} />
        </Col>
        <Col>
          <Form.Label>Block Layout:</Form.Label>
          <Form.Select value={blockLayout} onChange={(e) => setBlockLayout(e.target.value)}>
            <option>Select Block Layout</option>
            {propertyClasses.map((cls) => (
              <option key={cls} value={cls}>
                {cls}
              </option>
            ))}
          </Form.Select>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col>
          <Form.Label>Strategic Location</Form.Label>
          <br />
          <Form.Check
            inline
            label="Excellent"
            type="checkbox"
            onChange={() => handleCheckboxChange(1, setStrategicGrade)}
          />
          <Form.Check
            inline
            label="Very Good"
            type="checkbox"
            onChange={() => handleCheckboxChange(2, setStrategicGrade)}
          />
          <Form.Check
            inline
            label="Good"
            type="checkbox"
            onChange={() => handleCheckboxChange(3, setStrategicGrade)}
          />
          <Form.Check
            inline
            label="Average"
            type="checkbox"
            onChange={() => handleCheckboxChange(4, setStrategicGrade)}
          />
          <Form.Check
            inline
            label="L-Average"
            type="checkbox"
            onChange={() => handleCheckboxChange(5, setStrategicGrade)}
          />
        </Col>
        <Col>
          <Form.Label>Product Variety</Form.Label>
          <br />
          <Form.Check
            inline
            label="Excellent"
            type="checkbox"
            onChange={() => handleCheckboxChange(1, setProductGrade)}
          />
          <Form.Check
            inline
            label="Very Good"
            type="checkbox"
            onChange={() => handleCheckboxChange(2, setProductGrade)}
          />
          <Form.Check
            inline
            label="Good"
            type="checkbox"
            onChange={() => handleCheckboxChange(3, setProductGrade)}
          />
          <Form.Check
            inline
            label="Average"
            type="checkbox"
            onChange={() => handleCheckboxChange(4, setProductGrade)}
          />
          <Form.Check
            inline
            label="L-Average"
            type="checkbox"
            onChange={() => handleCheckboxChange(5, setProductGrade)}
          />
        </Col>
        <Col>
          <Form.Label>Business Popularity</Form.Label>
          <br />
          <Form.Check
            inline
            label="Best"
            type="checkbox"
            onChange={() => handleCheckboxChange(1, setBusPopGrade)}
          />
          <Form.Check
            inline
            label="Better"
            type="checkbox"
            onChange={() => handleCheckboxChange(2, setBusPopGrade)}
          />
          <Form.Check
            inline
            label="Good"
            type="checkbox"
            onChange={() => handleCheckboxChange(3, setBusPopGrade)}
          />
          <Form.Check
            inline
            label="Average"
            type="checkbox"
            onChange={() => handleCheckboxChange(4, setBusPopGrade)}
          />
          <Form.Check
            inline
            label="L-Average"
            type="checkbox"
            onChange={() => handleCheckboxChange(5, setBusPopGrade)}
          />
        </Col>
      </Row>
      <Row className="mb-3">
        <Col>
          <Form.Label>Business Environment</Form.Label>
          <br />
          <Form.Check
            inline
            label="Excellent"
            type="checkbox"
            onChange={() => handleCheckboxChange(1, setBusEnvGrade)}
          />
          <Form.Check
            inline
            label="Very Good"
            type="checkbox"
            onChange={() => handleCheckboxChange(2, setBusEnvGrade)}
          />
          <Form.Check
            inline
            label="Good"
            type="checkbox"
            onChange={() => handleCheckboxChange(3, setBusEnvGrade)}
          />
          <Form.Check
            inline
            label="Average"
            type="checkbox"
            onChange={() => handleCheckboxChange(4, setBusEnvGrade)}
          />
          <Form.Check
            inline
            label="L-Average"
            type="checkbox"
            onChange={() => handleCheckboxChange(5, setBusEnvGrade)}
          />
        </Col>
        <Col>
          <Form.Label>Size Of Business</Form.Label>
          <br />
          <Form.Check
            inline
            label="XX-Large"
            type="checkbox"
            onChange={() => handleCheckboxChange(1, setSizeGrade)}
          />
          <Form.Check
            inline
            label="X-Large"
            type="checkbox"
            onChange={() => handleCheckboxChange(2, setSizeGrade)}
          />
          <Form.Check
            inline
            label="Large"
            type="checkbox"
            onChange={() => handleCheckboxChange(3, setSizeGrade)}
          />
          <Form.Check
            inline
            label="Medium"
            type="checkbox"
            onChange={() => handleCheckboxChange(4, setSizeGrade)}
          />
          <Form.Check
            inline
            label="Small"
            type="checkbox"
            onChange={() => handleCheckboxChange(5, setSizeGrade)}
          />
        </Col>
        <Col>
          <Form.Label>No Of Working Days</Form.Label>
          <br />
          <Form.Check
            inline
            label="7 Days"
            type="checkbox"
            onChange={() => handleCheckboxChange(1, setNoGrade)}
          />
          <Form.Check
            inline
            label="6 Days"
            type="checkbox"
            onChange={() => handleCheckboxChange(2, setNoGrade)}
          />
          <Form.Check
            inline
            label="5 Days"
            type="checkbox"
            onChange={() => handleCheckboxChange(3, setNoGrade)}
          />
          <Form.Check
            inline
            label="4 Days"
            type="checkbox"
            onChange={() => handleCheckboxChange(4, setNoGrade)}
          />
          <Form.Check
            inline
            label="3 Days"
            type="checkbox"
            onChange={() => handleCheckboxChange(5, setNoGrade)}
          />
        </Col>
      </Row>
      <Row className="mb-3">
        <Col>
          <Form.Label>Business Operating Period</Form.Label>
          <br />
          <Form.Check
            inline
            label="24 Hours"
            type="checkbox"
            onChange={() => handleCheckboxChange(1, setBusOpeGrade)}
          />
          <Form.Check
            inline
            label="18 Hours"
            type="checkbox"
            onChange={() => handleCheckboxChange(2, setBusOpeGrade)}
          />
          <Form.Check
            inline
            label="12 Hours"
            type="checkbox"
            onChange={() => handleCheckboxChange(3, setBusOpeGrade)}
          />
          <Form.Check
            inline
            label="8 Hours"
            type="checkbox"
            onChange={() => handleCheckboxChange(4, setBusOpeGrade)}
          />
          <Form.Check
            inline
            label="6 Hours"
            type="checkbox"
            onChange={() => handleCheckboxChange(5, setBusOpeGrade)}
          />
        </Col>
        <Col>
          <Form.Label>Competitors Available</Form.Label>
          <br />
          <Form.Check
            inline
            label="Pure Mono"
            type="checkbox"
            onChange={() => handleCheckboxChange(1, setComAvaGrade)}
          />
          <Form.Check
            inline
            label="Mono(3)"
            type="checkbox"
            onChange={() => handleCheckboxChange(2, setComAvaGrade)}
          />
          <Form.Check
            inline
            label="Moderate(2)"
            type="checkbox"
            onChange={() => handleCheckboxChange(3, setComAvaGrade)}
          />
          <Form.Check
            inline
            label="Fierce(1)"
            type="checkbox"
            onChange={() => handleCheckboxChange(4, setComAvaGrade)}
          />
          <Form.Check
            inline
            label="Not Applicable(0)"
            type="checkbox"
            onChange={() => handleCheckboxChange(5, setComAvaGrade)}
          />
        </Col>
      </Row>
      <Row className="mb-3">
        <Col>
          <Form.Label>Total Marks:</Form.Label>
          <Form.Control value={totalMarks} readOnly />
        </Col>
        <Col>
          <Form.Label>Final Grade:</Form.Label>
          <Form.Control value={finalGrade} readOnly />
        </Col>
      </Row>
      <Row className="mb-3">
        <Col>
          <Button variant="primary" onClick={handleAddClick}>
            Add New Record
          </Button>
        </Col>
        <Col>
          <Button variant="primary" onClick={handleEditClick}>
            Re-evaluate Client
          </Button>
        </Col>
        <Col>
          <Button variant="danger" onClick={handleExitClick}>
            Exit
          </Button>
        </Col>
        <Col>
          <Button variant="primary" onClick={handleViewClick}>
            RELOAD SPREADSHEET
          </Button>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col>
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
              {businesses.map((business) => (
                <tr key={business.buss_no} onClick={() => handleListViewItemClick(business)}>
                  <td>{business.buss_no}</td>
                  <td>{business.buss_name}</td>
                  <td>{business.buss_type}</td>
                  <td>{business.buss_permitno}</td>
                  <td>{business.street_name}</td>
                  <td>{business.landmark}</td>
                  <td>{business.electroral_area}</td>
                  <td>{business.property_class}</td>
                  <td>{business.tot_grade}</td>
                  <td>{business.ceo}</td>
                  <td>{business.telno}</td>
                  <td>{business.assessmentby}</td>
                  <td>{business.transdate}</td>
                  <td>{business.status}</td>
                  <td>{business.serialno}</td>
                  <td>{business.current_rate}</td>
                  <td>{business.property_rate}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </div>
  );
};

export default UpdateClientForm;

// backend/
// ├── src/
// │   ├── controllers/
// │   │   ├── businessController.ts
// │   ├── models/
// │   │   ├── businessModel.ts
// │   ├── routes/
// │   │   ├── businessRoutes.ts
// │   ├── utils/
// │   │   ├── db.ts
// │   ├── app.ts
// │   ├── tsconfig.json
// ├── package.json
// ├── .env



// DB_HOST=localhost
// DB_USER=root
// DB_PASSWORD=Timbuk2tu
// DB_NAME=dsnSaltpond
// PORT=3000

// {
//   "compilerOptions": {
//     "target": "ES6",
//     "module": "commonjs",
//     "rootDir": "./src",
//     "outDir": "./dist",
//     "strict": true,
//     "esModuleInterop": true,
//     "skipLibCheck": true,
//     "forceConsistentCasingInFileNames": true
//   },
//   "include": ["src"]
// }

// import mysql from 'mysql2';
// import { config } from 'dotenv';

// config();

// const db = mysql.createConnection({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
// });

// db.connect((err) => {
//   if (err) {
//     console.error('Error connecting to MySQL:', err);
//     return;
//   }
//   console.log('Connected to MySQL database');
// });

// export default db;


// import db from '../utils/db';

// // Define interfaces for your data
// interface Business {
//   buss_no: string;
//   buss_name: string;
//   buss_address: string;
//   buss_type: string;
//   buss_permitno: string;
//   street_name: string;
//   landmark: string;
//   electroral_area: string;
//   property_class: string;
//   tot_grade: string;
//   ceo: string;
//   telno: string;
//   strategiclocation: number;
//   productvariety: number;
//   businesspopularity: number;
//   businessenvironment: number;
//   sizeofbusiness: number;
//   numberofworkingdays: number;
//   businessoperatingperiod: number;
//   competitorsavailable: number;
//   assessmentby: string;
//   transdate: Date;
//   balance: number;
//   status: string;
//   serialno: string;
//   current_rate: number;
//   site_no: string;
//   property_rate: number;
//   emailaddress: string;
//   floorroomno: string;
//   suburb: string;
//   postaladdress: string;
//   irsno: string;
//   vatno: string;
//   blocklayout: string;
//   blockdivision: string;
//   noofemployees: string;
//   noofbranches: string;
//   detailsofbranches: string;
//   contactperson: string;
//   contacttelno: string;
// }

// // Fetch assessments
// export const getAssessments = async (): Promise<string[]> => {
//   return new Promise((resolve, reject) => {
//     db.query('SELECT officer_no, officer_name FROM tb_officer', (err, results) => {
//       if (err) {
//         reject(err);
//       } else {
//         resolve(results.map((row: any) => `${row.officer_no} ${' '.repeat(10)} ${row.officer_name}`));
//       }
//     });
//   });
// };

// // Fetch business types
// export const getBusinessTypes = async (): Promise<string[]> => {
//   return new Promise((resolve, reject) => {
//     db.query('SELECT DISTINCT buss_type FROM tb_gradefees ORDER BY buss_type ASC', (err, results) => {
//       if (err) {
//         reject(err);
//       } else {
//         resolve(results.map((row: any) => row.buss_type));
//       }
//     });
//   });
// };

// // Fetch electoral areas
// export const getElectoralAreas = async (): Promise<string[]> => {
//   return new Promise((resolve, reject) => {
//     db.query('SELECT DISTINCT electoral_area FROM tb_electoralarea', (err, results) => {
//       if (err) {
//         reject(err);
//       } else {
//         resolve(results.map((row: any) => row.electoral_area));
//       }
//     });
//   });
// };

// // Fetch property classes
// export const getPropertyClasses = async (): Promise<string[]> => {
//   return new Promise((resolve, reject) => {
//     db.query('SELECT DISTINCT propertyclass FROM tb_propertyrate', (err, results) => {
//       if (err) {
//         reject(err);
//       } else {
//         resolve(results.map((row: any) => row.propertyclass));
//       }
//     });
//   });
// };

// // Fetch businesses
// export const getBusinesses = async (): Promise<Business[]> => {
//   return new Promise((resolve, reject) => {
//     db.query('SELECT * FROM tb_business ORDER BY CONVERT(INT, buss_NO)', (err, results) => {
//       if (err) {
//         reject(err);
//       } else {
//         resolve(results);
//       }
//     });
//   });
// };

// // Add a new business record
// export const addBusiness = async (business: Business): Promise<string> => {
//   return new Promise((resolve, reject) => {
//     db.query(
//       'INSERT INTO tb_business (buss_no, buss_name, buss_address, buss_type, buss_permitno, street_name, landmark, electroral_area, property_class, tot_grade, ceo, telno, strategiclocation, productvariety, businesspopularity, businessenvironment, sizeofbusiness, numberofworkingdays, businessoperatingperiod, competitorsavailable, assessmentby, transdate, balance, status, serialno, current_rate, site_no, property_rate, emailaddress, FloorRoomNo, suburb, postaladdress, irsno, vatno, blocklayout, blockdivision, noofemployees, noofbranches, detailsofbranches, contactperson, contacttelno) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
//       [
//         business.buss_no,
//         business.buss_name,
//         business.buss_address,
//         business.buss_type,
//         business.buss_permitno,
//         business.street_name,
//         business.landmark,
//         business.electroral_area,
//         business.property_class,
//         business.tot_grade,
//         business.ceo,
//         business.telno,
//         business.strategiclocation,
//         business.productvariety,
//         business.businesspopularity,
//         business.businessenvironment,
//         business.sizeofbusiness,
//         business.numberofworkingdays,
//         business.businessoperatingperiod,
//         business.competitorsavailable,
//         business.assessmentby,
//         business.transdate,
//         business.balance,
//         business.status,
//         business.serialno,
//         business.current_rate,
//         business.site_no,
//         business.property_rate,
//         business.emailaddress,
//         business.FloorRoomNo,
//         business.suburb,
//         business.postaladdress,
//         business.irsno,
//         business.vatno,
//         business.blocklayout,
//         business.blockdivision,
//         business.noofemployees,
//         business.noofbranches,
//         business.detailsofbranches,
//         business.contactperson,
//         business.contacttelno,
//       ],
//       (err, results) => {
//         if (err) {
//           reject(err);
//         } else {
//           resolve('Record successfully added');
//         }
//       }
//     );
//   });
// };

// // Edit an existing business record
// export const editBusiness = async (business: Business): Promise<string> => {
//   return new Promise((resolve, reject) => {
//     db.query(
//       'UPDATE tb_business SET buss_name = ?, buss_address = ?, buss_type = ?, buss_permitno = ?, street_name = ?, property_rate = ?, landmark = ?, electroral_area = ?, property_class = ?, BALANCE = CONVERT(DECIMAL(13,2), ?), tot_grade = ?, ceo = ?, telno = ?, assessmentby = ?, transdate = ?, status = ?, serialno = ?, current_rate = CONVERT(DECIMAL(13,2), ?) WHERE buss_no = ?',
//       [
//         business.buss_name,
//         business.buss_address,
//         business.buss_type,
//         business.buss_permitno,
//         business.street_name,
//         business.property_rate,
//         business.landmark,
//         business.electroral_area,
//         business.property_class,
//         business.balance,
//         business.tot_grade,
//         business.ceo,
//         business.telno,
//         business.assessmentby,
//         business.transdate,
//         business.status,
//         business.serialno,
//         business.current_rate,
//         business.buss_no,
//       ],
//       (err, results) => {
//         if (err) {
//           reject(err);
//         } else {
//           resolve('Record successfully edited');
//         }
//       }
//     );
//   });
// };

// import express, { Request, Response } from 'express';
// import { getAssessments, getBusinessTypes, getElectoralAreas, getPropertyClasses, getBusinesses, addBusiness, editBusiness } from '../controllers/businessController';

// const router = express.Router();

// // Get assessments
// router.get('/assessments', async (req: Request, res: Response) => {
//   try {
//     const assessments = await getAssessments();
//     res.json(assessments);
//   } catch (error) {
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// // Get business types
// router.get('/businessTypes', async (req: Request, res: Response) => {
//   try {
//     const businessTypes = await getBusinessTypes();
//     res.json(businessTypes);
//   } catch (error) {
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// // Get electoral areas
// router.get('/electoralAreas', async (req: Request, res: Response) => {
//   try {
//     const electoralAreas = await getElectoralAreas();
//     res.json(electoralAreas);
//   } catch (error) {
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// // Get property classes
// router.get('/propertyClasses', async (req: Request, res: Response) => {
//   try {
//     const propertyClasses = await getPropertyClasses();
//     res.json(propertyClasses);
//   } catch (error) {
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// // Get businesses
// router.get('/businesses', async (req: Request, res: Response) => {
//   try {
//     const businesses = await getBusinesses();
//     res.json(businesses);
//   } catch (error) {
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// // Add a new business
// router.post('/addBusiness', async (req: Request, res: Response) => {
//   try {
//     const result = await addBusiness(req.body);
//     res.json({ message: result });
//   } catch (error) {
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// // Edit an existing business
// router.post('/editBusiness', async (req: Request, res: Response) => {
//   try {
//     const result = await editBusiness(req.body);
//     res.json({ message: result });
//   } catch (error) {
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// export default router;

// import express from 'express';
// import bodyParser from 'body-parser';
// import businessRoutes from './routes/businessRoutes';
// import { config } from 'dotenv';

// config();

// const app = express();
// const port = process.env.PORT || 3000;

// app.use(bodyParser.json());
// app.use('/api', businessRoutes);

// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });


