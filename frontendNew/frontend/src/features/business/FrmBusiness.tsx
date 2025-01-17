import React, { useState, useEffect } from 'react';
import { Button, Form, FormGroup, Label, Input, Card, CardBody, CardHeader, Col, Row } from 'reactstrap';
//import axios from 'axios';
import { fetchElectoralAreas } from '../electoralArea/electoralAreaSlice';
import { fetchBusinessTypes } from '../businessType/businessTypeSlice';
import { fetchPropertyClasses } from '../propertyClass/propertyClassSlice';
import { fetchOfficers } from '../officer/officerSlice' //'../assessment/assessmentSlice';
//import { addBusiness } from './businessSlice';

import {createBusiness} from './businessSlice'
//import { useDispatch, useSelector } from 'react-redux';
//import { RootState } from '../../app/store';
import { useAppDispatch, useAppSelector } from '../../app/store';

// import useAppDispatch from '../../app/hooks';
// import { useAppSelector } from '../../app/hooks';
// import { selectBusinessById } from './businessSlice';
// import { selectBusinessTypes } from '../businessType/businessTypeSlice';
// import { selectElectoralAreas } from '../electoralArea/electoralAreaSlice';
// import { selectPropertyClasses } from '../propertyClass/propertyClassSlice';
// import { selectAssessments } from '../assessment/assessmentSlice';
// import { selectBusiness } from './businessSlice';
// import { useHistory } from 'react-router-dom';
// import { useFormik } from 'formik';
// import * as Yup from 'yup';
// import { Formik } from 'formik';
// import { useParams } from 'react-router-dom';
// import { useLocation } from 'react-router-dom';
// import { useRouteMatch } from 'react-router-dom';
// import { useLocation } from 'react-router-dom';
// import { useParams } from 'react-router-dom';
// import { useParams } from 'react-router-dom';

type FormData = {
  buss_no: number;
  buss_name: string;
  buss_address: string;
  buss_type: string;
  buss_town: string;
  buss_permitNo: string;
  street_name: string;
  landmark: string;
  electroral_area: string;
  property_class: string;
  Tot_grade: number;
  ceo: string;
  telno: string;
  strategiclocation: number;
  productvariety: number;
  businesspopularity: number;
  businessenvironment: number;
  sizeofbusiness: number;
  numberofworkingdays: number;
  businessoperatingperiod: number;
  competitorsavailable: number;
  assessmentby: string;
  transdate: Date;
  balance: number;
  status: string;
  serialno: number;
  current_rate: number;
  property_rate: number;
  totalmarks: number;
  meterid: number;
  metercategory: string;
  emailaddress: string;
  FloorRoomNo: string;
  suburb: string;
  postaladdress: string;
  irsno: string;
  vatno: string;
  blocklayout: string;
  blockdivision: string;
  noofemployees: number;
  noofbranches: number;
  detailsofbranches: string;
  contactperson: string;
  contacttelno: string;
  BALANCENEW: number;
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
    Tot_grade: 0,
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
    status: '',
    serialno: 0,
    current_rate: 0,
    property_rate: 0,
    totalmarks: 0,
    meterid: 0,
    metercategory: '',
    emailaddress: '',
    FloorRoomNo: '',
    suburb: '',
    postaladdress: '',
    irsno: '',
    vatno: '',
    blocklayout: '',
    blockdivision: '',
    noofemployees: 0,
    noofbranches: 0,
    detailsofbranches: '',
    contactperson: '',
    contacttelno: '',
    BALANCENEW: 0,
  });

  const [electoralAreas, setElectoralAreas] = useState<string[]>([]);
  const [businessTypes, setBusinessTypes] = useState<string[]>([]);
  const [propertyClasses, setPropertyClasses] = useState<string[]>([]);
  const [assessments, setAssessments] = useState<string[]>([]);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchElectoralAreas());
    dispatch(fetchBusinessTypes());
    dispatch(fetchPropertyClasses());
    dispatch(fetchOfficers());
  }, []);

  const electoralArea = useAppSelector((state) => state.electoralArea.electoralAreas);
  setElectoralAreas(electoralArea.map((area: any) => area.electoral_area));

  const businessType = useAppSelector((state) => state.businessType.businessTypes);
  setBusinessTypes(businessType.map((type: any) => type.buss_type));

  const propertyClass = useAppSelector((state) => state.propertyClass.propertyClasses);
  setPropertyClasses(propertyClass.map((classType: any) => classType.property_class));

  const officer = useAppSelector((state) => state.officer.officers);
  setAssessments(officer.map((officer: any) => `${officer.officer_no} ${officer.officer_name}`));

  // propertyClasses.push(response.data.map((property: any) => property.property_class));
  // setPropertyClasses(response.data.map((property: any) => property.property_class));

  // const loadElectoralAreas = async () => {
  //   try {
  //     // Fetch data from API
  //    // const response = dispatch(fetchElectoralAreas());
     
  //     const electoralAreas = useAppSelector((state) => state.electoralArea.electoralAreas);
  //     setElectoralAreas(electoralAreas.map((area: any) => area.electoral_area));
  //   } catch (error) {
  //     console.error(error);
  //     alert('Error loading electoral areas');
  //   }
  // };

  // const loadBusinessTypes = async () => {
  //   try {
  //     //const response = dispatch(fetchBusinessTypes());
  //     const businessTypes = useAppSelector((state) => state.businessType.businessTypes); //electoralArea.electoralAreas);
      
  //     setBusinessTypes(businessTypes.map((type: any) => type.buss_type));
  //   } catch (error) {
  //     console.error(error);
  //     alert('Error loading business types');
  //   }
  // };

  // const loadPropertyClasses = async () => {
  //   try {
  //     const response = dispatch(fetchPropertyClasses());

  //     propertyClasses.push(response.data.map((property: any) => property.property_class));
  //     setPropertyClasses(response.data.map((property: any) => property.property_class));
  //   } catch (error) {
  //     console.error(error);
  //     alert('Error loading property classes');
  //   }
  // };

  // const loadAssessments = async () => {
  //   try {
  //     const response = dispatch(fetchOfficers());

  //     assessments.push(response.data.map((officer: any) => `${officer.officer_no} ${officer.officer_name}`));
  //     setAssessments(response.data.map((officer: any) => `${officer.officer_no} ${officer.officer_name}`));
  //   } catch (error) {
  //     console.error(error);
  //     alert('Error loading assessments');
  //   }
  // };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddClick = async () => {
    try {
      // Basic validation (you can expand this)
      if (!formData.buss_no) {
        alert('Enter the business number');
        return;
      }

      const response = dispatch(createBusiness(formData))
      console.log(response);
      
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
        Tot_grade: 0,
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
        status: '',
        serialno: 0,
        current_rate: 0,
        property_rate: 0,
        totalmarks: 0,
        meterid: 0,
        metercategory: '',
        emailaddress: '',
        FloorRoomNo: '',
        suburb: '',
        postaladdress: '',
        irsno: '',
        vatno: '',
        blocklayout: '',
        blockdivision: '',
        noofemployees: 0,
        noofbranches: 0,
        detailsofbranches: '',
        contactperson: '',
        contacttelno: '',
        BALANCENEW: 0,
      });
    } catch (error) {
      console.error(error);
      alert('Error in adding a record');
    }
  };

  return (
    <Card>
      <CardHeader>
        <h3>Business Data Entry</h3>
      </CardHeader>
      <CardBody>
        <Form>
          <Row>
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
                <Input type="select" name="electoral_area" id="electoral_area" value={formData.electroral_area} onChange={handleChange}>
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
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for="emailaddress">Email Address:</Label>
                <Input type="email" name="emailaddress" id="emailaddress" value={formData.emailaddress} onChange={handleChange} />
              </FormGroup>
            </Col>
          </Row>
          {/* Add more fields as necessary */}
          <Row>
            <Col md={12}>
              <Button color="primary" onClick={handleAddClick}>Add New Record</Button>
            </Col>
          </Row>
          Property Class: {propertyClasses}
          Collector: {assessments}
        </Form>
      </CardBody>
    </Card>
  );
};

//export default FrmBusiness;

// import mysql, { Connection } from 'mysql2';

// const connection: Connection = mysql.createConnection({
//   host: 'localhost',
//   user: 'sa',
//   password: 'Timbuk2tu',
//   database: 'dsnAdenta',
// });

// connection.connect((err) => {
//   if (err) {
//     console.error('Error connecting to MySQL:', err);
//   } else {
//     console.log('Connected to MySQL');
//   }
// });

// export default connection;

// export interface Business {
//   buss_no: string;
//   buss_name: string;
//   buss_address: string;
//   street_name: string;
//   landmark: string;
//   electroral_area: string;
//   buss_permitNo: string;
//   buss_type: string;
//   telno: string;
//   emailaddress: string;
//   irsno: string;
//   vatno: string;
//   businessOperatingAC: string;
//   businessoperatingperiod: string;
//   competitorsavailable: string;
//   noofworkingdays: string;
//   strategiclocation: number;
//   productvariety: number;
//   businesspopularity: number;
//   businessenvironment: number;
//   sizeofbusiness: number;
//   noGrade: number;
//   busOpeGrade: number;
//   comAvaGrade: number;
//   tot_grade: string;
//   ceo: string;
//   assessmentby: string;
//   transdate: Date;
//   status: string;
//   serialno: string;
//   current_rate: number;
//   property_rate: number;
//   totalmarks: number;
//   meterid: string;
//   metercategory: string;
//   postaladdress: string;
//   floormRoomNo: string;
//   suburb: string;
//   noofemployees: number;
//   noofbranches: number;
//   detailsofbranches: string;
//   contactperson: string;
//   contacttelno: string;
//   balancebf: number;
// }

// import connection from '../config/dbConfig';
// import { Business } from '../models/businessModel';

// const loadElectoralAreas = async (): Promise<string[]> => {
//   return new Promise((resolve, reject) => {
//     connection.query('SELECT electoral_area FROM tb_electoralarea', (err, results) => {
//       if (err) reject(err);
//       else resolve(results.map((row: any) => row.electoral_area));
//     });
//   });
// };

// const loadBusinessTypes = async (): Promise<string[]> => {
//   return new Promise((resolve, reject) => {
//     connection.query('SELECT DISTINCT buss_type FROM tb_gradefees ORDER BY buss_type ASC', (err, results) => {
//       if (err) reject(err);
//       else resolve(results.map((row: any) => row.buss_type));
//     });
//   });
// };

// const loadPropertyClasses = async (): Promise<string[]> => {
//   return new Promise((resolve, reject) => {
//     connection.query('SELECT DISTINCT property_class FROM tb_business ORDER BY property_class ASC', (err, results) => {
//       if (err) reject(err);
//       else resolve(results.map((row: any) => row.property_class));
//     });
//   });
// };

// const loadAssessments = async (): Promise<string[]> => {
//   return new Promise((resolve, reject) => {
//     connection.query('SELECT officer_no, officer_name FROM tb_officer', (err, results) => {
//       if (err) reject(err);
//       else resolve(results.map((row: any) => `${row.officer_no} ${row.officer_name}`));
//     });
//   });
// };

// const loadGrades = async (businessType: string): Promise<string[]> => {
//   return new Promise((resolve, reject) => {
//     connection.query('SELECT grade FROM tb_gradefees WHERE buss_type = ? ORDER BY grade ASC', [businessType], (err, results) => {
//       if (err) reject(err);
//       else resolve(results.map((row: any) => row.grade));
//     });
//   });
// };

// const populateGradeRates = async (): Promise<any> => {
//   return new Promise((resolve, reject) => {
//     connection.query('SELECT * FROM tb_graderate', (err, results) => {
//       if (err) reject(err);
//       else resolve(results);
//     });
//   });
// };

// const addBusiness = async (business: Business): Promise<string> => {
//   return new Promise((resolve, reject) => {
//     connection.query('SELECT * FROM tb_business WHERE buss_no = ? OR buss_name = ?', [business.buss_no, business.buss_name], (err, results) => {
//       if (err) reject(err);
//       if (results.length > 0) {
//         resolve('Record already exists. Give it a middle name to make it different!!!');
//       } else {
//         connection.query('INSERT INTO tb_business SET ?', [business], (err, results) => {
//           if (err) reject(err);
//           else resolve('Record successfully added');
//         });
//       }
//     });
//   });
// };

// const viewBusinesses = async (): Promise<Business[]> => {
//   return new Promise((resolve, reject) => {
//     connection.query('SELECT * FROM tb_business', (err, results) => {
//       if (err) reject(err);
//       else resolve(results);
//     });
//   });
// };

// export { loadElectoralAreas, loadBusinessTypes, loadPropertyClasses, loadAssessments, loadGrades, populateGradeRates, addBusiness, viewBusinesses };


// import { Request, Response } from 'express';
// import { loadElectoralAreas, loadBusinessTypes, loadPropertyClasses, loadAssessments, loadGrades, populateGradeRates, addBusiness, viewBusinesses } from '../services/businessService';

// export const getElectoralAreas = async (req: Request, res: Response) => {
//   try {
//     const electoralAreas = await loadElectoralAreas();
//     res.json(electoralAreas);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Error loading electoral areas');
//   }
// };

// export const getBusinessTypes = async (req: Request, res: Response) => {
//   try {
//     const businessTypes = await loadBusinessTypes();
//     res.json(businessTypes);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Error loading business types');
//   }
// };

// export const getPropertyClasses = async (req: Request, res: Response) => {
//   try {
//     const propertyClasses = await loadPropertyClasses();
//     res.json(propertyClasses);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Error loading property classes');
//   }
// };

// export const getAssessments = async (req: Request, res: Response) => {
//   try {
//     const assessments = await loadAssessments();
//     res.json(assessments);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Error loading assessments');
//   }
// };

// export const getGrades = async (req: Request, res: Response) => {
//   const businessType = req.query.businessType as string;
//   try {
//     const grades = await loadGrades(businessType);
//     res.json(grades);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Error loading grades');
//   }
// };

// export const getGradeRates = async (req: Request, res: Response) => {
//   try {
//     const gradeRates = await populateGradeRates();
//     res.json(gradeRates);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Error populating grade rates');
//   }
// };

// export const addBusinessRecord = async (req: Request, res: Response) => {
//   const business: Business = req.body;
//   try {
//     const message = await addBusiness(business);
//     res.send(message);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Error in adding a record');
//   }
// };

// export const viewBusinessRecords = async (req: Request, res: Response) => {
//   try {
//     const businesses = await viewBusinesses();
//     res.json(businesses);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Error fetching business records');
//   }
// };


// // import { Router } from 'express';
// // import { getElectoralAreas, getBusinessTypes, getPropertyClasses, getAssessments, getGrades, getGradeRates, addBusinessRecord, viewBusinessRecords } from '../controllers/businessController';

// // const router = Router();

// // router.get('/electoral-areas', getElectoralAreas);
// // router.get('/business-types', getBusinessTypes);
// // router.get('/property-classes', getPropertyClasses);
// // router.get('/assessments', getAssessments);
// // router.get('/grades', getGrades);
// // router.get('/grade-rates', getGradeRates);
// // router.post('/add-business', addBusinessRecord);
// // router.get('/view-businesses', viewBusinessRecords);

// // export default router;


// // import express, { Application, Request, Response } from 'express';
// // import bodyParser from 'body-parser';
// // import businessRoutes from './routes/businessRoutes';

// // const app: Application = express();

// // app.use(bodyParser.json());
// // app.use(bodyParser.urlencoded({ extended: true }));

// // app.use('/api', businessRoutes);

// // app.get('/', (req: Request, res: Response) => {
// //   res.send('Welcome to the Business Data Entry API');
// // });

// // export default app;


