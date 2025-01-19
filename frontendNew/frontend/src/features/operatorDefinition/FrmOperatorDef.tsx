import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert, Table } from 'react-bootstrap';
import axios from 'axios';
import { Link } from 'react-router-dom';

interface Operator {
  operatorID: string;
  operatorName: string;
  password: string;
  firstname: string;
  lastname: string;
}

interface AddRecResponse {
  message: string;
}

interface EditRecResponse {
  message: string;
}

interface DeleteRecResponse {
  message: string;
}

const OperatorDefForm: React.FC = () => {
  const [operatorID, setOperatorID] = useState<string>('');
  const [operatorName, setOperatorName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [operatorList, setOperatorList] = useState<Operator[]>([]);
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  useEffect(() => {
    fetchOperatorList();
  }, []);

  const fetchOperatorList = async () => {
    try {
      const response = await axios.get<Operator[]>('http://your-api-url/operator_definition');
      setOperatorList(response.data);
    } catch (error) {
      console.error(error);
      setError('Error fetching operators');
    }
  };

  const handleOperatorIDChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOperatorID(e.target.value);
  };

  const handleOperatorNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOperatorName(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFirstName(e.target.value);
  };

  const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLastName(e.target.value);
  };

  const handleAddClick = async () => {
    if (!operatorID || !operatorName || !password || !firstName || !lastName) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const response = await axios.post<AddRecResponse>('http://your-api-url/add_rec', {
        operatorID,
        operatorName,
        password,
        firstName,
        lastName,
      });

      setSuccessMessage(response.data.message);
      setError('');
      clearForm();
      fetchOperatorList();
    } catch (error) {
      console.error(error);
      setError('Error adding record');
      setSuccessMessage('');
    }
  };

  const handleEditClick = async () => {
    if (!operatorID || !operatorName || !password || !firstName || !lastName) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const response = await axios.put<EditRecResponse>('http://your-api-url/edit_rec', {
        operatorID,
        operatorName,
        password,
        firstName,
        lastName,
      });

      setSuccessMessage(response.data.message);
      setError('');
      clearForm();
      fetchOperatorList();
    } catch (error) {
      console.error(error);
      setError('Error editing record');
      setSuccessMessage('');
    }
  };

  const handleDeleteClick = async () => {
    if (!operatorID || !password) {
      setError('Operator ID and Password cannot be empty');
      return;
    }

    const delResponse = prompt("Enter Y to Delete, N to Not to Delete");
    if (delResponse?.toUpperCase() !== 'Y') {
      setError('Deletion aborted');
      return;
    }

    try {
      const response = await axios.delete<DeleteRecResponse>('http://your-api-url/delete_rec', {
        data: {
          operatorID,
          password,
        },
      });

      setSuccessMessage(response.data.message);
      setError('');
      clearForm();
      fetchOperatorList();
    } catch (error) {
      console.error(error);
      setError('Error deleting record');
      setSuccessMessage('');
    }
  };

  const handleExitClick = () => {
    window.location.href = '/'; // Redirect to main page or hide the form
  };

  const handleItemClick = (operator: Operator) => {
    setOperatorID(operator.operatorID);
    setOperatorName(operator.operatorName);
    setPassword(operator.password);
    setFirstName(operator.firstname);
    setLastName(operator.lastname);
  };

  const clearForm = () => {
    setOperatorID('');
    setOperatorName('');
    setPassword('');
    setFirstName('');
    setLastName('');
  };

  // const validateOperatorID = async (operatorID: string) => {
  //   try {
  //     const response = await axios.get<Operator>(`http://your-api-url/find_rec?operatorID=${operatorID}&password=${password}`);
  //     setOperatorName(response.data.operatorName);
  //     setFirstName(response.data.firstname);
  //     setLastName(response.data.lastname);
  //   } catch (error) {
  //     console.error(error);
  //     setError('Record not found');
  //   }
  // };

  return (
    <Container>
      <h2>Operator Definitions</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {successMessage && <Alert variant="success">{successMessage}</Alert>}
      <Form>
        <Form.Group controlId="formOperatorID">
          <Form.Label>Operator ID:</Form.Label>
          <Form.Control
            type="text"
            value={operatorID}
            onChange={handleOperatorIDChange}
            maxLength={10}
          />
        </Form.Group>

        <Form.Group controlId="formOperatorName">
          <Form.Label>Operator Name:</Form.Label>
          <Form.Control
            type="text"
            value={operatorName}
            onChange={handleOperatorNameChange}
            maxLength={10}
          />
        </Form.Group>

        <Form.Group controlId="formPassword">
          <Form.Label>Password:</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={handlePasswordChange}
            maxLength={10}
          />
        </Form.Group>

        <Form.Group controlId="formFirstName">
          <Form.Label>First Name:</Form.Label>
          <Form.Control
            type="text"
            value={firstName}
            onChange={handleFirstNameChange}
            maxLength={5}
          />
        </Form.Group>

        <Form.Group controlId="formLastName">
          <Form.Label>Last Name:</Form.Label>
          <Form.Control
            type="text"
            value={lastName}
            onChange={handleLastNameChange}
            maxLength={10}
          />
        </Form.Group>

        <Button variant="primary" onClick={handleAddClick} style={{ marginTop: '10px' }}>
          Add
        </Button>
        <Button variant="success" onClick={handleEditClick} style={{ marginLeft: '10px', marginTop: '10px' }}>
          Edit
        </Button>
        <Button variant="danger" onClick={handleDeleteClick} style={{ marginLeft: '10px', marginTop: '10px' }}>
          Delete
        </Button>
        <Button variant="secondary" onClick={handleExitClick} style={{ marginLeft: '10px', marginTop: '10px' }}>
          Exit
        </Button>
      </Form>

      <h3 className="mt-4">List Of Operators</h3>
      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>Operator ID</th>
            <th>Name</th>
            <th>Password</th>
            <th>First Name</th>
            <th>Last Name</th>
          </tr>
        </thead>
        <tbody>
          {operatorList.map((operator) => (
            <tr key={operator.operatorID} onClick={() => handleItemClick(operator)}>
              <td>{operator.operatorID.toUpperCase()}</td>
              <td>{operator.operatorName.toUpperCase()}</td>
              <td>{operator.password.toUpperCase()}</td>
              <td>{operator.firstname.toUpperCase()}</td>
              <td>{operator.lastname.toUpperCase()}</td>
            </tr>
          ))}
        </tbody>
      </Table>
          
      <Link to="/main" className="primary m-3">
          Go Back
      </Link>
              
    </Container>
  );
};

export default OperatorDefForm;

