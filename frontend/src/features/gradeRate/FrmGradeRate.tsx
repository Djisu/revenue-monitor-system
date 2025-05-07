import React, { useState, useEffect } from 'react';
import { Button, Form, Table, Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { fetchGradeRates, createGradeRate, updateGradeRate, deleteGradeRate } from './gradeRateSlice';
import { useAppDispatch, useAppSelector } from '../../app/store';
import { setGradeRates, clearError } from './gradeRateSlice';


interface GradeRate {
  grade: string;
  minValuex: number;
  maxValuex: number;
  rate: number;
}

interface FormState {
  grade: string;
  minValuex: string;
  maxValuex: string;
  rate: string;
}

const GradeRateForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const gradeRatesState = useAppSelector((state) => state.gradeRate);

  const { loading, error, gradeRates } = gradeRatesState;

  console.log(`gradeRates: ${JSON.stringify(gradeRates)}`);

  const [formState, setFormState] = useState<FormState>({
    grade: '',
    minValuex: '',
    maxValuex: '',
    rate: '',
  });

  const [addFlag, setAddFlag] = useState<string>('');
  const [editFlag, setEditFlag] = useState<string>('');
  const [delFlag, setDelFlag] = useState<string>('');
  const [errorFlag, setErrorFlag] = useState<string>('');

  useEffect(() => {
    populateListView();
  }, [dispatch]);

  const populateListView = async () => {
    try {
      const response = await dispatch(fetchGradeRates()).unwrap();

      console.log(`after dispatch(fetchGradeRates()).unwrap(), response.data: ${JSON.stringify(response.data)}`);

      if (response.data && Array.isArray(response.data)) {
        const formattedGradeRates = response.data.map((gr: GradeRate) => ({
          grade: gr.grade,
          minValuex: gr.minValuex, // Ensure minValuex is a number
          maxValuex: gr.maxValuex, // Ensure maxValuex is a number
          rate: gr?.rate || 0,       // Provide default value if undefined
        }));

        dispatch(setGradeRates(formattedGradeRates));
      }
    } catch (error) {
      console.error('Error fetching grade rates:', error);
      setErrorFlag('Error fetching grade rates');
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setFormState((prevFormState) => ({
      ...prevFormState,
      [name]: value,
    }));
  };

  const handleAdd = async () => {
    try {
      if (!formState.grade) {
        throw new Error('Enter the grade');
      }
      if (isNaN(parseFloat(formState.minValuex))) {
        throw new Error('Enter a valid Minimum Value');
      }
      if (isNaN(parseFloat(formState.maxValuex))) {
        throw new Error('Enter a valid Maximum Value');
      }
      if (isNaN(parseFloat(formState.rate))) {
        throw new Error('Enter a valid rate');
      }

      const gradeRate: GradeRate = {
        grade: formState.grade,
        minValuex: parseFloat(formState.minValuex),
        maxValuex: parseFloat(formState.maxValuex),
        rate: parseFloat(formState.rate),
      };

      const response = await dispatch(createGradeRate(gradeRate)).unwrap();
      setAddFlag(response.message);

      populateListView();
      setFormState({ grade: '', minValuex: '', maxValuex: '', rate: '' });
    } catch (error) {
      console.error('Error adding grade rate:', error);
      setErrorFlag('Error in adding a record');
    }
  };

  const handleEdit = async () => {
    try {
      if (!formState.grade) {
        throw new Error('Enter the grade');
      }
      if (isNaN(parseFloat(formState.minValuex))) {
        throw new Error('Enter a valid Minimum Value');
      }
      if (isNaN(parseFloat(formState.maxValuex))) {
        throw new Error('Enter a valid Maximum Value');
      }
      if (isNaN(parseFloat(formState.rate))) {
        throw new Error('Enter a valid rate');
      }

      const gradeRate: GradeRate = {
        grade: formState.grade,
        minValuex: parseFloat(formState.minValuex),
        maxValuex: parseFloat(formState.maxValuex),
        rate: parseFloat(formState.rate),
      };

        const formattedGradeRate = {
        grade: gradeRate.grade,
        minValuex: gradeRate.minValuex, // Correct the typo if necessary, otherwise ensure this property exists
        maxValuex: gradeRate.maxValuex, // Correct the typo if necessary, otherwise ensure this property exists
        data: {
          grade: gradeRate.grade,
          minValuex: gradeRate.minValuex,
          maxValuex: gradeRate.maxValuex,
          rate: gradeRate.rate,
        },
      };

      const response = await dispatch(updateGradeRate(formattedGradeRate)).unwrap();
      setEditFlag(response.message);

      populateListView();
      setFormState({ grade: '', minValuex: '', maxValuex: '', rate: '' });
    } catch (error) {
      console.error('Error editing grade rate:', error);
      setEditFlag('Error in editing a record');
    }
  };

  const handleDelete = async () => {
    try {
      if (!formState.grade) {
        throw new Error('Enter the grade');
      }

      const response = await dispatch(deleteGradeRate({
        grade: formState.grade,
        minValuex: parseFloat(formState.minValuex),
        maxValuex: parseFloat(formState.maxValuex),
      })).unwrap();

      console.log('response: ', response);
      setDelFlag('Grade rate deleted successfully');
      populateListView();
      setFormState({ grade: '', minValuex: '', maxValuex: '', rate: '' });
    } catch (error) {
      console.error('Error deleting grade rate:', error);
      setDelFlag('Error in deleting record');
    }
  };

  const handleSelectGradeRate = (event: React.MouseEvent<HTMLElement>) => {
    const selectedGrade = event.currentTarget.getAttribute('data-grade');
    if (selectedGrade) {
      const selectedRecord = gradeRates.find((gr) => gr.grade === selectedGrade);
      if (selectedRecord) {
        setFormState({
          grade: selectedRecord.grade,
          minValuex: selectedRecord.minValuex.toString(),
          maxValuex: selectedRecord.maxValuex.toString(),
          rate: selectedRecord.rate.toString(),
        });
      }
    }
  };

  const handleClearError = () => {
    dispatch(clearError());
    setErrorFlag('');
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <Container>
      <Row className="justify-content-center">
        <Col xs={12} md={8}>
          <h1 className="text-center text-primary">Grade Rates Data Entry</h1>
          <p className="text-center text-info">CALIBRATE FEE FIXING GRADES</p>
          <p className="text-center text-danger">MARCORY MUNICIPAL ASSEMBLY</p>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Grade:</Form.Label>
              <Form.Control
                type="text"
                name="grade"
                value={formState.grade}
                onChange={handleInputChange}
                placeholder="Enter Grade"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Minimum Value:</Form.Label>
              <Form.Control
                type="text"
                name="minValue"
                value={formState.minValuex}
                onChange={handleInputChange}
                placeholder="Enter Minimum Value"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Maximum Value:</Form.Label>
              <Form.Control
                type="text"
                name="maxValue"
                value={formState.maxValuex}
                onChange={handleInputChange}
                placeholder="Enter Maximum Value"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Rate:</Form.Label>
              <Form.Control
                type="text"
                name="rate"
                value={formState.rate}
                onChange={handleInputChange}
                placeholder="Enter Rate"
              />
            </Form.Group>
            <div className="d-flex justify-content-between">
              <Button variant="primary" onClick={handleAdd}>
                Add New Record
              </Button>
              <Button variant="warning" onClick={handleEdit}>
                Edit Old Record
              </Button>
              <Button variant="danger" onClick={handleDelete}>
                Delete
              </Button>
              <Button variant="info" onClick={populateListView}>
                Load Spreadsheet
              </Button>
              <Button variant="secondary" onClick={handleClearError}>
                Clear Error
              </Button>
              <Link to="/main" className="primary m-3">
                Go Back
              </Link>
            </div>
            {addFlag && <p className="text-success mt-2">{addFlag}</p>}
            {editFlag && <p className="text-success mt-2">{editFlag}</p>}
            {delFlag && <p className="text-success mt-2">{delFlag}</p>}
            {errorFlag && <p className="text-danger mt-2">{errorFlag}</p>}
          </Form>
          <Table striped bordered hover className="mt-3">
            <thead>
              <tr>
                <th>GRADE</th>
                <th>MINIMUM VALUE</th>
                <th>MAXIMUM VALUE</th>
                <th>RATE</th>
              </tr>
            </thead>
            <tbody>
              {gradeRates.map((gr, index) => (
                <tr key={index} data-grade={gr.grade} onClick={handleSelectGradeRate}>
                  <td>{gr.grade}</td>
                  <td>{gr.minValuex}</td> 
                  <td>{gr.maxValuex}</td>
                  <td>{gr.rate}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
};

export default GradeRateForm;











// import React, { useState, useEffect } from 'react';
// import { Button, Form, Table, Container, Row, Col } from 'react-bootstrap';
// import { Link } from 'react-router-dom';
// import { fetchGradeRates, createGradeRate, updateGradeRate } from './gradeRateSlice';
// import { useAppDispatch, useAppSelector } from '../../app/store';

// interface GradeRate {
//   grade: string;
//   minValue: number;
//   maxValue: number;
//   rate: number;
// }

// interface FormState {
//   grade: string;
//   minValue: string;
//   maxValue: string;
//   rate: string;
// }

// const GradeRateForm: React.FC = () => {
//   const dispatch = useAppDispatch();
//   const gradeRatesState = useAppSelector((state) => state.gradeRate);

//   const { loading, error, gradeRates } = gradeRatesState;

//   console.log(`gradeRates: ${JSON.stringify(gradeRates)}`);

//   const [formState, setFormState] = useState<FormState>({
//     grade: '',
//     minValue: '',
//     maxValue: '',
//     rate: '',
//   });

//   const [addFlag, setAddFlag] = useState<string>('');
//   const [editFlag, setEditFlag] = useState<string>('');
//   const [delFlag, setDelFlag] = useState<string>('');
//   const [errorFlag, setErrorFlag] = useState<string>('');

//   useEffect(() => {
//     populateListView();
//   }, [dispatch]);

//   const populateListView = async () => {
//     try {
//       const response = await dispatch(fetchGradeRates()).unwrap();

//       console.log(`after dispatch(fetchGradeRates()).unwrap(), response.data: ${JSON.stringify(response.data)}`);

//       if (response.data && Array.isArray(response.data)) {
//         const formattedGradeRates = response.data.map((gr: any) => ({
//           grade: gr.grade,
//           minValue: parseFloat(gr.minValue), // Ensure minValue is a number
//           maxValue: parseFloat(gr.maxValue), // Ensure maxValue is a number
//           rate: parseFloat(gr.rate),       // Ensure rate is a number
//         }));

//         // Ensure the gradeRates in the state are updated
//         dispatch({
//           type: 'gradeRate/setGradeRates',
//           payload: formattedGradeRates,
//         });
//       }
//     } catch (error) {
//       console.error('Error fetching grade rates:', error);
//       setErrorFlag('Error fetching grade rates');
//     }
//   };

//   const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = event.target;

//     setFormState((prevFormState) => ({
//       ...prevFormState,
//       [name]: value,
//     }));
//   };

//   const handleAdd = async () => {
//     try {
//       if (!formState.grade) {
//         throw new Error('Enter the grade');
//       }
//       if (isNaN(parseFloat(formState.minValue))) {
//         throw new Error('Enter a valid Minimum Value');
//       }
//       if (isNaN(parseFloat(formState.maxValue))) {
//         throw new Error('Enter a valid Maximum Value');
//       }
//       if (isNaN(parseFloat(formState.rate))) {
//         throw new Error('Enter a valid rate');
//       }

//       const gradeRate: GradeRate = {
//         grade: formState.grade,
//         minValue: parseFloat(formState.minValue),
//         maxValue: parseFloat(formState.maxValue),
//         rate: parseFloat(formState.rate),
//       };

//       const response = await dispatch(createGradeRate(gradeRate)).unwrap();
//       setAddFlag(response.message);

//       populateListView();
//       setFormState({ grade: '', minValue: '', maxValue: '', rate: '' });
//     } catch (error) {
//       console.error('Error adding grade rate:', error);
//       setErrorFlag('Error in adding a record');
//     }
//   };

//   const handleEdit = async () => {
//     try {
//       if (!formState.grade) {
//         throw new Error('Enter the grade');
//       }
//       if (isNaN(parseFloat(formState.minValue))) {
//         throw new Error('Enter a valid Minimum Value');
//       }
//       if (isNaN(parseFloat(formState.maxValue))) {
//         throw new Error('Enter a valid Maximum Value');
//       }
//       if (isNaN(parseFloat(formState.rate))) {
//         throw new Error('Enter a valid rate');
//       }

//       const gradeRate: GradeRate = {
//         grade: formState.grade,
//         minValue: parseFloat(formState.minValue),
//         maxValue: parseFloat(formState.maxValue),
//         rate: parseFloat(formState.rate),
//       };

//         const formattedGradeRate = {
//         grade: gradeRate.grade,
//         minValuex: gradeRate.minValue, // Correct the typo if necessary, otherwise ensure this property exists
//         maxValuex: gradeRate.maxValue, // Correct the typo if necessary, otherwise ensure this property exists
//         data: {
//           grade: gradeRate.grade,
//           minValue: gradeRate.minValue,
//           maxValue: gradeRate.maxValue,
//           rate: gradeRate.rate,
//         },
//       };


//       const response = await dispatch(updateGradeRate(formattedGradeRate)).unwrap();
//       setEditFlag(response.message);

//       populateListView();
//       setFormState({ grade: '', minValue: '', maxValue: '', rate: '' });
//     } catch (error) {
//       console.error('Error editing grade rate:', error);
//       setEditFlag('Error in editing a record');
//     }
//   };

//   const handleDelete = async () => {
//     try {
//       if (!formState.grade) {
//         throw new Error('Enter the grade');
//       }

//       const response = await dispatch({
//         type: `gradeRate/deleteGradeRate`,
//         payload: {
//           grade: formState.grade,
//           minValue: parseFloat(formState.minValue),
//           maxValue: parseFloat(formState.maxValue),
//         },
//       });

//       console.log('response: ', response);
//       setDelFlag('Grade rate deleted successfully');
//       populateListView();
//       setFormState({ grade: '', minValue: '', maxValue: '', rate: '' });
//     } catch (error) {
//       console.error('Error deleting grade rate:', error);
//       setDelFlag('Error in deleting record');
//     }
//   };

//   const handleSelectGradeRate = (event: React.MouseEvent<HTMLElement>) => {
//     const selectedGrade = event.currentTarget.getAttribute('data-grade');
//     if (selectedGrade) {
//       const selectedRecord = gradeRates.find((gr) => gr.grade === selectedGrade);
//       if (selectedRecord) {
//         setFormState({
//           grade: selectedRecord.grade,
//           minValue: selectedRecord.minValue.toString(),
//           maxValue: selectedRecord.maxValue.toString(),
//           rate: selectedRecord.rate.toString(),
//         });
//       }
//     }
//   };

//   if (loading) {
//     return <p>Loading...</p>;
//   }

//   if (error) {
//     return <p>Error: {error}</p>;
//   }

//   return (
//     <Container>
//       <Row className="justify-content-center">
//         <Col xs={12} md={8}>
//           <h1 className="text-center text-primary">Grade Rates Data Entry</h1>
//           <p className="text-center text-info">CALIBRATE FEE FIXING GRADES</p>
//           <p className="text-center text-danger">MARCORY MUNICIPAL ASSEMBLY</p>
//           <Form>
//             <Form.Group className="mb-3">
//               <Form.Label>Grade:</Form.Label>
//               <Form.Control
//                 type="text"
//                 name="grade"
//                 value={formState.grade}
//                 onChange={handleInputChange}
//                 placeholder="Enter Grade"
//               />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Minimum Value:</Form.Label>
//               <Form.Control
//                 type="text"
//                 name="minValue"
//                 value={formState.minValue}
//                 onChange={handleInputChange}
//                 placeholder="Enter Minimum Value"
//               />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Maximum Value:</Form.Label>
//               <Form.Control
//                 type="text"
//                 name="maxValue"
//                 value={formState.maxValue}
//                 onChange={handleInputChange}
//                 placeholder="Enter Maximum Value"
//               />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Rate:</Form.Label>
//               <Form.Control
//                 type="text"
//                 name="rate"
//                 value={formState.rate}
//                 onChange={handleInputChange}
//                 placeholder="Enter Rate"
//               />
//             </Form.Group>
//             <div className="d-flex justify-content-between">
//               <Button variant="primary" onClick={handleAdd}>
//                 Add New Record
//               </Button>
//               <Button variant="warning" onClick={handleEdit}>
//                 Edit Old Record
//               </Button>
//               <Button variant="danger" onClick={handleDelete}>
//                 Delete
//               </Button>
//               <Button variant="info" onClick={populateListView}>
//                 Load Spreadsheet
//               </Button>
//               <Link to="/main" className="primary m-3">
//                 Go Back
//               </Link>
//             </div>
//             {addFlag && <p className="text-success mt-2">{addFlag}</p>}
//             {editFlag && <p className="text-success mt-2">{editFlag}</p>}
//             {delFlag && <p className="text-success mt-2">{delFlag}</p>}
//             {errorFlag && <p className="text-danger mt-2">{errorFlag}</p>}
//           </Form>
//           <Table striped bordered hover className="mt-3">
//             <thead>
//               <tr>
//                 <th>GRADE</th>
//                 <th>MINIMUM VALUE</th>
//                 <th>MAXIMUM VALUE</th>
//                 <th>RATE</th>
//               </tr>
//             </thead>
//             <tbody>
//               {gradeRates.map((gr, index) => (
//                 <tr key={index} data-grade={gr.grade} onClick={handleSelectGradeRate}>
//                   <td>{gr.grade}</td>
//                   <td>{gr.minValue.toString()}</td> 
//                   <td>{gr.maxValue.toString()}</td> {/* Convert maxValue to string */}
//                   <td>{gr.rate.toString()}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </Table>
//         </Col>
//       </Row>
//     </Container>
//   );
// };

// export default GradeRateForm;








// // import React, { useState, useEffect } from 'react';
// // import { Button, Form, Table, Container, Row, Col } from 'react-bootstrap';
// // import { Link } from 'react-router-dom';
// // import { fetchGradeRates, createGradeRate, updateGradeRate } from './gradeRateSlice';
// // import { useAppDispatch, useAppSelector } from '../../app/store';

// // interface GradeRate {
// //   grade: string;
// //   minValue: number;
// //   maxValue: number;
// //   rate: number;
// // }

// // interface FormState {
// //   grade: string;
// //   minValue: string;
// //   maxValue: string;
// //   rate: string;
// // }

// // const GradeRateForm: React.FC = () => {
// //   const dispatch = useAppDispatch();
// //   const gradeRatesState = useAppSelector((state) => state.gradeRate);

// //   const { loading, error, gradeRates } = gradeRatesState;

// //   console.log(`gradeRates: ${JSON.stringify(gradeRates)}`);

// //   const [formState, setFormState] = useState<FormState>({
// //     grade: '',
// //     minValue: '',
// //     maxValue: '',
// //     rate: '',
// //   });

// //   let [localGradeRates, setLocalGradeRates] = useState<GradeRate[]>([]);
// //   let [addFlag, setAddFlag] = useState<string>('');
// //   let [editFlag, setEditFlag] = useState<string>('');
// //   let [delFlag, setDelFlag] = useState<string>('');
// //   let [errorFlag, setErrorFlag] = useState<string>('');

// //   useEffect(() => {
// //     populateListView();
// //   }, [dispatch]);


// // useEffect(() => {
// //   populateListView();
// // }, [dispatch]);

// // const populateListView = async () => {
// //   try {
// //     const response = await dispatch(fetchGradeRates()).unwrap();

// //     console.log(`after dispatch(fetchGradeRates()).unwrap(), response.data: ${JSON.stringify(response.data)}`);

// //     if (response.data && Array.isArray(response.data)) {
// //       const formattedGradeRates = response.data.map((gr: GradeRate | any) => ({
// //         grade: gr.grade,
// //         minValue: parseFloat(gr.minValue), // Ensure minValue is a number
// //         maxValue: parseFloat(gr.maxValue), // Ensure maxValue is a number
// //         rate: parseFloat(gr.rate),       // Ensure rate is a number
// //       }));

// //       setLocalGradeRates(formattedGradeRates);
// //       //setGradeRates(formattedGradeRates); // Assuming you have a setter for gradeRates in the state
// //     }
// //   } catch (error) {
// //     console.error('Error fetching grade rates:', error);
// //   }
// // };


// //   const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
// //     const { name, value } = event.target;

// //     setFormState((prevFormState) => ({
// //       ...prevFormState,
// //       [name]: value,
// //     }));
// //   };

// //   const handleAdd = async () => {
// //     try {
// //       if (!formState.grade) {
// //         throw new Error('Enter the grade');
// //       }
// //       if (isNaN(parseFloat(formState.minValue))) {
// //         throw new Error('Enter a valid Minimum Value');
// //       }
// //       if (isNaN(parseFloat(formState.maxValue))) {
// //         throw new Error('Enter a valid Maximum Value');
// //       }
// //       if (isNaN(parseFloat(formState.rate))) {
// //         throw new Error('Enter a valid rate');
// //       }

// //       const gradeRate: GradeRate = {
// //         grade: formState.grade,
// //         minValue: parseFloat(formState.minValue),
// //         maxValue: parseFloat(formState.maxValue),
// //         rate: parseFloat(formState.rate),
// //       };

// //       const response = await dispatch(createGradeRate(gradeRate)).unwrap();
// //       setAddFlag(response.message);

// //       populateListView();
// //       setFormState({ grade: '', minValue: '', maxValue: '', rate: '' });
// //     } catch (error) {
// //       console.error('Error adding grade rate:', error);
// //       errorFlag = 'Error in adding a record';
// //       setErrorFlag('Error in adding a record');
// //     }
// //   };

// //   const handleEdit = async () => {
// //     try {
// //       if (!formState.grade) {
// //         throw new Error('Enter the grade');
// //       }
// //       if (isNaN(parseFloat(formState.minValue))) {
// //         throw new Error('Enter a valid Minimum Value');
// //       }
// //       if (isNaN(parseFloat(formState.maxValue))) {
// //         throw new Error('Enter a valid Maximum Value');
// //       }
// //       if (isNaN(parseFloat(formState.rate))) {
// //         throw new Error('Enter a valid rate');
// //       }

// //       const gradeRate: GradeRate = {
// //         grade: formState.grade,
// //         minValue: parseFloat(formState.minValue),
// //         maxValue: parseFloat(formState.maxValue),
// //         rate: parseFloat(formState.rate),
// //       };

// //       const formattedGradeRate = {
// //         grade: gradeRate.grade,
// //         minValuex: gradeRate.minValue, // Correct the typo if necessary, otherwise ensure this property exists
// //         maxValuex: gradeRate.maxValue, // Correct the typo if necessary, otherwise ensure this property exists
// //         data: {
// //           grade: gradeRate.grade,
// //           minValue: gradeRate.minValue,
// //           maxValue: gradeRate.maxValue,
// //           rate: gradeRate.rate,
// //         },
// //       };



// //       const response = await dispatch(updateGradeRate(formattedGradeRate)).unwrap();
// //       setEditFlag(response.message);

// //       populateListView();
// //       setFormState({ grade: '', minValue: '', maxValue: '', rate: '' });
// //     } catch (error) {
// //       console.error('Error editing grade rate:', error);
// //       setEditFlag('Error in editing a record');
// //     }
// //   };

// //   const handleDelete = async () => {
// //     try {
// //       if (!formState.grade) {
// //         throw new Error('Enter the grade');
// //       }

// //       const response = await dispatch({
// //         type: `gradeRate/deleteGradeRate`,
// //         payload: {
// //           grade: formState.grade,
// //           minValue: parseFloat(formState.minValue),
// //           maxValue: parseFloat(formState.maxValue),
// //         },
// //       });

// //       console.log('response: ', response);
// //       delFlag = 'Grade rate deleted successfully';  
// //       setDelFlag(delFlag);
// //       populateListView();
// //       setFormState({ grade: '', minValue: '', maxValue: '', rate: '' });
// //     } catch (error) {
// //       console.error('Error deleting grade rate:', error);
// //       setDelFlag('Error in deleting record');
// //     }
// //   };

// //   const handleSelectGradeRate = (event: React.MouseEvent<HTMLElement>) => {
// //     const selectedGrade = event.currentTarget.getAttribute('data-grade');
// //     if (selectedGrade) {
// //       const selectedRecord = gradeRates.find((gr) => gr.grade === selectedGrade);
// //       if (selectedRecord) {
// //         setFormState({
// //           grade: selectedRecord.grade,
// //           minValue: selectedRecord.minValue.toString(),
// //           maxValue: selectedRecord.maxValue.toString(),
// //           rate: selectedRecord.rate.toString(),
// //         });
// //       }
// //     }
// //   };

// //   if (loading) {
// //     return <p>Loading...</p>;
// //   }

// //   if (error) {
// //     return <p>Error: {error}</p>;
// //   }

// //   return (
// //     <Container>
// //       <Row className="justify-content-center">
// //         <Col xs={12} md={8}>
// //           <h1 className="text-center text-primary">Grade Rates Data Entry</h1>
// //           <p className="text-center text-info">CALIBRATE FEE FIXING GRADES</p>
// //           <p className="text-center text-danger">MARCORY MUNICIPAL ASSEMBLY</p>
// //           <Form>
// //             <Form.Group className="mb-3">
// //               <Form.Label>Grade:</Form.Label>
// //               <Form.Control
// //                 type="text"
// //                 name="grade"
// //                 value={formState.grade}
// //                 onChange={handleInputChange}
// //                 placeholder="Enter Grade"
// //               />
// //             </Form.Group>
// //             <Form.Group className="mb-3">
// //               <Form.Label>Minimum Value:</Form.Label>
// //               <Form.Control
// //                 type="text"
// //                 name="minValue"
// //                 value={formState.minValue}
// //                 onChange={handleInputChange}
// //                 placeholder="Enter Minimum Value"
// //               />
// //             </Form.Group>
// //             <Form.Group className="mb-3">
// //               <Form.Label>Maximum Value:</Form.Label>
// //               <Form.Control
// //                 type="text"
// //                 name="maxValue"
// //                 value={formState.maxValue}
// //                 onChange={handleInputChange}
// //                 placeholder="Enter Maximum Value"
// //               />
// //             </Form.Group>
// //             <Form.Group className="mb-3">
// //               <Form.Label>Rate:</Form.Label>
// //               <Form.Control
// //                 type="text"
// //                 name="rate"
// //                 value={formState.rate}
// //                 onChange={handleInputChange}
// //                 placeholder="Enter Rate"
// //               />
// //             </Form.Group>
// //             <div className="d-flex justify-content-between">
// //               <Button variant="primary" onClick={handleAdd}>
// //                 Add New Record
// //               </Button>
// //               <Button variant="warning" onClick={handleEdit}>
// //                 Edit Old Record
// //               </Button>
// //               <Button variant="danger" onClick={handleDelete}>
// //                 Delete
// //               </Button>
// //               <Button variant="info" onClick={populateListView}>
// //                 Load Spreadsheet
// //               </Button>
// //               <Link to="/main" className="primary m-3">
// //                 Go Back
// //               </Link>
// //             </div>
// //             {addFlag && <p className="text-success mt-2">{addFlag}</p>}
// //             {editFlag && <p className="text-success mt-2">{editFlag}</p>}
// //             {delFlag && <p className="text-success mt-2">{delFlag}</p>}
// //             {errorFlag && <p className="text-danger mt-2">{errorFlag}</p>}
// //           </Form>
// //           <Table striped bordered hover className="mt-3">
// //             <thead>
// //               <tr>
// //                 <th>GRADE</th>
// //                 <th>MINIMUM VALUE</th>
// //                 <th>MAXIMUM VALUE</th>
// //                 <th>RATE</th>
// //               </tr>
// //             </thead>
// //             <tbody>
// //               {localGradeRates.map((gr: GradeRate | any, index: number) => (
// //                 <tr key={index} data-grade={gr.grade} onClick={handleSelectGradeRate}>
// //                   <td>{gr.grade}</td>
// //                   <td>{gr.minValue.toString()}</td> 
// //                   <td>{gr.maxValue.toString()}</td> {/* Convert maxValue to string */}
// //                   <td>{gr.rate.toString()}</td>
// //                 </tr>
// //               ))}
// //             </tbody>
// //           </Table>
// //         </Col>
// //       </Row>
// //     </Container>
// //   );
// // };

// // export default GradeRateForm;









