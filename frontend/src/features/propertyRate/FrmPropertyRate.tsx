import React, { useState, useEffect } from 'react';
import { Button, Col, Form, Row, Table } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../../app/store';
import { Link } from 'react-router-dom';
import { fetchPropertyRates, 
        createPropertyRate, 
        updatePropertyRate, 
        deletePropertyRate, 
        PropertyRateData
} from './propertyRateSlice';
import { fetchPropertyClasses, PropertyClassData } from '../propertyClass/propertyClassSlice';

// interface PropertyRateData {
//   property_class: string;
//   fiscalyear: number;
//   rate: number;
//   registrationrate: number;
// }



const FrmProducePropertyRate: React.FC = () => {
  // Use dispatch to call actions and update state
  const dispatch = useAppDispatch();

  // Use selector to get state
  const propertyRates = useAppSelector((state) => state.propertyRate.rates);
  const propertyClasses = useAppSelector((state) => state.propertyClass.propertyClasses);

  // State management for form fields
  const [propertyClass, setPropertyClass] = useState('');
  const year = new Date().getFullYear();
  const [fiscalYear, setFiscalYear] = useState(year.toString());
  const [rate, setRate] = useState('');
  const [registrationRate, setRegistrationRate] = useState('');

  // State management for dropdowns
  let [localPropertyClasses, setLocalPropertyClasses] = useState<PropertyClassData[]>([]);

  // State management for ListView equivalent
  let [localPropertyRates, setLocalPropertyRates] = useState<PropertyRateData[]>([]);

  // Fetch dropdowns and ListView data on component mount
  useEffect(() => {
    fetchClasses();
    fetchRates();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await dispatch(fetchPropertyClasses());

      localPropertyClasses = response.payload.property_classes

      setLocalPropertyClasses(localPropertyClasses);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  const fetchRates = async () => {
    try {
      const response = await dispatch(fetchPropertyRates());

      localPropertyRates = response.payload.rates

      setLocalPropertyRates(localPropertyRates);
    } catch (error) {
      console.error('Error fetching rates:', error);
    }
  };

  const handleAddClick = async () => {
    try {
        const propertyRateData: PropertyRateData = {
          property_class: propertyClass,

          fiscalyear: parseInt(fiscalYear, 10),

          rate: parseFloat(rate),

          registrationrate: parseFloat(registrationRate),
        };

        const response = await dispatch(createPropertyRate(propertyRateData));
        
        alert(response.payload.message);

        fetchRates();
    } catch (error) {
        console.error('Error adding rate:', error);
        alert('Error in adding a record');
    }
  };

  const handleEditClick = async () => {
      try {
        const propertyRateData: PropertyRateData = {
          property_class: propertyClass,
          fiscalyear: parseInt(fiscalYear, 10),
          rate: parseFloat(rate), 
          registrationrate: parseFloat(registrationRate),
          };


          const payload = {
            property_Class: propertyClass,
            fiscalyear: parseInt(fiscalYear, 10),
            propertyRateData: propertyRateData,
          };
          
          const response = await dispatch(updatePropertyRate(payload));


          alert(response.payload.message);
          fetchRates();
      } catch (error: unknown) {
          console.error('Error editing rate:', error);
          alert('Error in editing a record');
      }
  };

  const handleDeleteClick = async () => {
    try {
        const payload = {
          property_Class: propertyClass,
          fiscalyear: parseInt(fiscalYear, 10),
        };
        
        const response = await dispatch(deletePropertyRate(payload));
        alert(response.payload.message);
        fetchRates();
    } catch (error) {
        console.error('Error editing rate:', error);
        alert('Error in editing a record');
    }
  };

  // const handleExitClick = () => {
  //   // Add your logic to exit here
  //   console.log('Exit');
  //   setPropertyClass(rate.property_class);

  //   setFiscalYear(rate.fiscalyear.toString());

  //   setRate(rate.rate.toString());

  //   setRegistrationRate(rate.registrationrate.toString());
  // };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    console.log('Selected value:', selectedValue);

    const selectedPropertyClass = propertyClasses.find(propertyClass => propertyClass.property_class === selectedValue);
  
    if (selectedPropertyClass) {
      console.log('selectedPropertyClass.property_class: ', selectedPropertyClass.property_class)
      
      setPropertyClass(selectedPropertyClass.property_class);
      console.log('rate: ', rate)
      setRate(selectedPropertyClass.rate.toString()); // Ensure rate is a string if you're using it as a controlled component value
    }
  };

  const handleListViewItemClick = (rate: PropertyRateData) => {
    // Your logic here, e.g., navigating to a detail page or opening a modal
    console.log('Clicked rate:', rate);
};


  return (
    <div className="container">
      <div>
        {/* Title */}
        <Row className="mb-3">
            <Col>
                <h4 className="text-primary">Property Rate Data Entry</h4>
            </Col>
        </Row>

        <div>
          {/* Input and Select Elements */}
          <Row className="mb-3">
              <Col>
                  <Form.Label>Property Class:</Form.Label>
                  <Form.Select value={propertyClass} onChange={handleSelectChange}>
                    <option value="">Select Property Class</option>
                    {propertyClasses.map((propertyClass, index: number) => (
                      <option key={index} value={propertyClass.property_class}>
                        {propertyClass.property_class} {propertyClass.rate}
                      </option>
                    ))}
                  </Form.Select>
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
                  <Form.Label>Fiscal Year:</Form.Label>
                  <Form.Control value={fiscalYear} onChange={(e) => setFiscalYear(e.target.value)} />
              </Col>
          </Row>

               
          <Row className="mb-3">
              <Col>
                  <Form.Label>Registration Rate:</Form.Label>
                  <Form.Control value={registrationRate} onChange={(e) => setRegistrationRate(e.target.value)} />
              </Col>
          </Row>
        </div>
        <div>
            {/* Table */}
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
                            {propertyRates.map((rate: PropertyRateData) => (
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
        </div>
       
        {/* Buttons */}
        <Row className="mt-3">
            <Col className="d-flex flex-column">
                <Button variant="primary" onClick={handleAddClick} className="mb-2">
                    Add New Record
                </Button>
                <Button variant="warning" onClick={handleEditClick} className="mb-2">
                    Edit Old Record
                </Button>
                <Button variant="danger" onClick={handleDeleteClick} className="mb-2">
                    Delete Old Record
                </Button>
                <Link to="/main" className="primary m-3">
                    Go Back
                </Link>
            </Col>
        </Row>
      </div>  
    </div>
);
;

};

export default FrmProducePropertyRate;

