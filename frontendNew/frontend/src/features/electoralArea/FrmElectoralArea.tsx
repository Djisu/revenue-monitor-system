import React, { useState, useEffect } from 'react';
import { useAppDispatch } from '../../app/store';
import { Container, Form, Button, Row, Col, Table } from 'react-bootstrap';
import { fetchElectoralAreas, createElectoralArea, deleteElectoralArea } from './electoralAreaSlice';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

interface ElectoralArea {
    electoral_area: string;
}

const FrmElectoralArea: React.FC = () => {
    const [electoralArea, setElectoralArea] = useState<string>('');
    const [localElectoralAreas, setLocalElectoralAreas] = useState<ElectoralArea[]>([]);
    let [isDeleting, setIsDeleting] = useState(false);

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAreas = async () => {
            try {
                const result = await dispatch(fetchElectoralAreas()).unwrap();
                console.log('Fetched electoral areasXXXXXXX:', result); // Log the result

                if (!Array.isArray(result)){
                    console.log('NOT AN ARRAY!!!')
                }

                // Check if result is an array
                if (Array.isArray(result)) {
                     console.log('it is an array of electoralareas');

                    setLocalElectoralAreas(result);
                    console.log('result:: ', result)
                    console.log('localElectoralAreas:: ', localElectoralAreas)
                } else {
                    console.error('Expected an array, but received:', result);
                    setLocalElectoralAreas([]);
                }
            } catch (error) {
                console.error('Error fetching electoral areas:', error);
            }
        };
    
        fetchAreas();
    }, [dispatch]);

    const handleElectoralAreaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setElectoralArea(e.target.value);
    };

    const handleAddClick = async () => {
        console.log("Add clicked");
        
        if (!electoralArea) {
            alert("Enter the electoral area");
            return;
        }
    
        try {
            // Dispatch the createElectoralArea thunk
            const response = await dispatch(createElectoralArea(electoralArea)).unwrap();
            console.log(response);

            alert("Record successfully added"); // Assuming response is successful
            setElectoralArea('');
            // Refresh the list of electoral areas
            const result = await dispatch(fetchElectoralAreas()).unwrap();
            setLocalElectoralAreas(result);
            navigate('/main');
        } catch (error: any) {
            console.error("Error adding electoral area", error);
            alert(error.message || "Error in adding a record");
        }
    };

    const handleDeleteClick = async () => {
        console.log("Delete clicked, handleDeleteClick");
        console.log(electoralArea);
    
        if (!electoralArea) {
            alert("Enter the electoral area");
            return;
        }
    
        isDeleting = true; // Prevent multiple clicks
        setIsDeleting(isDeleting); // Prevent multiple clicks
    
        try {
            const response = await dispatch(deleteElectoralArea(electoralArea)).unwrap();
    
            if (response.success) {
                alert(response.message);
                setElectoralArea('');
    
                // Optimistically remove the electoral area
                setLocalElectoralAreas(prevAreas => 
                    prevAreas.filter(area => area.electoral_area !== electoralArea)
                );
    
                // Optionally refresh the list
                // const result = await dispatch(fetchElectoralAreas()).unwrap();
                // setLocalElectoralAreas(result);
            } else {
                alert("Record does not exist");
            }
        } catch (error) {
            console.error("Error deleting electoral area", error);
            alert("Error in deleting a record");
        } finally {
            isDeleting = false; // Prevent multiple clicks
            setIsDeleting(isDeleting); // Prevent multiple clicks
        }
    };

    const handleRowClick = (area: ElectoralArea) => {
        setElectoralArea(area.electoral_area);
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
                    <h3 className="text-center text-danger">ELECTORAL AREA DATA ENTRY</h3>
                </Col>
            </Row>
            <Row className="mt-3">
                <Col>
                    <Form.Group controlId="formElectoralArea">
                        <Form.Label>Electoral Area:</Form.Label>
                        <Form.Control
                            type="text"
                            value={electoralArea}
                            onChange={handleElectoralAreaChange}
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
                        Delete
                    </Button>
                </Col>
            </Row>
            <Row className="mt-3">
                <Col>
                    <h2>List of Electoral Areas</h2>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Electoral Area</th>
                            </tr>
                        </thead>
                        <tbody>
                            {localElectoralAreas.map((area, index) => (
                                <tr key={index} onClick={() => handleRowClick(area)}>
                                    <td>{area.electoral_area}</td>
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

export default FrmElectoralArea;






