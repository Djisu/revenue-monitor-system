import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { useNavigate } from 'react-router-dom';
import { Form, FormGroup, Label, Input, Button, Alert, Table } from 'reactstrap';
import { fetchElectoralAreas } from '../electoralArea/electoralAreaSlice';
import { fetchBusinessTypes } from '../businessType/businessTypeSlice';
import { fetchBusTypeSummaryReports, BusTypeSummaryReport } from './BusTypeSummaryReportSlice';
import { Bar } from 'react-chartjs-2';
//import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

interface BusinessTypeData {
    Business_Type: string;
    buss_type?: string;
    business_type?: string;
}

const FrmManagementSummariseReport: React.FC = () => {
    let [zone, setZone] = useState<string>('');
    let [electoralAreas, setElectoralAreas] = useState<string[]>([]);
    let [bussType, setBussType] = useState<string>('');
    let [firstDate, setFirstDate] = useState<string>('');
    let [lastDate, setLastDate] = useState<string>('');
    let [bussTypes, setBussTypes] = useState<BusinessTypeData[]>([]);
    let [error, setError] = useState<string>('');
    let [isLoading, setIsLoading] = useState<boolean>(false);
    let [managementReport, setManagementReport] = useState<BusTypeSummaryReport[]>([]);
    let [totalBalance, setTotalBalance] = useState<number>(0);

    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(fetchElectoralAreas());
        dispatch(fetchBusinessTypes());
    }, [dispatch]);

    const managementReportData = useAppSelector((state) => state.reports.reports);

    useEffect(() => {
        setManagementReport(managementReportData);
    }, [managementReportData]);

    // const businessList = managementReport.map((report) => ({
    //     electoral_area: report.electoral_area,
    //     buss_type: report.buss_type,
    //     amountdue: report.amountdue,
    //     amountpaid: report.amountpaid,
    //     balance: report.amountdue - report.amountpaid,
    // }));

    useEffect(() => {
        const total = managementReport.reduce((acc, curr) => acc + (curr.amountdue - curr.amountpaid), 0);
        totalBalance = total
        setTotalBalance(totalBalance);
    }, [managementReport]);

    const electoralAreaData = useAppSelector((state) => state.electoralArea.electoralAreas);

    useEffect(() => {
        if (Array.isArray(electoralAreaData)) {
            setElectoralAreas(electoralAreaData.map((area) => area.electoral_area));
        } else {
            console.error('Expected electoralAreaData to be an array but got:', electoralAreaData);
        }
    }, [electoralAreaData]);

    const businessTypes = useAppSelector((state) => state.businessType.businessTypes);

    useEffect(() => {
        if (Array.isArray(businessTypes)) {
            setBussTypes(businessTypes);
        }
    }, [businessTypes]);

    const handleZoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setZone(e.target.value);
    };

    const handleFirstDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFirstDate(e.target.value);
    };

    const handleLastDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLastDate(e.target.value);
    };

    const handleProduceReport = async () => {
        setIsLoading(true);
        setError('');

        try {
            const answer = await dispatch(fetchBusTypeSummaryReports({
                firstDate,
                lastDate,
                zone,
                bussType
            }));

            console.log('answer: ', answer)
            if (answer && answer.payload) {
                console.log('answer.payload: ', answer.payload)
                setManagementReport(answer.payload);
            }
        } catch (error: any) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const businessList = managementReport.map((report) => ({
        electoral_area: report.electoral_area,
        buss_type: report.buss_type,
        amountdue: report.amountdue,
        amountpaid: report.amountpaid,
        balance: report.amountdue - report.amountpaid
    }));

    // Chart data
    const chartData = {
        labels: businessList.map(business => business.electoral_area), // Use electoral_area as labels
        datasets: [
            {
                label: 'Amount Due',
                data: businessList.map(business => business.amountdue),
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
            {
                label: 'Amount Paid',
                data: businessList.map(business => business.amountpaid),
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
            },
            {
                label: 'Balance',
                data: businessList.map(business => business.balance),
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
            },
        ],
    };

    return (
        <div>
            <div className="container mt-5">
                {error && <Alert color="danger">{error}</Alert>}
                <div>
                    <Form>
                        <FormGroup>
                            <p className="text-center text-underline">Produce Daily Payments Report</p>

                             {/* Render the Bar chart here */}
                             <Bar data={chartData} />

                            <Label for="zone" className="font-weight-bold">Electoral Area:</Label>
                            <Input type="select" name="zone" id="zone" value={zone} onChange={handleZoneChange}>
                                <option value="All electoral areas">All electoral areas</option>
                                {electoralAreas.map((area, index) => (
                                    <option key={index} value={area}>{area}</option>
                                ))}
                            </Input>
                        </FormGroup>
                        <FormGroup>
                            <Label for="bussType" className="font-weight-bold">Business Type/Profession:</Label>
                            <Input type="select" name="bussType" id="bussType" value={bussType} onChange={(e) => setBussType(e.target.value)}>
                                <option value="All business types">All business types</option>
                                {bussTypes.map((businessType, index) => (
                                    <option key={index} value={businessType.business_type}>
                                        {businessType.business_type}
                                    </option>
                                ))}
                            </Input>
                        </FormGroup>
                        <FormGroup>
                            <Label for="firstDate" className="font-weight-bold">First Payment Date:</Label>
                            <Input
                                type="date"
                                name="firstDate"
                                id="firstDate"
                                value={firstDate}
                                onChange={handleFirstDateChange}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="lastDate" className="font-weight-bold">Last Payment Date:</Label>
                            <Input
                                type="date"
                                name="lastDate"
                                id="lastDate"
                                value={lastDate}
                                onChange={handleLastDateChange}
                            />
                        </FormGroup>
                        <FormGroup>
                            <div className="d-flex justify-content-between">
                                <Button color="success" onClick={handleProduceReport} disabled={isLoading}>
                                    Produce Summarized Report
                                </Button>
                                <Button variant="secondary" onClick={() => navigate("/main")} style={{ marginLeft: '40px', marginTop: '10px' }}>
                                    Go Back
                                </Button>
                                <Table striped bordered hover className="mt-3">
                                    <thead>
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
                                                <td>{business.balance}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                        </FormGroup>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default FrmManagementSummariseReport;








// import React, { useState, useEffect } from 'react';
// import { useAppDispatch, useAppSelector } from '../../hooks';
// import { useNavigate } from 'react-router-dom';
// import { Form, FormGroup, Label, Input, Button, Alert, Table } from 'reactstrap';


// import { fetchElectoralAreas } from '../electoralArea/electoralAreaSlice';
// import { fetchBusinessTypes } from '../businessType/businessTypeSlice';

// import { fetchBusTypeSummaryReports, BusTypeSummaryReport } from './BusTypeSummaryReportSlice';
// //import { ElectoralArea } from '../electoralArea/electoralAreaSlice';

// // interface BusinessType {
// //     buss_type: string;
// // }

// // interface PaymentDate {
// //     transdate: string;
// // }

// // interface ReportResponse {
// //     success: boolean;
// //     message: string;
// // }

// interface BusinessTypeData {
//     Business_Type: string; // This matches your API response
//     buss_type?: string; // Optional if it's not always present
//     business_type?: string
// }

// const FrmManagementSummariseReport: React.FunctionComponent = () => {
//     const [zone, setZone] = useState<string>('');
//     let [electoralAreas, setElectoralAreas] = useState<string[]>([]);
//     const [bussType, setBussType] = useState<string>('');
    
//     //let [businessType, setBusinessType] = useState<string>('');

//     let [firstDate, setFirstDate] = useState<string>('');
//     let [lastDate, setLastDate] = useState<string>('');
//     //let [zones, setZones] = useState<string[]>([]);
//     let [bussTypes, setBussTypes] = useState<BusinessTypeData[]>([]);
//     //let [paymentDates, setPaymentDates] = useState<string[]>([]);
//     let [error, setError] = useState<string>('');
//     let [isLoading, setIsLoading] = useState<boolean>(false); 
//     let [managementReport, setManagementReport] = useState<BusTypeSummaryReport[]>([]);
//     let [totalBalance, setTotalBalance] = useState<number>(0);
    
//     const navigate = useNavigate(); // Initialize the useNavigate hook  

//     const dispatch = useAppDispatch();
  
//     // Fetch data on component mount
//     useEffect(() => {
//       dispatch(fetchElectoralAreas());
//       dispatch(fetchBusinessTypes());
//     }, [dispatch]);

//     useEffect(() => {
//       if (bussTypes && Array.isArray(bussTypes)) {
//           setBussTypes(bussTypes); // Update local state with fetched data
//       }
//     }, [bussTypes]); // Dependency array includes bussTypes

//     const managementReportData = useAppSelector((state) => state.reports.reports);

//     useEffect(() => {
//         setManagementReport(managementReportData);
//     }, [managementReportData]); // Update only when managementReportData changes

//     const businessList = managementReportData.map((report) => {
//         return {
//             electoral_area: report.electoral_area,
//             buss_type: report.buss_type,
//             amountdue: report.amountdue,
//             amountpaid: report.amountpaid,
//             balance: report.balance
//         };
//     });

//     useEffect(() => {
//         const total = managementReport.reduce((acc, curr) => acc + (curr.amountdue - curr.amountpaid), 0);
//         setTotalBalance(total);
//     }, [managementReport]); // Update when managementReport changes

//     const electoralAreaData = useAppSelector((state) => state.electoralArea.electoralAreas) ;

//     console.log('typeof electoralAreaData:', typeof electoralAreaData)
  
//     useEffect(() => {
//       if (electoralAreaData && Array.isArray(electoralAreaData)) {
//           setElectoralAreas(electoralAreaData.map((area) => area.electoral_area));
//           console.log('electoralAreas: ', electoralAreas)
//       } else {
//           console.error('Expected electoralAreaData to be an array but got:', electoralAreaData);
//       }
//     }, [electoralAreaData, setElectoralAreas]);


//     const businessTypes = useAppSelector((state) => state.businessType.businessTypes); 
//     console.log('businessTypes: ', businessTypes);
    
//     useEffect(() => {
//       if (Array.isArray(businessTypes)) {
//         setBussTypes(businessTypes); // Update local state with fetched data
//       }
//     }, [businessTypes]); // Dependency array includes businessTypes

//     const handleZoneChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//         const selectedZone = e.target.value;
//         setZone(selectedZone);
//     };

//     const handleFirstDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const selectedDate = e.target.value;
//         setFirstDate(selectedDate);
//     };

//     const handleLastDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const selectedDate = e.target.value;
//         setLastDate(selectedDate);
//     };

//     const handleProduceReport = async () => {
//         setIsLoading(true);
//         setError('');

//         try {
//             const answer = await dispatch(fetchBusTypeSummaryReports({
//                 firstDate,
//                 lastDate,
//                 zone,
//                 bussType
//             }));

//             if (answer && answer.payload){
//                 console.log('answer.payload: ', answer.payload);

//                 setManagementReport(answer.payload);
//                 console.log('managementReport:', managementReport);
//             }          
//         } catch (error: any) {
//             setError(error.message);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     // const handleViewClick = () => {
//     //     handleProduceReport(false);
//     // };

//     const handleProduceReportClick = () => {
//         handleProduceReport();
//     };

//     managementReport.forEach((business) => {
//       totalBalance += business.amountdue - business.amountpaid;

//       setTotalBalance(totalBalance);
//     });
  
//     console.log('totalBalance: ', totalBalance)
    

//     return (
//         <div>
//         <div className="container mt-5">
//             {error && <Alert color="danger">{error}</Alert>}
           
//             {/* <h2 className="text-center">MARCORY MUNICIPAL ASSEMBLY</h2> */}
//                    <div>
//                     <Form>
//                         <FormGroup>
//                         <p className="text-center text-underline">Produce Daily Payments Report</p>
//                             <Label for="zone" className="font-weight-bold">Electoral Area:</Label>
//                             <Input type="select" name="zone" id="zone" value={zone} onChange={handleZoneChange}>
//                                 <option value="All electoral areas">Select Electoral Area/Zone</option>
//                                    {electoralAreas.map((area, index) => (
//                                 <option key={index} value={area}>{area}</option>
//                                 ))}
//                             </Input>
//                         </FormGroup>
//                         <FormGroup>
//                             <Label for="bussType" className="font-weight-bold">Business Type/Profession:</Label>
//                             <Input type="select" name="bussType" id="bussType" value={bussType} onChange={(e) => setBussType(e.target.value)}>
//                                 <option value="">Select Business Type</option>
//                                 {bussTypes.map((businessType, index) => (
//                                 <option key={index} value={businessType.business_type}>
//                                     {businessType.business_type}
//                                 </option>
//                                 ))}
//                             </Input>
//                         </FormGroup>
//                         <FormGroup>
//                             <Label for="firstDate" className="font-weight-bold">First Payment Date:</Label>
//                             <Input
//                                 type="date"
//                                 name="firstDate"
//                                 id="firstDate"
//                                 value={firstDate}
//                                 onChange={handleFirstDateChange}
//                             />
//                         </FormGroup>
//                         <FormGroup>
//                             <Label for="lastDate" className="font-weight-bold">Last Payment Date:</Label>
//                             <Input
//                                 type="date"
//                                 name="lastDate"
//                                 id="lastDate"
//                                 value={lastDate}
//                                 onChange={handleLastDateChange}
//                             />
//                         </FormGroup>
//                         <FormGroup>
//                             <div className="d-flex justify-content-between">
//                                 {/* <Button color="primary" onClick={handleViewClick} disabled={isLoading}>
//                                     {isLoading ? 'Loading...' : 'Produce Report (unposted payments)'}
//                                 </Button> */}
//                                 <div>
//                                     <Button color="success" onClick={handleProduceReportClick} disabled={isLoading}>
//                                         Produce Summerized Report
//                                     </Button>
//                                     <div>     
//                                     <Button variant="secondary" onClick={() => navigate("/main")} style={{ marginLeft: '40px',  marginTop: '10px' }}>
//                                         Go Back
//                                     </Button>
//                                 </div>
//                                 <div>
//                                     <Table striped bordered hover className="mt-3">
//                                         <thead>
//                                         {/* Total Balance: {totalBalance} */}
//                                         <tr>
//                                             <th>Electoral Area</th>          
//                                             <th>Business Type/Profession</th>
//                                             <th>Amount Due</th>
//                                             <th>Amount Paid</th>
//                                             <th>Balance</th>
//                                         </tr>
//                                         </thead>
//                                         <tbody>
//                                             {businessList.map((business, index) => (
//                                                 <tr key={index}>
//                                                 <td>{business.electoral_area}</td>            
//                                                 <td>{business.buss_type}</td>
//                                                 <td>{business.amountdue}</td>
//                                                 <td>{business.amountpaid}</td>
//                                                 <td>{business.amountdue - business.amountpaid}</td>
//                                                 </tr>
//                                             ))}
//                                         </tbody>    
//                                     </Table>
//                                 </div>  
//                                 </div>  
//                             </div>
//                         </FormGroup>
//                     </Form>
//                 </div>
               
//             </div>  
//         </div>
//     );
// };

// export default FrmManagementSummariseReport;
