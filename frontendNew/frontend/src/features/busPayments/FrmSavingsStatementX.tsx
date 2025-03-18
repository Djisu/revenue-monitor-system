import React, { useState, useEffect, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../app/store";
import { Container, Form, Button, Row, Col, Table } from "react-bootstrap";
import { fetchBusinessById } from "../business/businessSlice";
import { fetchBusPaymentByTwoDates, fetchTransSavings } from "./busPaymentsSlice";

const FrmSavingsStatementX: React.FC = () => {
  let [bussNo, setBussNo] = useState<string>("");
  let [startDate, setStartDate] = useState<string>("");
  let [endDate, setEndDate] = useState<string>("");

  let [businessName, setBusinessName] = useState<string>("");
  let [records, setRecords] = useState<any[]>([]);
  let [errorMessage, setErrorMessage] = useState<string>("");
  let [successMessage, setSuccessMessage] = useState<string>("");

  const dispatch = useAppDispatch();
  const navigate = useNavigate(); // Initialize the useNavigate hook

  useEffect(() => {
    // Set default end date to today
   // setEndDate(new Date().toLocaleDateString("en-GB"));
    }, []);

    const handleBussNoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBussNo(e.target.value);
    };

    const handleStartDateChange = (event: ChangeEvent<HTMLInputElement>) => {
        const selectedDate = event.target.value; // This should be 'YYYY-MM-DD'
        setStartDate(selectedDate); // Assuming you want to keep it in that format
    };
    
    const handleEndDateChange = (event: ChangeEvent<HTMLInputElement>) => {
        const selectedDate = event.target.value; // This should be 'YYYY-MM-DD'
        setEndDate(selectedDate); // Again, keeping it in that format
    };

    // const handleStartDateChange = (event: ChangeEvent<HTMLInputElement>) => {
    //     const formattedDate = formatDate(event.target.value);
    //     setStartDate(formattedDate);
    // };
    
    // const handleEndDateChange = (event: ChangeEvent<HTMLInputElement>) => {
    //     const formattedDate = formatDate(event.target.value);
    //     setEndDate(formattedDate);
    // };

    const handlePreviewClick = async () => {
        console.log('in handlePreviewClick')

        setSuccessMessage("");
        setErrorMessage("");
        
        if (!bussNo) {
            alert("Select a business number");
            return;
        }
    
        try {
            const response = await dispatch(fetchBusPaymentByTwoDates({
                bussNo: bussNo,
                startDate: new Date(startDate),
                endDate: new Date(endDate)
            }));
        
            if (fetchBusPaymentByTwoDates.fulfilled.match(response)) {
                const fetchedRecords = response.payload; // Get the payload directly
                console.log('fetchedRecords:', fetchedRecords);
                
                // Update records state
                setRecords(fetchedRecords);
        
                // If you want to update dates from the fetched records
                const dates = fetchedRecords.map((rec: any) => rec.transdate);
                //setDates(dates);
                console.log('dates:', dates);
        
                // Set a success message if needed
                setSuccessMessage("Payment records fetched successfully");
                const transSavingsData = await dispatch(fetchTransSavings());
                console.log('transSavingsData:', transSavingsData);

                // Update records state
                if (fetchTransSavings.fulfilled.match(transSavingsData)) {
                    const fetchedTransSavings = transSavingsData.payload; // Get the payload directly
                    console.log('fetchedTransSavings:', fetchedTransSavings);
                    // Update records state
                    setRecords(fetchedTransSavings);
                } else {
                    throw new Error('Failed to fetch bus payments');
                }
            } else {
                throw new Error('Failed to fetch bus payments');
            }
        } catch (error) {
            console.error("Error fetching dates", error);
            setErrorMessage("Error fetching payment records. Please try again.");
            alert("No payment records found for the selected dates");
        }
    };

    const getBusiness = async (businessNo: string) => {
        console.log('in getBusiness')
    
        try {
          const response = await dispatch(fetchBusinessById(Number(businessNo))).unwrap();
          
          console.log('Response from slice:', response.data)
    
           if ( response) {
             console.log('there is response:', response.data);
    
            setBusinessName(response.data.buss_name);
            console.log(businessName)
         }else{
          console.log('data not found')
         }
        } catch (error: any) {
          console.error('Error fetching business:', error);
          errorMessage = 'Error fetching business. Please try again.' 
          
          setErrorMessage(errorMessage);
        }
    };

    // const formatDate = (dateString: string): string => {
    //     const [day, month, year] = dateString.split("/");
    //     return `${year}-${month}-${day}`; // Convert to "YYYY-MM-DD"
    // };
    
    return (
        <Container>
            
            <Row>
            <Col>
                <p>Savings Statement</p>
                {errorMessage && <div className="text-danger">{errorMessage}</div>}
                {successMessage && <div className="text-success">{successMessage}</div>}
                <hr />              
                <Form.Group controlId="formLoanNo">                        
                        <Form.Label>Business Number</Form.Label>
                        <input
                            type="number"
                            value={bussNo}
                            onChange={handleBussNoChange}
                            onBlur={(e) => getBusiness(e.target.value)}
                            required
                            placeholder="Enter Business Number"
                        />
                </Form.Group>

                <Form.Group controlId="formBusinessName">
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" value={businessName} readOnly />
                </Form.Group>
                <Form.Group controlId="formStartDate">
                    <Form.Label>Start Date</Form.Label>
                    <Form.Control 
                        type="date" 
                        value={startDate} 
                        onChange={handleStartDateChange} 
                        required 
                    />
                </Form.Group>

                <Form.Group controlId="formEndDate">
                    <Form.Label>End Date</Form.Label>
                    <Form.Control 
                        type="date" 
                        value={endDate} 
                        onChange={handleEndDateChange} 
                        required 
                    />
                </Form.Group>

            </Col>
            <Row className="mt-3">
                <Col className="d-flex justify-content-between">
                    <Button variant="primary" onClick={handlePreviewClick}>
                        Preview
                    </Button>
                    <Button variant="secondary" onClick={() => navigate("/main")}>
                        Go Back
                    </Button>
                </Col>
            </Row>
            <Col>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Business Number</th>
                                <th>Date</th>
                                <th>Details</th>
                                <th>Debit</th>
                                <th>Credit</th>
                                <th>Balance</th>
                            </tr>
                        </thead>
                        <tbody>
                            {records.map((rec, index) => (
                                <tr key={index}>
                                    <td>{rec.buss_no}</td>
                                    <td>{rec.transdate}</td>
                                    <td>{rec.details}</td>
                                    <td>{rec.debit}</td>
                                    <td>{rec.credit}</td>
                                    <td>{rec.balance}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Col>
             </Row>
        </Container>
    );
};

export default FrmSavingsStatementX;
