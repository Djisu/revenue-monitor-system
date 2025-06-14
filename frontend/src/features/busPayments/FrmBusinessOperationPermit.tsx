import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Table, Spinner } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../../app/store';
import { Link } from 'react-router-dom';
import { fetchBusinesses, processOperatingPermits } from '../business/businessSlice';
import { fetchElectoralAreas } from '../electoralArea/electoralAreaSlice';

const frmBusinessOperatingPermit: React.FC = () => {
    const BusinessesData = useAppSelector(state => state.business.businesses);
    const ElectoralAreasData = useAppSelector(state => state.electoralArea.electoralAreas);

    const [fiscalYear, setFiscalYear] = useState<number>(0);
    const [electoralArea, setElectoralArea] = useState<string>('');
    const [electoralAreas, setElectoralAreas] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(false); // Loading state

    const dispatch = useAppDispatch();

    // Fetch businesses and electoral areas when the component mounts
    useEffect(() => {
        dispatch(fetchBusinesses());
        dispatch(fetchElectoralAreas()); // Ensure the action creator is called
    }, [dispatch]);

    // Update electoralAreas state when ElectoralAreasData changes
    useEffect(() => {
        if (ElectoralAreasData && Array.isArray(ElectoralAreasData)) {
            setElectoralAreas(ElectoralAreasData.map(area => area.electroral_area));
            console.log('Electoral Areas Data:', ElectoralAreasData); // Debugging statement
        } else {
            console.error('Expected ElectoralAreasData to be an array but got:', ElectoralAreasData);
        }
    }, [ElectoralAreasData]);

    const handleElectoralAreaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {target} = event; //as HTMLSelectElement;
        const selectedElectoralArea = target.value;
        setElectoralArea(selectedElectoralArea);
    };
   


    const handleFiscalYearChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiscalYear = parseInt(event.target.value, 10);
        setFiscalYear(selectedFiscalYear);
    };

    const handlePreviewDemandNotices = async () => {
        if (fiscalYear === 0) {
            alert("Kindly select the fiscal year");
            return;
        }

        if (!electoralArea) {
            alert("Kindly select the electoral area");
            return;
        }

         setLoading(true); // Start loading

        try {
            const response = await dispatch(processOperatingPermits({ electoralArea, fiscalYear }));
            if (processOperatingPermits.fulfilled.match(response)) {
                alert(response.payload.message); // Assuming response contains a payload with a message
            }
        } catch (error) {
            console.error(error);
            alert("Error in processing demand notices");
        } finally {
            setLoading(false); // Stop loading
        }
    };

    return (
        <Container>
            <div>
                <Row>
                    <Col className="text-center mt-3">
                        <h2 className="text-primary">Produce Permits</h2>
                        <h4 className="text-info">MARCORY MUNICIPAL ASSEMBLY</h4>
                    </Col>
                </Row>
           
                <Row className="mt-3">
                    <Col>
                        <Form.Label className="font-weight-bold">Electoral Area:</Form.Label>
                        <Form.Control
                            as="select"
                            value={electoralArea}
                            onChange={handleElectoralAreaChange}
                        >
                            <option value="">Select...</option>
                            {electoralAreas.map(area => (
                                <option key={area} value={area}>
                                    {area}
                                </option>
                            ))}
                        </Form.Control>
                    </Col>
                  </Row>  
               
                    <Row className="mt-3">   
                        <Col className="mt-3">
                            <Form.Label className="font-weight-bold">Fiscal Year:</Form.Label>
                            <Form.Control
                                type="number"
                                value={fiscalYear.toString()}
                                onChange={handleFiscalYearChange}
                            />
                        </Col>
                    </Row>
               
                 <Row className="mt-3">
                    <Col className="text-center">
                        <Button variant="primary" onClick={handlePreviewDemandNotices}>
                            Produce Demand Notices
                        </Button>
                        {loading && (
                            <Spinner animation="border" variant="primary" className="ml-2" />
                        )}
                    </Col>
                </Row>
            
                <Row className="mt-3">
                    <Col>
                        <h3 className="font-weight-bold">List of Properties</h3>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>BUSS NO</th>
                                    <th>BUSS NAME</th>
                                </tr>
                            </thead>
                            <tbody>
                                {BusinessesData.map(property => (
                                    <tr key={property.buss_no}>
                                        <td>{property.buss_no}</td>
                                        <td>{property.buss_name}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            </div>
            <div>    
                <Row className="mt-3">
                    <Col>
                        <Link to="/main" className="primary m-3">
                            Go Back
                        </Link>
                    </Col>
                </Row>
            </div>
        </Container>
    );
};

export default frmBusinessOperatingPermit;


