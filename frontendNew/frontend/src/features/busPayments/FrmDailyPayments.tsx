import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../app/store';
import { Form, FormGroup, Label, Input, Button, Alert } from 'reactstrap';
import { fetchElectoralAreas } from '../electoralArea/electoralAreaSlice';
import { fetchBusinessTypes } from '../businessType/businessTypeSlice';
import { BusPaymentsData, fetchDailyPayments, FetchDailyPaymentsArgs, selectBusPayments } from './busPaymentsSlice';
import PaymentsTable from './PaymentsTable';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
//import { escape } from 'querystring';

interface BusinessTypeData {
    Business_Type: string; // This matches your API response
    buss_type?: string; // Optional if it's not always present
    business_type?: string
  }
  
const FrmDailyPayments: React.FC = () => {
    let [electoralArea, setElectoralArea] = useState<string>('');
    //let [electoralAreasData, setElectoralAreasData] = useState<ElectoralArea[]>([]);//
    let [selectedBusinessType, setSelectedBusinessType] = useState<string>('');
    let [firstDate, setFirstDate] = useState<string>('');
    let [lastDate, setLastDate] = useState<string>('');
    const [bussTypes, setBussTypes] = useState<BusinessTypeData[]>([]);
    let [errorx, setErrorx] = useState<string>('');

    let [busPaymentsData, setBusPaymentsData] = useState<BusPaymentsData[]>([]);
 
 
    let dispatch = useAppDispatch();

    let { electoralAreas, loading, error } = useAppSelector(state => state.electoralArea);

    const businessTypes = useAppSelector((state) => state.businessType.businessTypes); // as BusinessTypeData[]
    console.log('businessTypes: ', businessTypes);

    useEffect(() => {
        if (Array.isArray(businessTypes)) {
            setBussTypes(businessTypes); // Update local state with fetched data
        }
    }, [businessTypes]); // Dependency array includes businessTypes

    if (Array.isArray(businessTypes)){
        console.log('businessTypes  is an array')
    }else{
        console.log('IT IS NOT AN ARRAY')
    }


    // Check entire Redux state (for debugging)
    //const entireState = useAppSelector((state) => state);
    //console.log('Entire Redux State:', entireState);


    let busPayments = useAppSelector(selectBusPayments);
    console.log('busPayments:', busPayments);
   
    useEffect(() => {
        dispatch(fetchElectoralAreas());
        dispatch(fetchBusinessTypes());
      }, [dispatch]);
    
    useEffect(() => {
        console.log('Fetched business types:', businessTypes);
    }, [businessTypes]);


    const handleViewClick = async () => {
        console.log('Inside handleViewClick');
        if (!electoralArea) {
            setErrorx("Please select an electoral area");
            return;
        }
        if (!selectedBusinessType) {
            setErrorx("Please select a business type");
            return;
        }
        if (!firstDate) {
            setErrorx("Please select a first date");
            return;
        }
        if (!lastDate) {
            setErrorx("Please select a last date");
            return;
        }

        try {
            const DailyPaymentsData: FetchDailyPaymentsArgs = {
                firstDate: new Date(firstDate),
                lastDate: new Date(lastDate),
                electoralarea: electoralArea,
                bussType: selectedBusinessType,
            };

            console.log('DailyPaymentsData:', DailyPaymentsData)

            const answer = await dispatch(fetchDailyPayments(DailyPaymentsData));
            console.log('answer:', answer)

            if (answer.payload){
                busPaymentsData = answer.payload
                setBusPaymentsData(busPaymentsData)
            }
            console.log('busPaymentsData:', busPaymentsData)
        } catch (error) {
            console.error("Error fetching daily payments:", error);
            setErrorx("Error fetching daily payments");
            alert("Error fetching daily payments");
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error || errorx) {
        return <div>Error: {error || errorx}</div>;
    }

    return (
        <div className="container mt-5">
            {errorx && <Alert color="danger">{errorx}</Alert>}
            <Form>
                <FormGroup>
                    <p className="text-center text-underline">Produce Daily Payments Report</p>
                    <Label for="zone" className="font-weight-bold">Electoral Area:</Label>
                    <Input 
                        type="select" 
                        name="electoral_area" 
                        id="electoral_area" 
                        value={electoralArea} 
                        onChange={(e) => setElectoralArea(e.target.value)}
                    >
                        <option value="">Select...</option>
                        {electoralAreas.map((area, index) => (
                            <option key={index} value={area.electoral_area}>
                                {area.electoral_area}
                            </option>
                        ))}
                    </Input>
                </FormGroup>
                <FormGroup>
                    <Label for="bussType" className="font-weight-bold">Business Type/Profession:</Label>
                    <Input 
                           type="select" 
                           name="bussType" 
                           id="bussType" 
                           value={selectedBusinessType} 
                           onChange={(e) => setSelectedBusinessType(e.target.value)} 
                          
                    >
                        <option value="">Select Business Type</option>
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
                        onChange={(e) => setFirstDate(e.target.value)} 
                    />
                </FormGroup>
                <FormGroup>
                    <Label for="lastDate" className="font-weight-bold">Last Payment Date:</Label>
                    <Input 
                        type="date" 
                        name="lastDate" 
                        id="lastDate" 
                        value={lastDate} 
                        onChange={(e) => setLastDate(e.target.value)} 
                    />
                </FormGroup>
                <FormGroup>
                    <div className="d-flex justify-content-between">
                        <Button color="primary" onClick={handleViewClick}>Produce Report</Button>
                    </div>
                    <Link to="/main" className="primary m-3">Go Back</Link>
                </FormGroup>
            </Form>

            <PaymentsTable busPaymentsData={busPaymentsData} />
        </div>
    );
};

export default FrmDailyPayments;








// import React, { useState, useEffect } from 'react';
// import { useAppSelector, useAppDispatch } from '../../app/store'
// import { Form, FormGroup, Label, Input, Button, Alert } from 'reactstrap';
// import { fetchElectoralAreas, ElectoralArea } from '../electoralArea/electoralAreaSlice';
// import { BusinessTypeData } from '../businessType/businessTypeSlice';
// import { fetchDailyPayments, FetchDailyPaymentsArgs, selectBusPayments } from './busPaymentsSlice';
// import {fetchBusinessTypes} from '../businessType/businessTypeSlice';
// import PaymentsTable from './PaymentsTable';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import { Link } from 'react-router-dom';


// const FrmDailyPayments: React.FC = () => {
//     let [electoralArea, setElectoralArea] = useState<string>('');
//     let [electoralAreasData, setElectoralAreasData] = useState<ElectoralArea[]>([]);
//     let [selectedBusinessType, setSelectedBusinessType] = useState<string>('');
//     //let [bussType, setBussType] = useState<string>('');
//     let [firstDate, setFirstDate] = useState<string>('');
//     let [lastDate, setLastDate] = useState<string>('');
//     let [bussTypes, setBussTypes] = useState<BusinessTypeData[]>([]);

//     //let [paymentDates, setPaymentDates] = useState<string[]>([]);
//     let [errorx, setErrorx] = useState<string>('');

//     let { electoralAreas, loading, error } = useAppSelector(state => state.electoralArea);
//     let dispatch = useAppDispatch();

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 await dispatch(fetchElectoralAreas());
//                 await dispatch(fetchBusinessTypes());
//             } catch (error) {
//                 console.error("Error fetching data:", error);
//                 setErrorx("Error fetching data");
//             }
//         };
    
//         fetchData();
//     }, [dispatch]);

//     useEffect(() => {
//         const fetchElectoralAreasData = async () => {
//             try {
//                 await dispatch(fetchElectoralAreas());
//                 electoralAreasData = electoralAreas;
//                 setElectoralAreasData(electoralAreasData);
//             } catch (error) {
//                 console.error("Error fetching electoral areas:", error);
//                 setErrorx("Error fetching electoral areas");
//                 alert("Error fetching electoral areas");
//             }
//         };

//         fetchElectoralAreasData();
//     }, [dispatch]);

//     const businessTypes = useAppSelector((state) => state.businessType.businessTypes); // as BusinessTypeData[]
//     console.log('businessTypes: ', businessTypes);
    
//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 await dispatch(fetchElectoralAreas());
//                 await dispatch(fetchBusinessTypes());
//             } catch (error) {
//                 console.error("Error fetching data:", error);
//                 setErrorx("Error fetching data");
//             }
//         };
    
//         fetchData();
//     }, [dispatch]);

//     const busPayments = useAppSelector(selectBusPayments);

//     const handleViewClick = async () => {
//         try {
//             const DailyPaymentsData: FetchDailyPaymentsArgs = {
//                 firstDate: new Date(firstDate),
//                 lastDate: new Date(lastDate),
//                 electoralarea: electoralArea,
//                 bussType: selectedBusinessType, // Use selectedBusinessType instead
//             };
//             await dispatch(fetchDailyPayments(DailyPaymentsData));
//         } catch (error) {
//             console.error("Error fetching daily payments:", error);
//             setErrorx("Error fetching daily payments");
//             alert("Error fetching daily payments");
//         }
//     };

//     if (loading) {
//         return <div>Loading...</div>;
//     }

//     if (error || errorx) {
//         return <div>Error: {error || errorx}</div>;
//     }

//     // if (!electoralAreasData.length || !bussTypes.length || !busPayments.length) {
//     //     return <div>No data available</div>;
//     // }

//     return (
//         <div className="container mt-5">
//             {errorx && <Alert color="danger">{errorx}</Alert>}
//             <Form>
//                 <FormGroup>
//                     <p className="text-center text-underline">Produce Daily Payments Report</p>
//                     <Label for="zone" className="font-weight-bold">Electoral Area:</Label>
//                     <Input 
//                         type="select" 
//                         name="electoral_area" 
//                         id="electoral_area" 
//                         value={electoralArea} 
//                         onChange={(e) => setElectoralArea(e.target.value)}
//                     >
//                         <option value="">Select...</option>
//                         {electoralAreas.map((area, index) => (
//                             <option key={index} value={area.electoral_area}>
//                                 {area.electoral_area}
//                             </option>
//                         ))}
//                     </Input>
//                 </FormGroup>
//                 <FormGroup>
//                     <Label for="bussType" className="font-weight-bold">Business Type/Profession:</Label>
//                     <Input type="select" name="bussType" id="bussType" value={selectedBusinessType} onChange={(e) => setSelectedBusinessType(e.target.value)}>
//                         <option>Select Business Type</option>
//                         {bussTypes.length > 0 ? (
//                         bussTypes.map((businessType, index) => (
//                             <option key={index} value={businessType.Business_Type}>
//                                 {businessType.Business_Type}
//                             </option>
//                             ))
//                         ) : (
//                             <option disabled>No Business Types Available</option>
//                         )}
//                     </Input>
//                 </FormGroup>
//                 <FormGroup>
//                     <Label for="firstDate" className="font-weight-bold">First Payment Date:</Label>
//                     <Input 
//                         type="date" 
//                         name="firstDate" 
//                         id="firstDate" 
//                         value={firstDate} 
//                         onChange={(e) => setFirstDate(e.target.value)} 
//                     />
//                 </FormGroup>
//                 <FormGroup>
//                     <Label for="lastDate" className="font-weight-bold">Last Payment Date:</Label>
//                     <Input 
//                         type="date" 
//                         name="lastDate" 
//                         id="lastDate" 
//                         value={lastDate} 
//                         onChange={(e) => setLastDate(e.target.value)} 
//                     />
//                 </FormGroup>
//                 <FormGroup>
//                     <div className="d-flex justify-content-between">
//                         <Button color="primary" onClick={handleViewClick}>Produce Report</Button>
//                     </div>
//                     <Link to="/main" className="primary m-3">
//                         Go Back
//                     </Link>
//                 </FormGroup>
//             </Form>

//             <PaymentsTable busPayments={busPayments} />
//         </div>
//     );
// };

// export default FrmDailyPayments;







// // import React, { useState, useEffect } from 'react';
// // import { useAppSelector, useAppDispatch } from '../../app/store'
// // import { Form, FormGroup, Label, Input, Button, Alert } from 'reactstrap';
// // import { fetchElectoralAreas, ElectoralArea } from '../electoralArea/electoralAreaSlice';
// // import { fetchBusinessTypes } from '../businessType/businessTypeSlice';
// // import { fetchDailyPayments, FetchDailyPaymentsArgs, BusPaymentsState, selectBusPayments } from './busPaymentsSlice';
// // import PaymentsTable from './PaymentsTable';
// // import 'bootstrap/dist/css/bootstrap.min.css';
// // import { Link } from 'react-router-dom';


// // interface BusinessTypeData {
// //     Business_Type: string; // This matches your API response
// //     buss_type?: string; // Optional if it's not always present
// //     business_type?: string
// // }

// // // interface ReportResponse {
// // //     success: boolean;
// // //     message: string;
// // // }

// // const DailyPayments: React.FC = () => {
// //     let [electoralArea, setElectoralArea] = useState<string>('');
// //     let [electoralAreasData, setElectoralAreasData] = useState<ElectoralArea[]>([]);

// //     const [bussType, setBussType] = useState<string>('');
// //     const [firstDate, setFirstDate] = useState<string>('');
// //     const [lastDate, setLastDate] = useState<string>('');
    
// //     // const [bussTypes, setBussTypes] = useState<string[]>([]);
// //     //const [bussTypes, setBussTypes] = useState<string[]>([]);
// //     const [bussTypes, setBussTypes] = useState<BusinessTypeData[]>([]);
// //     const [paymentDates, setPaymentDates] = useState<string[]>([]);
// //     const [errorx, setErrorx] = useState<string>('');
// //     const [selectedBusinessType, setSelectedBusinessType] = useState(''); // eslint-disable-line no-unused-vars

// //     let {electoralAreas, loading, error} = useAppSelector(state => state.electoralArea)

// //     const dispatch = useAppDispatch();

// //     useEffect(() => {
// //         const fetchElectoralAreasData = async () => {
// //           try {
// //             await dispatch(fetchElectoralAreas());
// //             electoralAreasData = electoralAreas;
    
// //             setElectoralAreasData(electoralAreasData);
// //           } catch (error) {
// //             console.error("Error fetching electoral areas:", error);
// //             setErrorx("Error fetching electoral areas")
// //             alert("Error fetching electoral areas");
// //           }
// //         };
      
// //         fetchElectoralAreasData();
// //       }, [dispatch]);

// //     // Get business types from the Redux store
// //     const businessTypes = useAppSelector((state) => state.businessType.businessTypes); // as BusinessTypeData[]
// //     console.log('businessTypes: ', businessTypes);
    
// //     useEffect(() => {
// //         if (Array.isArray(businessTypes)) {
// //             bussTypes.length = 0; // Clear the array before adding new data
// //         setBussTypes(businessTypes); // Update local state with fetched data
// //         }
// //     }, [businessTypes]); // Dependency array includes businessTypes

// //     // Get payments data from the Redux store
// //     const busPayments = useAppSelector(selectBusPayments);

// //     const handleFirstDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// //         const selectedDate = e.target.value;
// //         setFirstDate(selectedDate);
// //     };

// //     const handleLastDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// //         const selectedDate = e.target.value;
// //         setLastDate(selectedDate);
// //     };

// //     const handleViewClick = async () => {
// //         try {
// //             const DailyPaymentsData: FetchDailyPaymentsArgs = {
// //                 firstDate: new Date(firstDate),
// //                 lastDate: new Date(lastDate),
// //                 electoralarea: electoralArea,
// //                 bussType: bussType,
// //             };
// //             console.log('DailyPaymentsData: ', DailyPaymentsData);

// //             await dispatch(fetchDailyPayments(DailyPaymentsData));
// //             setPaymentDates(paymentDates);
// //         } catch (error) {
// //             console.error("Error fetching daily payments:", error);
// //             setErrorx("Error fetching daily payments")
// //             alert("Error fetching daily payments");
// //         }
// //     };
     

// // if (loading) {
// //     return <div>Loading...</div>;
// // }

// // if (error) {
// //     return <div>Error: {error}</div>;
// // }

// // if (!electoralAreasData || !bussTypes || !busPayments) {
// //     return <div>No data available</div>;
// // }

// // if (error) {
// //     return <div>Error: {error}</div>;
// // }

// // if (!electoralAreasData || !bussTypes || !busPayments) {
// //     return <div>No data available</div>;
// // }


// //     return (
// //         <div className="container mt-5">
// //             {errorx && <Alert color="danger">{errorx}</Alert>}
            
// //             <Form>
// //                 <FormGroup>
// //                     <p className="text-center text-underline">Produce Daily Payments Report</p>
// //                     <Label for="zone" className="font-weight-bold">Electoral Area:</Label>
                    
// //                     <Input 
// //                         type="select" 
// //                         name="electoral_area" 
// //                         id="electoral_area" 
// //                         value={electoralArea} 
// //                         onChange={(e) => setElectoralArea(e.target.value)}
// //                     >
// //                         <option value="">Select...</option>
// //                         {electoralAreas.map((area, index) => (
// //                             <option key={index} value={area.electoral_area}>
// //                                 {area.electoral_area}
// //                             </option>
// //                         ))}
// //                     </Input>
// //                 </FormGroup>
// //                 <FormGroup>
// //                     <Label for="bussType" className="font-weight-bold">Business Type/Profession:</Label>
// //                     <Input type="select" name="bussType" id="bussType" value={bussType} onChange={(e) => setSelectedBusinessType(e.target.value)}>
// //                         <option>Select Business Type</option>
// //                         {bussTypes.map((businessType, index) => (
// //                             <option key={index} value={businessType.business_type}>
// //                             {businessType.business_type}
// //                             </option>
// //                         ))}
// //                     </Input>
// //                 </FormGroup>
// //                 <FormGroup>
// //                     <Label for="firstDate" className="font-weight-bold">First Payment Date:</Label>
// //                     <Input 
// //                         type="date" 
// //                         name="firstDate" 
// //                         id="firstDate" 
// //                         value={firstDate} 
// //                         onChange={handleFirstDateChange} 
// //                     />
// //                 </FormGroup>
// //                 <FormGroup>
// //                     <Label for="lastDate" className="font-weight-bold">Last Payment Date:</Label>
// //                     <Input 
// //                         type="date" 
// //                         name="lastDate" 
// //                         id="lastDate" 
// //                         value={lastDate} 
// //                         onChange={handleLastDateChange} 
// //                     />
// //                 </FormGroup>
// //                 <FormGroup>
// //                     <div className="d-flex justify-content-between">
// //                         <Button color="primary" onClick={handleViewClick}>Produce Report (unposted payments)</Button>
// //                         {/* <Button color="success" onClick={handleProduceReportClick}>Produce Report (posted payments)</Button> */}
// //                         {/* <Button color="danger" onClick={handleExitClick}>Exit</Button> */}
// //                     </div>
// //                 </FormGroup>
// //             </Form>
            
// //             <Link to="/main" className="primary m-3">
// //                 Go Back
// //             </Link>

// //             <h2>Payments List</h2>
// //             <PaymentsTable busPayments={busPayments} />
// //         </div>
// //     );
// // };

// // export default DailyPayments;
