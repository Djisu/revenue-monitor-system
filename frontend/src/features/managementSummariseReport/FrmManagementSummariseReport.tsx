import React, { useState, useEffect, useRef } from 'react';
//import { ChangeEvent } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Alert, Table, Spinner } from 'react-bootstrap';
import { fetchElectoralAreas } from '../electoralArea/electoralAreaSlice';
import { fetchBusinessTypes } from '../businessType/businessTypeSlice';
import { fetchBusTypeSummaryReports, BusTypeSummaryReport } from './BusTypeSummaryReportSlice';
import { Bar } from 'react-chartjs-2';

import {
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
} from 'chart.js';

import { Chart as ChartJS } from 'chart.js';
//import { Chart as ChartComponent } from 'react-chartjs-2';
//import { MutableRefObject } from 'react';
// import type { ChartJSOrUndefined } from 'react-chartjs-2';

 import type { Chart } from 'chart.js';

// This is what ChartJSOrUndefined<'bar', number[], string> resolves to:
// type ChartJSOrUndefined = Chart<'bar', number[], string> | undefined;
//type ChartJSOrUndefined = Chart<'bar', number[], string> | undefined;

ChartJS.register(
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend
);


interface BusinessTypeData {
    Business_Type: string;
    buss_type?: string;
    business_type?: string;
}

const FrmManagementSummariseReport: React.FC = () => {
    
    const chartRef = useRef<Chart<'bar', number[], string> | null>(null);


    const [zone, setZone] = useState<string>('');
    const [electoralAreas, setElectoralAreas] = useState<string[]>([]);
    const [bussType, setBussType] = useState<string>('');
    const [firstDate, setFirstDate] = useState<string>('');
    const [lastDate, setLastDate] = useState<string>('');
    const [bussTypes, setBussTypes] = useState<BusinessTypeData[]>([]);
    const [error, setError] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [managementReport, setManagementReport] = useState<BusTypeSummaryReport[]>([]);
    const [totalBalance, setTotalBalance] = useState<number>(0);
    const [chartKey, setChartKey] = useState<number>(0); // Add this state

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

    useEffect(() => {
        const total = managementReport.reduce((acc, curr) => acc + (curr.amountdue - curr.amountpaid), 0);
        setTotalBalance(total);
    }, [managementReport]);

    const electoralAreaData = useAppSelector((state) => state.electoralArea.electoralAreas);
    console.log('electoralAreaData: ', electoralAreaData)

    useEffect(() => {
        if (Array.isArray(electoralAreaData)) {
            setElectoralAreas(electoralAreaData.map((area) => area.electroral_area));
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

    // const handleZoneChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    //     setZone(e.target.value);
    // };

    type SelectControlElement = HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement;

    function handleZoneChange(e: React.ChangeEvent<SelectControlElement>) {
        if (e.target instanceof HTMLSelectElement) {
            // Handle the change
            setZone(e.target.value);
        }
    }
    

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
            const answer = await dispatch(fetchBusTypeSummaryReports({ firstDate, lastDate, zone, bussType }));
            if (answer && answer.payload) {
                setManagementReport(answer.payload);
                setChartKey(prevKey => prevKey + 1); // Update the key to force a re-render
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                setError(error.message);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const businessList = managementReport.map((report) => ({
        electoral_area: report.electoral_area,
        buss_type: report.buss_type,
        amountdue: report.amountdue,
        amountpaid: report.amountpaid,
        balance: report.amountdue - report.amountpaid,
    }));

    // Chart data
    const chartData = {
        labels: businessList.map((business) => business.electoral_area), // Use electoral_area as labels
        datasets: [
            {
                label: 'Amount Due',
                data: businessList.map((business) => business.amountdue),
                barThickness: 20, // Adjust bar thickness as needed
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
            {
                label: 'Amount Paid',
                data: businessList.map((business) => business.amountpaid),
                barThickness: 20, // Adjust bar thickness as needed
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
            },
            {
                label: 'Balance',
                data: businessList.map((business) => business.balance),
                barThickness: 20, // Adjust bar thickness as needed
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
            },
        ],
    };

    //const maxYValue = Math.max(...chartData.datasets[0].data); // Assuming chartData.datasets[0].data contains the y values


    useEffect(() => {
        if (chartRef.current) {
            chartRef.current.update(); // force re-render
        }
    }, [chartData]);
        
    useEffect(() => {
        setTimeout(() => window.dispatchEvent(new Event('resize')), 100);
    }, [chartData]);
     
    useEffect(() => {
        if (businessList.length > 0) {
            window.requestAnimationFrame(() => {
                window.dispatchEvent(new Event('resize'));
            });
        }
    }, [chartData]);

    useEffect(() => {
        console.log('Chart data:', chartData);
        console.log('Business List:', businessList);
        if (chartRef.current) {
            console.log('Chart instance:', chartRef.current);
        }
    }, [chartData]);
    
 

    return (
        <div>
            <div className="container mt-5">
                {error && <Alert variant="danger">{error}</Alert>}
                {isLoading ? (
                    <div className="text-center">
                        <Spinner style={{ width: '3rem', height: '3rem' }} />
                    </div>
                    
                ) : (
                    <div>
                         <p style={{color: 'red', fontSize: 'bold'}}>Right Click Graph to Show & Print. Click Print Page. Click Cancel. </p>
                        <p>Total Balance: {totalBalance}</p>
                        <Form>
                            <Form.Group className="mb-3">
                                <p className="text-center text-underline">Produce Daily Payments Report</p>
                                {businessList.length > 0 && (
                                    <div style={{ position: 'relative', height: '400px', width: '100%', border: '1px solid red' }}>
                                        <Bar
                                           ref={chartRef}
                                            data={chartData}
                                            options={{
                                                responsive: true,
                                                maintainAspectRatio: false,
                                                scales: {
                                                    y: {
                                                        beginAtZero: true,
                                                        max: Math.max(...chartData.datasets[0].data) * 1.1,
                                                    },
                                                    x: {
                                                        type: 'category',
                                                    },
                                                },
                                                plugins: {
                                                    legend: { position: 'top' },
                                                    tooltip: { mode: 'index', intersect: false },
                                                },
                                            }}
                                            key={chartKey} // Use the chartKey as a key
                                        />
                                    </div>
                                )}


                                <Form.Label htmlFor="zone" className="font-weight-bold">
                                    Electoral Area:
                                </Form.Label>
                                <Form.Control
                                    as="select"
                                    name="zone"
                                    id="zone"
                                    value={zone}
                                    onChange={handleZoneChange}
                                >
                                    <option value="All electoral areas">All electoral areas</option>
                                    {electoralAreas.map((area, index) => (
                                        <option key={index} value={area}>
                                            {area}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label htmlFor="bussType" className="font-weight-bold">
                                    Business Type/Profession:
                                </Form.Label>
                                <Form.Control
                                    as="select"
                                    name="bussType"
                                    id="bussType"
                                    value={bussType}
                                    onChange={(e) => setBussType(e.target.value)}
                                >
                                    <option value="All business types">All business types</option>
                                    {bussTypes.map((businessType, index) => (
                                        <option key={index} value={businessType.business_type}>
                                            {businessType.business_type}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label htmlFor="firstDate" className="font-weight-bold">
                                    First Payment Date:
                                </Form.Label>
                                <Form.Control
                                    type="date"
                                    name="firstDate"
                                    id="firstDate"
                                    value={firstDate}
                                    onChange={handleFirstDateChange}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label htmlFor="lastDate" className="font-weight-bold">
                                    Last Payment Date:
                                </Form.Label>
                                <Form.Control
                                    type="date"
                                    name="lastDate"
                                    id="lastDate"
                                    value={lastDate}
                                    onChange={handleLastDateChange}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <div className="d-flex justify-content-between">
                                    <Button variant="success" onClick={handleProduceReport} disabled={isLoading}>
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
                            </Form.Group>
                        </Form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FrmManagementSummariseReport;






// import React, { useState, useEffect } from 'react';
// import { useAppDispatch, useAppSelector } from '../../hooks';
// import { useNavigate } from 'react-router-dom';
// import { Form, Button, Alert, Table, Spinner } from 'react-bootstrap'
// import { fetchElectoralAreas } from '../electoralArea/electoralAreaSlice';
// import { fetchBusinessTypes } from '../businessType/businessTypeSlice';
// import { fetchBusTypeSummaryReports, BusTypeSummaryReport } from './BusTypeSummaryReportSlice';
// import { Bar } from 'react-chartjs-2';

// interface BusinessTypeData {
//     Business_Type: string;
//     buss_type?: string;
//     business_type?: string;
// }

// const FrmManagementSummariseReport: React.FC = () => {
//     const [zone, setZone] = useState<string>('');
//     const [electoralAreas, setElectoralAreas] = useState<string[]>([]);
//     const [bussType, setBussType] = useState<string>('');
//     const [firstDate, setFirstDate] = useState<string>('');
//     const [lastDate, setLastDate] = useState<string>('');
//     const [bussTypes, setBussTypes] = useState<BusinessTypeData[]>([]);
//     const [error, setError] = useState<string>('');
//     const [isLoading, setIsLoading] = useState<boolean>(false);
//     const [managementReport, setManagementReport] = useState<BusTypeSummaryReport[]>([]);
//     const [totalBalance, setTotalBalance] = useState<number>(0);

//     const navigate = useNavigate();
//     const dispatch = useAppDispatch();

//     useEffect(() => {
//         dispatch(fetchElectoralAreas());
//         dispatch(fetchBusinessTypes());
//     }, [dispatch]);

//     const managementReportData = useAppSelector((state) => state.reports.reports);

//     useEffect(() => {
//         setManagementReport(managementReportData);
//     }, [managementReportData]);

//     useEffect(() => {
//         const total = managementReport.reduce((acc, curr) => acc + (curr.amountdue - curr.amountpaid), 0);
//         //totalBalance = total
//         setTotalBalance(total);
//     }, [managementReport]);

//     const electoralAreaData = useAppSelector((state) => state.electoralArea.electoralAreas);

//     useEffect(() => {
//         if (Array.isArray(electoralAreaData)) {
//             setElectoralAreas(electoralAreaData.map((area) => area.electoral_area));
//         } else {
//             console.error('Expected electoralAreaData to be an array but got:', electoralAreaData);
//         }
//     }, [electoralAreaData]);

//     const businessTypes = useAppSelector((state) => state.businessType.businessTypes);

//     useEffect(() => {
//         if (Array.isArray(businessTypes)) {
//             setBussTypes(businessTypes);
//         }
//     }, [businessTypes]);

//     const handleZoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         setZone(e.target.value);
//     };

//     const handleFirstDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         setFirstDate(e.target.value);
//     };

//     const handleLastDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         setLastDate(e.target.value);
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

//             if (answer && answer.payload) {
//                 setManagementReport(answer.payload);
//             }
//         } catch (error: unknown) {
//             if (error instanceof Error){
//                  setError(error.message);
//             }
           
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const businessList = managementReport.map((report) => ({
//         electoral_area: report.electoral_area,
//         buss_type: report.buss_type,
//         amountdue: report.amountdue,
//         amountpaid: report.amountpaid,
//         balance: report.amountdue - report.amountpaid
//     }));

//     // Chart data
//     const chartData = {
//         labels: businessList.map(business => business.electoral_area), // Use electoral_area as labels
//         datasets: [
//             {
//                 label: 'Amount Due',
//                 data: businessList.map(business => business.amountdue),
//                 backgroundColor: 'rgba(255, 99, 132, 0.5)',
//             },
//             {
//                 label: 'Amount Paid',
//                 data: businessList.map(business => business.amountpaid),
//                 backgroundColor: 'rgba(54, 162, 235, 0.5)',
//             },
//             {
//                 label: 'Balance',
//                 data: businessList.map(business => business.balance),
//                 backgroundColor: 'rgba(75, 192, 192, 0.5)',
//             },
//         ],
//     };

//     return (
//         <div>
//             <div className="container mt-5">
//                 {error && <Alert color="danger">{error}</Alert>}
//                 {isLoading ? (
//                     <div className="text-center">
//                         <Spinner style={{ width: '3rem', height: '3rem' }} />
//                     </div>
//                 ) : (
//                     <div>
//                         <p>Total Balance: {totalBalance}</p>
//                         <Form>
//                             <Form.Group>
//                                 <p className="text-center text-underline">Produce Daily Payments Report</p>

//                                 {/* Render the Bar chart here */}
//                                 <Bar data={chartData} />

//                                 <Form.Label for="zone" className="font-weight-bold">Electoral Area:</Form.Label>
//                                 <Form.Control type="select" name="zone" id="zone" value={zone} onChange={handleZoneChange}>
//                                     <option value="All electoral areas">All electoral areas</option>
//                                     {electoralAreas.map((area, index) => (
//                                         <option key={index} value={area}>{area}</option>
//                                     ))}
//                                 </Form.Control>
//                             </Form.Group>
//                             <Form.Group>
//                                 <Form.Label for="bussType" className="font-weight-bold">Business Type/Profession:</Form.Label>
//                                 <Form.Control as="select" name="bussType" id="bussType" value={bussType} onChange={(e) => setBussType(e.target.value)}>
//                                     <option value="All business types">All business types</option>
//                                     {bussTypes.map((businessType, index) => (
//                                         <option key={index} value={businessType.business_type}>
//                                             {businessType.business_type}
//                                         </option>
//                                     ))}
//                                 </Form.Control>
//                             </Form.Group>
//                             <Form.Group>
//                                 <Form.Label for="firstDate" className="font-weight-bold">First Payment Date:</Form.Label>
//                                 <Form.Control
//                                     type="date"
//                                     name="firstDate"
//                                     id="firstDate"
//                                     value={firstDate}
//                                     onChange={handleFirstDateChange}
//                                 />
//                             </Form.Group>
//                             <Form.Group>
//                                 <Form.Label for="lastDate" className="font-weight-bold">Last Payment Date:</Form.Label>
//                                 <Form.Control
//                                     type="date"
//                                     name="lastDate"
//                                     id="lastDate"
//                                     value={lastDate}
//                                     onChange={handleLastDateChange}
//                                 />
//                             </Form.Group>
//                             <Form.Group>
//                                 <div className="d-flex justify-content-between">
//                                     <Button color="success" onClick={handleProduceReport} disabled={isLoading}>
//                                         Produce Summarized Report
//                                     </Button>
//                                     <Button variant="secondary" onClick={() => navigate("/main")} style={{ marginLeft: '40px', marginTop: '10px' }}>
//                                         Go Back
//                                     </Button>
//                                     <Table striped bordered hover className="mt-3">
//                                         <thead>
//                                             <tr>
//                                                 <th>Electoral Area</th>
//                                                 <th>Business Type/Profession</th>
//                                                 <th>Amount Due</th>
//                                                 <th>Amount Paid</th>
//                                                 <th>Balance</th>
//                                             </tr>
//                                         </thead>
//                                         <tbody>
//                                             {businessList.map((business, index) => (
//                                                 <tr key={index}>
//                                                     <td>{business.electoral_area}</td>
//                                                     <td>{business.buss_type}</td>
//                                                     <td>{business.amountdue}</td>
//                                                     <td>{business.amountpaid}</td>
//                                                     <td>{business.balance}</td>
//                                                 </tr>
//                                             ))}
//                                         </tbody>
//                                     </Table>
//                                 </div>
//                             </Form.Group>
//                         </Form>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default FrmManagementSummariseReport;










































