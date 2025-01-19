import React, { useState, useEffect } from 'react';
import { Button, Col, Form, Row, Table } from 'react-bootstrap';
import axios from 'axios';
import { Link } from 'react-router-dom';

const FrmProducePropertyRate: React.FC = () => {
  // State management for form fields
  const [propertyClass, setPropertyClass] = useState('');
  const [fiscalYear, setFiscalYear] = useState('');
  const [rate, setRate] = useState('');
  const [registrationRate, setRegistrationRate] = useState('');

  // State management for dropdowns
  const [propertyClasses, setPropertyClasses] = useState<string[]>([]);

  // State management for ListView equivalent
  const [propertyRates, setPropertyRates] = useState<any[]>([]);

  // Fetch dropdowns and ListView data on component mount
  useEffect(() => {
    fetchClasses();
    fetchRates();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await axios.get('/api/classes');
      setPropertyClasses(response.data);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  const fetchRates = async () => {
    try {
      const response = await axios.get('/api/rates');
      setPropertyRates(response.data);
    } catch (error) {
      console.error('Error fetching rates:', error);
    }
  };

  const handleAddClick = async () => {
    try {
      const response = await axios.post('/api/addRate', {
        property_class: propertyClass,
        fiscalyear: parseInt(fiscalYear, 10),
        rate: parseFloat(rate),
        registrationrate: parseFloat(registrationRate),
      });
      alert(response.data.message);
      fetchRates();
    } catch (error) {
      console.error('Error adding rate:', error);
      alert('Error in adding a record');
    }
  };

  const handleEditClick = async () => {
    try {
      const response = await axios.post('/api/editRate', {
        property_class: propertyClass,
        fiscalyear: parseInt(fiscalYear, 10),
        rate: parseFloat(rate),
        registrationrate: parseFloat(registrationRate),
      });
      alert(response.data.message);
      fetchRates();
    } catch (error) {
      console.error('Error editing rate:', error);
      alert('Error in editing a record');
    }
  };

  const handleExitClick = () => {
    // Add your logic to exit here
    console.log('Exit');
  };

  const handleListViewItemClick = (rate: any) => {
    setPropertyClass(rate.property_class);
    setFiscalYear(rate.fiscalyear.toString());
    setRate(rate.rate.toString());
    setRegistrationRate(rate.registrationrate.toString());
  };

  return (
    <div className="container">
      <Row className="mb-3">
        <Col>
          <h2 className="text-primary">Property Rate Data Entry</h2>
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
      </Row>
      <Row className="mb-3">
        <Col>
          <Form.Label>Fiscal Year:</Form.Label>
          <Form.Control value={fiscalYear} onChange={(e) => setFiscalYear(e.target.value)} />
        </Col>
      </Row>
      <Row className="mb-3">
        <Col>
          <Form.Label>Rate:</Form.Label>
          <Form.Control value={rate} onChange={(e) => setRate(e.target.value)} />
        </Col>
      </Row>
      <Row className="mb-3">
        <Col>
          <Form.Label>Registration Rate:</Form.Label>
          <Form.Control value={registrationRate} onChange={(e) => setRegistrationRate(e.target.value)} />
        </Col>
      </Row>
      <Row className="mb-3">
        <Col>
          <Button variant="primary" onClick={handleAddClick}>
            Add New Record
          </Button>
        </Col>
        <Col>
          <Button variant="warning" onClick={handleEditClick}>
            Edit Old Record
          </Button>
        </Col>
        <Col>
          <Button variant="danger" onClick={handleExitClick}>
            Exit
          </Button>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>PROPERTY CLASS</th>
                <th>FISCAL YEAR</th>
                <th>RATE</th>
                <th>REGISTRATION RATE</th>
              </tr>
            </thead>
            <tbody>
              {propertyRates.map((rate) => (
                <tr key={`${rate.property_class}-${rate.fiscalyear}`} onClick={() => handleListViewItemClick(rate)}>
                  <td>{rate.property_class}</td>
                  <td>{rate.fiscalyear}</td>
                  <td>{rate.rate}</td>
                  <td>{rate.registrationrate}</td>
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
    </div>
  );
};

export default FrmProducePropertyRate;

// import React from 'react';
// import PropertyRateForm from './components/PropertyRateForm';
// import 'bootstrap/dist/css/bootstrap.min.css';

// const App: React.FC = () => {
//   return (
//     <div className="App">
//       <PropertyRateForm />
//     </div>
//   );
// };

// export default App;

// backend/
// ├── src/
// │   ├── controllers/
// │   │   ├── propertyRateController.ts
// │   ├── models/
// │   │   ├── propertyRateModel.ts
// │   ├── routes/
// │   │   ├── propertyRateRoutes.ts
// │   ├── utils/
// │   │   ├── db.ts
// │   ├── app.ts
// │   ├── tsconfig.json
// ├── package.json
// ├── .env


// import db from '../utils/db';

// // Define interfaces for your data
// interface PropertyRate {
//   property_class: string;
//   fiscalyear: number;
//   rate: number;
//   registrationrate: number;
// }

// // Fetch property classes
// export const getPropertyClasses = async (): Promise<string[]> => {
//   return new Promise((resolve, reject) => {
//     db.query('SELECT DISTINCT property_class FROM tb_business', (err, results) => {
//       if (err) {
//         reject(err);
//       } else {
//         resolve(results.map((row: any) => row.property_class));
//       }
//     });
//   });
// };

// // Fetch property rates
// export const getPropertyRates = async (): Promise<PropertyRate[]> => {
//   return new Promise((resolve, reject) => {
//     db.query('SELECT * FROM tb_propertyrate ORDER BY property_class', (err, results) => {
//       if (err) {
//         reject(err);
//       } else {
//         resolve(results);
//       }
//     });
//   });
// };

// // Add a new property rate record
// export const addPropertyRate = async (propertyRate: PropertyRate): Promise<string> => {
//   return new Promise((resolve, reject) => {
//     db.query(
//       'INSERT INTO tb_propertyrate (property_class, fiscalyear, rate, registrationrate) VALUES (?, ?, ?, ?)',
//       [
//         propertyRate.property_class,
//         propertyRate.fiscalyear,
//         propertyRate.rate,
//         propertyRate.registrationrate,
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

// // Edit an existing property rate record
// export const editPropertyRate = async (propertyRate: PropertyRate): Promise<string> => {
//   return new Promise((resolve, reject) => {
//     db.query(
//       'UPDATE tb_propertyrate SET rate = ?, registrationrate = ? WHERE property_class = ? AND fiscalyear = ?',
//       [
//         propertyRate.rate,
//         propertyRate.registrationrate,
//         propertyRate.property_class,
//         propertyRate.fiscalyear,
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

// // Delete a property rate record
// export const deletePropertyRate = async (propertyClass: string, fiscalYear: number): Promise<string> => {
//   return new Promise((resolve, reject) => {
//     db.query(
//       'DELETE FROM tb_propertyrate WHERE property_class = ? AND fiscalyear = ?',
//       [propertyClass, fiscalYear],
//       (err, results) => {
//         if (err) {
//           reject(err);
//         } else {
//           resolve('Record successfully deleted');
//         }
//       }
//     );
//   });
// };


// import { Request, Response } from 'express';
// import { getPropertyClasses, getPropertyRates, addPropertyRate, editPropertyRate, deletePropertyRate } from '../models/propertyRateModel';

// // Get property classes
// export const getClasses = async (req: Request, res: Response) => {
//   try {
//     const classes = await getPropertyClasses();
//     res.json(classes);
//   } catch (error) {
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };

// // Get property rates
// export const getRates = async (req: Request, res: Response) => {
//   try {
//     const rates = await getPropertyRates();
//     res.json(rates);
//   } catch (error) {
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };

// // Add a new property rate
// export const addRate = async (req: Request, res: Response) => {
//   try {
//     const result = await addPropertyRate(req.body);
//     res.json({ message: result });
//   } catch (error) {
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };

// // Edit an existing property rate
// export const editRate = async (req: Request, res: Response) => {
//   try {
//     const result = await editPropertyRate(req.body);
//     res.json({ message: result });
//   } catch (error) {
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };

// // Delete a property rate
// export const deleteRate = async (req: Request, res: Response) => {
//   try {
//     const propertyClass = req.body.property_class;
//     const fiscalYear = req.body.fiscalyear;
//     const result = await deletePropertyRate(propertyClass, fiscalYear);
//     res.json({ message: result });
//   } catch (error) {
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };

// import express, { Request, Response } from 'express';
// import { getClasses, getRates, addRate, editRate, deleteRate } from '../controllers/propertyRateController';

// const router = express.Router();

// // Get property classes
// router.get('/classes', getClasses);

// // Get property rates
// router.get('/rates', getRates);

// // Add a new property rate
// router.post('/addRate', addRate);

// // Edit an existing property rate
// router.post('/editRate', editRate);

// // Delete a property rate
// router.post('/deleteRate', deleteRate);

// export default router;

// import express from 'express';
// import bodyParser from 'body-parser';
// import propertyRateRoutes from './routes/propertyRateRoutes';
// import { config } from 'dotenv';

// config();

// const app = express();
// const port = process.env.PORT || 3000;

// app.use(bodyParser.json());
// app.use('/api', propertyRateRoutes);

// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });

// import 'bootstrap/dist/css/bootstrap.min.css';
// import React from 'react';
// import ReactDOM from 'react-dom';
// import App from './App';

// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById('root')
// );
// import 'bootstrap/dist/css/bootstrap.min.css';
// import React from 'react';
// import ReactDOM from 'react-dom';
// import App from './App';

// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById('root')
// );
