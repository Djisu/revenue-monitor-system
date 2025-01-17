import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Table } from 'react-bootstrap';
import axios from 'axios';

interface Officer {
    officer_no: string;
    officer_name: string;
}

interface Business {
    buss_no: string;
    buss_name: string;
    buss_type: string;
    buss_town: string;
    assessmentby: string;
    current_rate: number;
    balance: number;
    property_class: string;
    property_rate: number;
    ceo: string;
    electroral_area: string;
}

interface Payment {
    officer_no: string;
    buss_no: string;
    buss_name: string;
    amount: number;
    receiptno: number;
    monthpaid: string;
    fiscal_year: number;
    transdate: Date;
    userid: string;
}

interface Receipt {
    receiptno: number;
    buss_no: string;
    description: string;
    transdate: Date;
    amount: number;
    buss_name: string;
}

// interface Balance {
//     buss_no: string;
//     buss_name: string;
//     billamount: number;
//     paidamount: number;
//     balance: number;
// }

interface FiscalYear {
    fiscalyear: number;
}

interface ElectoralArea {
    electroral_area: string;
}

const FrmClientPayments: React.FC = () => {
    let [officers, setOfficers] = useState<Officer[]>([]);
    let [business, setBusiness] = useState<Business[]>([]);
    let [payments, setPayments] = useState<Payment[]>([]);
    let [fiscalYears, setFiscalYears] = useState<FiscalYear[]>([]);
    // @ts-ignore
    let [electoralAreas, setElectoralAreas] = useState<ElectoralArea[]>([]);

     // @ts-ignore
    let [fiscalYear, setFiscalYear] = useState<number>(new Date().getFullYear());
    // @ts-ignore
    let [electoralArea, setElectoralArea] = useState<string>('');
    let [officerNo, setOfficerNo] = useState<string>('');
    let [busNo, setBusNo] = useState<string>('');
    let [amount, setAmount] = useState<number>(0);
    let [receiptNo, setReceiptNo] = useState<number>(0);
    let [paymentMonth, setPaymentMonth] = useState<string>('');
    let [transDate, setTransDate] = useState<Date>(new Date());
    let [owner, setOwner] = useState<string>('');
    let [businessName, setBusinessName] = useState<string>('');
    let [businessType, setBusinessType] = useState<string>('');
    let [rate, setRate] = useState<number>(0);
    let [balanceBF, setBalanceBF] = useState<number>(0);
    let [propertyClass, setPropertyClass] = useState<string>('');
    let [propertyRent, setPropertyRent] = useState<number>(0);
    let [totalPayable, setTotalPayable] = useState<number>(0);
    let [totalPayment, setTotalPayment] = useState<number>(0);
    let [currentBalance, setCurrentBalance] = useState<number>(0);
    let [statusFlag, setStatusFlag] = useState<boolean>(false);

    useEffect(() => {
        fetchOfficers();
        fetchFiscalYears();
        fetchElectoralAreas();
        fetchPayments();
        handleUserPermissions();
    }, []);

    const fetchOfficers = async () => {
        try {
            const response = await axios.get<Officer[]>('/api/officers');
            setOfficers(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchProperties = async (officerNo: string) => {
        try {
            const response = await axios.get<Business[]>('/api/properties', { params: { officer_no: officerNo } });
            setBusiness(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchFiscalYears = async () => {
        try {
            const response = await axios.get<FiscalYear[]>('/api/fiscal-years');
            fiscalYears = response.data
            setFiscalYears(fiscalYears);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchElectoralAreas = async () => {
        try {
            const response = await axios.get<ElectoralArea[]>('/api/electoral-areas');
            electoralAreas = response.data
            setElectoralAreas(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchPayments = async () => {
        try {
            const response = await axios.get<Payment[]>('/api/payments', { params: { fiscal_year: fiscalYear } });
            setPayments(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleOfficerNoChange = (event: React.ChangeEvent<HTMLElement>) => {
        let target = event.target as HTMLSelectElement;
        const selectedOfficerNo = target.value;
        setOfficerNo(selectedOfficerNo);
        fetchProperties(selectedOfficerNo);
    };

    const handleBusNoChange = (event: React.ChangeEvent<HTMLElement>) => {
        let target = event.target as HTMLSelectElement;
        const selectedBusNo = target.value;
        setBusNo(selectedBusNo);
        fetchPropertyDetails(selectedBusNo);
    };

    const fetchPropertyDetails = async (busNo: string) => {
        try {
            const response = await axios.get<Business>('/api/property-details', { params: { buss_no: busNo } });
            const Business = response.data;

            if (Business) {
                setBusinessName(Business.buss_name);
                setBusinessType(Business.buss_type);
                setRate(Business.current_rate);
                setBalanceBF(await findBalanceBF(Business.buss_no));
                setPropertyClass(Business.property_class);
                setPropertyRent(Business.property_rate);
                setOwner(Business.ceo);
                setTotalPayable(await findTotalPayable(Business.buss_no));
                setTotalPayment(await findTotalPayment(Business.buss_no));
                setCurrentBalance(totalPayable - totalPayment);
                fetchReceiptNos(busNo);
            } else {
                alert("This business number does not exist. Select another number");
            }
        } catch (error) {
            console.error(error);
        }
    };

    const findBalanceBF = async (busNo: string): Promise<number> => {
        try {
            const response = await axios.get<number>('/api/balance-bf', { params: { buss_no: busNo } });
            return response.data || 0;
        } catch (error) {
            console.error(error);
            alert("Error in finding balance");
            return 0;
        }
    };

    const findTotalPayable = async (busNo: string): Promise<number> => {
        try {
            const response = await axios.get<number>('/api/total-payable', { params: { buss_no: busNo } });
            return response.data || 0;
        } catch (error) {
            console.error(error);
            alert("Error in finding total payable");
            return 0;
        }
    };

    const findTotalPayment = async (busNo: string): Promise<number> => {
        try {
            const response = await axios.get<number>('/api/total-payment', { params: { buss_no: busNo } });
            return response.data || 0;
        } catch (error) {
            console.error(error);
            alert("Error in finding total payment");
            return 0;
        }
    };

    const fetchReceiptNos = async (busNo: string) => {
        try {
            const response = await axios.get<Payment[]>('/api/receipt-nos', { params: { buss_no: busNo } });
            setPayments(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handlePaymentMonthChange = (event: React.ChangeEvent<HTMLElement>) => {
        let target = event.target as HTMLSelectElement;
        const selectedMonth = target.value;
        setPaymentMonth(selectedMonth);
    };

    const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const amount = parseFloat(event.target.value);
        setAmount(amount);
        setCurrentBalance(totalPayable - totalPayment - amount);
    };

    const handleReceiptNoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const receiptNo = parseInt(event.target.value, 10);
        setReceiptNo(receiptNo);
        validateReceiptNo();
    };

    const validateReceiptNo = async () => {
        try {
            const response = await axios.get<Receipt[]>('/api/validate-receipt-no', { params: { receiptno: receiptNo, fiscal_year: fiscalYear } });
            if (response.data.length > 0) {
                alert("Receipt number already entered. Enter another receipt number");
                setReceiptNo(0);
            } else {
                const tempResponse = await axios.get<Receipt[]>('/api/temp-payment', { params: { receiptno: receiptNo, fiscal_year: fiscalYear } });
                if (tempResponse.data.length > 0) {
                    alert("Receipt number temporally entered but not yet posted by the supervisor. Enter a new receipt number");
                    setReceiptNo(0);
                } else {
                    setStatusFlag(true);
                }
            }
        } catch (error) {
            console.error(error);
            alert("Error in validating receipt number");
        }
    };

    const handleAddRecord = async () => {
        if (!busNo) {
            alert("Select the business number");
            return;
        }
        if (!officerNo) {
            alert("Select the officer number");
            return;
        }
        if (!amount) {
            alert("Enter the amount");
            return;
        }
        if (!paymentMonth) {
            alert("Select the payment month");
            return;
        }
        if (!receiptNo) {
            alert("Enter the receipt number");
            return;
        }

        try {
            const response = await axios.post('/api/add-record', {
                buss_no: busNo,
                officer_no: officerNo,
                amount: amount,
                monthpaid: paymentMonth,
                transdate: transDate,
                userid: 'your_user_id_here', // Replace with actual user ID logic
                fiscal_year: fiscalYear,
                receiptno: receiptNo
            });
            alert(response.data);
            fetchPayments();
            handleUserPermissions();
        } catch (error) {
            console.error(error);
            alert("Error in adding a record");
        }
    };

    const handlePostRecord = async () => {
        if (!busNo) {
            alert("Select the business number");
            return;
        }
        if (!officerNo) {
            alert("Select the officer number");
            return;
        }
        if (!amount) {
            alert("Enter the amount");
            return;
        }
        if (!paymentMonth) {
            alert("Select the payment month");
            return;
        }
        if (!receiptNo) {
            alert("Enter the receipt number");
            return;
        }

        try {
            const response = await axios.get<Payment[]>('/api/validate-temp-record', { params: { buss_no: busNo, officer_no: officerNo, fiscal_year: fiscalYear, receiptno: receiptNo } });
            if (response.data.length === 0) {
                alert("This payment cannot be posted. Data entry clerk has not yet entered it!!!");
                return;
            }

            await axios.post('/api/post-record', {
                buss_no: busNo,
                officer_no: officerNo,
                amount: amount,
                monthpaid: paymentMonth,
                transdate: transDate,
                userid: 'your_user_id_here', // Replace with actual user ID logic
                fiscal_year: fiscalYear,
                receiptno: receiptNo
            });

            await axios.post('/api/update-officer-budget', {
                officer_no: officerNo,
                fiscal_year: fiscalYear,
                month: paymentMonth,
                amount: amount
            });

            await axios.post('/api/update-business-balance', {
                buss_no: busNo,
                amount: amount
            });

            await axios.post('/api/delete-temp-record', {
                buss_no: busNo,
                officer_no: officerNo,
                fiscal_year: fiscalYear,
                receiptno: receiptNo
            });

            alert("Collector's Payment successfully posted");
            fetchPayments();
            handleUserPermissions();
        } catch (error) {
            console.error(error);
            alert("Error in posting a record");
        }
    };

    const handleDeleteRecord = async () => {
        const password = prompt("Enter the password to delete");
        if (password !== "Timbuk2tu") {
            alert("Wrong password. Deletion aborted");
            return;
        }

        try {
            const response = await axios.get<Payment[]>('/api/validate-payment-record', { params: { buss_no: busNo, officer_no: officerNo, fiscal_year: fiscalYear, receiptno: receiptNo, monthpaid: paymentMonth } });
            if (response.data.length === 0) {
                alert("Record does not exist!!!");
                return;
            }

            await axios.post('/api/delete-payment-record', {
                buss_no: busNo,
                officer_no: officerNo,
                fiscal_year: fiscalYear,
                receiptno: receiptNo,
                monthpaid: paymentMonth
            });

            alert("Faulty record deleted from temporal storage");
            fetchPayments();
            handleUserPermissions();
        } catch (error) {
            console.error(error);
            alert("Error in deleting a record");
        }
    };

    const handleExit = () => {
        // Logic to exit and show main menu
        window.close();
    };

    const handleUserPermissions = async () => {
        const userId = 'your_user_id_here'; // Replace with actual user ID logic
        if (userId.toUpperCase() === "SUPERVISOR") {
            setPayments([]);
            fetchSupervisorPayments(fiscalYear);
        } else {
            setPayments([]);
            fetchUserPayments(userId, fiscalYear);
        }
    };

    const fetchSupervisorPayments = async (fiscalYear: number) => {
        try {
            const response = await axios.get<Payment[]>('/api/supervisor-payments', { params: { fiscal_year: fiscalYear } });
            setPayments(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchUserPayments = async (userId: string, fiscalYear: number) => {
        try {
            const response = await axios.get<Payment[]>('/api/user-payments', { params: { userid: userId, fiscal_year: fiscalYear } });
            setPayments(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handlePrintReceipt = async () => {
        if (!officerNo) {
            alert("Select a collector to produce receipt");
            return;
        }

        try {
            await axios.post('/api/print-receipt', {
                officer_no: officerNo,
                fiscal_year: fiscalYear
            });

            alert("This is the report");
        } catch (error) {
            console.error(error);
            alert("Error in printing receipt");
        }
    };

    const handleDefaulters = async () => {
        try {
            await axios.post('/api/defaulters', {
                fiscal_year: fiscalYear
            });

            alert("This is the report");
        } catch (error) {
            console.error(error);
            alert("Error in generating defaulters report");
        }
    };

    const handlePrepayments = async () => {
        try {
            await axios.post('/api/prepayments', {
                fiscal_year: fiscalYear
            });

            alert("This is the report");
        } catch (error) {
            console.error(error);
            alert("Error in generating prepayments report");
        }
    };

    const handleLoad = () => {
        handleUserPermissions();
    };

    const handleNoArrears = async () => {
        try {
            await axios.post('/api/no-arrears', {
                fiscal_year: fiscalYear
            });

            alert("This is the report");
        } catch (error) {
            console.error(error);
            alert("Error in generating no arrears report");
        }
    };

    return (
        <Container>
            <Row>
                <Col className="text-center mt-3">
                    <h2 className="text-primary">Collector's Payments Entry</h2>
                    <h4 className="text-info">MARCORY MUNICIPAL ASSEMBLY</h4>
                </Col>
            </Row>
            <Row className="mt-3">
                <Col>
                    <Form.Label className="font-weight-bold">Collector Code:</Form.Label>
                    <Form.Control as="select" value={officerNo} onChange={handleOfficerNoChange}>
                        <option value="">Select...</option>
                        {officers.map(officer => (
                            <option key={officer.officer_no} value={officer.officer_no}>
                                {officer.officer_no} - {officer.officer_name}
                            </option>
                        ))}
                    </Form.Control>
                </Col>
                <Col>
                    <Form.Label className="font-weight-bold">Business No:</Form.Label>
                    <Form.Control as="select" value={busNo} onChange={handleBusNoChange}>
                        <option value="">Select...</option>
                        {business.map(item => (
                            <option key={item.buss_no} value={item.buss_no}>
                                {item.buss_no} - {item.buss_name} - {item.electroral_area}
                            </option>
                        ))}
                    </Form.Control>
                </Col>
            </Row>
            <Row className="mt-3">
                <Col>
                    <Form.Label className="font-weight-bold">Receipt No:</Form.Label>
                    <Form.Control type="number" value={receiptNo} onChange={handleReceiptNoChange} />
                </Col>
                <Col>
                    <Form.Label className="font-weight-bold">Payment Month:</Form.Label>
                    <Form.Control as="select" value={paymentMonth} onChange={handlePaymentMonthChange}>
                        <option value="">Select...</option>
                        <option value="January">January</option>
                        <option value="February">February</option>
                        <option value="March">March</option>
                        <option value="April">April</option>
                        <option value="May">May</option>
                        <option value="June">June</option>
                        <option value="July">July</option>
                        <option value="August">August</option>
                        <option value="September">September</option>
                        <option value="October">October</option>
                        <option value="November">November</option>
                        <option value="December">December</option>
                    </Form.Control>
                </Col>
            </Row>
            <Row className="mt-3">
                <Col>
                    <Form.Label className="font-weight-bold">Amount:</Form.Label>
                    <Form.Control type="number" step="0.01" value={amount} onChange={handleAmountChange} />
                </Col>
            </Row>
            <Row className="mt-3">
                <Col>
                    <Form.Label className="font-weight-bold">Payment Date:</Form.Label>
                    <Form.Control type="date" value={transDate.toISOString().split('T')[0]} onChange={(e) => setTransDate(new Date(e.target.value))} />
                </Col>
            </Row>
            <Row className="mt-3">
                <Col>
                    <Form.Label className="font-weight-bold">Owner's Name:</Form.Label>
                    <Form.Control type="text" value={owner} readOnly />
                </Col>
            </Row>
            <Row className="mt-3">
                <Col>
                    <Form.Label className="font-weight-bold">Business Name:</Form.Label>
                    <Form.Control type="text" value={businessName} readOnly />
                </Col>
            </Row>
            <Row className="mt-3">
                <Col>
                    <Form.Label className="font-weight-bold">Business Type:</Form.Label>
                    <Form.Control type="text" value={businessType} readOnly />
                </Col>
            </Row>
            <Row className="mt-3">
                <Col>
                    <Form.Label className="font-weight-bold">Rate:</Form.Label>
                    <Form.Control type="text" value={rate.toFixed(2)} readOnly />
                </Col>
            </Row>
            <Row className="mt-3">
                <Col>
                    <Form.Label className="font-weight-bold">Balance BF:</Form.Label>
                    <Form.Control type="text" value={balanceBF.toFixed(2)} readOnly />
                </Col>
            </Row>
            <Row className="mt-3">
                <Col>
                    <Form.Label className="font-weight-bold">Property Class:</Form.Label>
                    <Form.Control type="text" value={propertyClass} readOnly />
                </Col>
            </Row>
            <Row className="mt-3">
                <Col>
                    <Form.Label className="font-weight-bold">Property Fees:</Form.Label>
                    <Form.Control type="text" value={propertyRent.toFixed(2)} readOnly />
                </Col>
            </Row>
            <Row className="mt-3">
                <Col>
                    <Form.Label className="font-weight-bold">Total Payable:</Form.Label>
                    <Form.Control type="text" value={totalPayable.toFixed(2)} readOnly />
                </Col>
            </Row>
            <Row className="mt-3">
                <Col>
                    <Form.Label className="font-weight-bold">Total Payment:</Form.Label>
                    <Form.Control type="text" value={totalPayment.toFixed(2)} readOnly />
                </Col>
            </Row>
            <Row className="mt-3">
                <Col>
                    <Form.Label className="font-weight-bold">Current Balance:</Form.Label>
                    <Form.Control type="text" value={currentBalance.toFixed(2)} readOnly />
                </Col>
            </Row>
            <Row className="mt-3">
                <Col>
                    <Form.Label className="font-weight-bold">Fiscal Year:</Form.Label>
                    <Form.Control type="number" value={fiscalYear} readOnly />
                </Col>
            </Row>
            <Row className="mt-3">
                <Col className="text-center">
                    <Button variant="primary" onClick={handleAddRecord} disabled={!statusFlag}>
                        Add New Record
                    </Button>
                </Col>
                <Col className="text-center">
                    <Button variant="primary" onClick={handlePostRecord} disabled={officerNo === '' || busNo === '' || amount === 0 || paymentMonth === '' || receiptNo === 0}>
                        Post
                    </Button>
                </Col>
                <Col className="text-center">
                    <Button variant="primary" onClick={handleDeleteRecord} disabled={officerNo === '' || busNo === '' || paymentMonth === '' || receiptNo === 0}>
                        Delete A Faulty Entry
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
                    <h3 className="font-weight-bold">List of Payments</h3>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Collector No</th>
                                <th>Business No</th>
                                <th>Business Name</th>
                                <th>Amount</th>
                                <th>Receipt No</th>
                                <th>Payment Month</th>
                                <th>Fiscal Year</th>
                            </tr>
                        </thead>
                        <tbody>
                            {payments.map(payment => (
                                <tr key={payment.buss_no}>
                                    <td>{payment.officer_no}</td>
                                    <td>{payment.buss_no}</td>
                                    <td>{payment.buss_name}</td>
                                    <td>{payment.amount.toFixed(2)}</td>
                                    <td>{payment.receiptno}</td>
                                    <td>{payment.monthpaid}</td>
                                    <td>{payment.fiscal_year}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Col>
            </Row>
            <Row className="mt-3">
                <Col>
                    <h3 className="font-weight-bold">List of Business Receipt Numbers</h3>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Business No</th>
                                <th>Receipt No</th>
                                <th>Amount</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {payments.map(payment => (
                                <tr key={payment.buss_no}>
                                    <td>{payment.buss_no}</td>
                                    <td>{payment.receiptno}</td>
                                    <td>{payment.amount.toFixed(2)}</td>
                                    <td>{payment.transdate.toISOString().split('T')[0]}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Col>
            </Row>
            <Row className="mt-3">
                <Col className="text-center">
                    <Button variant="primary" onClick={handlePrintReceipt} disabled={officerNo === ''}>
                        Print Receipt
                    </Button>
                </Col>
                <Col className="text-center">
                    <Button variant="primary" onClick={handleDefaulters}>
                        Defaulters
                    </Button>
                </Col>
                <Col className="text-center">
                    <Button variant="primary" onClick={handlePrepayments}>
                        Prepayments
                    </Button>
                </Col>
                <Col className="text-center">
                    <Button variant="primary" onClick={handleLoad}>
                        Load
                    </Button>
                </Col>
                <Col className="text-center">
                    <Button variant="primary" onClick={handleNoArrears}>
                        No Arrears
                    </Button>
                </Col>
            </Row>
        </Container>
    );
};

export default FrmClientPayments;
