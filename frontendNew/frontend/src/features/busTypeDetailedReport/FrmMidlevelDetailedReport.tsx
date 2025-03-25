import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { Container, Form, Button, Alert, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { fetchElectoralAreas } from '../electoralArea/electoralAreaSlice';
import { fetchBusinessTypes } from '../businessType/businessTypeSlice';
import { fetchReportsByCriteria, BusTypeDetailedReport, fetchAllRecords } from '../busTypeDetailedReport/busTypeDetailedReportSlice';

// interface Business {
//   electroral_area: string;
//   buss_no: number;
//   buss_name: string;
//   buss_type: string;
//   current_rate: number;
//   tot_grade: string;
// }

interface BusinessTypeData {
  Business_Type: string; // This matches your API response
  buss_type?: string; // Optional if it's not always present
  business_type?: string
}

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

interface reportAdd {
  zone: string;
  businessType: string;
  fiscalYear: string;
}

const FrmMidlevelDetailedReport: React.FC = () => {
  let [zone, setZone] = useState<string>('');

  let [electoralAreas, setElectoralAreas] = useState<string[]>([]);
  let [bussTypes, setBussTypes] = useState<BusinessTypeData[]>([]);

  let [businessList, setBusinessList] = useState<BusTypeDetailedReport[]>([]);

  let [businessType, setBusinessType] = useState<string>('');
  let [fiscalYear, setFiscalYear] = useState<string>(new Date().getFullYear().toString());
 
  
  let [error, setError] = useState<string>('');
  let [successMessage, setSuccessMessage] = useState<string>('');

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
    console.log('about to dispatch(fetchAllRecords())')

    dispatch(fetchAllRecords())
  }, [dispatch])

  // Get electoral areas from the Redux store // as ElectoralArea[];
  const busTypeDetailedReport = useAppSelector((state) => state.busTypedetailedReport.reports)
  useEffect(() => {
    if (Array.isArray(busTypeDetailedReport)) {
      businessList = busTypeDetailedReport
      setBusinessList(businessList); // Update local state with fetched data
    }
  }, [busTypeDetailedReport]);


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
    console.log('in handleViewClick')
    if (!zone) {
      setError('Please select in the electoral area');
      return;
    }
    if (!businessType) {
      setError('Please select the business type/profession');
      return;
    }
    if (!fiscalYear) {
      setError('Please select the current fiscal year');
      return;
    }

      const reportData: reportAdd = {
        zone,
        businessType,
        fiscalYear: fiscalYear
      }
     
 

      try {
         const response = await dispatch(fetchReportsByCriteria(reportData));
         console.log('response: ', response);
         

        if (response && response.payload) {
           console.log('RECORDS FOUND action.payload: ', response.payload)

          // Extract the payload from the action
          const reportData = response.payload as BusTypeDetailedReport[];

          console.log('reportData::::::: ', reportData)

          setBusinessList(reportData);
          console.log('businessList: ', businessList)

          setError(''); // Clear error if request is successful
          setSuccessMessage('Report produced successfully');
          //fetchDetailedReports();
        } else if (response.meta.requestStatus === 'rejected') {
          // Type guard to ensure action is of type PayloadAction<..., ..., ..., unknown>
          if ('error' in response) {
            // Handle the case where the response was rejected
            console.error('Error fetching reports:', response.error);
            setError('Error producing report');
            setSuccessMessage('');
          }
        }
      } catch (error) {
        console.error(error);
        setError('An unexpected error occurred');
        setSuccessMessage('');
      }

      
  };

  // const handleExitClick = () => {
  //   window.location.href = '/'; // Redirect to main page or hide the form
  // };

 let totalBalance = 0;
  businessList.forEach((business) => {
    totalBalance += business.amountdue - business.amountpaid;
  });

  console.log('totalBalance: ', totalBalance)
  

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
            <option value="">Select an electoral area</option>
            {electoralAreas.map((area, index) => (
              <option key={index} value={area}>{area}</option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group controlId="formBussType">
          <Form.Label>Business Type/Profession:</Form.Label>
          <Form.Select value={businessType} onChange={handleBusinessTypeChange}>
            <option value="">Select a business type</option>
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
      </Form>

      
      <Table striped bordered hover className="mt-3">
        <thead>
          Total Balance: {totalBalance}
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
          {businessList.map((business) => (
            <tr key={business.buss_no}>
              <td>{business.electoral_area}</td>            
              <td>{business.buss_name}</td>
              <td>{business.buss_type}</td>
              <td>{business.amountdue}</td>
              <td>{business.amountpaid}</td>
              <td>{business.amountdue - business.amountpaid}</td>
            </tr>
          ))}
        </tbody>    
      </Table>
    
      </div>      
    </Container>
  );
};

export default FrmMidlevelDetailedReport;

