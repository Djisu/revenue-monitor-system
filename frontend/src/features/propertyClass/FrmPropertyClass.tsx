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
  assessed: string
}

type FormData = {
  property_class: string;
  description: string;
  frequency: string;
  rate: number;
  assessed: string
};


interface FetchPropertyClassesResponse {
  data: PropertyClass[];
}

const FrmPropertyClass: React.FC = () => {
  const dispatch = useAppDispatch();

  const propertyClasses = useAppSelector((state) => state.propertyClass.propertyClasses);
  //const selectorPropertyClasses = useAppSelector((state) => state.propertyClass.propertyClasses);

  console.log('propertyClasses:', propertyClasses);
  const [localPropertyClasses, setLocalPropertyClasses] = useState<PropertyClass[]>([]);
  const [addFlag, setAddFlag] = useState<string>('');
  const [delFlag, setDelFlag] = useState<string>('')
  const [isDeleting, setIsDeleting] = useState(false);

  // const [propertyClass, setPropertyClass] = useState<PropertyClass>({
  //   property_class: '',
  //   description: '',
  //   frequency: '',
  //   rate: 0,
  //   assessed: ''
  // }); 

  const [formData, setFormData] = useState<FormData>({
    property_class: '',
    description: '',
    frequency: '',
    rate: 0,
    assessed: ''
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

// useEffect(() => {
//   if (Array.isArray(selectorPropertyClasses)) {
//     console.error('propertyClasses is AN ARRAY:', selectorPropertyClasses);
//     setLocalPropertyClasses(selectorPropertyClasses);
//   } else {
//     console.error('propertyClasses is not an array:', selectorPropertyClasses);
//     setLocalPropertyClasses([]);
//   }
// }, [selectorPropertyClasses]);

type FormControlElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

const handleChange = (e: React.ChangeEvent<FormControlElement>) => {
  const { name, value } = e.target;
  setFormData((prevData) => ({
      ...prevData,
      [name]: value,
  }));
};


  const handleAdd = async () => {
    console.log('in handleAdd Property class:', formData);
    try {
      if (!formData.property_class) {
        throw new Error('Enter the property class');
      }
      if (!formData.description) {
        throw new Error('Enter the property class decription');
      } 
      if (!formData.frequency) {
        throw new Error('Enter a valid property class frequency');
      }           
      if (!formData.rate || isNaN(formData.rate)) {
        throw new Error('Enter a valid property rate');
      }
      if (!formData.assessed) {
        throw new Error('Select the assessed/valued status of the property');
      }   

      console.log('Before dispatch, property class:', formData);

      const response = await dispatch(createPropertyClass(formData)).unwrap();

      if (response.success) {
        setAddFlag(response.message || 'Record successfully added');
        setFormData({ property_class: '', description: '', frequency: '', rate: 0, assessed: '' });
  
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
    console.log(`Deleting property class: ${formData.property_class}`);
    setIsDeleting(true);

    try {
        if (!formData.property_class) {
            throw new Error('Enter the property class');
        }

        const response = await dispatch(deletePropertyClass(formData.property_class)).unwrap();
        setLocalPropertyClasses(localPropertyClasses.filter((pc) => pc.property_class !== formData.property_class));
        setIsDeleting(false);
        setFormData({ property_class: '', description: '', frequency: '', rate: 0, assessed: '' });

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

  const assessedOptions = [
    "Assessed/ Valued Properties",
    "Unassessed Properties - Flat Rate Categories",
];

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
                value={formData.property_class}
                onChange={handleChange}
                placeholder="Enter Property Class"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Property Description:</Form.Label>
              <Form.Control
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter Property Class description"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Property Class Frequency:</Form.Label>
              <Form.Control
                type="text"
                name="frequency"
                value={formData.frequency}
                onChange={handleChange}
                placeholder="Enter Property Class Frequency"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Property Rate:</Form.Label>
              <Form.Control
                type="number"
                name="rate"
                value={formData.rate.toString()}
                onChange={handleChange}
                placeholder="Enter Property Rate"
              />
            </Form.Group>


            <Form.Group className="mb-3">
              <Form.Label>Is Property Assessed?:</Form.Label>
              <Form.Select
                name="assessed"
                value={formData.assessed}
                onChange={handleChange}
              >
                <option value="">Select Assessed Option</option>
                {assessedOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </Form.Select>
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
                        <th>ASSESSED</th>
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
                            <td>{pc.assessed}</td>
                            <td>
                                <button onClick={() => setFormData(pc)} disabled={isDeleting}>
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

