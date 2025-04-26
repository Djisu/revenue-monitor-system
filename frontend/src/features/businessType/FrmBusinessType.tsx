import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/store';
import { fetchBusinessTypes, createBusinessType, deleteBusinessType } from './businessTypeSlice';
import { Link } from 'react-router-dom';
import { Container, Form, Button, Row, Col, Table } from 'react-bootstrap';

export interface BusinessTypeData {
    business_type: string; // Updated to match API response
}

const FrmBusinessType: React.FC = () => {
    const [businessType, setBusinessType] = useState('');
    const [businessTypesData, setBusinessTypesData] = useState<BusinessTypeData[]>([]);
    const [isDeleting, setIsDeleting] = useState(false);
    const dispatch = useAppDispatch();

    const { businessTypes, loading, error } = useAppSelector((state) => state.businessType);
    console.log("businessTypes from useAppSelector:", businessTypes);

    useEffect(() => {
        const fetchAndSetBusinessTypes = async () => {
            try {
                const response = await dispatch(fetchBusinessTypes()).unwrap();
                setBusinessTypesData(response);
                console.log("Fetched business types:", response);
            } catch (error: any) {
                console.error("Error fetching business types", error);
                alert("Error in fetching business types");
            }
        };

        fetchAndSetBusinessTypes();
    }, [dispatch]);

    // const handleBusinessTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     setBusinessType(e.target.value);
    //     console.log("Business type input:", e.target.value); // Debugging statement
    // };

    const handleAddClick = async () => {
        console.log("Add clicked");
    
        if (!businessType.trim()) {
            alert("Enter a business type");
            return;
        }
    
        try {
            // Dispatching an object with Business_Type
            const response = await dispatch(createBusinessType(businessType)).unwrap();

            console.log("Added business type:", response.message); // Debugging statement

            alert(`Record successfully added: ${response.message}`);
            setBusinessType(''); // Reset the input field
            // Refresh the list of business types
            await dispatch(fetchBusinessTypes()).unwrap();
        } catch (error) {
            console.error("Error adding business type", error);
            alert("Error in adding a record");
        }
    };

    const handleDeleteClick = async () => {
        console.log("Delete clicked");
    
        if (!businessType.trim()) {
            alert("Enter a business type to delete");
            return;
        }
    
        setIsDeleting(true); // Set deleting state to true
        try {
            // Dispatching an object with Business_Type
            const response = await dispatch(deleteBusinessType(businessType)).unwrap();
            console.log("Deleted business type:", response.message); // Debugging statement
    
            if (response.success) {
                alert(response.message);
                // Refresh the list of business types
                await dispatch(fetchBusinessTypes()).unwrap();
            } else {
                alert("Record does not exist");
            }
        } catch (error) {
            console.error("Error deleting business type", error);
            alert("Error in deleting a record");
        } finally {
            setIsDeleting(false); // Reset deleting state
        }
    };

    const handleRowClick = (bussType: any) => {
        console.log("Row clicked:", bussType);
        const businessTypeValue = bussType.business_type; 

        console.log("Business type value:", businessTypeValue);
    
        if (businessTypeValue) {
            setBusinessType(businessTypeValue); // Set the state with the correct value
        } else {
            console.error("Business type is undefined or null");
        }
    };

    const renderBusinessTypes = (businessTypes: any) => {
        console.log("Rendering businessTypes:", businessTypes);
        
        return businessTypes.map((bussType: any, index: number) => (
            <tr key={index}onClick={() => handleRowClick(bussType)}>
                <td className="business-type-row">{bussType.Business_Type}</td>
            </tr>
        ));
    };

    return (
        <Container fluid>
            <Row className="mb-3">
                <Col>
                    <h1 className="text-center text-primary">MARCORY MUNICIPAL ASSEMBLY</h1>
                </Col>
            </Row>
            <Row>
                <Col>
                    <h3 className="text-center text-danger">BUSINESS TYPE DATA ENTRY</h3>
                </Col>
            </Row>
            <Row className="mt-3">
                <Col>
                    <Form.Group controlId="formBusinessType">
                        <Form.Label>Business Type:</Form.Label>
                        <Form.Control
                            type="text"
                            value={businessType}
                            onChange={(e) => setBusinessType(e.target.value)}
                            required
                        />
                    </Form.Group>
                </Col>
            </Row>
            <Row className="mt-3">
                <Col>
                    <Button variant="primary" onClick={handleAddClick}>
                        Add New Record
                    </Button>
                </Col>
                <Col>
                    <Button variant="danger" onClick={handleDeleteClick} disabled={isDeleting}>
                        Delete Old Record
                    </Button>
                </Col>
            </Row>
            <Row className="mt-3">
                <Col>
                    <h2>List of Business Types</h2>
                    {loading && <p>Loading...</p>}
                    {error && <p>Error: {error}</p>}
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Business Type</th>
                            </tr>
                        </thead>
                        <tbody>                              
                                {businessTypesData.length > 0 ? (
                                      renderBusinessTypes(businessTypes)
                            ) : (
                                <tr>
                                    <td colSpan={1}>No business types available.</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </Col>
            </Row>
            <Row className="mt-3">
                <Col>
                    <Link to="/main" className="primary m-3">
                        Go Back
                    </Link>
                </Col>
            </Row>
        </Container>
    );
};

export default FrmBusinessType;








// import React, { useState, useEffect } from 'react';
// import { useAppDispatch, useAppSelector } from '../../app/store';
// import { fetchBusinessTypes, createBusinessType, deleteBusinessType } from './businessTypeSlice';
// import { Link } from 'react-router-dom';
// import { Container, Form, Button, Row, Col, Table } from 'react-bootstrap';


// // interface BusinessTypeData {
// //     business_Type: string;
// // }

// // Define the interface for the component state
// // interface BusinessTypeState {
// //     businessTypes: BusinessTypeData[];
// // }

// interface BusinessType {
//     Business_Type: string;
// }


// const FrmBusinessType: React.FC = () => {
//     const [businessTypeList, setBusinessTypeList] = useState<BusinessType[]>([]);
//     const [buss_type, setBuss_type] = useState('')
//     const [isDeleting, setIsDeleting] = useState(false);
//     const dispatch = useAppDispatch();

//     const { businessTypes, loading, error } = useAppSelector((state) => state.businessType);

// console.log("businessTypes from useAppSelector:", businessTypes)


//     useEffect(() => {
//         const fetchAndSetBusinessTypes = async () => {
//             try {
//                 const response = await dispatch(fetchBusinessTypes()).unwrap();
//                 setBusinessTypeList(response.map(bussType => bussType.Business_Type))

//                 console.log("Fetched business types:", response); // Debugging statement
//             } catch (error: any) {
//                 console.error("Error fetching business types", error);

//                 alert("Error in fetching business types");
//             }
//         };

//         fetchAndSetBusinessTypes();
//     }, [dispatch]);

//     const handleBusinessTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         setBuss_type(e.target.value);
//         console.log("Business type list:", businessTypeList); // Debugging statement
//     };

//     const handleAddClick = async () => {
//         console.log("Add clicked");

//         if (businessTypeList.length === 0) {
//             alert("Enter a business type");
//             return;
//         }

//         try {
//             const response = await dispatch(createBusinessType(buss_type)).unwrap();
//             console.log("Added business type:", response.message); // Debugging statement

//             alert(`Record successfully added: ${response.message}`);

//             setBusinessTypeList([]); // Reset the state to an empty array

//             // Refresh the list of business types
//             const result = await dispatch(fetchBusinessTypes()).unwrap();

//             console.log("Refreshed business types:", result.data); // Debugging statement
//         } catch (error) {
//             console.error("Error adding business type", error);
//             alert("Error in adding a record");
//         }
//     };

// const handleDeleteClick = async () => {
//         console.log("Delete clicked, handleDeleteClick");
//         console.log(businessTypeList);

//         if (!businessTypeList) {
//             alert("Enter a business type");
//             return;
//         }

//         setIsDeleting(true); // Set deleting state to true
//         try {
//             const response = await dispatch(deleteBusinessType(buss_type)).unwrap();
//             console.log("Deleted business type:", response.message); // Debugging statement

//             if (response.success) {
//                 alert(response.message);
//                 setBusinessTypeList([]);
//                 // Optimistically remove the business type
//                 setBusinessTypeList(prevTypes => 
//                     prevTypes.filter(type => type !== businessTypeList[0])
//                 );
//             } else {
//                 alert("Record does not exist");
//             }
//         } catch (error) {
//             console.error("Error deleting business type", error);
//             alert("Error in deleting a record");
//         } finally {
//             setIsDeleting(false); // Reset deleting state
//         }
//     };

//     const handleRowClick = (bussType: any) => {
//         console.log("Row clicked:", bussType);
//         //setBusinessTypeList(prevList => [...prevList, bussType.business_Type]);
//         setBusinessTypeList([bussType.Business_Type]);
//     };

//     if (loading){
//         <div>Loading...</div>
//     }

//     if (error){
//         <div>Error: {error}</div>
//     }


//     return (
//         <Container fluid>
//             <Row className="mb-3">
//                 <Col>
//                     <h1 className="text-center text-primary">MARCORY MUNICIPAL ASSEMBLY</h1>
//                 </Col>
//             </Row>
//             <Row>
//                 <Col>
//                     <h3 className="text-center text-danger">BUSINESS TYPE DATA ENTRY</h3>
//                 </Col>
//             </Row>
//             <Row className="mt-3">
//                 <Col>
//                     <Form.Group controlId="formBusinessType">
//                         <Form.Label>Business Type:</Form.Label>
//                         <Form.Control
//                             type="text"
//                             value={buss_type}
//                             onChange={handleBusinessTypeChange}
//                             required
//                         />
//                     </Form.Group>
//                 </Col>
//             </Row>
//             <Row className="mt-3">
//                 <Col>
//                     <Button variant="primary" onClick={handleAddClick}>
//                         Add New Record
//                     </Button>
//                 </Col>
//                 <Col>
//                     <Button variant="danger" onClick={handleDeleteClick} disabled={isDeleting}>
//                         Delete Old Record
//                     </Button>
//                 </Col>
//             </Row>
//             <Row className="mt-3">
//                 <Col>
//                     <h2>List of Business Types</h2>
//                     {loading && <p>Loading...</p>}
//                     {error && <p>Error: {error}</p>}
//                     <Table striped bordered hover>
//                         <thead>
//                             <tr>
//                                 <th>Business Type</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {businessTypes.map((bussType, index) => (
//                                 <tr  style={{ backgroundColor: 'blue' }} key={index} onClick={() => handleRowClick(bussType)}>
//                                     <td>{bussType.Business_Type}</td> 
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </Table>
//                 </Col>
//             </Row>
           
//             <Row className="mt-3">
//                 <Col>
//                     <Link to="/main" className="primary m-3">
//                         Go Back
//                     </Link>
//                 </Col>
//             </Row>
//         </Container>
//     );
// };

// export default FrmBusinessType;











