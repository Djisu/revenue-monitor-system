import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert, Table, Image, ButtonGroup } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../../app/store';
import { FaUpload } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { fetchOfficers, createOfficer, updateOfficer, deleteOfficer } from './officerSlice';
import { storePhotoAsync } from '../photos/photosSlice';

interface Officer {
  officer_no: string;
  officer_name: string;
  photo: string | Blob;
  photoUrl?: string;
}

const frmEmployee: React.FC = () => {
  const [officerNo, setOfficerNo] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [photo, setPhoto] = useState<string | Blob>('');
  const [photoUrlFromState, setPhotoUrlFromState] = useState<string>(''); 
  const [officerList, setOfficerList] = useState<Officer[]>([]);
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [photoName, setPhotoName] = useState<string>('');

  const dispatch = useAppDispatch();

  const selectedPhotoUrl = useAppSelector((state) => state.photos.photoUrl);
  console.log('Photo URL from state:', selectedPhotoUrl);

  useEffect(() => {
    fetchOfficerList();
  }, []);

  const fetchOfficerList = async () => {
    try {
        console.log('Fetching officers...');
        const response = await dispatch(fetchOfficers()).unwrap();
        console.log('Fetched officers:', response);

        if (Array.isArray(response)) {
            const officersWithUrls = response.map((officer) => {
                if (typeof officer.photo === 'string') {
                    return {
                        ...officer,
                        photoUrl: officer.photo // Use the URL directly
                    };
                } else {
                    console.warn('Photo is not a valid URL:', officer.photo);
                    return {
                        ...officer,
                        photoUrl: ''
                    };
                }
            });

            setOfficerList(officersWithUrls);
        } else {
            console.error('Expected an array, but received:', response);
            setOfficerList([]);
        }
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
    console.log('in handlePhotoChange');

    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhotoName(file.name);

      if (file.size > 10 * 1024 * 1024) {  // 10MB in bytes
        alert('File size exceeds the limit of 10MB.');
        return;
      }

      const photoBlobUrl = URL.createObjectURL(file);
      setPhoto(file); // Store the Blob itself
      setPhotoUrlFromState(photoBlobUrl); // Update the photo URL in state
      console.log('Photo URL:', photoBlobUrl);
      console.log('Photo:', file.name);

      uploadPhoto(file);
    }
  };

  const uploadPhoto = async (file: File) => {
    console.log('in uploadPhoto');

    try {
      console.log('about to dispatch(storePhotoAsync({ photo: file, officer_no: officerNo }))');
      console.log('file:', file);
      console.log('officerNo:', officerNo);

      // Clear the previous photo URL
      setPhotoUrlFromState('');
      setPhoto('');

      // Dispatch the thunk and wait for the response
      const resultAction = await dispatch(storePhotoAsync({ photo: file, officer_no: officerNo }));
      console.log('after dispatch(storePhotoAsync(', resultAction);

      if (storePhotoAsync.fulfilled.match(resultAction)) {
        console.log('Photo uploaded successfully:', resultAction.payload.photoUrl);

        const photoUrl: string = resultAction.payload.photoUrl;
        console.log('Photo URL:', photoUrl);

        // Add a unique query parameter to prevent caching
        const uniquePhotoUrl = `${photoUrl}?${new Date().getTime()}`;

        const updatedOfficerList = officerList.map((officer) => {
          if (officer.officer_no === officerNo) {
            return {
              ...officer,
              photoUrl: uniquePhotoUrl
            };
          }
          return officer;
        });
        setOfficerList(updatedOfficerList);

        setPhotoUrlFromState(uniquePhotoUrl); // Update the photo URL in state
        setPhoto(uniquePhotoUrl); // Update the photo URL in state
        console.log('Photo URL:', uniquePhotoUrl);
      } else if (storePhotoAsync.rejected.match(resultAction)) {
        if (resultAction.payload) {
          console.error('Error uploading photo XXXXX:', resultAction.payload.error);
          // Handle specific error, e.g., show error notification
          if (resultAction.payload.error.includes('Photo already exists')) {
            // Handle the specific 409 error
            console.log('Handling 409: Photo already exists');
            // Show a user-friendly message or notification
            alert('Photo already exists for this officer.');
          } else {
            // Handle other errors
            alert('Failed to upload photo. Please try again.');
          }
        } else {
          console.error('Error uploading photo: No payload');
          alert('Failed to upload photo. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error uploading photo:', error);
      setError('Error uploading photo');
    }
  };

  const handleAddClick = async () => {
    if (!officerNo || !name || !photo) {
      setError('Please fill in all fields');
      return;
    }

    try {
      console.log('about to dispatch(createOfficer({officer_no, officer_name, photo}))');
      console.log('officer_no:', officerNo);
      console.log('officer_name:', name);
      console.log('photo:', photoUrlFromState);

      // Dispatch the createOfficer thunk with the required parameters
      const response = await dispatch(createOfficer({
        officer_no: officerNo,
        officer_name: name,
        photo: photoUrlFromState // Use the photo URL
      }));

      if(response.payload){
        setSuccessMessage(response.payload.message);
      }
          
      setError('');
      clearForm();
      fetchOfficerList();
    } catch (error) {
      console.error('Failed to create officer:', error);
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
      const response = await dispatch(updateOfficer({
        officer_no: officerNo,
        officerData: {
          officer_no: officerNo,
          officer_name: name,
          photo: typeof photo === 'string' ? photo : photoUrlFromState, // Use the photo URL
        },
      }));

      setSuccessMessage(response.payload.message);
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
      const response = await dispatch(deleteOfficer(officerNo));

      setSuccessMessage(response.payload.message);
      setError('');
      clearForm();
      fetchOfficerList();
    } catch (error) {
      console.error(error);
      setError('Error deleting record');
      setSuccessMessage('');
    }
  };

  const clearForm = () => {
    setOfficerNo('');
    setName('');
    setPhoto('');
    setPhotoUrlFromState(''); // Clear the photo URL in state
  };

  const handleItemClick = (officer: Officer) => {
    setOfficerNo(officer.officer_no);
    setName(officer.officer_name);
    setPhoto(officer.photoUrl ? '' : officer.photo); // If photoUrl is available, clear photo
    setPhotoUrlFromState(officer.photoUrl ?? ''); // Use the nullish coalescing operator
  };

  return (
    <Container>
      {error && <Alert variant="danger">{error}</Alert>}
      {successMessage && <Alert variant="success">{successMessage}</Alert>}
      <div>
      <div>
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
         
          <div style={{ marginTop: '10px' }}>
            <Button variant="secondary" onClick={() => document.getElementById('photoInput')?.click()}>
              <FaUpload /> Upload Photo
            </Button>
            <Form.Control
              id="photoInput"
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              style={{ display: 'none' }}
            />
          </div>
          <Form.Label>Photo:</Form.Label>
          <Form.Control
            type="text"
            value={typeof photo === 'string' ? photo : photoName}
            readOnly
          />
        </Form.Group>

        <div style={{ marginTop: '10px' }}>
          <ButtonGroup>
            <Button variant="primary" onClick={handleAddClick}>
              Add
            </Button>
            <Button variant="success" onClick={handleEditClick} style={{ marginLeft: '10px' }}>
              Edit
            </Button>
            <Button variant="danger" onClick={handleDeleteClick} style={{ marginLeft: '10px' }}>
              Delete
            </Button>
            <Link to="/main" className="btn btn-secondary m-3">
              Go Back
            </Link>
          </ButtonGroup>
        </div>
      </Form>
      </div>
      <div>
      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>Employee ID</th>
            <th>Name</th>
            <th>Photo</th>
          </tr>
        </thead>
        <tbody>
          {officerList.map((officer, index) => (
            <tr key={index} onClick={() => handleItemClick(officer)}>
              <td>{officer.officer_no}</td>
              <td>{officer.officer_name}</td>
              <td>
                {officer.photoUrl && officer.photoUrl !== 'xx' ? (
                  <Image src={officer.photoUrl} alt={officer.officer_name} style={{ width: '100px', height: '100px' }} />
                ) : (
                  'No Photo'
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {photoUrlFromState && photoUrlFromState !== 'xx' && (
        <div className="mt-4">
          <h4>Photo Preview</h4>
          <Image src={photoUrlFromState} alt="Employee Photo" style={{ width: '200px', height: '200px' }} />
        </div>
      )}
     </div>
     </div>
    </Container>
  );
};

export default frmEmployee;
