import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert, Table, Image } from 'react-bootstrap';
import axios from 'axios';
import { FaUpload } from 'react-icons/fa';
import { Link } from 'react-router-dom';

interface Officer {
  officer_no: string;
  officer_name: string;
  photo: string;
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

const EmployeeForm: React.FC = () => {
  const [officerNo, setOfficerNo] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [photo, setPhoto] = useState<string>('');
  const [officerList, setOfficerList] = useState<Officer[]>([]);
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  useEffect(() => {
    fetchOfficerList();
  }, []);

  const fetchOfficerList = async () => {
    try {
      const response = await axios.get<Officer[]>('http://your-api-url/tb_officer');
      setOfficerList(response.data);
    } catch (error) {
      console.error(error);
      setError('Error fetching officers');
    }
  };

  const handleOfficerNoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOfficerNo(e.target.value);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value.toUpperCase());
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhoto(URL.createObjectURL(e.target.files[0]));
      uploadPhoto(e.target.files[0]);
    }
  };

  const uploadPhoto = async (file: File) => {
    const formData = new FormData();
    formData.append('photo', file);

    try {
      const response = await axios.post<{ path: string }>('http://your-api-url/upload_photo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setPhoto(response.data.path);
    } catch (error) {
      console.error(error);
      setError('Error uploading photo');
    }
  };

  const handleAddClick = async () => {
    if (!officerNo || !name || !photo) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const response = await axios.post<AddRecResponse>('http://your-api-url/add_rec', {
        officerNo,
        name,
        photo,
      });

      setSuccessMessage(response.data.message);
      setError('');
      clearForm();
      fetchOfficerList();
    } catch (error) {
      console.error(error);
      setError('Error adding record');
      setSuccessMessage('');
    }
  };

  const handleEditClick = async () => {
    if (!officerNo || !name || !photo) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const response = await axios.put<EditRecResponse>('http://your-api-url/edit_rec', {
        officerNo,
        name,
        photo,
      });

      setSuccessMessage(response.data.message);
      setError('');
      clearForm();
      fetchOfficerList();
    } catch (error) {
      console.error(error);
      setError('Error editing record');
      setSuccessMessage('');
    }
  };

  const handleDeleteClick = async () => {
    if (!officerNo) {
      setError('Employee ID cannot be empty');
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
          officerNo,
        },
      });

      setSuccessMessage(response.data.message);
      setError('');
      clearForm();
      fetchOfficerList();
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
    setOfficerNo('');
    setName('');
    setPhoto('');
  };

  // const validateOfficerNo = async (officerNo: string) => {
  //   try {
  //     const response = await axios.get<Officer>(`http://your-api-url/find_rec?officerNo=${officerNo}`);
  //     setName(response.data.officer_name);
  //     setPhoto(response.data.photo);
  //     setError('');
  //   } catch (error) {
  //     console.error(error);
  //     setError('Record not found');
  //   }
  // };

  const handleItemClick = (officer: Officer) => {
    setOfficerNo(officer.officer_no);
    setName(officer.officer_name);
    setPhoto(officer.photo);
  };

  return (
    <Container>
      <h2>Employee Data Entry Screen</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {successMessage && <Alert variant="success">{successMessage}</Alert>}
      <Form>
        <Form.Group controlId="formOfficerno">
          <Form.Label>Employee ID:</Form.Label>
          <Form.Control
            type="text"
            value={officerNo}
            onChange={handleOfficerNoChange}
            maxLength={10}
            required
          />
        </Form.Group>

        <Form.Group controlId="formName">
          <Form.Label>Name:</Form.Label>
          <Form.Control
            type="text"
            value={name}
            onChange={handleNameChange}
            maxLength={50}
            required
          />
        </Form.Group>

        <Form.Group controlId="formPhoto">
          <Form.Label>Photo:</Form.Label>
          <Form.Control
            type="text"
            value={photo}
            onChange={handlePhotoChange}
            readOnly
          />
          <Button variant="secondary" onClick={() => document.getElementById('photoInput')?.click()} style={{ marginTop: '10px' }}>
            <FaUpload /> Upload Photo
          </Button>
          <input
            id="photoInput"
            type="file"
            onChange={handlePhotoChange}
            style={{ display: 'none' }}
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
        <Button variant="info" onClick={() => window.alert('View Logins functionality not implemented')} style={{ marginLeft: '10px', marginTop: '10px' }}>
          View Logins
        </Button>
      </Form>

      <h3 className="mt-4">List Of Employees</h3>
      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>Employee ID</th>
            <th>Name</th>
            <th>Photo</th>
          </tr>
        </thead>
        <tbody>
          {officerList.map((officer) => (
            <tr key={officer.officer_no} onClick={() => handleItemClick(officer)}>
              <td>{officer.officer_no.toUpperCase()}</td>
              <td>{officer.officer_name.toUpperCase()}</td>
              <td>
                {officer.photo && officer.photo !== 'xx' ? (
                  <Image src={officer.photo} alt={officer.officer_name} style={{ width: '100px', height: '100px' }} />
                ) : (
                  'No Photo'
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {photo && photo !== 'xx' && (
        <div className="mt-4">
          <h4>Photo Preview</h4>
          <Image src={photo} alt="Employee Photo" style={{ width: '200px', height: '200px' }} />
        </div>
      )}
      
      <Link to="/main" className="primary m-3">
          Go Back
      </Link>
         
    </Container>
  );
};

export default EmployeeForm;


// Backend API:

// The form above assumes you have a backend API that can handle the following queries:

// http://your-api-url/tb_officer to fetch the list of officers.
// http://your-api-url/add_rec to add a new officer record.
// http://your-api-url/edit_rec to edit an existing officer record.
// http://your-api-url/delete_rec to delete an officer record.
// http://your-api-url/find_rec?officerNo=XYZ to find an officer record by ID.
// http://your-api-url/upload_photo to upload a photo and return the file path.
// You will need to create a backend service to handle these queries and return the appropriate data from your SQL Server.