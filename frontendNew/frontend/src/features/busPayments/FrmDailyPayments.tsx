import React, { useState, useEffect } from 'react';
import { Form, FormGroup, Label, Input, Button, Alert } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';

// interface Business {
//     buss_no: string;
//     electroral_area: string;
//     buss_type: string;
// }

// interface Payment {
//     transdate: string;
// }

interface ReportResponse {
    success: boolean;
    message: string;
}

const DailyPayments: React.FC = () => {
    const [zone, setZone] = useState<string>('');
    const [bussType, setBussType] = useState<string>('');
    const [firstDate, setFirstDate] = useState<string>('');
    const [lastDate, setLastDate] = useState<string>('');
    const [zones, setZones] = useState<string[]>([]);
    const [bussTypes, setBussTypes] = useState<string[]>([]);
    const [paymentDates, setPaymentDates] = useState<string[]>([]);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Update business zones in payments
                await fetch('/api/update-business-zones', { method: 'POST' });

                // Fetch zones
                const zonesResponse = await fetch('/api/zones');
                const zonesData = await zonesResponse.json();
                setZones(zonesData);

                // Fetch payment dates
                const paymentDatesResponse = await fetch('/api/payment-dates');
                const paymentDatesData = await paymentDatesResponse.json();
                setPaymentDates(paymentDatesData);
            } catch (error: any) {
                setError(error.message);
            }
        };

        fetchData();
    }, []);

    const fetchBussTypes = async () => {
        if (!zone) {
            setError("Select a zone");
            return;
        }

        try {
            const response = await fetch(`/api/business-types?zone=${zone}`);
            const data = await response.json();
            setBussTypes(data);
        } catch (error: any) {
            setError(error.message);
        }
    };

    const handleZoneChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedZone = e.target.value;
        setZone(selectedZone);

        // Fetch business types based on the selected zone
        fetchBussTypes();
    };

    const handleFirstDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedDate = e.target.value;
        setFirstDate(selectedDate);
    };

    const handleLastDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedDate = e.target.value;
        setLastDate(selectedDate);
    };

    const handleViewClick = async () => {
        try {
            const response = await fetch('/api/produce-report', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ firstDate, lastDate, zone, bussType, posted: false }),
            });

            const data: ReportResponse = await response.json();
            if (data.success) {
                window.location.href = '/reports/daily-zones-payments'; // Redirect to report page
                setError('');
            } else {
                setError(data.message);
            }
        } catch (error: any) {
            setError(error.message);
        }
    };

    const handleProduceReportClick = async () => {
        try {
            const response = await fetch('/api/produce-report', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ firstDate, lastDate, zone, bussType, posted: true }),
            });

            const data: ReportResponse = await response.json();
            if (data.success) {
                window.location.href = '/reports/daily-zones-payments'; // Redirect to report page
                setError('');
            } else {
                setError(data.message);
            }
        } catch (error: any) {
            setError(error.message);
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
            <h1 className="text-center text-underline">Produce Daily Payments Report</h1>
            <h2 className="text-center">MARCORY MUNICIPAL ASSEMBLY</h2>
            <Form>
                <FormGroup>
                    <Label for="zone" className="font-weight-bold">Electoral Area:</Label>
                    <Input type="select" name="zone" id="zone" value={zone} onChange={handleZoneChange}>
                        <option value="">Select Zone</option>
                        {zones.map((z) => (
                            <option key={z} value={z}>{z}</option>
                        ))}
                    </Input>
                </FormGroup>
                <FormGroup>
                    <Label for="bussType" className="font-weight-bold">Business Type/Profession:</Label>
                    <Input type="select" name="bussType" id="bussType" value={bussType} onChange={(e) => setBussType(e.target.value)}>
                        <option value="">Select Business Type</option>
                        {bussTypes.map((bt) => (
                            <option key={bt} value={bt}>{bt}</option>
                        ))}
                    </Input>
                </FormGroup>
                <FormGroup>
                    <Label for="firstDate" className="font-weight-bold">First Payment Date:</Label>
                    <Input type="select" name="firstDate" id="firstDate" value={firstDate} onChange={handleFirstDateChange}>
                        <option value="">Select Date</option>
                        {paymentDates.map((date) => (
                            <option key={date} value={date}>{date}</option>
                        ))}
                    </Input>
                </FormGroup>
                <FormGroup>
                    <Label for="lastDate" className="font-weight-bold">Last Payment Date:</Label>
                    <Input type="select" name="lastDate" id="lastDate" value={lastDate} onChange={handleLastDateChange}>
                        <option value="">Select Date</option>
                        {paymentDates.map((date) => (
                            <option key={date} value={date}>{date}</option>
                        ))}
                    </Input>
                </FormGroup>
                <FormGroup>
                    <div className="d-flex justify-content-between">
                        <Button color="primary" onClick={handleViewClick}>Produce Report (unposted payments)</Button>
                        <Button color="success" onClick={handleProduceReportClick}>Produce Report (posted payments)</Button>
                        <Button color="danger" onClick={handleExitClick}>Exit</Button>
                    </div>
                </FormGroup>
            </Form>
            
                <Link to="/main" className="primary m-3">
                    Go Back
                </Link>
              
        </div>
    );
};

export default DailyPayments;
