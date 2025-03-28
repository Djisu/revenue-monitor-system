import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { Container, Form, Button, Alert, Table, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { fetchElectoralAreas } from '../electoralArea/electoralAreaSlice';
import { fetchBusinessTypes } from '../businessType/businessTypeSlice';
import { BusTypeDetailedReport, fetchDetailedReports } from '../busTypeDetailedReport/busTypeDetailedReportSlice';

interface Business {
  electroral_area: string;
  buss_no: number; // Changed from string to number
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
  Business_Type: string; // This matches your API response
  buss_type?: string; // Optional if it's not always present
  business_type?: string
}

// interface BusTypeDetailedReportX {
//   electoral_area: string;
//   buss_no: number; // Ensure this is a number
//   buss_name: string;
//   buss_type: string;
//   amountdue: number;
//   amountpaid: number;
// }

// interface BusinessTypeDetailedReport {
//   electroral_area: string;
//   buss_no: number;
//   buss_name: string;
//   buss_type: string;
//   amountdue: number;
//   amountpaid: number;
//   balance: number;
//   tot_grade: string;
// }

// interface ElectoralArea {
//   electroral_area: string;
// }

// interface FiscalYear {
//   fiscal_year: number;
// }

// interface reportAdd {
//   zone: string;
//   businessType: string;
//   fiscalYear: string;
// }

const FrmMidlevelDetailedReport: React.FC = () => {
  let [zone, setZone] = useState<string>('');

  let [electoralAreas, setElectoralAreas] = useState<string[]>([]);
  let [bussTypes, setBussTypes] = useState<BusinessTypeData[]>([]);

 // let [businessList] = useState<BusTypeDetailedReport[]>([]);
  let [busDetailedReport, setBusDetailedReport] = useState<BusTypeDetailedReport[]>([]);

  let [businessType, setBusinessType] = useState<string>('');
  let [fiscalYear, setFiscalYear] = useState<string>(new Date().getFullYear().toString());
 
  
  let [error, setError] = useState<string>('');
  let [successMessage, setSuccessMessage] = useState<string>('');

  
  let [loading, setLoading] = useState<boolean>(false); // Loading state


  let reportData: any = {
    zone,
    businessType,
    fiscalYear
  }

  const navigate = useNavigate(); // Initialize the useNavigate hook  

  const dispatch = useAppDispatch();

  // Fetch data on component mount
  useEffect(() => {
    dispatch(fetchElectoralAreas());
    dispatch(fetchBusinessTypes());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchElectoralAreas());
  }, [dispatch]);

  useEffect(() => {
    console.log('about to dispatch(fetchDetailedReports())');
    dispatch(fetchDetailedReports(reportData)); // Make sure this is triggered correctly
}, [dispatch]);

  // Get electoral areas from the Redux store // as ElectoralArea[];
  const busTypeDetailedReport = useAppSelector((state) => state.busTypedetailedReport.reports)
  useEffect(() => {
    if (Array.isArray(busTypeDetailedReport)) {
        setBusDetailedReport(busTypeDetailedReport); // Correct this line
        console.log('busTypeDetailedReport: ', busTypeDetailedReport);
    }
}, [busTypeDetailedReport]);


  const electoralAreaData = useAppSelector((state) => state.electoralArea.electoralAreas) ;

  //console.log('typeof electoralAreaData:', typeof electoralAreaData)

  useEffect(() => {
    if (electoralAreaData && Array.isArray(electoralAreaData)) {
        setElectoralAreas(electoralAreaData.map((area) => area.electoral_area));
        //console.log('electoralAreas: ', electoralAreas)
    } else {
        console.error('Expected electoralAreaData to be an array but got:', electoralAreaData);
    }
  }, [electoralAreaData, setElectoralAreas]);


  const businessTypes = useAppSelector((state) => state.businessType.businessTypes); 
  //console.log('businessTypes: ', businessTypes);
  
  useEffect(() => {
    if (Array.isArray(businessTypes)) {
      setBussTypes(businessTypes); // Update local state with fetched data
    }
  }, [businessTypes]); // Dependency array includes businessTypes

  const handleBusinessTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setBusinessType(e.target.value);
  };

  const handleZoneChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedZone = e.target.value;
    setZone(selectedZone);

    // You can log or handle the selected value here
    //console.log('Selected Zone:', selectedZone);
  };


  const handleLastDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiscalYear(e.target.value);
  };

  const handleViewClick = async () => {
    console.log('in handleViewClick')

    if (!fiscalYear) {
      setError('Please select the current fiscal year');
      return;
    }

    //  const reportAdd = {
    //     zone,
    //     businessType,
    //     fiscalYear: fiscalYear
    //   }

    setLoading(true); // Set loading to true

      try {
         const answer = await dispatch(fetchDetailedReports(reportData));

         console.log('answer from the thunk: ', answer.payload);
         

        if (answer && answer.payload) {
          // console.log('RECORDS FOUND action.payload: ', answer.payload)

          // Extract the payload from the action
          reportData = answer.payload;

          console.log('reportData::::::: ', reportData)

          setBusDetailedReport(reportData);
          console.log('busDetailedReport: ', busDetailedReport)

          setError(''); // Clear error if request is successful
          setSuccessMessage('Report produced successfully');
          //fetchDetailedReports();
        } else if (answer.meta.requestStatus === 'rejected') {
          // Type guard to ensure action is of type PayloadAction<..., ..., ..., unknown>
          if ('error' in answer) {
            // Handle the case where the answer was rejected
            console.error('Error fetching reports:', answer.error);
            setError('Error producing report');
            setSuccessMessage('');
          }
        }
      } catch (error) {
        console.error(error);
        setError('An unexpected error occurred');
        setSuccessMessage('');
      }finally {
      setLoading(false); // Set loading to false after the fetch completes
    }

      
  };

  // const handleExitClick = () => {
  //   window.location.href = '/'; // Redirect to main page or hide the form
  // };

//  let totalBalance: number = 0;
//   businessList.forEach((business) => {
//     totalBalance += business.amountdue - business.amountpaid;
//   });

//   console.log('totalBalance: ', totalBalance)

const groupedData = busDetailedReport.reduce<Record<string, SummarizedArea>>((acc, busDetailedReport) => {
  const area = busDetailedReport.electoral_area;

  if (!area) {
      return acc; // Skip if no electoral area
  }

  if (!acc[area]) {
      acc[area] = {
          electoral_area: area,
          totalAmountDue: 0,
          totalAmountPaid: 0,
          totalBalance: 0,
          businesses: []
      };
  }

  // Ensure that amountdue and amountpaid are treated as numbers
  const amountDue = busDetailedReport.amountdue || 0; 
  const amountPaid = busDetailedReport.amountpaid || 0;   

  // Update totals
  acc[area].totalAmountDue += amountDue;
  acc[area].totalAmountPaid += amountPaid;
  acc[area].totalBalance = acc[area].totalAmountDue - acc[area].totalAmountPaid;

  // Push the business details to the corresponding area
  acc[area].businesses.push({
      electroral_area: area,
      buss_no: busDetailedReport.buss_no,
      buss_name: busDetailedReport.buss_name,
      buss_type: busDetailedReport.buss_type,
      amountdue: amountDue,
      amountpaid: amountPaid
  });

  return acc;
}, {});

const summarizedList: SummarizedArea[] = Object.values(groupedData);
console.log('summarizedList: ', summarizedList);

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
            <option value="">Select business types/professions</option>
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
            readOnly
          />
        </Form.Group>
        <div>
          <Button variant="primary" onClick={handleViewClick} style={{ marginTop: '10px' }}>
            Produce Report
          </Button>
                  
          <Button variant="secondary" onClick={() => navigate("/main")} style={{ marginLeft: '40px',  marginTop: '10px' }}>
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
            {summarizedList.map((area, index) => (
                <React.Fragment key={index}>
                    <tr>
                        <td rowSpan={area.businesses.length || 1}>{area.electoral_area || 'N/A'}</td>
                        <td>{area.businesses[0]?.buss_name || 'N/A'}</td>
                        <td>{area.businesses[0]?.buss_type || 'N/A'}</td>
                        <td>{isNaN(area.totalAmountDue) ? '0.00' : area.totalAmountDue.toFixed(2)}</td>
                        <td>{isNaN(area.totalAmountPaid) ? '0.00' : area.totalAmountPaid.toFixed(2)}</td>
                        <td>{isNaN(area.totalBalance) ? '0.00' : area.totalBalance.toFixed(2)}</td>
                    </tr>
                    {area.businesses.slice(1).map((business) => (
                        <tr key={business.buss_no}>
                            <td>{business.buss_name}</td>
                            <td>{business.buss_type}</td>
                            <td>{business.amountdue || '0.00'}</td>
                            <td>{business.amountpaid || '0.00'}</td>
                            <td>{(business.amountdue - business.amountpaid) || '0.00'}</td>
                        </tr>
                    ))}
                </React.Fragment>
            ))}
        </tbody>
       </Table>
      </div>      
    </Container>
  );
};

export default FrmMidlevelDetailedReport;

