import React, { useState, useEffect } from 'react';
import { Button, Form, Table, Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';

interface GradeRate {
  grade: string;
  minValue: number;
  maxValue: number;
  rate: number;
}

const GradeRateForm: React.FC = () => {
  const [gradeRate, setGradeRate] = useState<GradeRate>({
    grade: '',
    minValue: 0,
    maxValue: 0,
    rate: 0,
  });
  const [gradeRates, setGradeRates] = useState<GradeRate[]>([]);
  const [addFlag, setAddFlag] = useState<string>('');
  const [editFlag, setEditFlag] = useState<string>('');
  const [delFlag, setDelFlag] = useState<string>('');

  useEffect(() => {
    populateListView();
  }, []);

  const populateListView = async () => {
    try {
      const response = await axios.get<GradeRate[]>('/api/gradeRates');
      setGradeRates(response.data);
    } catch (error) {
      console.error('Error fetching grade rates:', error);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setGradeRate((prevGradeRate) => ({
      ...prevGradeRate,
      [name]: name === 'rate' ? parseFloat(value) : parseInt(value, 10),
    }));
  };

  const handleAdd = async () => {
    try {
      if (!gradeRate.grade) {
        throw new Error('Enter the grade');
      }
      if (!gradeRate.minValue) {
        throw new Error('Enter the Minimum Value');
      }
      if (!gradeRate.maxValue) {
        throw new Error('Enter the Maximum Value');
      }
      if (!gradeRate.rate) {
        throw new Error('Enter the rate');
      }

      const response = await axios.post('/api/gradeRates', gradeRate);
      setAddFlag(response.data.message);
      populateListView();
      setGradeRate({ grade: '', minValue: 0, maxValue: 0, rate: 0 });
    } catch (error) {
      console.error('Error adding grade rate:', error);
      setAddFlag('Error in adding a record');
    }
  };

  const handleEdit = async () => {
    try {
      if (!gradeRate.grade) {
        throw new Error('Enter the grade');
      }
      if (!gradeRate.minValue) {
        throw new Error('Enter the Minimum Value');
      }
      if (!gradeRate.maxValue) {
        throw new Error('Enter the Maximum Value');
      }
      if (!gradeRate.rate) {
        throw new Error('Enter the rate');
      }

      const response = await axios.put(`/api/gradeRates/${gradeRate.grade}`, gradeRate);
      setEditFlag(response.data.message);
      populateListView();
      setGradeRate({ grade: '', minValue: 0, maxValue: 0, rate: 0 });
    } catch (error) {
      console.error('Error editing grade rate:', error);
      setEditFlag('Error in editing a record');
    }
  };

  const handleDelete = async () => {
    try {
      if (!gradeRate.grade) {
        throw new Error('Enter the grade');
      }

      const response = await axios.delete(`/api/gradeRates/${gradeRate.grade}`);
      setDelFlag(response.data.message);
      populateListView();
      setGradeRate({ grade: '', minValue: 0, maxValue: 0, rate: 0 });
    } catch (error) {
      console.error('Error deleting grade rate:', error);
      setDelFlag('Error in deleting record');
    }
  };

  const handleSelectGradeRate = (event: React.MouseEvent<HTMLElement>) => {
    const selectedGrade = event.currentTarget.getAttribute('data-grade');
    if (selectedGrade) {
      const selectedRecord = gradeRates.find((gr) => gr.grade === selectedGrade);
      if (selectedRecord) {
        setGradeRate(selectedRecord);
      }
    }
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col xs={12} md={8}>
          <h1 className="text-center text-primary">Grade Rates Data Entry</h1>
          <h2 className="text-center text-info">CALIBRATE FEE FIXING GRADES</h2>
          <h2 className="text-center text-danger">MARCORY MUNICIPAL ASSEMBLY</h2>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Grade:</Form.Label>
              <Form.Control
                type="text"
                name="grade"
                value={gradeRate.grade}
                onChange={handleInputChange}
                placeholder="Enter Grade"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Minimum Value:</Form.Label>
              <Form.Control
                type="text"
                name="minValue"
                value={gradeRate.minValue}
                onChange={handleInputChange}
                placeholder="Enter Minimum Value"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Maximum Value:</Form.Label>
              <Form.Control
                type="text"
                name="maxValue"
                value={gradeRate.maxValue}
                onChange={handleInputChange}
                placeholder="Enter Maximum Value"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Rate:</Form.Label>
              <Form.Control
                type="text"
                name="rate"
                value={gradeRate.rate.toFixed(2)}
                onChange={handleInputChange}
                placeholder="Enter Rate"
              />
            </Form.Group>
            <div className="d-flex justify-content-between">
              <Button variant="primary" onClick={handleAdd}>
                Add New Record
              </Button>
              <Button variant="warning" onClick={handleEdit}>
                Edit Old Record
              </Button>
              <Button variant="danger" onClick={handleDelete}>
                Delete
              </Button>
              <Button variant="secondary" onClick={() => alert('Exit')}>
                Exit
              </Button>
              <Button variant="info" onClick={populateListView}>
                Load Spreadsheet
              </Button>
            </div>
            {addFlag && <p className="text-success mt-2">{addFlag}</p>}
            {editFlag && <p className="text-success mt-2">{editFlag}</p>}
            {delFlag && <p className="text-danger mt-2">{delFlag}</p>}
          </Form>
          <Table striped bordered hover className="mt-3">
            <thead>
              <tr>
                <th>GRADE</th>
                <th>MINIMUM VALUE</th>
                <th>MAXIMUM VALUE</th>
                <th>RATE</th>
              </tr>
            </thead>
            <tbody>
              {gradeRates.map((gr) => (
                <tr key={gr.grade} data-grade={gr.grade} onClick={handleSelectGradeRate}>
                  <td>{gr.grade.toUpperCase()}</td>
                  <td>{gr.minValue}</td>
                  <td>{gr.maxValue}</td>
                  <td>{gr.rate.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
};

export default GradeRateForm;


// import express from 'express';
// import { Request, Response } from 'express';
// import { Pool } from 'pg';

// const app = express();
// app.use(express.json());

// const pool = new Pool({
//   user: 'sa',
//   host: 'localhost',
//   database: 'dsnSaltpond',
//   password: 'Timbuk2tu',
//   port: 5432,
// });

// app.get('/api/gradeRates', async (req: Request, res: Response) => {
//   try {
//     const result = await pool.query<GradeRate[]>('SELECT * FROM tb_graderate ORDER BY grade');
//     res.json(result.rows);
//   } catch (err) {
//     res.status(500).json({ message: 'Error fetching grade rates' });
//   }
// });

// app.post('/api/gradeRates', async (req: Request, res: Response) => {
//   const { grade, minValue, maxValue, rate } = req.body;
//   try {
//     const result = await pool.query<GradeRate[]>(
//       'SELECT * FROM tb_graderate WHERE grade = $1',
//       [grade]
//     );
//     if (result.rows.length > 0) {
//       return res.status(400).json({ message: 'Record already exists' });
//     }
//     await pool.query('INSERT INTO tb_graderate(grade, minValue, maxValue, rate) VALUES($1, $2, $3, $4)', [grade, minValue, maxValue, rate]);
//     res.json({ message: 'Record successfully added' });
//   } catch (err) {
//     res.status(500).json({ message: 'Error in adding a record' });
//   }
// });

// app.put('/api/gradeRates/:grade', async (req: Request, res: Response) => {
//   const { grade } = req.params;
//   const { minValue, maxValue, rate } = req.body;
//   try {
//     const result = await pool.query<GradeRate[]>(
//       'SELECT * FROM tb_graderate WHERE grade = $1',
//       [grade]
//     );
//     if (result.rows.length === 0) {
//       return res.status(404).json({ message: 'Record does not exist' });
//     }
//     await pool.query('UPDATE tb_graderate SET minValue = $1, maxValue = $2, rate = $3 WHERE grade = $4', [minValue, maxValue, rate, grade]);
//     res.json({ message: 'Record successfully edited' });
//   } catch (err) {
//     res.status(500).json({ message: 'Error in editing a record' });
//   }
// });

// app.delete('/api/gradeRates/:grade', async (req: Request, res: Response) => {
//   const { grade } = req.params;
//   try {
//     const result = await pool.query<GradeRate[]>(
//       'SELECT * FROM tb_graderate WHERE grade = $1',
//       [grade]
//     );
//     if (result.rows.length === 0) {
//       return res.status(404).json({ message: 'Record does not exist' });
//     }
//     await pool.query('DELETE FROM tb_graderate WHERE grade = $1', [grade]);
//     res.json({ message: 'Record successfully deleted' });
//   } catch (err) {
//     res.status(500).json({ message: 'Error in deleting record' });
//   }
// });

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
