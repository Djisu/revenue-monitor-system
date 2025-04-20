import React, { useState, useEffect } from 'react';
import { Form, FormGroup, Label, Input, Button, Alert } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';

interface BusinessType {
    buss_type: string;
}

interface ReportResponse {
    success: boolean;
    message: string;
}

const BusinessTypesReport: React.FC = () => {
    const [businessType, setBusinessType] = useState<string>('');
    const [businessTypes, setBusinessTypes] = useState<string[]>([]);
    const [error, setError] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchBusinessTypes = async () => {
            try {
                const response = await fetch('/api/business-types');
                const data: BusinessType[] = await response.json();
                const types = data.map((record) => record.buss_type);
                setBusinessTypes(types);
            } catch (error: any) {
                setError(error.message);
            }
        };

        fetchBusinessTypes();
    }, []);

    // const fetchBusinessTypes = async () => {
    //     try {
    //         const response = await fetch('/api/business-types');
    //         const data: BusinessType[] = await response.json();
    //         const types = data.map((record) => record.buss_type);
    //         setBusinessTypes(types);
    //     } catch (error: any) {
    //         setError(error.message);
    //     }
    // };

    const handleBusinessTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedBusinessType = e.target.value;
        setBusinessType(selectedBusinessType);
    };

    const handleViewReportSortedByCategory = async () => {
        await handleProduceReport('sorted-by-category', false);
    };

    const handleViewReportElectoralArea = async () => {
        await handleProduceReport('electoral-area', false);
    };

    const handleViewReportCurrentRates = async () => {
        await handleProduceReport('current-rates', false);
    };

    const handleViewReportCurrentRatesActual = async () => {
        await handleProduceReport('current-rates', true);
    };

    const handleViewReportElectoralAreaActual = async () => {
        await handleProduceReport('electoral-area', true);
    };

    const handleViewReportGradeActual = async () => {
        await handleProduceReport('grade', true);
    };

    const handleProduceReport = async (reportType: string, isActual: boolean) => {
        setIsLoading(true);
        setError('');

        try {
            const response = await fetch('/api/produce-report', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ businessType, reportType, isActual }),
            });

            const data: ReportResponse = await response.json();
            if (data.success) {
                window.location.href = `/reports/${reportType}`; // Redirect to report page
            } else {
                setError(data.message);
            }
        } catch (error: any) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleExitClick = () => {
        // Logic to hide the form and show the main form
        // This can be managed by routing or state in a larger application
        window.location.href = '/'; // Redirect to main page or handle as needed
    };

    return (
        <div className="container mt-5">
            {error && <Alert color="danger">{error}</Alert>}
            <h1 className="text-center text-underline">Business Types Report</h1>
            <h2 className="text-center">MARCORY MUNICIPAL ASSEMBLY</h2>
            <Form>
                <FormGroup>
                    <Label for="businessType" className="font-weight-bold">Business Type:</Label>
                    <Input type="select" name="businessType" id="businessType" value={businessType} onChange={handleBusinessTypeChange}>
                        <option value="">Select Business Type</option>
                        {businessTypes.map((bt) => (
                            <option key={bt} value={bt}>{bt}</option>
                        ))}
                    </Input>
                </FormGroup>
                <FormGroup>
                    <div className="d-flex justify-content-between">
                        <Button color="primary" onClick={handleViewReportSortedByCategory} disabled={isLoading}>
                            {isLoading ? 'Loading...' : 'View Report (sorted by category)'}
                        </Button>
                        <Button color="success" onClick={handleViewReportElectoralArea} disabled={isLoading}>
                            {isLoading ? 'Loading...' : 'View Report (electoral area)'}
                        </Button>
                        <Button color="warning" onClick={handleViewReportCurrentRates} disabled={isLoading} style={{ display: 'none' }}>
                            {isLoading ? 'Loading...' : 'View Report (current rates)'}
                        </Button>
                        <Button color="danger" onClick={handleExitClick}>
                            Exit
                        </Button>
                    </div>
                </FormGroup>
            </Form>
            <div className="mt-5">
                <h2 className="text-center">Actual Reports</h2>
                <Form>
                    <FormGroup>
                        <div className="d-flex justify-content-between">
                            <Button color="primary" onClick={handleViewReportGradeActual} disabled={isLoading}>
                                {isLoading ? 'Loading...' : 'View Report (sorted by category)'}
                            </Button>
                            <Button color="success" onClick={handleViewReportElectoralAreaActual} disabled={isLoading}>
                                {isLoading ? 'Loading...' : 'View Report (electoral area)'}
                            </Button>
                            <Button color="warning" onClick={handleViewReportCurrentRatesActual} disabled={isLoading} style={{ display: 'none' }}>
                                {isLoading ? 'Loading...' : 'View Report (current rates)'}
                            </Button>
                            <Button color="danger" onClick={handleExitClick}>
                                Exit
                            </Button>
                        </div>
                    </FormGroup>
                </Form>
            </div>
            
            <Link to="/main" className="primary m-3">
                Go Back
            </Link>
              
        </div>
    );
};

export default BusinessTypesReport;
