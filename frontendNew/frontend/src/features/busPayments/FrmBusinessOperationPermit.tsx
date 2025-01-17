import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Table } from 'react-bootstrap';
import axios from 'axios';

interface Officer {
    officer_no: string;
    officer_name: string;
}

interface Property {
    buss_no: string;
    buss_name: string;
    propertyuse: string;
    propertytype: string;
    propertyclass: string;
    electroral_area: string;
    landmark: string;
    street_name: string;
    lattitude: string;
    longitude: string;
    code: string;
    elevation: string;
    rate: string;
    propertyuserate: number;
    propertytyperate: number;
    propertyclassrate: number;
    assessmentby: string;
    current_rate: number;
    balancenew: number;
    status: string;
}

interface FiscalYear {
    fiscalyear: number;
}

interface ElectoralArea {
    electroral_area: string;
}

//type FormControlElement = HTMLSelectElement | HTMLInputElement;

const BusinessOperatingPermit: React.FC = () => {
    // @ts-ignore
    const [officers, setOfficers] = useState<Officer[]>([]);
    const [properties, setProperties] = useState<Property[]>([]);
    const [fiscalYears, setFiscalYears] = useState<FiscalYear[]>([]);
    const [electoralAreas, setElectoralAreas] = useState<ElectoralArea[]>([]);

    const [fiscalYear, setFiscalYear] = useState<number>(0);
    const [electoralArea, setElectoralArea] = useState<string>('');
    //const [balance, setBalance] = useState<number>(0);

    useEffect(() => {
        fetchOfficers();
        fetchProperties();
        fetchFiscalYears();
        fetchElectoralAreas();
    }, []);

    const fetchOfficers = async () => {
        try {
            const response = await axios.get<Officer[]>('/api/officers');
            setOfficers(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchProperties = async () => {
        try {
            const response = await axios.get<Property[]>('/api/properties');
            setProperties(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchFiscalYears = async () => {
        try {
            const response = await axios.get<FiscalYear[]>('/api/fiscal-years');
            setFiscalYears(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchElectoralAreas = async () => {
        try {
            const response = await axios.get<ElectoralArea[]>('/api/electoral-areas');
            setElectoralAreas(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleElectoralAreaChange = (event: React.ChangeEvent<HTMLElement>) => {
        const target = event.target as HTMLSelectElement;
        const selectedElectoralArea = target.value;
        setElectoralArea(selectedElectoralArea);
    };

    const handleFiscalYearChange = (event: React.ChangeEvent<HTMLInputElement >) => {
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

        try {
            // Fetch properties based on electoral area
            const propertiesResponse = await axios.get<Property[]>('/api/properties', { params: { electoral_area: electoralArea } });
            const propertiesData = propertiesResponse.data;

            if (propertiesData.length === 0) {
                alert("No records found in this electoral area");
                return;
            }

            // Calculate and update balances
            for (const property of propertiesData) {
                const balanceBF = await findBalanceBF(property.buss_no);
                const recBussCurrlance = await axios.post('/api/update-balance', {
                    buss_no: property.buss_no,
                    fiscalyear: fiscalYear,
                    balancebf: balanceBF
                });

                // Update current_rate and balancenew in tb_business
                await axios.post('/api/update-property', {
                    buss_no: property.buss_no,
                    current_rate: recBussCurrlance.data.current_balance,
                    balancenew: balanceBF
                });
            }

            // Clear temporary tables
            await axios.post('/api/clear-temp-tables');

            // Insert data into temporary tables
            await axios.post('/api/insert-temp-data', {
                electoral_area: electoralArea,
                fiscalyear: fiscalYear
            });

            // Open the report file
            const reportResponse = await axios.get('/api/report');
            if (reportResponse.data.length === 0) {
                alert("No paid businesses found");
                return;
            }

            alert("Processing completed");
        } catch (error) {
            console.error(error);
            alert("Error in processing demand notices");
        }
    };

    const findBalanceBF = async (bussNo: string): Promise<number> => {
        try {
            const varPrevFiscalYear = new Date().getFullYear() - 1;

            // Find all payments
            const paymentsResponse = await axios.get<number>('/api/payments', { params: { buss_no: bussNo } });
            const varPrevPayments = paymentsResponse.data || 0;

            // Find all billings
            const billingsResponse = await axios.get<number>('/api/billings', { params: { buss_no: bussNo, fiscalyear: varPrevFiscalYear } });
            const varPrevBalances = billingsResponse.data || 0;

            return varPrevBalances - varPrevPayments;
        } catch (error) {
            console.error(error);
            alert("Error in finding balance");
            return 0;
        }
    };

    const handleExit = () => {
        // Logic to exit and show main menu
        window.close();
    };

    return (
        <Container>
            <Row>
                <Col className="text-center mt-3">
                    <h2 className="text-primary">Business Operating Permit Demand Notice</h2>
                    <h4 className="text-info">MARCORY MUNICIPAL ASSEMBLY</h4>
                </Col>
            </Row>
            <Row className="mt-3">
                <Col>
                    <Form.Label className="font-weight-bold">Electoral Area:</Form.Label>
                    <Form.Control as="select" value={electoralArea !== null ? electoralArea : ""} onChange={handleElectoralAreaChange}>
                        <option value="">Select...</option>
                        {electoralAreas.map(area => (
                            <option key={area.electroral_area} value={area.electroral_area}>
                                {area.electroral_area}
                            </option>
                        ))}
                    </Form.Control>
                </Col>
                <Col className="mt-3">
                    <Form.Label className="font-weight-bold">Fiscal Year:</Form.Label>
                    <Form.Control 
                        as="select" 
                        value={fiscalYear !== null ? fiscalYear : 0} 
                        onChange={handleFiscalYearChange}>
                        <option value={0}>Select...</option>
                        {fiscalYears.map(year => (
                            <option key={year.fiscalyear} value={year.fiscalyear}>
                                {year.fiscalyear}
                            </option>
                        ))}
                    </Form.Control>
                </Col>
            </Row>
            {/* <Row className="mt-3">
                <Col className="mt-3">
                    <Form.Label className="font-weight-bold">Balance:</Form.Label>
                    <Form.Control type="number" step="0.01" value={balanceBf !== null ? balanceBf : 0} readOnly />
                </Col>
            </Row> */}
            <Row className="mt-3">
                <Col className="text-center">
                    <Button variant="primary" onClick={handlePreviewDemandNotices}>
                        Preview Demand Notices
                    </Button>
                </Col>
                <Col className="text-center">
                    <Button variant="primary" onClick={handleExit}>
                        Exit
                    </Button>
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
                                <th>BUSS TYPE</th>
                                <th>PERMIT NO</th>
                                <th>STREET NAME</th>
                                <th>LANDMARK</th>
                                <th>ELECTORAL AREA</th>
                                <th>PROPERTY CLASS</th>
                                <th>GRADE</th>
                                <th>OWNER</th>
                                <th>TEL NO</th>
                                <th>OFFICER NO</th>
                                <th>TRANSDATE</th>
                                <th>STATUS</th>
                                <th>SERIALNO</th>
                                <th>CURRENT RATE</th>
                                <th>PROPERTY RATE</th>
                            </tr>
                        </thead>
                        <tbody>
                            {properties.map(property => (
                                <tr key={property.buss_no}>
                                    <td>{property.buss_no}</td>
                                    <td>{property.buss_name}</td>
                                    <td>{property.propertyuse}</td>
                                    <td>{property.buss_no}</td>
                                    <td>{property.street_name}</td>
                                    <td>{property.landmark}</td>
                                    <td>{property.electroral_area}</td>
                                    <td>{property.propertyclass}</td>
                                    <td>{property.assessmentby}</td>
                                    <td>{property.buss_no}</td>
                                    <td>{property.status}</td>
                                    <td>{property.buss_no}</td>
                                    <td>{property.current_rate.toFixed(2)}</td>
                                    <td>{parseFloat(property.rate).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Col>
            </Row>
        </Container>
    );
};

export default BusinessOperatingPermit;
