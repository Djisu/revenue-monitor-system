import React, { useState, useEffect } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';
import axios from 'axios';

const FrmChangePrevBillAmount: React.FC = () => {
    const [busNo, setBusNo] = useState<string>('');
    const [busName, setBusName] = useState<string>('');
    const [year, setYear] = useState<string>('');
    const [oldBilledAmount, setOldBilledAmount] = useState<number>(0);
    const [newBilledAmount, setNewBilledAmount] = useState<number>(0);
    const [businessOptions, setBusinessOptions] = useState<{ value: string, label: string }[]>([]);
    const [yearOptions, setYearOptions] = useState<string[]>([]);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [modalMessage, setModalMessage] = useState<string>('');

    useEffect(() => {
        fetchBusinessOptions();
        fetchYearOptions();
    }, []);

    const fetchBusinessOptions = async () => {
        try {
            const response = await axios.get<{ buss_no: string, buss_name: string }[]>('http://your-api-url/businesses');
            const options = response.data.map(({ buss_no, buss_name }) => ({
                value: buss_no,
                label: `${buss_no}          ${buss_name}`
            }));
            setBusinessOptions(options);
        } catch (error) {
            console.error(error);
            showModalMessage('Error fetching business options');
        }
    };

    const fetchYearOptions = async () => {
        try {
            const response = await axios.get<{ fiscalyear: string }[]>('http://your-api-url/fiscalyears');
            const options = response.data.map(({ fiscalyear }) => fiscalyear);
            setYearOptions(options);
        } catch (error) {
            console.error(error);
            showModalMessage('Error fetching fiscal year options');
        }
    };

    const handleBusNoChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedBusNo = event.target.value;
        setBusNo(selectedBusNo);
        try {
            const response = await axios.get<{ buss_name: string, current_balance: number }>(`http://your-api-url/business/${selectedBusNo}`);
            setBusName(response.data.buss_name);
            setOldBilledAmount(response.data.current_balance);
        } catch (error) {
            console.error(error);
            showModalMessage('A wrong business number');
        }
    };

    const handleYearChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedYear = event.target.value;
        setYear(selectedYear);
        if (busNo) {
            try {
                const response = await axios.get<{ current_balance: number }>(`http://your-api-url/business/${busNo}/fiscalyear/${selectedYear}`);
                setOldBilledAmount(response.data.current_balance);
            } catch (error) {
                console.error(error);
                showModalMessage('Error fetching old billed amount');
            }
        }
    };

    const handleNewBilledAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewBilledAmount(Number(event.target.value));
    };

    const handleUpdateClick = async () => {
        try {
            await axios.post('http://your-api-url/updatebalance', {
                buss_no: busNo,
                fiscalyear: year,
                new_amount: newBilledAmount
            });

            const response = await axios.get<{ current_balance: number }>(`http://your-api-url/business/${busNo}/fiscalyear/${year}`);
            if (response.data.current_balance === newBilledAmount) {
                showModalMessage('Update successful');
            } else {
                showModalMessage('Error with Update');
            }
        } catch (error) {
            console.error(error);
            showModalMessage('Error with Update');
        }
    };

    const handleExitClick = () => {
        // Logic to exit to main menu or close the form
        console.log('Exiting to main menu...');
    };

    const showModalMessage = (message: string) => {
        setModalMessage(message);
        setShowModal(true);
    };

    return (
        <div className="container">
            <h1>Change Previously Billed Amount</h1>
            <Form.Group controlId="formBusNo">
                <Form.Label>Business No:</Form.Label>
                <Form.Select value={busNo} onChange={handleBusNoChange}>
                    <option value="">Select Business No</option>
                    {businessOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                </Form.Select>
            </Form.Group>
            <Form.Group controlId="formBusName">
                <Form.Label>Business Name:</Form.Label>
                <Form.Control type="text" value={busName} readOnly />
            </Form.Group>
            <Form.Group controlId="formYear">
                <Form.Label>Fiscal Year:</Form.Label>
                <Form.Select value={year} onChange={handleYearChange}>
                    <option value="">Select Fiscal Year</option>
                    {yearOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                    ))}
                </Form.Select>
            </Form.Group>
            <Form.Group controlId="formOldBilledAmount">
                <Form.Label>Old Billed Amount:</Form.Label>
                <Form.Control type="text" value={oldBilledAmount} readOnly />
            </Form.Group>
            <Form.Group controlId="formNewBilledAmount">
                <Form.Label>New Amount to Bill:</Form.Label>
                <Form.Control type="text" value={newBilledAmount} onChange={handleNewBilledAmountChange} />
            </Form.Group>
            <div className="mt-3">
                <Button variant="primary" onClick={handleUpdateClick}>
                    Update Billed Amount
                </Button>
                <Button variant="danger" className="ms-3" onClick={handleExitClick}>
                    Exit to Main Menu
                </Button>
            </div>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Information</Modal.Title>
                </Modal.Header>
                <Modal.Body>{modalMessage}</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default FrmChangePrevBillAmount;
