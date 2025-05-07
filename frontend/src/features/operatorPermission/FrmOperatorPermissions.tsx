import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../app/store';
import { 
  fetchOperatorPermissionsThunk, 
  createOperatorPermission, 
  updateOperatorPermission, 
  deleteOperatorPermission
} from './operatorPermissionSlice';

import { fetchOperators } from '../operatorDefinition/operatorDefinitionSlice';
import  {OperatorPermissionData} from './OperatorPermissionData';

const FrmOperatorPermissions: React.FC = () => {
  const [operatorID, setOperatorID] = useState<string>('');
  const [menus, setMenus] = useState<string>('');
  // const [reports, setReports] = useState<string>('');
  // const [databases, setDatabases] = useState<string>('DEM');
  const [password, setPassword] = useState<string>('');
  
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  //const [operatorList, setOperatorList] = useState<OperatorData[]>([]);
  const [localOperatorPermissions, setLocalOperatorPermissions] = useState<OperatorPermissionData[]>([]);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  const operatorListData = useAppSelector((state) => state.operatorDefinition.operators);
console.log('operatorListData: ', operatorListData)

  const operatorPermissionsValues = useAppSelector((state) => state.operatorPermission);

  // Update local state when operatorPermissions in Redux state changes
  useEffect(() => {
      if (operatorPermissionsValues.operatorPermissions) {
          setLocalOperatorPermissions(operatorPermissionsValues.operatorPermissions as OperatorPermissionData[]);
      }
  }, [operatorPermissionsValues]);

  useEffect(() => {
    fetchOperatorList();
    fetchOperatorPermissions();
  }, [dispatch]);

  const fetchOperatorList = async () => {
    try {
      const response = await dispatch(fetchOperators()).unwrap();
      //operatorList = response
     // setOperatorList(response);
      console.log('Fetched Operators:', response); // Log the fetched operators
    } catch (error) {
      console.error(error);
      setError('Error fetching operators');
    }
  };

  const fetchOperatorPermissions = async () => {
    try {
      const response = await dispatch(fetchOperatorPermissionsThunk()).unwrap(); // Use unwrap to directly get the payload
  
      console.log('Fetched Permissions:', response); // Log the fetched permissions
  
      if (response.length > 0) {
        setLocalOperatorPermissions(response as OperatorPermissionData[]);
      } else {
        setLocalOperatorPermissions([]);
      }
    } catch (error) {
      console.error(error);
      setError('Error fetching operator permissions');
    }
  };

  const handleAddClick = async () => {

    console.log('in handleAddClick')
    if (!operatorID || !menus || !password) {
      setError('Please fill in all fields');
      return;
    }

    const permissionsData: OperatorPermissionData = {
      operatorid: operatorID, // Match the API structure
      menus: menus || '',
      password: password,
    };

    try {
      const response = await dispatch(createOperatorPermission(permissionsData)).unwrap();
      setSuccessMessage(response.message);
      setError('');
      clearForm();
      fetchOperatorPermissions(); // Refresh the permissions list
    } catch (error) {
      console.error(error);
      setError('Error adding record');
      setSuccessMessage('');
    }
  };

  const handleEditClick = async () => {
    if (!operatorID || !menus || !password) {
        setError('Please fill in all fields');
        return;
    }

    const updatedPermissionsData: OperatorPermissionData = {
        operatorid: operatorID, // Ensure this matches the database field
        menus: menus,
        password: password,
    };

    try {
        const response = await dispatch(
            updateOperatorPermission({ OperatorID: operatorID, operatorPermissionData: updatedPermissionsData })
        ).unwrap();
        setSuccessMessage(response.message);
        setError('');
        clearForm();
        fetchOperatorPermissions(); // Refresh the permissions list
    } catch (error) {
        console.error(error);
        setError('Error editing record');
        setSuccessMessage('');
    }
 };

  const handleDeleteClick = async () => {
    if (!operatorID) {
      setError('Operator ID and Password cannot be empty');
      return;
    }

    const delResponse = prompt("Enter Y to Delete, N to Not to Delete");
    if (delResponse?.toUpperCase() !== 'Y') {
      setError('Deletion aborted');
      return;
    }

    try {
      const response = await dispatch(deleteOperatorPermission(operatorID)).unwrap();
      setSuccessMessage(response.message);
      setError('');
      clearForm();
      fetchOperatorPermissions(); // Refresh the permissions list
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
    // setReports('');
    // setDatabases('DEM');
    setPassword('');
  };

  return (
    <Container>
      {error && <Alert variant="danger">{error}</Alert>}
      {successMessage && <Alert variant="success">{successMessage}</Alert>}
      <Form>
        <Form.Group controlId="formOperatorID">
          <Form.Label>Operator ID:</Form.Label>
          <Form.Select value={operatorID} onChange={(e) => setOperatorID(e.target.value)}>
            <option value="">Select an operator</option>
            {operatorListData.map((operator, index) => (
              <option key={index} value={operator.operatorid}>
                {operator.operatorid} {operator.operatorname}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group controlId="formPassword">
          <Form.Label>Password:</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            maxLength={10}
          />
        </Form.Group>

        <Form.Group controlId="formMenus">
          <Form.Label>Menus:</Form.Label>
          <Form.Control
            type="text"
            value={menus}
            onChange={(e) => setMenus(e.target.value)}
            maxLength={100}
          />
        </Form.Group>

        <div>
          <Button
            variant="primary"
            onClick={handleAddClick}
            style={{ marginTop: '10px', width: '100px', height: '40px' }}
          >
            Add
          </Button>
          <Button
            variant="success"
            onClick={handleEditClick}
            style={{ marginLeft: '10px', marginTop: '10px', width: '100px', height: '40px' }}
          >
            Edit
          </Button>
          <Button
            variant="danger"
            onClick={handleDeleteClick}
            style={{ marginLeft: '10px', marginTop: '10px', width: '100px', height: '40px' }}
          >
            Delete
          </Button>
          <Button
            variant="secondary"
            onClick={handleExitClick}
            style={{ marginLeft: '10px', marginTop: '10px', width: '100px', height: '40px' }}
          >
            Exit
          </Button>
          <Button
            className="primary flex-fill"
            onClick={() => navigate('/main')}
            style={{ marginLeft: '10px', marginTop: '10px', width: '100px', height: '40px' }}
          >
            Go Back
          </Button>
        </div>   
      </Form>    

      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>Operator ID</th>
            <th>Menus</th>
          </tr>
        </thead>
        <tbody>
          {localOperatorPermissions.length > 0 ? (
            localOperatorPermissions.map((permission, index) => (
              <tr key={index}>
                <td>{permission.operatorid}</td> 
                <td>{permission.menus}</td>      
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={2}>No permissions found.</td>
            </tr>
          )}
        </tbody>
      </Table>     
    </Container>
  );
};

export default FrmOperatorPermissions;


