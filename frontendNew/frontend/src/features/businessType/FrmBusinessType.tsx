import React, { useState, useEffect } from 'react';
import { useAppDispatch } from '../../app/store';
import { Container, Form, Button, Row, Col, Table } from 'react-bootstrap';
import { fetchBusinessTypes, createBusinessType, deleteBusinessType } from './businessTypeSlice'
import { Link } from 'react-router-dom';

interface BusinessType {
    business_type: string;
}

const FrmBusinessType: React.FC = () => {
    const [businessType, setBusinessType] = useState<string>('');
    const [localBusinessTypes, setLocalBusinessTypes] = useState<BusinessType[]>([]);
    let [isDeleting, setIsDeleting] = useState(false);

    const dispatch = useAppDispatch();

    useEffect(() => {
        const fetchAreas = async () => {
            try {
                const result = await dispatch(fetchBusinessTypes()).unwrap();
                console.log('Fetched electoral areas:', result); // Log the result
                // Check if result is an array
                if (Array.isArray(result.data)) {
                    setLocalBusinessTypes(result.data);
                } else {
                    console.error('Expected an array, but received:', result.data);
                    setLocalBusinessTypes([]);
                }
            } catch (error) {
                console.error('Error fetching business types:', error);
            }
        };
    
        fetchAreas();
    }, [dispatch]);

    const handleBusinessTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBusinessType(e.target.value);
    };

    const handleAddClick = async () => {
        console.log("Add clicked");

        if (!businessType) {
            alert("Enter a business type");
            return;
        }

        try {
            // Dispatch the createBusinessType thunk
            const response = await dispatch(createBusinessType(businessType)).unwrap();

            alert(`Record successfully added: ${response.message}`); // Assuming response is successful
            setBusinessType('');
            // Refresh the list of electoral areas
            const result = await dispatch(fetchBusinessTypes()).unwrap();
            setLocalBusinessTypes(result.data);
        } catch (error) {
            console.error("Error adding business type", error);
            alert("Error in adding a record");
        }
    };

    const handleDeleteClick = async () => {
        console.log("Delete clicked, handleDeleteClick");
        console.log(businessType);

        if (!businessType) {
            alert("Enter a business type");
            return;
        }

        try {
            const response = await dispatch(deleteBusinessType(businessType)).unwrap();

            if (response.success) {
                alert(response.message);
                setBusinessType('');
    
                // Optimistically remove the electoral area
                setLocalBusinessTypes(prevAreas => 
                    prevAreas.filter(area => area.business_type !== businessType)
                );
    
                // Optionally refresh the list
                // const result = await dispatch(fetchElectoralAreas()).unwrap();
                // setLocalElectoralAreas(result);
            } else {
                alert("Record does not exist");
            }
        } catch (error) {
            console.error("Error deleting business type", error);
            alert("Error in deleting a record");
        } finally {
            isDeleting = false; // Prevent multiple clicks
            setIsDeleting(isDeleting); // Prevent multiple clicks
        }
    };

    // const handleExitClick = () => {
    //     // Hide the form and show main form (this can be handled via routing)
    //     console.log("Exit button clicked");
    //     // For example, you might navigate to another route here
    //     // history.push('/main-form');
    // };

    const handleRowClick = (bussType: BusinessType) => {
        setBusinessType(bussType.business_type);
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
                            onChange={handleBusinessTypeChange}
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
                    <Button variant="danger" onClick={handleDeleteClick}>
                        Delete Old Record
                    </Button>
                </Col>
            </Row>
            <Row className="mt-3">
                <Col>
                    <h2>List of Business Types</h2>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Business Type</th>
                            </tr>
                        </thead>
                        <tbody>
                            {localBusinessTypes.map((bussType, index) => (
                                <tr key={index} onClick={() => handleRowClick(bussType)}>
                                    <td>{bussType.business_type}</td>
                                </tr>
                            ))}
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

