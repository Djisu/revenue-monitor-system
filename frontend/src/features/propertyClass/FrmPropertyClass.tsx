import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/store';
import { Button, Form, Table, Container, Row, Col } from 'react-bootstrap';
import { fetchPropertyClasses, createPropertyClass, deletePropertyClass } from './propertyClassSlice';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons'; // Import the trash icon

interface PropertyClass {
  property_class: string;
  description: string;
  frequency: string;
  rate: number;
}

interface FetchPropertyClassesResponse {
  data: PropertyClass[];
}

const FrmPropertyClass: React.FC = () => {
  const dispatch = useAppDispatch();

  const propertyClasses = useAppSelector((state) => state.propertyClass.propertyClasses);

  console.log('propertyClasses:', propertyClasses);
  const [localPropertyClasses, setLocalPropertyClasses] = useState<PropertyClass[]>([]);
  const [addFlag, setAddFlag] = useState<string>('');
  const [delFlag, setDelFlag] = useState<string>('')
  const [isDeleting, setIsDeleting] = useState(false);

  const [propertyClass, setPropertyClass] = useState<PropertyClass>({
    property_class: '',
    description: '',
    frequency: '',
    rate: 0,
  });
 

useEffect(() => {
    dispatch(fetchPropertyClasses());
}, [dispatch]);
 

useEffect(() => {
  if (Array.isArray(propertyClasses)) {
      console.error('propertyClasses is AN ARRAY:', propertyClasses);
      setLocalPropertyClasses(propertyClasses);
  } else {
      console.error('propertyClasses is not an array:', propertyClasses);
      setLocalPropertyClasses([]);
  }
}, [propertyClasses]);

const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = event.target;

  setPropertyClass((prevPropertyClass) => ({
    ...prevPropertyClass,
    [name]: name === 'rate' ? parseFloat(value) : value.toString(),
  }));
};


  const handleAdd = async () => {
    console.log('in handleAdd Property class:', propertyClass);
    try {
      if (!propertyClass.property_class) {
        throw new Error('Enter the property class');
      }
      if (!propertyClass.description) {
        throw new Error('Enter the property class decription');
      } 
      if (!propertyClass.frequency) {
        throw new Error('Enter a valid property class frequency');
      }           
      if (!propertyClass.rate || isNaN(propertyClass.rate)) {
        throw new Error('Enter a valid property rate');
      }

      console.log('Before dispatch, property class:', propertyClass);

      const response = await dispatch(createPropertyClass(propertyClass)).unwrap();

      if (response.success) {
        setAddFlag(response.message || 'Record successfully added');
        setPropertyClass({ property_class: '', description: '', frequency: '', rate: 0 });
  
        console.log(response);
  
        alert('Record successfully added'); // Assuming response is successful

        console.log('about to fetch property classes')
  
        const result = await dispatch(fetchPropertyClasses()).unwrap() as FetchPropertyClassesResponse;
        console.log('After dispatch, property classes:', result.data);

        if (result.data.length === 0) {
            console.log('No property classes fetched');
        } else {
          console.log('Property classes fetched: ', result.data);
            setLocalPropertyClasses(result.data);
        }
       
        
      } else {
        throw new Error(response.error.message);
      }   
    } catch (error: unknown) {
      console.error('Error adding property class:', error);
      
      if (error instanceof Error && error.message.includes('Property class record already exists')) {
        setAddFlag('Property class record already exists');
      } else {
        setAddFlag('Error in adding a record');
      }
    }
  };

  const handleDelete = async () => {
    console.log(`Deleting property class: ${propertyClass.property_class}`);
    setIsDeleting(true);

    try {
        if (!propertyClass.property_class) {
            throw new Error('Enter the property class');
        }

        const response = await dispatch(deletePropertyClass(propertyClass.property_class)).unwrap();
        setLocalPropertyClasses(localPropertyClasses.filter((pc) => pc.property_class !== propertyClass.property_class));
        setIsDeleting(false);
        setPropertyClass({ property_class: '', description: '', frequency: '', rate: 0 });

        console.log(response);

        setDelFlag(response.message);
    } catch (error) {
        console.error('Error deleting property class:', error);
        setDelFlag('Error in deleting record');
    } finally {
        setIsDeleting(false); // Prevent multiple clicks
    }
};

  // const handleSelectPropertyClass = (event: React.MouseEvent<HTMLElement>) => {
  //   const selectedPropertyClass = event.currentTarget.getAttribute('data-propertyclass');

  //   console.log('Selected property class:', selectedPropertyClass);

  //   if (selectedPropertyClass) {
  //     const selectedRecord = propertyClasses.find((pc) => pc.property_class === selectedPropertyClass);
  //     if (selectedRecord) {
  //       setPropertyClass(selectedRecord);
  //     } else {
  //       setPropertyClass({ property_class: selectedPropertyClass, rate: 0 });
  //     }
  //   }
  // };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col xs={12} md={8}>
          <h5 className="text-center text-danger">MARCORY MUNICIPAL ASSEMBLY</h5>
          <p className="text-center text-info">PROPERTY CLASS DATA ENTRY</p>
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
              <Form.Label>Property Description:</Form.Label>
              <Form.Control
                type="text"
                name="description"
                value={propertyClass.description}
                onChange={handleInputChange}
                placeholder="Enter Property Class description"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Property Class Frequency:</Form.Label>
              <Form.Control
                type="text"
                name="frequency"
                value={propertyClass.frequency}
                onChange={handleInputChange}
                placeholder="Enter Property Class Frequency"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Property Rate:</Form.Label>
              <Form.Control
                type="number"
                name="rate"
                value={propertyClass.rate.toString()}
                onChange={handleInputChange}
                placeholder="Enter Property Rate"
              />
            </Form.Group>

            <div className="d-flex justify-content-between">
              <Button variant="primary" onClick={handleAdd}>
                Add New Record
              </Button>
              <Button variant="warning" onClick={handleDelete} disabled={isDeleting}>
                Delete
              </Button>
            </div>
            <Row className="mt-3">
              <Col>
                <Link to="/main" className="primary m-3">
                  Go Back
                </Link>
              </Col>
            </Row>
            {addFlag && <p className="text-success mt-2">{addFlag}</p>}
            {delFlag && <p className="text-danger mt-2">{delFlag}</p>}
          </Form>
          <Table striped bordered hover className="mt-3">
                <thead>
                    <tr>
                        <th>PROPERTY CLASS</th>
                        <th>DESCRIPTION</th>
                        <th>FREQUENCY</th>
                        <th>RATE</th>
                        <th>ACTIONS</th>
                    </tr>
                </thead>
                <tbody>
                    {localPropertyClasses && localPropertyClasses.map((pc, index) => (
                        <tr key={index}>
                            <td>{pc.property_class}</td>
                            <td>{pc.description}</td>
                            <td>{pc.frequency}</td>
                            <td>{pc.rate}</td>
                            <td>
                                <button onClick={() => setPropertyClass(pc)} disabled={isDeleting}>
                                    {isDeleting ? 'Deleting...' : <FontAwesomeIcon icon={faTrash} />}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Col>
      </Row>
      <div>{delFlag}</div>
    </Container>
  );
};

export default FrmPropertyClass;

