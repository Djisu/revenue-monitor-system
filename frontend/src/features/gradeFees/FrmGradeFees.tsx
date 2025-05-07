import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/store';
import { Container, Form, Button, Alert, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { fetchGradeFees,  deleteGradeFee, createGradeFee, setGradeFees, updateGradeFee } from './gradeFeesSlice';
import { fetchBusinessTypes, BusinessTypeState } from '../businessType/businessTypeSlice';

interface BusinessType {
  business_type: string;
}

interface GradeFee {
  buss_type: string;
  grade: string;
  description: string;
  fees: number;
}

const GradeFeesForm: React.FC = () => {
  const dispatch = useAppDispatch();

  const gradeFees = useAppSelector(state => state.gradeFees.gradeFees);


  const { bussTypesData , loading, error }: BusinessTypeState = useAppSelector((state) => state.businessType);

  console.log('businessTypes:', bussTypesData); // Debugging statement
  console.log('gradeFees:', gradeFees); // Debugging statement
 
  const [businessType, setBusinessType] = useState<string>('');

  const [businessTypes, setBusinessTypes] = useState<BusinessType[]>([]);

  const [grade, setGrade] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [fees, setFees] = useState<number>(0);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [errorFlag, setErrorFlag] = useState<string>('');
  const [localGradeFeesList, setLocalGradeFeesList] = useState<GradeFee[]>([]);

  
  const [loadingFlag, setLoadingFlag] = useState<boolean>(false);

  const [selectedBussType, setSelectedBussType] = useState<string | null>(null);
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null);
  const [selectedDescription, setSelectedDescription] = useState<string | null>(null);
  const [selectedFees, setSelectedFees] = useState<number>(0);

//

  useEffect(() => {
    console.log('in useEffect: Fetching grade fees');
    dispatch(fetchGradeFees());
  }, [dispatch]);


  useEffect(() => {
    console.log('in useEffect: Fetching grade fees list');
    fetchGradeFeesList();
  }, []);

  useEffect(() => {
      const fetchAndSetBusinessTypes = async () => {
          try {
              const response = await dispatch(fetchBusinessTypes()).unwrap();

              console.log('FRONTEND: Fetched business types:', response);
              setBusinessTypes(response);
          } catch (error: unknown) {
            if (error instanceof Error){
              console.error("Error fetching business types", error);
              alert("Error in fetching business types");
            }else{
              alert("Error unknown");
            }
              
          }
      };

      fetchAndSetBusinessTypes();
  }, [dispatch])

  const fetchGradeFeesList = async () => {
    try {
        console.log('Fetching grade fees list');
        //loadingFlag = true;
        setLoadingFlag(true); // Start loading

        const response = await dispatch(fetchGradeFees()).unwrap();
        
        console.log('Fetched grade fees list:', response);

        if (response && Array.isArray(response)) {
            console.log('IT IS AN ARRAY');

            const formattedGradeFees: GradeFee[] = response.map((gr: GradeFee): GradeFee => ({
                buss_type: gr?.buss_type || '',
                description: gr?.description || '',
                grade: gr?.grade || '',
                fees: gr?.fees || 0,
            }));

            setLocalGradeFeesList(formattedGradeFees);
            dispatch(setGradeFees(formattedGradeFees));
        } else {
            console.error('Expected an array of GradeFee objects but found:', response);
            setErrorFlag('Error fetching grade fees list');
        }
    } catch (error: unknown) {
      if (error instanceof Error){
        console.error("Error fetching business types", error);
        alert("Error in fetching business types");
      }else{
        alert("Error unknown");
      }
        
    
    } finally {
        //loadingFlag = false;
        setLoadingFlag(false); // Stop loading
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
    const {value} = e.target;

    if (value === '' || !isNaN(Number(value))) {
      setFees(Number(value));
    }
  };

  const handleAddClick = async () => {
    console.log('Adding new grade fee record')

    if (!businessType || !grade || !description || !fees) {
     // errorFlag = 'Please fill in all fields'
      setErrorFlag('Please fill in all fields');
      return;
    }

    try {
      const response = await dispatch(createGradeFee({ buss_type: businessType, grade, description, fees })).unwrap();

      setSuccessMessage(response.message);
      //dispatch(setGradeFees([...gradeFees, response.data]));
      dispatch(fetchGradeFees());
      clearForm();
    } catch (error: unknown) {
      if (error instanceof Error){
        console.error("Error fetching business types", error);
        alert("Error in fetching business types");
      }else{
        alert("Error unknown");
      } 
    }        
  };

  const handleEditClick = async () => {
    if (!businessType || !grade || !description || !fees) {
        setErrorFlag('Please fill in all fields');
        return;
    }

    const formattedGradeFees = {
      buss_type: businessType, // Renamed from businessType
      grade: grade, 
      data: {
        buss_type: businessType,
        grade: grade, 
        description: description,
        fees: fees
      },
    };

    try {
        const response = await dispatch(updateGradeFee(formattedGradeFees)).unwrap();

        setSuccessMessage(`Grade fee record updated successfully: ${JSON.stringify(response)}`);
        fetchGradeFeesList();
        clearForm();
       
        setErrorFlag('');
      } catch (error: unknown) {
        if (error instanceof Error){
          console.error("Error fetching business types", error);
          alert("Error in fetching business types");
        }else{
          alert("Error unknown");
        } 
      } 
    }

    const handleDelete = async (bussType: string | null, grade: string | null) => {
      console.log('Deleting grade fee record')
      try {
        if (!bussType || !grade) {
          throw new Error('Select the business type and enter the grade');
        }
  
        const response = await dispatch(deleteGradeFee({
          buss_type: bussType,
          grade: grade
        })).unwrap();
  
        console.log('response: ', response);
        setSuccessMessage('Grade rate deleted successfully');
        clearForm();
        fetchGradeFeesList();
        setErrorFlag('');
      } catch (error: unknown) {
        if (error instanceof Error){
          console.error("Error fetching business types", error);
          alert("Error in fetching business types");
        }else{
          alert("Error unknown");
        }
      }   
    };
   

  const handleViewClick = async () => {
    try {
      fetchGradeFeesList();
    } catch (error: unknown) {
      if (error instanceof Error){
        console.error("Error fetching business types", error);
        alert("Error in fetching business types");
      }else{
        alert("Error unknown");
      }
    }    
  };

  const clearForm = () => {
    setBusinessType('');
    setGrade('');
    setDescription('');
    setFees(0);
  };


  const handleSelectedBusstype = (bussType: string | null, grade: string | null) => {
    console.log('Selected buss_type:', bussType, 'Selected grade:', grade);

    if (bussType && grade) {
      console.log('there are values in both fields')

      // Find the corresponding record in the gradeFees array
      const selectedRecord = gradeFees.find(
        (gr: GradeFee) => gr.buss_type === bussType && gr.grade === grade
      );

      if (selectedRecord) {
        console.log('Found the selected record:', selectedRecord);
        setSelectedBussType(bussType);
        setSelectedGrade(grade);
        //selectedDescription = selectedRecord.description;
        setSelectedDescription( selectedRecord.description);

        //selectedFees = selectedRecord.fees || 0
        setSelectedFees(selectedRecord.fees || 0);
      } else {
        console.error('No record found for buss_type:', bussType, 'and grade:', grade);
        setSelectedBussType(bussType);
        setSelectedGrade(grade);
        setSelectedDescription(null);
        setSelectedFees(0); // Convert 0 to a string
      }
    }
  };

  if (loading || loadingFlag) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }
  return (
    <Container>
      {/* Error and Success Messages */}
      {error && <Alert variant="danger">{error || errorFlag}</Alert>}
      {successMessage && <Alert variant="success">{successMessage}</Alert>}
  
      {/* Data Entry Section */}
      <div>
      <p>Selected Description: {selectedDescription}</p>
      <p>Selected Fees: {selectedFees}</p>
        <Form>
          <Form.Group controlId="formBusinessType">
            <Form.Label>Business Type:</Form.Label>
            <Form.Select value={businessType} onChange={handleBusinessTypeChange} required>
              <option value="">Select buss type</option>
              {businessTypes.length > 0 ? (
                businessTypes.map((typeObj, index) => (
                  <option key={index} value={typeObj.business_type}>
                    {typeObj.business_type}
                  </option>
                ))
              ) : (
                <option value="" disabled>No Business Types records found</option>
              )}
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
          </Form.Group>
  
          {/* Buttons Section */}
          <div>
            <Button variant="primary" onClick={handleAddClick} className="uniform-button">
              Add New Record
            </Button>
            <Button variant="info" onClick={handleViewClick} className="uniform-button">
              View Grades
            </Button>
            <Link to="/main" className="btn btn-primary uniform-button">
              Go Back
            </Link>
          </div>
        </Form>
      </div>
  
      {/* Grades Table */}
      <div>
        <Table striped bordered hover className="mt-3">
          <thead>
            <tr>
              <th>Buss Type</th>
              <th>Grade</th>
              <th>Description</th>
              <th>Fees₵</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {localGradeFeesList && localGradeFeesList.length > 0 ? (
              localGradeFeesList.map((gr, index) => (
                <tr 
                  key={index} 
                  data-buss_type={gr.buss_type} 
                  data-grade={gr.grade} 
                  onClick={() => handleSelectedBusstype(gr.buss_type, gr.grade)}
                  className={selectedBussType === gr.buss_type && selectedGrade === gr.grade ? 'selected' : ''}
                >
                  <td>{gr.buss_type}</td>
                  <td>{gr.grade}</td>
                  <td>{gr.description}</td>
                  <td>{gr.fees.toString()}</td> 
                  <td>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent the row click event from firing
                        handleEditClick();
                      }}
                      className="uniform-button green-button"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent the row click event from firing
                        handleDelete(gr.buss_type, gr.grade);
                      }}
                      className="uniform-button red-button"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5}>No Grade Fees records found</td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    </Container>
  );
 
};

export default GradeFeesForm;
