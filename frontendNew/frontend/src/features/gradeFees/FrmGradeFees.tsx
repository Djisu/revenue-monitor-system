import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert, Table } from 'react-bootstrap';
import axios from 'axios';
import { Link } from 'react-router-dom';


interface GradeFee {
  buss_type: string;
  grade: string;
  description: string;
  fees: number;
}

interface BusinessType {
  buss_type: string;
}

interface AddRecResponse {
  message: string;
}

interface EditRecResponse {
  message: string;
}

// interface DeleteRecResponse {
//   message: string;
// }

const GradeFeesForm: React.FC = () => {
  const [businessType, setBusinessType] = useState<string>('');
  const [grade, setGrade] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [fees, setFees] = useState<number>(0);
  const [gradeFeesList, setGradeFeesList] = useState<GradeFee[]>([]);
  const [businessTypeList, setBusinessTypeList] = useState<string[]>([]);
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  useEffect(() => {
    fetchBusinessTypes();
    fetchGradeFeesList();
  }, []);

  const fetchBusinessTypes = async () => {
    try {
      const response = await axios.get<BusinessType[]>('http://your-api-url/business_types');
      setBusinessTypeList(response.data.map(type => type.buss_type));
    } catch (error) {
      console.error(error);
      setError('Error fetching business types');
    }
  };

  const fetchGradeFeesList = async () => {
    try {
      const response = await axios.get<GradeFee[]>('http://your-api-url/tb_gradefees');
      setGradeFeesList(response.data);
    } catch (error) {
      console.error(error);
      setError('Error fetching grade fees list');
    }
  };

  const handleBusinessTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setBusinessType(e.target.value);
  };

  const handleGradeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGrade(e.target.value.toUpperCase());
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
  };

  const handleFeesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || !isNaN(Number(value))) {
      setFees(Number(value));
    }
  };

  const handleAddClick = async () => {
    if (!businessType || !grade || !description || !fees) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const response = await axios.post<AddRecResponse>('http://your-api-url/add_rec', {
        businessType,
        grade,
        description,
        fees,
      });

      setSuccessMessage(response.data.message);
      setError('');
      clearForm();
      fetchGradeFeesList();
    } catch (error) {
      console.error(error);
      setError('Error adding record');
      setSuccessMessage('');
    }
  };

  const handleEditClick = async () => {
    if (!businessType || !grade || !description || !fees) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const response = await axios.put<EditRecResponse>('http://your-api-url/edit_rec', {
        businessType,
        grade,
        description,
        fees,
      });

      setSuccessMessage(response.data.message);
      setError('');
      clearForm();
      fetchGradeFeesList();
    } catch (error) {
      console.error(error);
      setError('Error editing record');
      setSuccessMessage('');
    }
  };

  const handleViewClick = async () => {
    try {
      fetchGradeFeesList();
    } catch (error) {
      console.error(error);
      setError('Error fetching grade fees list');
    }
  };

  const handleExitClick = () => {
    window.location.href = '/'; // Redirect to main page or hide the form
  };

  const handleItemClick = (gradeFee: GradeFee) => {
    setBusinessType(gradeFee.buss_type);
    setGrade(gradeFee.grade);
    setDescription(gradeFee.description);
    setFees(gradeFee.fees);
  };

  const clearForm = () => {
    setBusinessType('');
    setGrade('');
    setDescription('');
    setFees(0);
  };

  return (
    <Container>
      <h2>Grade Fees Entry</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {successMessage && <Alert variant="success">{successMessage}</Alert>}
      <Form>
        <Form.Group controlId="formBusinessType">
          <Form.Label>Business Type:</Form.Label>
          <Form.Select value={businessType} onChange={handleBusinessTypeChange}>
            <option value="">Select a business type</option>
            {businessTypeList.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group controlId="formGrade">
          <Form.Label>Grade:</Form.Label>
          <Form.Control
            type="text"
            value={grade}
            onChange={handleGradeChange}
            maxLength={50}
          />
        </Form.Group>

        <Form.Group controlId="formDescription">
          <Form.Label>Description:</Form.Label>
          <Form.Control
            type="text"
            value={description}
            onChange={handleDescriptionChange}
            maxLength={100}
          />
        </Form.Group>

        <Form.Group controlId="formFees">
          <Form.Label>Fees (GHC):</Form.Label>
          <Form.Control
            type="number"
            step="0.01"
            value={fees}
            onChange={handleFeesChange}
          />
          <Form.Text className="text-muted">
            GHC
          </Form.Text>
        </Form.Group>

        <Button variant="primary" onClick={handleAddClick} style={{ marginTop: '10px' }}>
          Add New Record
        </Button>
        <Button variant="success" onClick={handleEditClick} style={{ marginLeft: '10px', marginTop: '10px' }}>
          Edit Old Record
        </Button>
        <Button variant="info" onClick={handleViewClick} style={{ marginLeft: '10px', marginTop: '10px' }}>
          View Grades
        </Button>
        <Button variant="danger" onClick={handleExitClick} style={{ marginLeft: '10px', marginTop: '10px' }}>
          Exit
        </Button>
        <Button variant="secondary" onClick={() => window.alert('Report functionality not implemented')} style={{ marginLeft: '10px', marginTop: '10px' }}>
          Report
        </Button>
        <Form.Text className="text-danger" style={{ marginTop: '10px' }}>
          Know that you are changing ONLY the fees and description
        </Form.Text>
      </Form>

      <h3 className="mt-4">List of Business Types</h3>
      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>Business Type</th>
            <th>Grade</th>
            <th>Description</th>
            <th>Fees (GHC)</th>
          </tr>
        </thead>
        <tbody>
          {gradeFeesList.map((gradeFee) => (
            <tr key={`${gradeFee.buss_type}-${gradeFee.grade}`} onClick={() => handleItemClick(gradeFee)}>
              <td>{gradeFee.buss_type.toUpperCase()}</td>
              <td>{gradeFee.grade.toUpperCase()}</td>
              <td>{gradeFee.description.toUpperCase()}</td>
              <td>{gradeFee.fees.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <h6 className="mt-3" style={{ color: '#C00000' }}>
        MARCORY MUNICIPAL ASSEMBLY
      </h6>
          
      <Link to="/main" className="primary m-3">
          Go Back
      </Link>
            
    </Container>
  );
};

export default GradeFeesForm;


