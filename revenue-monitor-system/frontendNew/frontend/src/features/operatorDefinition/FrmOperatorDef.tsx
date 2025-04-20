import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Table, Alert, Row, Col } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../../hooks';

import { useNavigate } from 'react-router-dom';
import { fetchOperators, createOperator, updateOperator, deleteOperator, OperatorData } from './operatorDefinitionSlice';

// interface OperatorData {
//   OperatorID: string;
//   OperatorName: string;
//   password: string;
//   firstname: string;
//   lastname: string;
//   email: string;
// }

// interface AddRecResponse {
//   message: string;
// }

// interface EditRecResponse {
//   message: string;
// }

// interface DeleteRecResponse {clear

//   message: string;
// }

const OperatorDefForm: React.FC = () => {
  let [operatorid, setOperatorid] = useState<string>('');
  let [operatorname, setOperatorname] = useState<string>('');
  let [password, setPassword] = useState<string>('');
  let [firstname, setFirstname] = useState<string>('');
  let [lastname, setLastname] = useState<string>('');
  let [email, setEmail] = useState<string>('');
  let [operatorList, setOperatorList] = useState<OperatorData[]>([]);
  let [error, setError] = useState<string>('');
  let [successMessage, setSuccessMessage] = useState<string>('');

  let dispatch = useAppDispatch();
  const navigate = useNavigate();
  let operatorListFromStore = useAppSelector((state) => state.operatorDefinition.operators);



  useEffect(() => {
    fetchOperatorList();
  }, []);

  const fetchOperatorList = async () => {
    console.log('in fetchOperatorList')

    try {
        // Directly use the response as an array of operators
        const operatorListData = await dispatch(fetchOperators()).unwrap();
        console.log(operatorListData); // This is now the array of operators

        operatorList = operatorListData
        setOperatorList(operatorList); // Set the operator list directly
    } catch (error) {
        console.error(error);
        setError('Error fetching operators');
    }
};

  const handleOperatorIDChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOperatorid(e.target.value);
  };

  const handleOperatorNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOperatorname(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFirstname(e.target.value);
  };

  const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLastname(e.target.value);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };


  const handleAddClick = async () => {
    console.log('in handleAddClick');

    if (!operatorid || !operatorname || !password || !firstname || !lastname || !email) {
        setError('Please fill in all fields');
        return;
    }

    try {
        const resultAction = await dispatch(createOperator({
          operatorid, // Change 'operatorid' to 'OperatorID'
          operatorname, // Change 'operatorname' to 'OperatorName'
            password,
            firstname,
            lastname,
            email
        }));

        // Now you can check if the action was fulfilled or rejected
        if (createOperator.fulfilled.match(resultAction)) {
            const responseMessage = resultAction.payload; // This is the message returned from the API
            console.log(responseMessage); // Log the success message

            setSuccessMessage(responseMessage);
            setError('');
            clearForm();
            fetchOperatorList();
        } else {
            // Handle the error case
            console.error('Failed to create operator:', resultAction.error);
        }
    } catch (error) {
        console.error(error);
        setError('Error adding record');
        setSuccessMessage('');
    }
};

  const handleEditClick = async () => {
    if (!operatorid || !operatorname || !password || !firstname || !lastname || !email) {
      setError('Please fill in all fields');
      return;
    }

    const formData = {
      operatorid: operatorid,
      operatorname: operatorname,
      password: password,
      firstname: firstname,
      lastname: lastname,
      email: email
  }

    try {
      const response = await dispatch(updateOperator({ OperatorID: operatorid, operatorData: formData })).unwrap();
      console.log(response.data);

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
    if (!operatorid || !password) {
      setError('Operator ID and Password cannot be empty');
      return;
    }

    const delResponse = prompt("Enter Y to Delete, N to Not to Delete");
    if (delResponse?.toUpperCase() !== 'Y') { 
      setError('Deletion aborted');
      return;
    }

    try {
      const response = await dispatch(deleteOperator( operatorid )).unwrap();

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

  const handleItemClick = (operator: OperatorData) => {
    setOperatorid(operator.operatorid || ''); // Default to an empty string if undefined
    setOperatorname(operator.operatorname || ''); // Default to an empty string if undefined
    setPassword(operator.password || ''); // Default to an empty string if undefined
    setFirstname(operator.firstname || ''); // Default to an empty string if undefined
    setLastname(operator.lastname || ''); // Default to an empty string if undefined
    setEmail(operator.email || ''); // Default to an empty string if undefined
  };

  const clearForm = () => {
    setOperatorid('');
    setOperatorname('');
    setPassword('');
    setFirstname('');
    setLastname('');
    setEmail('');
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
      {/* <h2 className="text-center mb-4">Operator Definitions</h2> */}
      
      {error && <Alert variant="danger">{error}</Alert>}
      {successMessage && <Alert variant="success">{successMessage}</Alert>}
      
      <Form>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group controlId="formOperatorID">
              <Form.Label>Operator ID:</Form.Label>
              <Form.Control
                type="text"
                value={operatorid}
                onChange={handleOperatorIDChange}
                maxLength={10}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="formOperatorName">
              <Form.Label>Operator Name:</Form.Label>
              <Form.Control
                type="text"
                value={operatorname}
                onChange={handleOperatorNameChange}
                maxLength={10}
              />
            </Form.Group>
          </Col>
        </Row>
  
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group controlId="formPassword">
              <Form.Label>Password:</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={handlePasswordChange}
                maxLength={10}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="formFirstName">
              <Form.Label>First Name:</Form.Label>
              <Form.Control
                type="text"
                value={firstname}
                onChange={handleFirstNameChange}
                maxLength={5}
              />
            </Form.Group>
          </Col>
        </Row>
  
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group controlId="formLastName">
              <Form.Label>Last Name:</Form.Label>
              <Form.Control
                type="text"
                value={lastname}
                onChange={handleLastNameChange}
                maxLength={10}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={6}>
            <Form.Group controlId="formEmail">
              <Form.Label>Email:</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={handleEmailChange}
                maxLength={50}
              />
            </Form.Group>
          </Col>
        </Row>
  
        <div className="d-flex justify-content-between mb-3">
          <Button variant="primary" className="flex-fill me-2" onClick={handleAddClick}>Add</Button>
          <Button variant="success" className="flex-fill me-2" onClick={handleEditClick}>Edit</Button>
          <Button variant="danger" className="flex-fill me-2" onClick={handleDeleteClick}>Delete</Button>
          <Button className="primary flex-fill" onClick={() => navigate('/main')}>Go Back</Button>
        </div>
      </Form>
  
      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>Operator ID</th>
            <th>First Name</th>
            <th>Last Name</th>
          </tr>
        </thead>
        <tbody>
          {operatorListFromStore.map((operator: any, index: number) => (
            <tr key={index} onClick={() => handleItemClick(operator)}>
              <td>{operator.operatorid}</td>
              <td>{operator.firstname}</td>
              <td>{operator.lastname}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      
      <Button className="primary m-3" onClick={() => navigate('/main')}>Go Back</Button>
    </Container>
  );
};

export default OperatorDefForm;

