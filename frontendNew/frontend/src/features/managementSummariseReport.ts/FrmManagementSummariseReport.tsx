import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { useNavigate } from 'react-router-dom';
import { Form, FormGroup, Label, Input, Button, Alert, Table } from 'reactstrap';


import { fetchElectoralAreas } from '../electoralArea/electoralAreaSlice';
import { fetchBusinessTypes } from '../businessType/businessTypeSlice';

import { fetchBusTypeSummaryReports, BusTypeSummaryReport } from './BusTypeSummaryReportSlice';
//import { ElectoralArea } from '../electoralArea/electoralAreaSlice';

// interface BusinessType {
//     buss_type: string;
// }

// interface PaymentDate {
//     transdate: string;
// }

// interface ReportResponse {
//     success: boolean;
//     message: string;
// }

interface BusinessTypeData {
    Business_Type: string; // This matches your API response
    buss_type?: string; // Optional if it's not always present
    business_type?: string
}

const DailyPayments: React.FC = () => {
    const [zone, setZone] = useState<string>('');
    let [electoralAreas, setElectoralAreas] = useState<string[]>([]);
    const [bussType, setBussType] = useState<string>('');
    
    //let [businessType, setBusinessType] = useState<string>('');

    let [firstDate, setFirstDate] = useState<string>('');
    let [lastDate, setLastDate] = useState<string>('');
    //let [zones, setZones] = useState<string[]>([]);
    let [bussTypes, setBussTypes] = useState<BusinessTypeData[]>([]);
    //let [paymentDates, setPaymentDates] = useState<string[]>([]);
    let [error, setError] = useState<string>('');
    let [isLoading, setIsLoading] = useState<boolean>(false); 
    let [managementReport, setManagementReport] = useState<BusTypeSummaryReport[]>([]);
    let [totalBalance, setTotalBalance] = useState<number>(0);
    
    const navigate = useNavigate(); // Initialize the useNavigate hook  

    const dispatch = useAppDispatch();
  
    // Fetch data on component mount
    useEffect(() => {
      dispatch(fetchElectoralAreas());
      dispatch(fetchBusinessTypes());
    }, [dispatch]);

    useEffect(() => {
      if (bussTypes && Array.isArray(bussTypes)) {
          setBussTypes(bussTypes); // Update local state with fetched data
      }
    }, [bussTypes]); // Dependency array includes bussTypes

   

    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             // Update business zones in payments
    //             await fetch('/api/update-business-zones', { method: 'POST' });

    //             // Fetch zones
    //             const zonesResponse = await fetch('/api/zones');
    //             const zonesData = await zonesResponse.json();
    //             setZones(zonesData);

    //         } catch (error: any) {
    //             setError(error.message);
    //         }
    //     };

    //     fetchData();
    // }, [dispatch]);

   const managementReportData = useAppSelector((state) => state.reports.reports);
    console.log('managementReportData:', managementReportData);

    const businessList = managementReportData.map((report) => {
        return {
            electoral_area: report.electoral_area,
            buss_type: report.buss_type,
            amountdue: report.amountdue,
            amountpaid: report.amountpaid,
            balance: report.balance
        };
    });

    useEffect(() => {
        const total = businessList.reduce((acc, curr) => acc + curr.balance, 0);
        setTotalBalance(total);
    }, [businessList]);

    const electoralAreaData = useAppSelector((state) => state.electoralArea.electoralAreas) ;

    console.log('typeof electoralAreaData:', typeof electoralAreaData)
  
    useEffect(() => {
      if (electoralAreaData && Array.isArray(electoralAreaData)) {
          setElectoralAreas(electoralAreaData.map((area) => area.electoral_area));
          console.log('electoralAreas: ', electoralAreas)
      } else {
          console.error('Expected electoralAreaData to be an array but got:', electoralAreaData);
      }
    }, [electoralAreaData, setElectoralAreas]);


    const businessTypes = useAppSelector((state) => state.businessType.businessTypes); 
    console.log('businessTypes: ', businessTypes);
    
    useEffect(() => {
      if (Array.isArray(businessTypes)) {
        setBussTypes(businessTypes); // Update local state with fetched data
      }
    }, [businessTypes]); // Dependency array includes businessTypes

    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             // Update business zones in payments
    //             await fetch('/api/update-business-zones', { method: 'POST' });

    //             // Fetch zones
    //             const zonesResponse = await fetch('/api/zones');
    //             const zonesData = await zonesResponse.json();
    //             setZones(zonesData);

    //             // Fetch payment dates (if zone is pre-selected)
    //             if (zone) {
    //                 fetchPaymentDates(zone);
    //             }
    //         } catch (error: any) {
    //             setError(error.message);
    //         }
    //     };

    //     fetchData();
    // }, [zone]);

    // const fetchPaymentDates = async (zone: string) => {
    //     try {
    //         const response = await fetch(`/api/payment-dates?zone=${zone}`);
    //         const data: PaymentDate[] = await response.json();
    //         const dates = data.map((record) => record.transdate);
    //         setPaymentDates(dates);
    //     } catch (error: any) {
    //         setError(error.message);
    //     }
    // };


    const handleZoneChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedZone = e.target.value;
        setZone(selectedZone);
    };

    const handleFirstDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedDate = e.target.value;
        setFirstDate(selectedDate);
    };

    const handleLastDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedDate = e.target.value;
        setLastDate(selectedDate);
    };

    const handleProduceReport = async (posted: boolean) => {
        setIsLoading(true);
        setError('');

        try {
            const response = await fetchBusTypeSummaryReports({
                firstDate,
                lastDate,
                zone,
                bussType
            });

            console.log('response:', response);

            // if (response.success) {
            //     window.location.href = '/reports/daily-zones-payments'; // Redirect to report page
            // } else {
            //     setError(response.message);
            // }
        } catch (error: any) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    // const handleViewClick = () => {
    //     handleProduceReport(false);
    // };

    const handleProduceReportClick = () => {
        handleProduceReport(true);
    };

    managementReport.forEach((business) => {
      totalBalance += business.amountdue - business.amountpaid;

      setTotalBalance(totalBalance);
    });
  
    console.log('totalBalance: ', totalBalance)
    

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
                        {electoralAreas.map((area, index) => (
                          <option key={index} value={area}>{area}</option>
                        ))}
                    </Input>
                </FormGroup>
                <FormGroup>
                    <Label for="bussType" className="font-weight-bold">Business Type/Profession:</Label>
                    <Input type="select" name="bussType" id="bussType" value={bussType} onChange={(e) => setBussType(e.target.value)}>
                        <option value="">Select Business Type</option>
                        {bussTypes.map((businessType, index) => (
                        <option key={index} value={businessType.business_type}>
                            {businessType.business_type}
                        </option>
                        ))}
                    </Input>
                </FormGroup>
                <FormGroup>
                    <Label for="firstDate" className="font-weight-bold">First Payment Date (YYYYMMDD):</Label>
                    <Input
                        type="number"
                        name="firstDate"
                        id="firstDate"
                        value={firstDate}
                        onChange={handleFirstDateChange}
                        placeholder="Enter date as YYYYMMDD"
                    />
                </FormGroup>
                <FormGroup>
                    <Label for="lastDate" className="font-weight-bold">Last Payment Date (YYYYMMDD):</Label>
                    <Input
                        type="number"
                        name="lastDate"
                        id="lastDate"
                        value={lastDate}
                        onChange={handleLastDateChange}
                        placeholder="Enter date as YYYYMMDD"
                    />
                </FormGroup>
                <FormGroup>
                    <div className="d-flex justify-content-between">
                        {/* <Button color="primary" onClick={handleViewClick} disabled={isLoading}>
                            {isLoading ? 'Loading...' : 'Produce Report (unposted payments)'}
                        </Button> */}
                        <Button color="success" onClick={handleProduceReportClick} disabled={isLoading}>
                           Produce Payments Report
                        </Button>
                                
                        <Button variant="secondary" onClick={() => navigate("/main")} style={{ marginLeft: '40px',  marginTop: '10px' }}>
                            Go Back
                        </Button>
                    </div>
                </FormGroup>
            </Form>
            <Table striped bordered hover className="mt-3">
                <thead>
                Total Balance: {totalBalance}
                <tr>
                    <th>Electoral Area</th>          
                    <th>Business Type/Profession</th>
                    <th>Amount Due</th>
                    <th>Amount Paid</th>
                    <th>Balance</th>
                </tr>
                </thead>
                <tbody>
                {businessList.map((business, index) => (
                    <tr key={index}>
                    <td>{business.electoral_area}</td>            
                    <td>{business.buss_type}</td>
                    <td>{business.amountdue}</td>
                    <td>{business.amountpaid}</td>
                    <td>{business.amountdue - business.amountpaid}</td>
                    </tr>
                ))}
                </tbody>    
            </Table>
              
        </div>
    );
};

export default DailyPayments;
