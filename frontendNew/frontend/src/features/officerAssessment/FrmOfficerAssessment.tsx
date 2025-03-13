import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/store';
import { Button, Form, Container, Row, Col } from 'react-bootstrap';

import { useNavigate } from 'react-router-dom';
import { fetchOfficers } from '../officer/officerSlice'; 
import { fetchJanuaryAmount, 
        fetchFebruaryAmount, 
        fetchMarchAmount, 
        fetchAprilAmount, 
        fetchMayAmount, 
        fetchJuneAmount, 
        fetchJulyAmount,  
        fetchAugustAmount, 
        fetchSeptemberAmount, 
        fetchOctoberAmount, 
        fetchNovemberAmount, 
        fetchDecemberAmount, 
        fetchClientsServed, 
        fetchBillsDistributed
       } from './officerAssessmentSlice'; 
import {fetchOfficerBudget} from '../officerBudget/officerBudgetSlice';

export interface FetchClientsServedParams {
  officerNo: string;
  fiscalYear: FiscalYear; // If you expect an object
}

interface FiscalYear {
  fiscal_year: number;
}

export interface Officer {
  officer_no: number;
  officer_name: string;
  photo: Buffer;
}

interface OfficerBudgetResponse {
  exists: boolean;
  data: any[]; // Adjust type as necessary
  status: number;
  statusText: string;
}

export interface CreateClientsServedParams {
  officerNo: string;
  fiscalYear: FiscalYear;
  noOfClientsServed: number;
  valueOfBillsDistributed: number;
  januaryAmount: number;
  februaryAmount: number;
  marchAmount: number;
  aprilAmount: number;
  mayAmount: number;
  juneAmount: number;
  julyAmount: number;
  augustAmount: number;
  septemberAmount: number;
  octoberAmount: number;
  novemberAmount: number;
  decemberAmount: number;
  totalReceiptToDate: number;
  balance: number;
  remarks: number;
}

const FrmOfficerAssessment = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [firstFiscalYear, setFirstFiscalYear] = useState(""); // Initialize as an empty string
  const [firstOfficer, setFirstOfficer] = useState('');
  //let [fiscalYears, setFiscalYears] = useState<FiscalYearsParam[]>([]);
  //const [selectedOfficerName, setSelectedOfficerName] = useState('');


  let officersData = useAppSelector((state) => state.officer.officers);

  // const fiscalYearsData: FiscalYear[] = useAppSelector((state) => state.officerAssessment.fiscalYears);    //.officerAssessment?.bus_year || []);
  
  // console.log("Selected Fiscal Year:", firstFiscalYear);
  // console.log("Fiscal Years Data:", fiscalYearsData);

  // useEffect(() => {
  //   console.log('Officers Data Updated:', officersData); 
  // }, [fiscalYearsData]);

  // Use this effect to log the updated state after it changes
  // useEffect(() => {
  //   console.log("Updated firstOfficer:", firstOfficer);
  // }, [firstOfficer]);
  
  useEffect(() => {
    const fetchData = async () => {
      await dispatch(fetchOfficers());
    };

    fetchData();
  }, [dispatch]);

 // Fetch fiscal years
// const fetchFiscalYearsData = async () => {
//   try {
//       // Dispatch the thunk
//       const resultAction = await dispatch(fetchFiscalYears())  //.unwrap();

//       console.log("resultAction:", resultAction)



//      // Check if the response indicates that the data exists
//           if (resultAction.payload) {
//             // Data was successfully fetched
//             console.log('resultAction.payload:', resultAction.payload);
//             // You can further process the budget data here
//           } else {
//             // Handle the case where the data doesn't exist
//             console.error("No budget data found for the officer:", resultAction);
//             alert("No budget data found for the officer.");
//           }
      
//   } catch (error) {
//       console.error("Error fetching fiscal years:", error);
//       const currentYear = new Date().getFullYear();
//       alert(`No officer budget details entered FOR the year ${currentYear}`);
//   }
// };

  // const handleFirstOfficerChange = (event: React.ChangeEvent<HTMLElement>) => {
  //   const target = event.target as HTMLSelectElement; 
  //   console.log("target.value:", target.value);

  //   setFirstOfficer(target.value.split(' ')[0]);
  //    console.log("firstOfficer:", firstOfficer);
  // };

  // const handleFirstOfficerChange = (event: React.ChangeEvent<HTMLElement>) => {
  //   const target = event.target as HTMLSelectElement;
  //   const selectedOfficer = target.value.split(' ')[0];
  //   setFirstOfficer(selectedOfficer);
  // };

   const handleFirstOfficerChange = (event: React.ChangeEvent<HTMLElement>) => {
         const target = event.target as HTMLSelectElement;
         const selectedOfficer = target.value.split(' ')[0];
         setFirstOfficer(selectedOfficer);
    };

   


  const handleFirstFiscalYearChange = (event: React.ChangeEvent<HTMLElement>) => {
    const target = event.target as HTMLSelectElement;
    setFirstFiscalYear(target.value);
  };

  const handlePreviewClick = async () => {
    console.log('in handlePreviewClick');

    if (!firstFiscalYear || !firstOfficer) {
        alert("ENTER THE FISCAL YEAR AND OFFICERS");
        return;
    }

    console.log('about to access budgetResponse');

    try {
        const budgetResponse: OfficerBudgetResponse = await dispatch(fetchOfficerBudget({ officer_no: firstOfficer, fiscal_year: parseInt(firstFiscalYear, 10) })).unwrap();

        console.log('budgetResponse.data: ', budgetResponse.data);

        // Check if the response indicates that the data exists
        if (budgetResponse.exists) {
            // Data was successfully fetched
            console.log('Budget Data:', budgetResponse.data);
            // You can further process the budget data here
        } else {
            // Handle the case where the data doesn't exist
            console.error("No budget data found for the officer:", budgetResponse);
            alert("No budget data found for the officer.");
        }

        console.log('about to access variable of createClientsServedParams object');

        if (budgetResponse && budgetResponse.exists && Array.isArray(budgetResponse.data)) {
            await Promise.all(budgetResponse.data.map(async officer => {
                let officerNo = officer.officer_no; // Officer number from your existing data
                console.log('officerNo: ', officerNo);

                let officerName = officer.officer_name; // Officer name from your existing data
                console.log('officerName: ', officerName);

                // Parse the fiscal year to a number
                let fiscalYearValue = parseInt(firstFiscalYear, 10);

                // Check if fiscalYearValue is a valid number
                if (isNaN(fiscalYearValue)) {
                    throw new Error('Invalid fiscalYear: must be a number');
                }

                // Dispatch the thunk with the necessary parameters
                let noOfClientsServed = await dispatch(fetchClientsServed({ officerNo, fiscalYear: fiscalYearValue })).unwrap();
                console.log('noOfClientsServed: ', noOfClientsServed);

                // Fetch the value of bills distributed
                let valueOfBillsDistributed = await dispatch(fetchBillsDistributed({ officerNo, fiscalYear: fiscalYearValue })).unwrap();
                console.log('valueOfBillsDistributed: ', valueOfBillsDistributed);

                // // Fetch all monthly amounts
                let januaryAmount: number = await dispatch(fetchJanuaryAmount({ officerNo, fiscalYear: fiscalYearValue  })).unwrap();
                console.log('januaryAmount: ', januaryAmount)
                
                // let februaryAmount: number = await dispatch(fetchFebruaryAmount({ officerNo, fiscalYear: fiscalYearValue  })).unwrap();
                // let marchAmount: number = await dispatch(fetchMarchAmount({ officerNo, fiscalYear: fiscalYearValue  })).unwrap();
                // let aprilAmount: number = await dispatch(fetchAprilAmount({ officerNo, fiscalYear: fiscalYearValue  })).unwrap();
                // let mayAmount: number = await dispatch(fetchMayAmount({ officerNo, fiscalYear: fiscalYearValue  })).unwrap();
                // let juneAmount: number = await dispatch(fetchJuneAmount({ officerNo, fiscalYear: fiscalYearValue  })).unwrap();
                // let julyAmount: number = await dispatch(fetchJulyAmount({ officerNo, fiscalYear: fiscalYearValue  })).unwrap();
                // let augustAmount: number = await dispatch(fetchAugustAmount({ officerNo, fiscalYear: fiscalYearValue  })).unwrap();
                // let septemberAmount: number = await dispatch(fetchSeptemberAmount({ officerNo, fiscalYear: fiscalYearValue  })).unwrap();
                // let octoberAmount: number = await dispatch(fetchOctoberAmount({ officerNo, fiscalYear: fiscalYearValue  })).unwrap();
                // let novemberAmount: number = await dispatch(fetchNovemberAmount({ officerNo, fiscalYear: fiscalYearValue  })).unwrap();
                // let decemberAmount: number = await dispatch(fetchDecemberAmount({ officerNo, fiscalYear: fiscalYearValue  })).unwrap();

                // let totalReceiptToDate: number = januaryAmount + februaryAmount + marchAmount + aprilAmount + mayAmount + juneAmount + julyAmount + augustAmount + 
                // septemberAmount + octoberAmount + novemberAmount + decemberAmount;

                // // Calculate balance and remarks
                // let balance = valueOfBillsDistributed - totalReceiptToDate;
                // console.log('balance: ', balance);

                // const remarks = (valueOfBillsDistributed > 0) ? (totalReceiptToDate / valueOfBillsDistributed) * 100 : 0;
                // console.log('remarks: ', remarks);

                // // Create the object for the thunk
                // const createClientsServedParams: CreateClientsServedParams = {
                //     officerNo, // Assumes officerNo is a string defined elsewhere
                //     fiscalYear, // Ensure firstFiscalYear is a valid string representation of a number
                //     noOfClientsServed, // Must be defined as a number
                //     valueOfBillsDistributed, // Must be defined as a number
                //     januaryAmount, // Must be defined as a number
                //     februaryAmount, // Must be defined as a number
                //     marchAmount, // Must be defined as a number
                //     aprilAmount, // Must be defined as a number
                //     mayAmount, // Must be defined as a number
                //     juneAmount, // Must be defined as a number
                //     julyAmount, // Must be defined as a number
                //     augustAmount, // Must be defined as a number
                //     septemberAmount, // Must be defined as a number
                //     octoberAmount, // Must be defined as a number
                //     novemberAmount, // Must be defined as a number
                //     decemberAmount, // Must be defined as a number
                //     totalReceiptToDate, // Must be defined as a number
                //     balance, // Must be defined as a number
                //     remarks, // Should be a string
                // };

                //console.log('createClientsServedParams processed values: ', createClientsServedParams);

                // Now you can dispatch the thunk with this object
                // await dispatch(createClientsServed(createClientsServedParams));
            }));
        } else {
            console.log('No data available or response structure is invalid.');
        }

        // Fetch assessment response
        // const assessmentResponse = await dispatch(fetchOfficerAssessments()).unwrap();

        // if (assessmentResponse.length > 0) {
        //     alert(`This is the report for ${firstFiscalYear}`);
        // } else {
        //     alert("No records found");
        // }
    } catch (error: any) {
        console.error("Error processing preview:", error);
        // alert("Error processing preview");
    }
};

  const handleExitClick = () => {
    navigate('/main');
  };

  return (
    <Container fluid className="bg-light">
      <Row className="mt-3">
        <Col className="text-center">
          <p style={{ textDecoration: 'underline', color: '#0000C0' }}>MARCORY MUNICIPAL ASSEMBLY</p>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col>
          <Form.Group controlId="formFirstFiscalYear">
            <Form.Label>First Fiscal Year:</Form.Label>
            <Form.Control 
                type="number" 
                value={firstFiscalYear} 
                onChange={handleFirstFiscalYearChange} 
                placeholder="Enter a fiscal year" 
            />
          </Form.Group>
        </Col>
      </Row>
      <Row className="mt-3">
      <Col>
          <Form.Group controlId="formFirstOfficer">
            <Form.Label> 
             
                 First Officer:   <p style={{ textDecoration: 'underline', color: '#0000C0' }}>{firstOfficer}</p>
              
              </Form.Label>
            <Form.Control as="select" value={firstOfficer} onChange={handleFirstOfficerChange}>
              <option value="">Select an officer</option>
              {officersData.map(officer => (
                <option key={officer.officer_no} value={`${officer.officer_no} ${officer.officer_name}`}>
                 {officer.officer_no}  {officer.officer_name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col className="text-center">
          <Button variant="primary" onClick={handlePreviewClick}>
            Preview Monitoring Report (Monthly)
          </Button>
        </Col>
      </Row>
      {/* <Row className="mt-3">
        <Col className="text-center">
          <Button variant="secondary" onClick={handleExitClick}>
            Exit
          </Button>
        </Col>
      </Row> */}
      <Row className="mt-3">
        <Col>
        <Button variant="secondary" onClick={handleExitClick}>
            Exit
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default FrmOfficerAssessment;