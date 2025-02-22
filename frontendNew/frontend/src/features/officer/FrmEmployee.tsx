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
  let [photoType, setPhotoType] = useState<string>('');
  let [photoName, setPhotoName] = useState<string>('');

  const dispatch = useAppDispatch();

  const selectedPhotoUrl = useAppSelector((state: any) => state.photos.photoUrl);
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
            const officersWithUrls = await Promise.all(response.map(async (officer) => {
                if (officer.photo instanceof Blob) {
                    const base64 = await blobToBase64(officer.photo);
                    return {
                        ...officer,
                        photoUrl: base64
                    };
                } else {
                    console.warn('Photo is not a valid Blob:', officer.photo);
                    return {
                        ...officer,
                        photoUrl: ''
                    };
                }
            }));
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

// Helper function to convert Blob to Base64
const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string); // Ensure result is treated as a string
      reader.onerror = reject;
      reader.readAsDataURL(blob);
  });
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
      photoType = file.type;
      setPhotoType(photoType);

      photoName = file.name;
      setPhotoName(photoName);

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

      // Dispatch the thunk and wait for the response
      const resultAction = await dispatch(storePhotoAsync({ photo: file, officer_no: officerNo }));
      console.log('after dispatch(storePhotoAsync(', resultAction);

      if (storePhotoAsync.fulfilled.match(resultAction)) {
        console.log('Photo uploaded successfully:', resultAction.payload.photoUrl);

        const photoUrl: string = resultAction.payload.photoUrl;
        console.log('Photo URL:', photoUrl);

        const updatedOfficerList = officerList.map((officer) => {
          if (officer.officer_no === officerNo) {
            return {
              ...officer,
              photoUrl: photoUrl
            };
          }
          return officer;
        });
        setOfficerList(updatedOfficerList);

        setPhotoUrlFromState(photoUrl); // Update the photo URL in state
        setPhoto(photoUrl); // Update the photo URL in state
        console.log('Photo URL:', photoUrl);
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
        photo: photoUrlFromState//typeof photo === 'string' ? photo : URL.createObjectURL(photo), // Use the photo URL
      }));

      setSuccessMessage(response.payload.message);
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
      const response = await dispatch(updateOfficer({
        officer_no: officerNo,
        officerData: {
          officer_no: officerNo,
          officer_name: name,
          photo: typeof photo === 'string' ? photo : URL.createObjectURL(photo), // Use the photo URL
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
  
 // const [photoUrlFromState, setPhotoUrlFromState] = useState<string>(''); // State to store the photo URL from Redux


  return (
    <Container>
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
            value={typeof photo === 'string' ? photo : photoName}
            readOnly
          />
          <div style={{ marginTop: '10px' }}>
            <Button variant="secondary" onClick={() => document.getElementById('photoInput')?.click()}>
              <FaUpload /> Upload Photo
            </Button>
            <input
              id="photoInput"
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              style={{ display: 'none' }}
            />
          </div>
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
    </Container>
  );
};

export default frmEmployee;



































// import React, { useState, useEffect } from 'react';
// import { Container, Form, Button, Alert, Table, Image, ButtonGroup } from 'react-bootstrap';
// import { useAppDispatch, useAppSelector } from '../../app/store';
// import { FaUpload } from 'react-icons/fa';
// import { Link } from 'react-router-dom';
// import { fetchOfficers, createOfficer, updateOfficer, deleteOfficer } from './officerSlice';
// import { storePhotoAsync } from '../photos/photosSlice';

// interface Officer {
//   officer_no: string;
//   officer_name: string;
//   photo: string | File;
//   photoUrl?: string;
// }

// const EmployeeForm: React.FC = () => {
//   const [officerNo, setOfficerNo] = useState<string>('');
//   const [name, setName] = useState<string>('');
//   const [photo, setPhoto] = useState<string | File>('');
//   const [officerList, setOfficerList] = useState<Officer[]>([]);
//   const [error, setError] = useState<string>('');
//   const [successMessage, setSuccessMessage] = useState<string>('');
//   let [photoType, setPhotoType] = useState<string>('');
//   let [photoName, setPhotoName] = useState<string>('');

//   const dispatch = useAppDispatch();

//   const photoUrlFromState = useAppSelector((state: any) => state.photos.photoUrl); // Adjust the type as necessary
//   console.log('Photo URL from state:', photoUrlFromState);

//   useEffect(() => {
//     fetchOfficerList();
//   }, []);

//   const fetchOfficerList = async () => {
//     try {
//       console.log('Fetching officers...');

//       const response = await dispatch(fetchOfficers()).unwrap();
//       console.log('Fetched officers:', response); // Log the result

//       // Check if result is an array
//       if (Array.isArray(response)) {
//         const officersWithUrls = response.map((officer: Officer) => {
//           if (officer.photo && typeof officer.photo !== 'string') {
//             return {
//               ...officer,
//               photoUrl: URL.createObjectURL(officer.photo)
//             };
//           } else {
//             return officer;
//           }
//         });
//         setOfficerList(officersWithUrls);
//       } else {
//         console.error('Expected an array, but received:', response);
//         setOfficerList([]);
//       }
//     } catch (error) {
//       console.error(error);
//       setError('Error fetching officers');
//     }
//   };

//   const handleOfficerNoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setOfficerNo(e.target.value);
//   };

//   const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setName(e.target.value.toUpperCase());
//   };

//   const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     console.log('in handlePhotoChange');

//     if (e.target.files && e.target.files[0]) {
//       photoType = e.target.files[0].type;
//       setPhotoType(photoType);

//       photoName = e.target.files[0].name;
//       setPhotoName(photoName);

//       if (e.target.files[0] && e.target.files[0].size > 10 * 1024 * 1024) {  // 10MB in bytes
//         alert('File size exceeds the limit of 10MB.');
//         return;
//       }

//       const photoBlobUrl = URL.createObjectURL(e.target.files[0]);
//       setPhoto(photoBlobUrl);
//       console.log('Photo URL:', photoBlobUrl);
//       console.log('Photo:', e.target.files[0].name);

//       uploadPhoto(e.target.files[0]);
//     }
//   };

//   const uploadPhoto = async (file: File) => {
//     console.log('in uploadPhoto');

//     try {
//       console.log('about to dispatch(storePhotoAsync({ photo: file, officer_no: officerNo }))');
//       console.log('file:', file);
//       console.log('officerNo:', officerNo);

//       // Dispatch the thunk and wait for the response
//       const resultAction = await dispatch(storePhotoAsync({ photo: file, officer_no: officerNo }));
//       console.log('after dispatch(storePhotoAsync(', resultAction);

//       if (storePhotoAsync.fulfilled.match(resultAction)) {
//         console.log('Photo uploaded successfully:', resultAction.payload.photoUrl);

//         const photoUrl: string = resultAction.payload.photoUrl;
//         console.log('Photo URL:', photoUrl);

//         const updatedOfficerList = officerList.map((officer) => {
//           if (officer.officer_no === officerNo) {
//             return {
//               ...officer,
//               photoUrl: photoUrl
//             };
//           }
//           return officer;
//         });
//         setOfficerList(updatedOfficerList);

//         setPhoto(photoUrl); // Update the photo URL in state
//         console.log('Photo URL:', photoUrl);
//       } else if (storePhotoAsync.rejected.match(resultAction)) {
//         if (resultAction.payload) {
//           console.error('Error uploading photo XXXXX:', resultAction.payload.error);
//           // Handle specific error, e.g., show error notification
//           if (resultAction.payload.error.includes('Photo already exists')) {
//             // Handle the specific 409 error
//             console.log('Handling 409: Photo already exists');
//             // Show a user-friendly message or notification
//             alert('Photo already exists for this officer.');
//           } else {
//             // Handle other errors
//             alert('Failed to upload photo. Please try again.');
//           }
//         } else {
//           console.error('Error uploading photo: No payload');
//           alert('Failed to upload photo. Please try again.');
//         }
//       }
//     } catch (error) {
//       console.error('Error uploading photo:', error);
//       setError('Error uploading photo');
//     }
//   };

//   const handleAddClick = async () => {
//     if (!officerNo || !name || !photo) {
//       setError('Please fill in all fields');
//       return;
//     }

//     try {
//       console.log('about to dispatch(createOfficer({officer_no, officer_name, photo}))');
//       console.log('officer_no:', officerNo);
//       console.log('officer_name:', name);
//       console.log('photo:', photo);

//       // Dispatch the createOfficer thunk with the required parameters
//       const response = await dispatch(createOfficer({
//         officer_no: officerNo,
//         officer_name: name,
//         photo: typeof photo === 'string' ? photo : URL.createObjectURL(photo), // Use the photo URL
//       }));

//       setSuccessMessage(response.payload.message);
//       setError('');
//       clearForm();
//       fetchOfficerList();
//     } catch (error) {
//       console.error(error);
//       setError('Error adding record');
//       setSuccessMessage('');
//     }
//   };

//   const handleEditClick = async () => {
//     if (!officerNo || !name || !photo) {
//       setError('Please fill in all fields');
//       return;
//     }

//     try {
//       const response = await dispatch(updateOfficer({
//         officer_no: officerNo,
//         officerData: {
//           officer_no: officerNo,
//           officer_name: name,
//           photo: typeof photo === 'string' ? photo : URL.createObjectURL(photo), // Use the photo URL
//         },
//       }));

//       setSuccessMessage(response.payload.message);
//       setError('');
//       clearForm();
//       fetchOfficerList();
//     } catch (error) {
//       console.error(error);
//       setError('Error editing record');
//       setSuccessMessage('');
//     }
//   };

//   const handleDeleteClick = async () => {
//     if (!officerNo) {
//       setError('Employee ID cannot be empty');
//       return;
//     }

//     const delResponse = prompt("Enter Y to Delete, N to Not to Delete");
//     if (delResponse?.toUpperCase() !== 'Y') {
//       setError('Deletion aborted');
//       return;
//     }

//     try {
//       const response = await dispatch(deleteOfficer(officerNo));

//       setSuccessMessage(response.payload.message);
//       setError('');
//       clearForm();
//       fetchOfficerList();
//     } catch (error) {
//       console.error(error);
//       setError('Error deleting record');
//       setSuccessMessage('');
//     }
//   };

//   const clearForm = () => {
//     setOfficerNo('');
//     setName('');
//     setPhoto('');
//   };

//   const handleItemClick = (officer: Officer) => {
//     setOfficerNo(officer.officer_no);
//     setName(officer.officer_name);
//     setPhoto(officer.photoUrl || officer.photo);
//   };

//   useEffect(() => {
//     return () => {
//       // Clean up the Blob URLs when the component unmounts
//       officerList.forEach((officer) => {
//         if (officer.photoUrl) {
//           URL.revokeObjectURL(officer.photoUrl);
//         }
//       });
//     };
//   }, [officerList]);

//   return (
//     <Container>
//       {error && <Alert variant="danger">{error}</Alert>}
//       {successMessage && <Alert variant="success">{successMessage}</Alert>}
//       <Form>
//         <Form.Group controlId="formOfficerno">
//           <Form.Label>Employee ID:</Form.Label>
//           <Form.Control
//             type="text"
//             value={officerNo}
//             onChange={handleOfficerNoChange}
//             maxLength={10}
//             required
//           />
//         </Form.Group>

//         <Form.Group controlId="formName">
//           <Form.Label>Name:</Form.Label>
//           <Form.Control
//             type="text"
//             value={name}
//             onChange={handleNameChange}
//             maxLength={50}
//             required
//           />
//         </Form.Group>

//         <Form.Group controlId="formPhoto">
//           <Form.Label>Photo:</Form.Label>
//           <Form.Control
//             type="text"
//             value={typeof photo === 'string' ? photo : photoName}
//             readOnly
//           />
//           <div style={{ marginTop: '10px' }}>
//             <Button variant="secondary" onClick={() => document.getElementById('photoInput')?.click()}>
//               <FaUpload /> Upload Photo
//             </Button>
//             <input
//               id="photoInput"
//               type="file"
//               accept="image/*"
//               onChange={handlePhotoChange}
//               style={{ display: 'none' }}
//             />
//           </div>
//         </Form.Group>

//         <div style={{ marginTop: '10px' }}>
//           <ButtonGroup>
//             <Button variant="primary" onClick={handleAddClick}>
//               Add
//             </Button>
//             <Button variant="success" onClick={handleEditClick} style={{ marginLeft: '10px' }}>
//               Edit
//             </Button>
//             <Button variant="danger" onClick={handleDeleteClick} style={{ marginLeft: '10px' }}>
//               Delete
//             </Button>
//             <Link to="/main" className="btn btn-secondary m-3">
//               Go Back
//             </Link>
//           </ButtonGroup>
//         </div>
//       </Form>

//       <Table striped bordered hover className="mt-3">
//         <thead>
//           <tr>
//             <th>Employee ID</th>
//             <th>Name</th>
//             <th>Photo</th>
//           </tr>
//         </thead>
//         <tbody>
//           {officerList.map((officer) => (
//             <tr key={officer.officer_no} onClick={() => handleItemClick(officer)}>
//               <td>{officer.officer_no}</td>
//               <td>{officer.officer_name}</td>
//               <td>
//                 {officer.photoUrl && officer.photoUrl !== 'xx' ? (
//                   <Image src={officer.photoUrl} alt={officer.officer_name} style={{ width: '100px', height: '100px' }} />
//                 ) : (
//                   'No Photo'
//                 )}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </Table>

//       {photoUrlFromState && photoUrlFromState !== 'xx' && (
//         <div className="mt-4">
//           <h4>Photo Preview</h4>
//           <Image src={photoUrlFromState} alt="Employee Photo" style={{ width: '200px', height: '200px' }} />
//         </div>
//       )}
//     </Container>
//   );
// };

// export default EmployeeForm;










































// // import React, { useState, useEffect } from 'react';
// // import { Container, Form, Button, Alert, Table, Image, ButtonGroup } from 'react-bootstrap';
// // import { useAppDispatch, useAppSelector } from '../../app/store';
// // import { FaUpload } from 'react-icons/fa';
// // import { Link } from 'react-router-dom';
// // import { fetchOfficers, createOfficer, updateOfficer, deleteOfficer } from './officerSlice';
// // import { storePhotoAsync } from '../photos/photosSlice';

// // interface Officer {
// //   officer_no: string;
// //   officer_name: string;
// //   photo: string;
// // }

// // const EmployeeForm: React.FC = () => {
// //   const [officerNo, setOfficerNo] = useState<string>('');
// //   const [name, setName] = useState<string>('');
// //   const [photo, setPhoto] = useState<string>('');
// //   const [officerList, setOfficerList] = useState<Officer[]>([]);
// //   const [error, setError] = useState<string>('');
// //   const [successMessage, setSuccessMessage] = useState<string>('');
// //   let [photoType, setPhotoType] = useState<string>('');
// //   let [photoName, setPhotoName] = useState<string>('');

// //   const dispatch = useAppDispatch();

// //   const photoUrl = useAppSelector((state: any) => state.photos.photoUrl); // Adjust the type as necessary
// //   console.log('Photo URL:', photoUrl);

// //   useEffect(() => {
// //     fetchOfficerList();
// //   }, []);

// //   const fetchOfficerList = async () => {
// //     try {
// //       console.log('Fetching officers...');

// //       const response = await dispatch(fetchOfficers()).unwrap();
// //       console.log('Fetched officers:', response); // Log the result

// //       // Check if result is an array
// //       if (Array.isArray(response)) {
// //         setOfficerList(response);
// //       } else {
// //         console.error('Expected an array, but received:', response);
// //         setOfficerList([]);
// //       }
// //     } catch (error) {
// //       console.error(error);
// //       setError('Error fetching officers');
// //     }
// //   };

// //   const handleOfficerNoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// //     setOfficerNo(e.target.value);
// //   };

// //   const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// //     setName(e.target.value.toUpperCase());
// //   };

// //   const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// //     console.log('in handlePhotoChange')

// //     if (e.target.files && e.target.files[0]) {
// //       photoType = e.target.files[0].type;
// //       setPhotoType(photoType);

// //       photoName = e.target.files[0].name;
// //       setPhotoName(photoName);

// //       if (e.target.files[0] && e.target.files[0].size > 10 * 1024 * 1024) {  // 10MB in bytes
// //         alert('File size exceeds the limit of 10MB.');
// //         return;
// //       }

// //       setPhoto(URL.createObjectURL(e.target.files[0]));
// //       console.log('Photo URL:', photo);
// //       console.log('Photo:', e.target.files[0].name);

// //       uploadPhoto(e.target.files[0]);
// //     }
// //   };

// //   const uploadPhoto = async (file: File) => {
// //     console.log('in uploadPhoto')

   
// //     console.log('about to dispatch(storePhotoAsync({ photo: file, officer_no: officerNo }))');
// //     console.log('file:', file);
// //     console.log('officerNo:', officerNo);
  

// //     try {
// //         // Dispatch the thunk and wait for the response
// //         const resultAction = await dispatch(storePhotoAsync({ photo: file, officer_no: officerNo }));
// //         console.log('after  dispatch(storePhotoAsync(', resultAction); 

// //         if (storePhotoAsync.fulfilled.match(resultAction)) {
// //             console.log('Photo uploaded successfully:', resultAction.payload.photoUrl);

// //             const photoUrl: string = resultAction.payload.photoUrl  //payload.result.url;

// //             console.log('Photo URL:', photoUrl);

// //             setPhoto(photoUrl); // Update the photo URL in state
// //             console.log('Photo URL:', photoUrl);
// //         } else if (storePhotoAsync.rejected.match(resultAction)) {
// //           if (resultAction.payload) {
// //             console.error('Error uploading photo XXXXX:', resultAction.payload.error);
// //             // Handle specific error, e.g., show error notification
// //             if (resultAction.payload.error.includes('Photo already exists')) {
// //               // Handle the specific 409 error
// //               console.log('Handling 409: Photo already exists');
// //               // Show a user-friendly message or notification
// //               alert('Photo already exists for this officer.');
// //             } else {
// //               // Handle other errors
// //               alert('Failed to upload photo. Please try again.');
// //             }
// //           } else {
// //             console.error('Error uploading photo: No payload');
// //             alert('Failed to upload photo. Please try again.');
// //           }
// //       }
// //     } catch (error) {
// //         console.error('Error uploading photo:', error);
// //         setError('Error uploading photo');
// //     }
// // };
  
// //   const handleAddClick = async () => {
// //     if (!officerNo || !name || !photo) {
// //       setError('Please fill in all fields');
// //       return;
// //     }

// //     try {
// //       console.log('about to dispatch(createOfficer({officer_no, officer_name, photo}))');
// //       console.log('officer_no:', officerNo);
// //       console.log('officer_name:', name);
// //       console.log('photo:', photo);

// //       // Dispatch the createOfficer thunk with the required parameters
// //       const response = await dispatch(createOfficer({
// //           officer_no: officerNo,
// //           officer_name: name,
// //           photo: photo, // Use the photo URL returned by storePhotoAsync
// //       }));

// //       setSuccessMessage(response.payload.message);
// //       setError('');
// //       clearForm();
// //       fetchOfficerList();
// //     } catch (error) {
// //       console.error(error);
// //       setError('Error adding record');
// //       setSuccessMessage('');
// //     }
// //   };

// //   const handleEditClick = async () => {
// //     if (!officerNo || !name || !photo) {
// //       setError('Please fill in all fields');
// //       return;
// //     }

// //     try {
// //       const response = await dispatch(updateOfficer({
// //           officer_no: officerNo,
// //           officerData: {
// //               officer_no: officerNo,
// //               officer_name: name,
// //               photo: photo, // , // Use the photo file stored in state', // Use the photo URL stored in state
// //               // Add other fields as necessary
// //           }
// //       }));

// //       setSuccessMessage(response.payload.message);
// //       setError('');
// //       clearForm();
// //       fetchOfficerList();
// //     } catch (error) {
// //       console.error(error);
// //       setError('Error editing record');
// //       setSuccessMessage('');
// //     }
// //   };

// //   const handleDeleteClick = async () => {
// //     if (!officerNo) {
// //       setError('Employee ID cannot be empty');
// //       return;
// //     }

// //     const delResponse = prompt("Enter Y to Delete, N to Not to Delete");
// //     if (delResponse?.toUpperCase() !== 'Y') {
// //       setError('Deletion aborted');
// //       return;
// //     }

// //     try {
// //       const response = await dispatch(deleteOfficer(officerNo));

// //       setSuccessMessage(response.payload.message);
// //       setError('');
// //       clearForm();
// //       fetchOfficerList();
// //     } catch (error) {
// //       console.error(error);
// //       setError('Error deleting record');
// //       setSuccessMessage('');
// //     }
// //   };

// //   // const handleExitClick = () => {
// //   //   window.location.href = '/'; // Redirect to main page or hide the form
// //   // };

// //   const clearForm = () => {
// //     setOfficerNo('');
// //     setName('');
// //     setPhoto('');
// //   };

// //   const handleItemClick = (officer: Officer) => {
// //     setOfficerNo(officer.officer_no);
// //     setName(officer.officer_name);
// //     setPhoto(officer.photo);
// //   };

// //   return (
// //     <Container>
// //             {/* <h2>Employee Data Entry Screen</h2> */}
// //             {error && <Alert variant="danger">{error}</Alert>}
// //             {successMessage && <Alert variant="success">{successMessage}</Alert>}
// //             <Form>
// //                 <Form.Group controlId="formOfficerno">
// //                     <Form.Label>Employee ID:</Form.Label>
// //                     <Form.Control
// //                         type="text"
// //                         value={officerNo}
// //                         onChange={handleOfficerNoChange}
// //                         maxLength={10}
// //                         required
// //                     />
// //                 </Form.Group>

// //                 <Form.Group controlId="formName">
// //                     <Form.Label>Name:</Form.Label>
// //                     <Form.Control
// //                         type="text"
// //                         value={name}
// //                         onChange={handleNameChange}
// //                         maxLength={50}
// //                         required
// //                     />
// //                 </Form.Group>

// //                 <Form.Group controlId="formPhoto">
// //                     <Form.Label>Photo:</Form.Label>
// //                     <Form.Control
// //                         type="text"
// //                         value={photo}
// //                         onChange={handlePhotoChange}
// //                         readOnly
// //                     />
// //                     <div style={{ marginTop: '10px' }}>
// //                         <Button variant="secondary" onClick={() => document.getElementById('photoInput')?.click()}>
// //                             <FaUpload /> Upload Photo
// //                         </Button>
// //                         <input
// //                             id="photoInput"
// //                             type="file"
// //                             onChange={handlePhotoChange}
// //                             style={{ display: 'none' }}
// //                         />
// //                     </div>
// //                 </Form.Group>

// //                 <div style={{ marginTop: '10px' }}>
// //                     <ButtonGroup>
// //                         <Button variant="primary" onClick={handleAddClick}>
// //                             Add
// //                         </Button>
// //                         <Button variant="success" onClick={handleEditClick} style={{ marginLeft: '10px' }}>
// //                             Edit
// //                         </Button>
// //                         <Button variant="danger" onClick={handleDeleteClick} style={{ marginLeft: '10px' }}>
// //                             Delete
// //                         </Button>
// //                         {/* Uncomment the following buttons if needed
// //                         <Button variant="secondary" onClick={handleExitClick} style={{ marginLeft: '10px' }}>
// //                             Exit
// //                         </Button>
// //                         <Button variant="info" onClick={() => window.alert('View Logins functionality not implemented')} style={{ marginLeft: '10px' }}>
// //                             View Logins
// //                         </Button> */}
// //                     </ButtonGroup>
// //                     <Link to="/main" className="btn btn-secondary m-3">
// //                         Go Back
// //                     </Link>
// //                 </div>
// //             </Form>

// //             {/* <h3 className="mt-4">List Of Employees</h3> */}
// //             <Table striped bordered hover className="mt-3">
// //                 <thead>
// //                     <tr>
// //                         <th>Employee ID</th>
// //                         <th>Name</th>
// //                         <th>Photo</th>
// //                     </tr>
// //                 </thead>
// //                 <tbody>
// //                     {officerList.map((officer) => (
// //                         <tr key={officer.officer_no} onClick={() => handleItemClick(officer)}>
// //                             <td>{officer.officer_no}</td>
// //                             <td>{officer.officer_name}</td>
// //                             <td>
// //                                 {officer.photo && officer.photo !== 'xx' ? (
// //                                     <Image src={officer.photo} alt={officer.officer_name} style={{ width: '100px', height: '100px' }} />
// //                                 ) : (
// //                                     'No Photo'
// //                                 )}
// //                             </td>
// //                         </tr>
// //                     ))}
// //                 </tbody>
// //             </Table>

// //             {photo && photo !== 'xx' && (
// //                 <div className="mt-4">
// //                     <h4>Photo Preview</h4>
// //                     <Image src={photoUrl} alt="Employee Photo" style={{ width: '200px', height: '200px' }} />
// //                 </div>
// //             )}
// //         </Container>
// //       );
// // };

// // export default EmployeeForm;






























