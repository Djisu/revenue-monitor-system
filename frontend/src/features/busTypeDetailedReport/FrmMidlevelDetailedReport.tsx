import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { Container, Form, Button, Alert, Table, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { fetchElectoralAreas } from '../electoralArea/electoralAreaSlice';
import { fetchBusinessTypes } from '../businessType/businessTypeSlice';
import { BusTypeDetailedReport, fetchDetailedReports } from './busTypeDetailedReportSlice';

interface Business {
  electroral_area: string;
  buss_no: number;
  buss_name: string;
  buss_type: string;
  amountdue: number;
  amountpaid: number;
}

interface SummarizedArea {
  electoral_area: string;
  totalAmountDue: number;
  totalAmountPaid: number;
  totalBalance: number;
  businesses: Business[];
}

interface BusinessTypeData {
  Business_Type: string;
  buss_type?: string;
  business_type?: string;
}

const FrmMidlevelDetailedReport: React.FC = () => {
  const [zone, setZone] = useState<string>('All electoral areas');
  const [electoralAreas, setElectoralAreas] = useState<string[]>([]);
  const [bussTypes, setBussTypes] = useState<BusinessTypeData[]>([]);
  const [busDetailedReport, setBusDetailedReport] = useState<BusTypeDetailedReport[]>([]);
  const [businessType, setBusinessType] = useState<string>('');
  const [fiscalYear, setFiscalYear] = useState<string>(new Date().getFullYear().toString());
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>(''); 
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Fetch data on component mount
  useEffect(() => {
    dispatch(fetchElectoralAreas());
    dispatch(fetchBusinessTypes());
  }, [dispatch]);

  const electoralAreaData = useAppSelector((state) => state.electoralArea.electoralAreas);
  const businessTypes = useAppSelector((state) => state.businessType.businessTypes); 
  const busTypeDetailedReport = useAppSelector((state) => state.busTypedetailedReport.reports);

  useEffect(() => {
    if (Array.isArray(electoralAreaData)) {
      setElectoralAreas(electoralAreaData.map((area) => area.electroral_area));
    }
  }, [electoralAreaData]);

  useEffect(() => {
    if (Array.isArray(businessTypes)) {
      setBussTypes(businessTypes);
    }
  }, [businessTypes]);

  useEffect(() => {
    if (Array.isArray(busTypeDetailedReport)) {
      setBusDetailedReport(busTypeDetailedReport);
    }
  }, [busTypeDetailedReport]);

  const handleBusinessTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setBusinessType(e.target.value);
  };

  const handleZoneChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setZone(e.target.value);
  };

  const handleLastDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiscalYear(e.target.value);
  };

  const handleViewClick = async () => {
    if (!fiscalYear) {
      setError('Please select the current fiscal year');
      return;
    }

    setLoading(true);
    const reportData = { zone, businessType, fiscalYear };

    try {
      const answer = await dispatch(fetchDetailedReports(reportData));

      if (answer && Array.isArray(answer.payload)) {
        setBusDetailedReport(answer.payload);
        setSuccessMessage('Report produced successfully');
        setError('');
      } else if (answer.meta.requestStatus === 'rejected') {
        setError('Error producing report');
      }
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const groupedData = busDetailedReport.reduce<Record<string, SummarizedArea>>((acc, report) => {
    const area = report.electoral_area;

    if (!area) return acc;

    if (!acc[area]) {
      acc[area] = {
        electoral_area: area,
        totalAmountDue: 0,
        totalAmountPaid: 0,
        totalBalance: 0,
        businesses: [],
      };
    }

    const amountDue = Number(report.amountdue) || 0;
    const amountPaid = Number(report.amountpaid) || 0;

    acc[area].totalAmountDue += amountDue;
    acc[area].totalAmountPaid += amountPaid;
    acc[area].totalBalance = acc[area].totalAmountDue - acc[area].totalAmountPaid;

    acc[area].businesses.push({
      electroral_area: area,
      buss_no: report.buss_no,
      buss_name: report.buss_name,
      buss_type: report.buss_type,
      amountdue: amountDue,
      amountpaid: amountPaid,
    });

    return acc;
  }, {});

  const summarizedList: SummarizedArea[] = Object.values(groupedData);

  const calculateGrandTotals = (reports: BusTypeDetailedReport[]) => {
    let totalDue = 0;
    let totalPaid = 0;
    let totalBal = 0;

    reports.forEach(report => {
      const amountDue = Number(report.amountdue) || 0;
      const amountPaid = Number(report.amountpaid) || 0;
      totalDue += amountDue;
      totalPaid += amountPaid;
      totalBal += (amountDue - amountPaid);
    });

    return { totalDue, totalPaid, totalBal };
  };

  const { totalDue: grandTotalAmountDue, totalPaid: grandTotalAmountPaid, totalBal: grandTotalBalance } = calculateGrandTotals(busDetailedReport);

  return (
    <Container>     
      {error && <Alert variant="danger">{error}</Alert>}
      {successMessage && <Alert variant="success">{successMessage}</Alert>}
      <div>
        <Form>
          <p className="text-center mb-4">Mid Level Detailed Report</p>
          <Form.Group controlId="formZone">
            <Form.Label>Electoral Area:</Form.Label>
            <Form.Select value={zone} onChange={handleZoneChange}>
              <option value="All electoral areas">All electoral areas</option>
              {electoralAreas.map((area, index) => (
                <option key={index} value={area}>{area}</option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group controlId="formBussType">
            <Form.Label>Business Type/Profession:</Form.Label>
            <Form.Select value={businessType} onChange={handleBusinessTypeChange}>
              <option value="All business types">All business types</option>
              {bussTypes.map((businessType, index) => (
                <option key={index} value={businessType.business_type}>
                  {businessType.business_type}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group controlId="formFiscalYear">
            <Form.Label>Current Fiscal Year:</Form.Label>
            <Form.Control
              type="text"
              value={fiscalYear}
              onChange={handleLastDateChange}
            />
          </Form.Group>
          <div>
            <Button variant="primary" onClick={handleViewClick} style={{ marginTop: '10px' }}>
              Produce Report
            </Button>
            <Button variant="secondary" onClick={() => navigate("/main")} style={{ marginLeft: '40px', marginTop: '10px' }}>
              Go Back
            </Button>
          </div>
          {loading && (
            <div className="text-center mt-3">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          )}
        </Form>

        <Table striped bordered hover className="mt-3">
          <thead>
            <tr>
              <th>Electoral Area</th>          
              <th>Business Name</th>
              <th>Business Type/Profession</th>
              <th>Amount Due</th>
              <th>Amount Paid</th>
              <th>Balance</th>
            </tr>
          </thead>
          <tbody>
            {summarizedList.map((area, index) => {
              const isFirstBusiness = index === 0 || area.electoral_area !== summarizedList[index - 1].electoral_area;

              if (isFirstBusiness) {
                return (
                  <React.Fragment key={index}>
                    <tr>
                      <td rowSpan={area.businesses.length + 1}>{area.electoral_area || 'N/A'}</td>
                      <td>{area.businesses[0]?.buss_name || 'N/A'}</td>
                      <td>{area.businesses[0]?.buss_type || 'N/A'}</td>
                      <td>{area.businesses[0]?.amountdue.toFixed(2)}</td>
                      <td>{area.businesses[0]?.amountpaid.toFixed(2)}</td>
                      <td>{(area.businesses[0]?.amountdue - area.businesses[0]?.amountpaid).toFixed(2)}</td>
                    </tr>
                    {area.businesses.slice(1).map((business) => (
                      <tr key={business.buss_no}>
                        <td>{business.buss_name || 'N/A'}</td>
                        <td>{business.buss_type || 'N/A'}</td>
                        <td>{business.amountdue.toFixed(2)}</td>
                        <td>{business.amountpaid.toFixed(2)}</td>
                        <td>{(business.amountdue - business.amountpaid).toFixed(2)}</td>
                      </tr>
                    ))}
                    <tr style={{ fontWeight: 'bold' }}>
                      <td colSpan={2}>Total for {area.electoral_area}</td>
                      <td>{area.totalAmountDue.toFixed(2)}</td>
                      <td>{area.totalAmountPaid.toFixed(2)}</td>
                      <td>{area.totalBalance.toFixed(2)}</td>
                    </tr>
                  </React.Fragment>
                );
              } else {
                return null;
              }
            })}
            {/* Render Grand Total Row */}
            <tr style={{ fontWeight: 'bold', backgroundColor: '#f0f0f0' }}>
              <td colSpan={3}>Grand Total</td>
              <td>{grandTotalAmountDue.toFixed(2)}</td>
              <td>{grandTotalAmountPaid.toFixed(2)}</td>
              <td>{grandTotalBalance.toFixed(2)}</td>
            </tr>
          </tbody>                  
        </Table>
      </div>      
    </Container>
  );
};

export default FrmMidlevelDetailedReport;



























// import React, { useState, useEffect } from 'react';
// import { useAppDispatch, useAppSelector } from '../../hooks';
// import { Container, Form, Button, Alert, Table, Spinner } from 'react-bootstrap';
// import { useNavigate } from 'react-router-dom';
// import { fetchElectoralAreas } from '../electoralArea/electoralAreaSlice';
// import { fetchBusinessTypes } from '../businessType/businessTypeSlice';
// import { BusTypeDetailedReport, fetchDetailedReports } from '../busTypeDetailedReport/busTypeDetailedReportSlice';

// interface Business {
//   electroral_area: string;
//   buss_no: number; // Changed from string to number
//   buss_name: string;
//   buss_type: string;
//   amountdue: number;
//   amountpaid: number;
// }

// interface SummarizedArea {
//   electoral_area: string;
//   totalAmountDue: number;
//   totalAmountPaid: number;
//   totalBalance: number;
//   businesses: Business[];
// }

// interface BusinessTypeData {
//   Business_Type: string; // This matches your API response
//   buss_type?: string; // Optional if it's not always present
//   business_type?: string
// }

// // interface BusTypeDetailedReportX {
// //   electoral_area: string;
// //   buss_no: number; // Ensure this is a number
// //   buss_name: string;
// //   buss_type: string;
// //   amountdue: number;
// //   amountpaid: number;
// // }

// // interface BusinessTypeDetailedReport {
// //   electroral_area: string;
// //   buss_no: number;
// //   buss_name: string;
// //   buss_type: string;
// //   amountdue: number;
// //   amountpaid: number;
// //   balance: number;
// //   tot_grade: string;
// // }

// // interface ElectoralArea {
// //   electroral_area: string;
// // }

// // interface FiscalYear {
// //   fiscal_year: number;
// // }

// // interface reportAdd {
// //   zone: string;
// //   businessType: string;
// //   fiscalYear: string;
// // }

// const FrmMidlevelDetailedReport: React.FC = () => {
//   let [zone, setZone] = useState<string>('');

//   let [electoralAreas, setElectoralAreas] = useState<string[]>([]);
//   let [bussTypes, setBussTypes] = useState<BusinessTypeData[]>([]);

//  // let [businessList] = useState<BusTypeDetailedReport[]>([]);
//   let [busDetailedReport, setBusDetailedReport] = useState<BusTypeDetailedReport[]>([]);

//   let [businessType, setBusinessType] = useState<string>('');
//   let [fiscalYear, setFiscalYear] = useState<string>(new Date().getFullYear().toString());
 
  
//   let [error, setError] = useState<string>('');
//   let [successMessage, setSuccessMessage] = useState<string>(''); 
//   let [loading, setLoading] = useState<boolean>(false); // Loading state

//   // Local states for totals and grand totals
//   let [totalAmountDue, setTotalAmountDue] = useState<number>(0);
//   let [totalAmountPaid, setTotalAmountPaid] = useState<number>(0);
//   let [totalBalance, setTotalBalance] = useState<number>(0);
//   let [grandTotalAmountDue, setGrandTotalAmountDue] = useState<number>(0);
//   let [grandTotalAmountPaid, setGrandTotalAmountPaid] = useState<number>(0);
//   let [grandTotalBalance, setGrandTotalBalance] = useState<number>(0);


//   let reportData: any = {
//     zone,
//     businessType,
//     fiscalYear
//   }

//   const navigate = useNavigate(); // Initialize the useNavigate hook  

//   const dispatch = useAppDispatch();

//   // Fetch data on component mount
//   useEffect(() => {
//     dispatch(fetchElectoralAreas());
//     dispatch(fetchBusinessTypes());
//   }, [dispatch]);

//   useEffect(() => {
//     dispatch(fetchElectoralAreas());
//   }, [dispatch]);

//   useEffect(() => {
//     console.log('about to dispatch(fetchDetailedReports())');
//     dispatch(fetchDetailedReports(reportData)); // Make sure this is triggered correctly
// }, [dispatch]);

//   // Get electoral areas from the Redux store // as ElectoralArea[];
//   const busTypeDetailedReport = useAppSelector((state) => state.busTypedetailedReport.reports)
//   useEffect(() => {
//     if (Array.isArray(busTypeDetailedReport)) {
//         setBusDetailedReport(busTypeDetailedReport); // Correct this line
//         console.log('busTypeDetailedReport: ', busTypeDetailedReport);
//     }
// }, [busTypeDetailedReport]);


//   const electoralAreaData = useAppSelector((state) => state.electoralArea.electoralAreas) ;

//   //console.log('typeof electoralAreaData:', typeof electoralAreaData)

//   useEffect(() => {
//     if (electoralAreaData && Array.isArray(electoralAreaData)) {
//         setElectoralAreas(electoralAreaData.map((area) => area.electoral_area));
//         //console.log('electoralAreas: ', electoralAreas)
//     } else {
//         console.error('Expected electoralAreaData to be an array but got:', electoralAreaData);
//     }
//   }, [electoralAreaData, setElectoralAreas]);


//   const businessTypes = useAppSelector((state) => state.businessType.businessTypes); 
//   //console.log('businessTypes: ', businessTypes);
  
//   useEffect(() => {
//     if (Array.isArray(businessTypes)) {
//       setBussTypes(businessTypes); // Update local state with fetched data
//     }
//   }, [businessTypes]); // Dependency array includes businessTypes

//   const handleBusinessTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     setBusinessType(e.target.value);
//   };

//   const handleZoneChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const selectedZone = e.target.value;
//     setZone(selectedZone);

//     // You can log or handle the selected value here
//     //console.log('Selected Zone:', selectedZone);
//   };


// //   const handleLastDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// //     setFiscalYear(e.target.value);
// //   };

// const handleLastDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFiscalYear(e.target.value);
// };

// const handleViewClick = async () => {
//     console.log('in handleViewClick');

//     if (!fiscalYear) {
//         setError('Please select the current fiscal year');
//         return;
//     }

//     setLoading(true); // Set loading to true

//     try {
//         console.log('about to dispatch(fetchDetailedReports(reportData))')

//         const answer = await dispatch(fetchDetailedReports(reportData));

//         console.log('answer from the thunk: ', answer.payload);
//         setLoading(false);

//         if (answer && answer.payload) {
//             // Handle successful response
//             reportData = answer.payload;

//             setBusDetailedReport(reportData);
//             console.log('busDetailedReport: ', busDetailedReport);

//             if (busDetailedReport.length === 0){
//               setLoading(false); // Set loading to false
//               setError('No businesses found for the selected criteria.');
//               setSuccessMessage('');
//             }
//             setLoading(false); // Set loading to false

//             setError(''); // Clear error if request is successful
//             setSuccessMessage('Report produced successfully');
//         } else if (answer.meta.requestStatus === 'rejected') {
//             // Handle rejected case
//             if ('error' in answer) {
//                 console.error('Error fetching reports:', answer.error);

//                 // Check if the error message is in the error object
//                 if (typeof answer.error === 'string' && answer.error === 'No businesses found') {
//                     setError('No businesses found for the selected criteria.');
//                 } else {
//                     setError('Error producing report');
//                 }

//                 setSuccessMessage('');
//             }
//         }
//     } catch (error) {
//         console.error(error);
//         setError('An unexpected error occurred');
//         setSuccessMessage('');
//     } finally {
//         setLoading(false); // Set loading to false after the fetch completes
//     }
// };


//   // const handleExitClick = () => {
//   //   window.location.href = '/'; // Redirect to main page or hide the form
//   // };

// //  let totalBalance: number = 0;
// //   businessList.forEach((business) => {
// //     totalBalance += business.amountdue - business.amountpaid;
// //   });

// //   console.log('totalBalance: ', totalBalance)

// // let grandTotalAmountDue = 0; 
// // let grandTotalAmountPaid = 0; 
// // let grandTotalBalance = 0;

// const groupedData = busDetailedReport.reduce<Record<string, SummarizedArea>>((acc, report) => {
//   const area = report.electoral_area;

//   if (!area) return acc;

//   if (!acc[area]) {
//       acc[area] = {
//           electoral_area: area,
//           totalAmountDue: 0,
//           totalAmountPaid: 0,
//           totalBalance: 0,
//           businesses: []
//       };
//   }

//   const amountDue = Number(report.amountdue) || 0;
//   const amountPaid = Number(report.amountpaid) || 0;

//   acc[area].totalAmountDue += amountDue;
//   acc[area].totalAmountPaid += amountPaid;
//   acc[area].totalBalance = acc[area].totalAmountDue - acc[area].totalAmountPaid;

//   // grandTotalAmountDue += amountDue;
//   // grandTotalAmountPaid += amountPaid;
//   // grandTotalBalance = grandTotalAmountDue - grandTotalAmountPaid;

//   // console.log(groupedData);
//   // console.log("Grand Total Due:", grandTotalAmountDue);
//   // console.log("Grand Total Paid:", grandTotalAmountPaid);
//   // console.log("Grand Total Balance:", grandTotalBalance);

//   acc[area].businesses.push({
//       electroral_area: area,
//       buss_no: report.buss_no,
//       buss_name: report.buss_name,
//       buss_type: report.buss_type,
//       amountdue: amountDue,
//       amountpaid: amountPaid
//   });

//   return acc;
// }, {});

// const summarizedList: SummarizedArea[] = Object.values(groupedData);


// const calculateTotals = (reports: BusTypeDetailedReport[]) => {
//   let totalDue = 0;
//   let totalPaid = 0;
//   let totalBal = 0;

//   reports.forEach(report => {
//     const amountDue = Number(report.amountdue) || 0;
//     const amountPaid = Number(report.amountpaid) || 0;
//     totalDue += amountDue;
//     totalPaid += amountPaid;
//     totalBal += (amountDue - amountPaid);
//   });

//   // Set totals using state setter functions
//   setTotalAmountDue(totalDue);
//   setTotalAmountPaid(totalPaid);
//   setTotalBalance(totalBal);
// };

// calculateTotals(busDetailedReport)

//   return (
//     <Container>     
//       {error && <Alert variant="danger">{error}</Alert>}
//       {successMessage && <Alert variant="success">{successMessage}</Alert>}
//       <div>
//       <Form>
//          <p className="text-center mb-4">Mid Level Detailed Report</p>
//         <Form.Group controlId="formZone">
//           <Form.Label>Electoral Area:- Select any electoral area then select All electoral areas </Form.Label>
//           <Form.Select value={zone} onChange={handleZoneChange}>
//             <option value="All electoral areas">All electoral areas</option>
//             {electoralAreas.map((area, index) => (
//               <option key={index} value={area}>{area}</option>
//             ))}
//           </Form.Select>
//         </Form.Group>

//         <Form.Group controlId="formBussType">
//           <Form.Label>Business Type/Profession:</Form.Label>
//           <Form.Select value={businessType} onChange={handleBusinessTypeChange}>
//             <option value="All business types">All business types</option>
//             {bussTypes.map((businessType, index) => (
//               <option key={index} value={businessType.business_type}>
//                 {businessType.business_type}
//               </option>
//             ))}
//           </Form.Select>
//         </Form.Group>

//         <Form.Group controlId="formFiscalYear">
//           <Form.Label>Current Fiscal Year:</Form.Label>
//           <Form.Control
//             type="text"
//             value={fiscalYear}
//             onChange={handleLastDateChange}
//           />
//         </Form.Group>
//         <div>
//           <Button variant="primary" onClick={handleViewClick} style={{ marginTop: '10px' }}>
//             Produce Report
//           </Button>
                  
//           <Button variant="secondary" onClick={() => navigate("/main")} style={{ marginLeft: '40px',  marginTop: '10px' }}>
//               Go Back
//           </Button>
//         </div>
//         {loading && (
//           <div className="text-center mt-3">
//             <Spinner animation="border" role="status">
//               <span className="visually-hidden">Loading...</span>
//             </Spinner>
//           </div>
//         )}
//       </Form>

//       <Table striped bordered hover className="mt-3">
//         <thead>
//           <tr>
//             <th>Electoral Area</th>          
//             <th>Business Name</th>
//             <th>Business Type/Profession</th>
//             <th>Amount Due</th>
//             <th>Amount Paid</th>
//             <th>Balance</th>
//           </tr>
//         </thead>
//         <tbody>
//             {summarizedList.map((area, index) => {
//                 const isFirstBusiness = index === 0 || area.electoral_area !== summarizedList[index - 1].electoral_area;

//                 if (isFirstBusiness) {
//                     return (
//                         <React.Fragment key={index}>
//                             <tr>
//                                 <td rowSpan={area.businesses.length + 1}>{area.electoral_area || 'N/A'}</td>
//                                 <td>{area.businesses[0]?.buss_name || 'N/A'}</td>
//                                 <td>{area.businesses[0]?.buss_type || 'N/A'}</td>
//                                 <td>{isNaN(area.totalAmountDue) ? '0.00' : area.totalAmountDue}</td>
//                                 <td>{isNaN(area.totalAmountPaid) ? '0.00' : area.totalAmountPaid}</td>
//                                 <td>{isNaN(area.totalBalance) ? '0.00' : area.totalBalance}</td>
//                             </tr>
//                             {area.businesses.slice(1).map((business) => (
//                                 <tr key={business.buss_no}>
//                                     <td>{business.buss_name || 'N/A'}</td>
//                                     <td>{business.buss_type || 'N/A'}</td>
//                                     <td>{isNaN(business.amountdue) ? '0.00' : business.amountdue}</td>
//                                     <td>{isNaN(business.amountpaid) ? '0.00' : business.amountpaid}</td>
//                                     <td>{isNaN(business.amountdue - business.amountpaid) ? '0.00' : (business.amountdue - business.amountpaid)}</td>
//                                 </tr>
//                             ))}
//                             <tr style={{ fontWeight: 'bold' }}>
//                                 <td colSpan={3}>Total for {area.electoral_area}</td>
//                                 <td>{isNaN(area.totalAmountDue) ? '0.00' : area.totalAmountDue}</td>
//                                 <td>{isNaN(area.totalAmountPaid) ? '0.00' : area.totalAmountPaid}</td>
//                                 <td>{isNaN(area.totalBalance) ? '0.00' : area.totalBalance}</td>
//                             </tr>
//                         </React.Fragment>
//                     );
//                 } else {
//                     return null;
//                 }
//             })}
//             {/* Render Grand Total Row */}
//             <tr style={{ fontWeight: 'bold', backgroundColor: '#f0f0f0' }}>
//               <td colSpan={3}>Grand Total</td>
//               <td>{grandTotalAmountDue.toFixed(2)}</td>
//               <td>{grandTotalAmountPaid.toFixed(2)}</td>
//               <td>{grandTotalBalance.toFixed(2)}</td>
//             </tr>
//         </tbody>
//        </Table>
//       </div>      
//     </Container>
//   );
// };

// export default FrmMidlevelDetailedReport;

