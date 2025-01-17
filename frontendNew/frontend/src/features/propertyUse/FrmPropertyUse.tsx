import React, { useState, useEffect } from 'react';
import { Button, Form, Table, Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';

interface PropertyUse {
  PropertyUse: string;
  PropertyRate: number;
}

const FrmPropertyUse: React.FC = () => {
  const [propertyUse, setPropertyUse] = useState<PropertyUse>({
    PropertyUse: '',
    PropertyRate: 0,
  });
  const [propertyUses, setPropertyUses] = useState<PropertyUse[]>([]);
  const [addFlag, setAddFlag] = useState<string>('');
  const [delFlag, setDelFlag] = useState<string>('');

  useEffect(() => {
    populateListView();
  }, []);

  const populateListView = async () => {
    try {
      const response = await axios.get<PropertyUse[]>('/api/propertyUses');
      setPropertyUses(response.data);
    } catch (error) {
      console.error('Error fetching property uses:', error);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setPropertyUse((prevPropertyUse) => ({
      ...prevPropertyUse,
      [name]: name === 'PropertyRate' ? parseFloat(value) : value,
    }));
  };

  const handleAdd = async () => {
    try {
      if (!propertyUse.PropertyUse) {
        throw new Error('Enter the property use');
      }
      if (!propertyUse.PropertyRate || isNaN(propertyUse.PropertyRate)) {
        throw new Error('Enter the property rate');
      }

      const response = await axios.post('/api/propertyUses', propertyUse);
      setAddFlag(response.data.message);
      populateListView();
      setPropertyUse({ PropertyUse: '', PropertyRate: 0 });
    } catch (error) {
      console.error('Error adding property use:', error);
      setAddFlag('Error in adding a record');
    }
  };

  const handleDelete = async () => {
    try {
      if (!propertyUse.PropertyUse) {
        throw new Error('Enter the property use');
      }

      const response = await axios.delete(`/api/propertyUses/${propertyUse.PropertyUse}`);
      setDelFlag(response.data.message);
      populateListView();
      setPropertyUse({ PropertyUse: '', PropertyRate: 0 });
    } catch (error) {
      console.error('Error deleting property use:', error);
      setDelFlag('Error in deleting record');
    }
  };

  const handleSelectPropertyUse = (event: React.MouseEvent<HTMLElement>) => {
    const selectedPropertyUse = event.currentTarget.getAttribute('data-propertyuse');
    if (selectedPropertyUse) {
      const selectedRecord = propertyUses.find((pu) => pu.PropertyUse === selectedPropertyUse);
      if (selectedRecord) {
        setPropertyUse(selectedRecord);
      }
    }
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col xs={12} md={8}>
          <h1 className="text-center text-primary">Enter the Use of Property from The FEE FIXING TABLE</h1>
          <h2 className="text-center text-danger">MARCORY MUNICIPAL ASSEMBLY</h2>
          <h3 className="text-center text-info">FEE FIXING FOR PROPERTY RATES</h3>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Use of Property:</Form.Label>
              <Form.Control
                type="text"
                name="PropertyUse"
                value={propertyUse.PropertyUse}
                onChange={handleInputChange}
                placeholder="Enter Use of Property"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Property Rate:</Form.Label>
              <Form.Control
                type="text"
                name="PropertyRate"
                value={propertyUse.PropertyRate.toFixed(2)}
                onChange={handleInputChange}
                placeholder="Enter Property Rate"
              />
            </Form.Group>
            <div className="d-flex justify-content-between">
              <Button variant="primary" onClick={handleAdd}>
                Add New Record
              </Button>
              <Button variant="danger" onClick={handleDelete}>
                Delete
              </Button>
              <Button variant="secondary" onClick={() => alert('Exit')}>
                Exit
              </Button>
            </div>
            {addFlag && <p className="text-success mt-2">{addFlag}</p>}
            {delFlag && <p className="text-danger mt-2">{delFlag}</p>}
          </Form>
          <Table striped bordered hover className="mt-3">
            <thead>
              <tr>
                <th>USE OF PROPERTY</th>
                <th>RATE</th>
              </tr>
            </thead>
            <tbody>
              {propertyUses.map((pu) => (
                <tr key={pu.PropertyUse} data-propertyuse={pu.PropertyUse} onClick={handleSelectPropertyUse}>
                  <td>{pu.PropertyUse.toUpperCase()}</td>
                  <td>{pu.PropertyRate.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
};

export default FrmPropertyUse;

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

// app.get('/api/propertyUses', async (req: Request, res: Response) => {
//   try {
//     const result = await pool.query<PropertyUse[]>('SELECT * FROM tb_PropertyUse ORDER BY PropertyUse');
//     res.json(result.rows);
//   } catch (err) {
//     res.status(500).json({ message: 'Error fetching property uses' });
//   }
// });

// app.post('/api/propertyUses', async (req: Request, res: Response) => {
//   const { PropertyUse, PropertyRate } = req.body;
//   try {
//     const result = await pool.query<PropertyUse[]>(
//       'SELECT * FROM tb_PropertyUse WHERE PropertyUse = $1',
//       [PropertyUse]
//     );
//     if (result.rows.length > 0) {
//       return res.status(400).json({ message: 'Record already exists' });
//     }
//     await pool.query('INSERT INTO tb_PropertyUse(PropertyUse, PropertyRate) VALUES($1, $2)', [PropertyUse, PropertyRate]);
//     res.json({ message: 'Record successfully added' });
//   } catch (err) {
//     res.status(500).json({ message: 'Error in adding a record' });
//   }
// });

// app.delete('/api/propertyUses/:PropertyUse', async (req: Request, res: Response) => {
//   const { PropertyUse } = req.params;
//   try {
//     const result = await pool.query<PropertyUse[]>(
//       'SELECT * FROM tb_PropertyUse WHERE PropertyUse = $1',
//       [PropertyUse]
//     );
//     if (result.rows.length === 0) {
//       return res.status(404).json({ message: 'Record does NOT exist' });
//     }
//     await pool.query('DELETE FROM tb_PropertyUse WHERE PropertyUse = $1', [PropertyUse]);
//     res.json({ message: 'Record successfully deleted' });
//   } catch (err) {
//     res.status(500).json({ message: 'Error in deleting record' });
//   }
// });

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
