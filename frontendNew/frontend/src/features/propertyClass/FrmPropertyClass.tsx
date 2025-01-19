import React, { useState, useEffect } from 'react';
import { useAppDispatch } from '../../app/store';
import { Button, Form, Table, Container, Row, Col } from 'react-bootstrap';
import { fetchPropertyClasses, createPropertyClass, deletePropertyClass } from './propertyClassSlice';
import { Link } from 'react-router-dom';

interface PropertyClass {
  property_class: string;
  rate: number;
}

const FrmPropertyClass: React.FC = () => {
  const [propertyClass, setPropertyClass] = useState<PropertyClass>({
    property_class: '',
    rate: 0,
  });
  const [propertyClasses, setPropertyClasses] = useState<PropertyClass[]>([]);
  const [addFlag, setAddFlag] = useState<string>('');
  const [delFlag, setDelFlag] = useState<string>('');

  const [localPropertyClasses, setLocalPropertyClasses] = useState<PropertyClass[]>([]);
  let [isDeleting, setIsDeleting] = useState(false);

  const dispatch = useAppDispatch();


  useEffect(() => {
    const fetchAreas = async () => {
        try {
            const result = await dispatch(fetchPropertyClasses()).unwrap();
            console.log('Fetched property classes:', result); // Log the result
            // Check if result is an array
            if (Array.isArray(result.data)) {
                setLocalPropertyClasses(result.data);
            } else {
                console.error('Expected an array, but received:', result.data);
                setLocalPropertyClasses([]);
            }
        } catch (error) {
            console.error('Error fetching electoral areas:', error);
        }
    };

    fetchAreas();
}, [dispatch]);


  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setPropertyClass((prevPropertyClass) => ({
      ...prevPropertyClass,
      [name]: name === 'rate' ? parseFloat(value) : value,
    }));
  };

  const handleAdd = async () => {
    try {
      if (!propertyClass.property_class) {
        throw new Error('Enter the property class');
      }
      if (!propertyClass.rate || isNaN(propertyClass.rate)) {
        throw new Error('Enter the rate');
      }

      const response = await dispatch(createPropertyClass(propertyClass)).unwrap();   

      setAddFlag(response.data.message);
      // populateListView();
      setPropertyClass({ property_class: '', rate: 0 });

      console.log(response);

            alert("Record successfully added"); // Assuming response is successful
            setPropertyClasses((prevPropertyClasses) => [
              ...prevPropertyClasses,
              { property_class: '', rate: 0 },
            ]);
            
            // Refresh the list of electoral areas
            const result = await dispatch(fetchPropertyClasses()).unwrap();
            setLocalPropertyClasses(result.data);
    } catch (error) {
      console.error('Error adding property class:', error);
      setAddFlag('Error in adding a record');
    }
  };

  const handleDelete = async () => {
    try {
      if (!propertyClass.property_class) {
        throw new Error('Enter the property class');
      }

      const response = await dispatch(deletePropertyClass(propertyClass.property_class)).unwrap();
          setLocalPropertyClasses(localPropertyClasses.filter((pc) => pc.property_class !== propertyClass.property_class));
          setIsDeleting(false);
          setPropertyClass({ property_class: '', rate: 0 });
          console.log(response);

      setDelFlag(response.data.message);
          //populateListView();
          setPropertyClass({ property_class: '', rate: 0 });
        } catch (error) {
          console.error('Error deleting property class:', error);
          setDelFlag('Error in deleting record');
        } finally {
          isDeleting = false; // Prevent multiple clicks
          setIsDeleting(isDeleting); // Prevent multiple clicks
      }
  };

  const handleSelectPropertyClass = (event: React.MouseEvent<HTMLElement>) => {
    const selectedPropertyClass = event.currentTarget.getAttribute('data-propertyclass');
    if (selectedPropertyClass) {
      const selectedRecord = propertyClasses.find((pc) => pc.property_class === selectedPropertyClass);
      if (selectedRecord) {
        setPropertyClass(selectedRecord);
      }
    }
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col xs={12} md={8}>
          <h1 className="text-center text-primary">Property Class</h1>
          <h2 className="text-center text-danger">MARCORY MUNICIPAL ASSEMBLY</h2>
          <h3 className="text-center text-info">PROPERTY CLASS DATA ENTRY</h3>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Property Class:</Form.Label>
              <Form.Control
                type="text"
                name="property_class"
                value={propertyClass.property_class}
                onChange={handleInputChange}
                placeholder="Enter Property Class"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Property Rate:</Form.Label>
              <Form.Control
                type="text"
                name="rate"
                value={propertyClass.rate.toFixed(2)}
                onChange={handleInputChange}
                placeholder="Enter Property Rate"
              />
            </Form.Group>
            <div className="d-flex justify-content-between">
              <Button variant="primary" onClick={handleAdd}>
                Add New Record
              </Button>
              <Button variant="warning" onClick={handleDelete}>
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
                <th>PROPERTY CLASS</th>
                <th>RATE</th>
              </tr>
            </thead>
            <tbody>
              {propertyClasses.map((pc) => (
                <tr key={pc.property_class} data-propertyclass={pc.property_class} onClick={handleSelectPropertyClass}>
                  <td>{pc.property_class.toUpperCase()}</td>
                  <td>{pc.rate.toFixed(2)}</td>
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

export default FrmPropertyClass;


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

// app.get('/api/propertyClasses', async (req: Request, res: Response) => {
//   try {
//     const result = await pool.query<PropertyClass[]>('SELECT * FROM tb_propertyclass ORDER BY property_class ASC');
//     res.json(result.rows);
//   } catch (err) {
//     res.status(500).json({ message: 'Error fetching property classes' });
//   }
// });

// app.post('/api/propertyClasses', async (req: Request, res: Response) => {
//   const { property_class, rate } = req.body;
//   try {
//     const result = await pool.query<PropertyClass[]>(
//       'SELECT * FROM tb_propertyclass WHERE property_class = $1',
//       [property_class]
//     );
//     if (result.rows.length > 0) {
//       return res.status(400).json({ message: 'Record already exists' });
//     }
//     await pool.query('INSERT INTO tb_propertyclass(property_class, rate) VALUES($1, $2)', [property_class, rate]);
//     res.json({ message: 'Record successfully added' });
//   } catch (err) {
//     res.status(500).json({ message: 'Error in adding a record' });
//   }
// });

// app.delete('/api/propertyClasses/:property_class', async (req: Request, res: Response) => {
//   const { property_class } = req.params;
//   try {
//     const result = await pool.query<PropertyClass[]>(
//       'SELECT * FROM tb_propertyclass WHERE property_class = $1',
//       [property_class]
//     );
//     if (result.rows.length === 0) {
//       return res.status(404).json({ message: 'Record does not exist' });
//     }
//     await pool.query('DELETE FROM tb_propertyclass WHERE property_class = $1', [property_class]);
//     res.json({ message: 'Record successfully deleted' });
//   } catch (err) {
//     res.status(500).json({ message: 'Error in deleting record' });
//   }
// });

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
