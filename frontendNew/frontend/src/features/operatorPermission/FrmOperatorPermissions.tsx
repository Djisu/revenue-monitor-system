import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert, Table } from 'react-bootstrap';
import axios from 'axios';

interface OperatorPermission {
  operatorID: string;
  menus: string;
  reports: string;
  databases: string;
  password: string;
}

interface OperatorDefinition {
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

const OperatorPermissionsForm: React.FC = () => {
  const [operatorID, setOperatorID] = useState<string>('');
  const [menus, setMenus] = useState<string>('');
  const [reports, setReports] = useState<string>('');
  const [databases, setDatabases] = useState<string>('DEM');
  const [password, setPassword] = useState<string>('');
  const [operatorList, setOperatorList] = useState<OperatorDefinition[]>([]);
  const [operatorPermissions, setOperatorPermissions] = useState<OperatorPermission[]>([]);
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  useEffect(() => {
    fetchOperatorList();
    fetchOperatorPermissions();
  }, []);

  const fetchOperatorList = async () => {
    try {
      const response = await axios.get<OperatorDefinition[]>('http://your-api-url/operator_definition');
      setOperatorList(response.data);
    } catch (error) {
      console.error(error);
      setError('Error fetching operators');
    }
  };

  const fetchOperatorPermissions = async () => {
    try {
      const response = await axios.get<OperatorPermission[]>('http://your-api-url/operator_permission');
      setOperatorPermissions(response.data);
    } catch (error) {
      console.error(error);
      setError('Error fetching operator permissions');
    }
  };

  const handleOperatorIDChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setOperatorID(e.target.value);
    validateOperatorID(e.target.value);
  };

  const handleMenusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMenus(e.target.value);
  };

  const handleReportsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReports(e.target.value);
  };

  const handleDatabasesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDatabases(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const validateOperatorID = async (operatorID: string) => {
    try {
      const response = await axios.get<OperatorPermission>(`http://your-api-url/find_rec?operatorID=${operatorID}&password=${password}`);
      setMenus(response.data.menus || '');
      setReports(response.data.reports || '');
      setDatabases(response.data.databases || 'DEM');
      setError('');
    } catch (error) {
      console.error(error);
      setError('Record not found');
    }
  };

  const handleAddClick = async () => {
    if (!operatorID || !menus || !reports || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const response = await axios.post<AddRecResponse>('http://your-api-url/add_rec', {
        operatorID,
        menus,
        reports,
        databases,
        password,
      });

      setSuccessMessage(response.data.message);
      setError('');
      clearForm();
      fetchOperatorPermissions();
    } catch (error) {
      console.error(error);
      setError('Error adding record');
      setSuccessMessage('');
    }
  };

  const handleEditClick = async () => {
    if (!operatorID || !menus || !reports || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const response = await axios.put<EditRecResponse>('http://your-api-url/edit_rec', {
        operatorID,
        menus,
        reports,
        databases,
        password,
      });

      setSuccessMessage(response.data.message);
      setError('');
      clearForm();
      fetchOperatorPermissions();
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
      fetchOperatorPermissions();
    } catch (error) {
      console.error(error);
      setError('Error deleting record');
      setSuccessMessage('');
    }
  };

  const handleExitClick = () => {
    window.location.href = '/'; // Redirect to main page or hide the form
  };

  const clearForm = () => {
    setOperatorID('');
    setMenus('');
    setReports('');
    setDatabases('DEM');
    setPassword('');
  };

  return (
    <Container>
      <h2>Operator Reports</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {successMessage && <Alert variant="success">{successMessage}</Alert>}
      <Form>
        <Form.Group controlId="formOperatorID">
          <Form.Label>Operator ID:</Form.Label>
          <Form.Select value={operatorID} onChange={handleOperatorIDChange}>
            <option value="">Select an operator</option>
            {operatorList.map((operator) => (
              <option key={operator.operatorID} value={operator.operatorID}>
                {operator.operatorID} {operator.operatorName}
              </option>
            ))}
          </Form.Select>
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

        <Form.Group controlId="formMenus">
          <Form.Label>Menus:</Form.Label>
          <Form.Control
            type="text"
            value={menus}
            onChange={handleMenusChange}
            maxLength={100}
          />
        </Form.Group>

        <Form.Group controlId="formReports">
          <Form.Label>Reports:</Form.Label>
          <Form.Control
            type="text"
            value={reports}
            onChange={handleReportsChange}
            maxLength={100}
          />
        </Form.Group>

        <Form.Group controlId="formDatabases">
          <Form.Label>Databases:</Form.Label>
          <Form.Control
            type="text"
            value={databases}
            onChange={handleDatabasesChange}
            maxLength={10}
            style={{ display: 'none' }} // Hidden as per original form
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
            <th>Menus</th>
            <th>Reports</th>
            <th>Databases</th>
            <th>Password</th>
          </tr>
        </thead>
        <tbody>
          {operatorPermissions.map((permission) => (
            <tr key={permission.operatorID} onClick={() => {
              setOperatorID(permission.operatorID);
              setMenus(permission.menus);
              setReports(permission.reports);
              setDatabases(permission.databases);
              setPassword(permission.password);
            }}>
              <td>{permission.operatorID.toUpperCase()}</td>
              <td>{permission.menus.toUpperCase()}</td>
              <td>{permission.reports.toUpperCase()}</td>
              <td>{permission.databases.toUpperCase()}</td>
              <td>{permission.password.toUpperCase()}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default OperatorPermissionsForm;

