import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/store';
import { Button, Form, Container, Row, Col, Table } from 'react-bootstrap';

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
        fetchBillsDistributed,
        createClientsServed,
        CreateClientsServedParams,
        fetchOfficerAssessment
       } from './officerAssessmentSlice'; 
import {fetchOfficerBudget} from '../officerBudget/officerBudgetSlice';
import OfficerAssessmentBarChart from '../../charts/OfficerAssessmentBarChart';


export interface FetchClientsServedParams {
  officerNo: string;
  fiscalYear: FiscalYear; // If you expect an object
}

interface FiscalYear {
  fiscal_year: number;
}

// interface OfficerData {
//   officer_name: string;
//   noofclientsserved: number;
// }

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

//type FetchClientsServedPayload = any[]; // Replace 'any[]' with the actual type



const FrmOfficerAssessment = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [firstFiscalYear, setFirstFiscalYear] = useState(""); // Initialize as an empty string
  const [firstOfficer, setFirstOfficer] = useState('');
  const [chartData, setChartData] = useState<any[]>([]); // Initialize as an empty array

  const [shouldFetchChartData, setShouldFetchChartData] = useState(false);

  let [createClientsServedParams, setCreateClientsServedParams] = useState<CreateClientsServedParams | null>(null);

  //let [clientsServed, setClientsServed] = useState<number | null>(null);


  useEffect(() => {
    const fetchData = async () => {
      console.log('in fetchData dispatch(fetchOfficerAssessment');
  
      try {
        const action = await dispatch(fetchOfficerAssessment({ officerNo: firstOfficer, fiscalYear: parseInt(firstFiscalYear, 10) }));
  
        console.log('action.payload: ', action.payload);
  
        // Check if action.payload is an object and convert it to an array
        const fetchedData = Array.isArray(action.payload) ? action.payload : [action.payload];
        
        setChartData(fetchedData); // Set the normalized data to chartData
  
        console.log('SUCCESS SUCCESS SUCCESS');
        console.log('chartData: ', fetchedData);
      } catch (error) {
        console.error('Error fetching data:', error);
        console.log('FAIL FAIL FAIL');
      }
    };
  
    if (shouldFetchChartData) {
      fetchData();
      setShouldFetchChartData(false); // Reset the state after fetching
    }
  }, [dispatch, shouldFetchChartData]); 

  let officersData = useAppSelector((state) => state.officer.officers);

  
  
  useEffect(() => {
    const fetchData = async () => {
      await dispatch(fetchOfficers());
    };

    fetchData();
  }, [dispatch]);

 
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

        console.log('budgetResponse.data.data: ', budgetResponse.data)

        // Check if the response indicates that the data exists
        if (budgetResponse.data.length > 0) {
            // Data was successfully fetched
            console.log('Budget Data:', budgetResponse.data);
            // You can further process the budget data here
        } else {
            // Handle the case where the data doesn't exist
            console.error("No budget data found for the officer:", budgetResponse);
            alert("No budget data found for the officer.");
            return
        }

        console.log('about to access variable of createClientsServedParams object');

        if (budgetResponse && Array.isArray(budgetResponse.data)) {
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
                console.log('on dispatch(fetchClientsServed')
                let noOfClientsServed = await dispatch(fetchClientsServed({ officerNo, fiscalYear: fiscalYearValue })).unwrap();
                console.log('noOfClientsServed: ', noOfClientsServed);

                // Fetch the value of bills distributed
                let valueOfBillsDistributed = await dispatch(fetchBillsDistributed({ officerNo, fiscalYear: fiscalYearValue })).unwrap();
                console.log('valueOfBillsDistributed: ', valueOfBillsDistributed);

                // // Fetch all monthly amounts
                let januaryAmount: number = 0  
                try {
                  // Directly use unwrap to get the result or catch the error
                    januaryAmount = await dispatch(fetchJanuaryAmount({ officerNo, fiscalYear: fiscalYearValue })).unwrap();
                    
                    console.log('Total amount for January:', januaryAmount);
                } catch (error) {
                    console.error('Failed to fetch amount:', error);
                }
              
                let februaryAmount: number = 0
                try {
                  // Directly use unwrap to get the result or catch the error
                  februaryAmount = await dispatch(fetchFebruaryAmount({ officerNo, fiscalYear: fiscalYearValue })).unwrap();
                    
                    console.log('Total amount for February:', februaryAmount);
                } catch (error) {
                    console.error('Failed to fetch amount:', error);
                }

                let marchAmount = 0
                try {
                  // Directly use unwrap to get the result or catch the error
                  marchAmount = await dispatch(fetchMarchAmount({ officerNo, fiscalYear: fiscalYearValue  })).unwrap();
                    
                  console.log('Total amount for March:', marchAmount);
                } catch (error) {
                    console.error('Failed to fetch amount:', error);
                }

                let aprilAmount = 0
                try {
                  // Directly use unwrap to get the result or catch the error
                  aprilAmount = await dispatch(fetchAprilAmount({ officerNo, fiscalYear: fiscalYearValue  })).unwrap();
                    
                  console.log('Total amount for april:', aprilAmount);
                } catch (error) {
                    console.error('Failed to fetch amount:', error);
                }

                let mayAmount = 0
                try {
                  // Directly use unwrap to get the result or catch the error
                  mayAmount = await dispatch(fetchMayAmount({ officerNo, fiscalYear: fiscalYearValue  })).unwrap();
                    
                  console.log('Total amount for may:', mayAmount);
                } catch (error) {
                    console.error('Failed to fetch amount:', error);
                }

                
                let juneAmount = 0
                try {
                  // Directly use unwrap to get the result or catch the error
                  juneAmount = await dispatch(fetchJuneAmount({ officerNo, fiscalYear: fiscalYearValue  })).unwrap();
                    
                  console.log('Total amount for june:', juneAmount);
                } catch (error) {
                    console.error('Failed to fetch amount:', error);
                }


                let julyAmount = 0
                try {
                  // Directly use unwrap to get the result or catch the error
                  julyAmount = await dispatch(fetchJulyAmount({ officerNo, fiscalYear: fiscalYearValue  })).unwrap();
                    
                  console.log('Total amount for july:', julyAmount);
                } catch (error) {
                    console.error('Failed to fetch amount:', error);
                }

                let augustAmount = 0
                try {
                  // Directly use unwrap to get the result or catch the error
                  augustAmount = await dispatch(fetchAugustAmount({ officerNo, fiscalYear: fiscalYearValue  })).unwrap();
                    
                  console.log('Total amount for august:', augustAmount);
                } catch (error) {
                    console.error('Failed to fetch amount:', error);
                }


                let septemberAmount = 0
                try {
                  // Directly use unwrap to get the result or catch the error
                  septemberAmount = await dispatch(fetchSeptemberAmount({ officerNo, fiscalYear: fiscalYearValue  })).unwrap();
                    
                  console.log('Total amount for september:', septemberAmount);
                } catch (error) {
                    console.error('Failed to fetch amount:', error);
                }

                let octoberAmount = 0
                try {
                  // Directly use unwrap to get the result or catch the error
                  octoberAmount = await dispatch(fetchOctoberAmount({ officerNo, fiscalYear: fiscalYearValue  })).unwrap();
                    
                  console.log('Total amount for october:', octoberAmount);
                } catch (error) {
                    console.error('Failed to fetch amount:', error);
                }

                let novemberAmount = 0
                try {
                  // Directly use unwrap to get the result or catch the error
                  novemberAmount = await dispatch(fetchNovemberAmount({ officerNo, fiscalYear: fiscalYearValue  })).unwrap();
                    
                  console.log('Total amount for november:', novemberAmount);
                } catch (error) {
                    console.error('Failed to fetch amount:', error);
                }

                let decemberAmount = 0
                try {
                  // Directly use unwrap to get the result or catch the error
                  decemberAmount = await dispatch(fetchDecemberAmount({ officerNo, fiscalYear: fiscalYearValue  })).unwrap();
                    
                  console.log('Total amount for december:', decemberAmount);
                } catch (error) {
                    console.error('Failed to fetch amount:', error);
                }


                let totalReceiptToDate: number = 
                januaryAmount +  // Assuming value is the property holding the number
                februaryAmount + 
                marchAmount + 
                aprilAmount + 
                mayAmount + 
                juneAmount + 
                julyAmount + 
                augustAmount + 
                septemberAmount + 
                octoberAmount + 
                novemberAmount + 
                decemberAmount;
                 
                console.log('totalReceiptToDate: ', totalReceiptToDate)

                // Calculate balance and remarks
                let balance = valueOfBillsDistributed - totalReceiptToDate;
                console.log('balance: ', balance);

                const remarks = (valueOfBillsDistributed > 0) ? (totalReceiptToDate / valueOfBillsDistributed) * 100 : 0;
                console.log('remarks: ', remarks)

                // Create the object for the thunk
                const createClientsServedParams: CreateClientsServedParams = {
                  officerNo, // Assumes officerNo is a string defined elsewhere
                  fiscalYear: fiscalYearValue, // Use 'fiscalYear'
                  noOfClientsServed, // Must be defined as a number
                  valueOfBillsDistributed, // Must be defined as a number
                  JanuaryAmount: januaryAmount, // Use PascalCase
                  FebruaryAmount: februaryAmount,
                  MarchAmount: marchAmount,
                  AprilAmount: aprilAmount,
                  MayAmount: mayAmount,
                  JuneAmount: juneAmount,
                  JulyAmount: julyAmount,
                  AugustAmount: augustAmount,
                  SeptemberAmount: septemberAmount,
                  OctoberAmount: octoberAmount,
                  NovemberAmount: novemberAmount,
                  DecemberAmount: decemberAmount,
                  totalReceiptToDate, // Must be defined as a number
                  balance, // Must be defined as a number
                  remarks, // Keep as a number (float)
                };


                console.log('createClientsServedParams: ', createClientsServedParams);

                setCreateClientsServedParams(createClientsServedParams); // Update state to trigger table rendering
                console.log('createClientsServedParams processed values: ', createClientsServedParams);

                // Now you can dispatch the thunk with this object
                const answer = await dispatch(createClientsServed(createClientsServedParams)).unwrap();
                
                console.log('answer: ', answer)
                
                alert(answer)

                console.log('All data fetched and processed.');
                // Set to trigger fetching chart data
                
                setShouldFetchChartData(true);
            }));

           
        } else {
            console.log('No data available or response structure is invalid.');
        }
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
    
      <Row className="mt-3">
        <Col className="text-center">
          <Button variant="secondary" onClick={handleExitClick}>
            Exit
          </Button>
        </Col>
      </Row>
       {/* Add the OfficerAssessmentBarChart here */}
       <Row className="mt-3">
        <Col>
        <OfficerAssessmentBarChart data={chartData} />
        </Col>
      </Row>
      {/* Render the table if createClientsServedParams is not null */}
      {createClientsServedParams && (
        <Row className="mt-3">
          <Col>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Parameter</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(createClientsServedParams).map(([key, value]) => (
                  <tr key={key}>
                    <td>{key}</td>
                    <td>{value}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
      )}
     
    </Container>
  );
};

export default FrmOfficerAssessment;