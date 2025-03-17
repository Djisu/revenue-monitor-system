import React, { useState, useEffect } from 'react';
import { Button, Col, Form, Row, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/store';
import { fetchBusinesses, fetchBusinessById, updateBusiness } from './businessSlice';

import { fetchElectoralAreas } from '../electoralArea/electoralAreaSlice';
import { fetchBusinessTypes } from '../businessType/businessTypeSlice';
import { fetchPropertyClasses } from '../propertyClass/propertyClassSlice';
import { fetchOfficers } from '../officer/officerSlice';
//import {fetchGradeRates} from '../gradeRate/gradeRateSlice';
import {fetchPropertyRateByPropertyClassAndFiscalyear} from '../propertyRate/propertyRateSlice';

interface ElectoralArea {
  electoral_area: string;
}

// interface GradeRate {
//   grade: string;
// }

interface BusinessTypeData {
  Business_Type: string; // This matches your API response
  buss_type?: string; // Optional if it's not always present
  business_type?: string
}

export interface BusinessData {
  buss_no: number;
  buss_name?: string;
  buss_address?: string;
  buss_type?: string;
  buss_town?: string;
  street_name?: string;
  landmark?: string;
  electroral_area?: string;
  property_class?: string;
  tot_grade?: string;
  ceo?: string;
  telno?: string;
  strategiclocation?: number;
  productvariety?: number;
  businesspopularity?: number;
  businessenvironment?: number;
  sizeofbusiness?: number;
  numberofworkingdays?: number;
  businessoperatingperiod?: number;
  competitorsavailable?: number;
  assessmentby?: string;
  transdate?: Date;
  balance?: number;
  status?: string;
  current_rate?: number;
  property_rate?: number;
  totalmarks?: number;
  emailaddress?: string; 
  postaladdress?: string;
  gps_address?: string; 
  noofemployees?: number;
  noofbranches?: number;
  BALANCENEW?: number;
}

const FrmUpdateClient: React.FC = () => {
  // State management for form fields
  const [businessNo, setBusinessNo] = useState<number | "">('');
  const [businessName, setBusinessName] = useState('');
  const [ceo, setCeo] = useState('');
  const [businessAddress, setBusinessAddress] = useState('');
  const [telNo, setTelNo] = useState('');
  const [businessType, setBusinessType] = useState('');

  const [bussTown, setBussTown] = useState('');
  //const [bussPermitNo, setBussPermitNo] = useState('');
  const [streetName, setStreetName] = useState('');
  const [landMark, setLandMark] = useState('');
  //const [electoralArea, setElectoralArea] = useState('');


  const [propertyClass, setPropertyClass] = useState('');
  let [totGrade, setTotGrade] =  useState('')
  const [propertyRate, setPropertyRate] =  useState<number>(0);
  const [currentRate, setCurrentRate] =  useState<number>(0);
  const [balanceBF, setBalanceBF] = useState<number>(0);
  const [status, setStatus] = useState('Active');
  const [emailAddress, setEmailAddress] = useState('');
  const [gpsAddress, setGpsAddress] = useState('');


  const [noOfBranches, setNoOfBranches] = useState<number>(0);
 
  const [noOfEmployees, setNoOfEmployees] = useState<number>(0);
 
  // State management for checkboxes
  const [strategicGrade, setStrategicGrade] =  useState<number>(0);
  const [productGrade, setProductGrade] =  useState<number>(0);
  const [busPopGrade, setBusPopGrade] =  useState<number>(0);
  const [busEnvGrade, setBusEnvGrade] =  useState<number>(0);
  const [sizeGrade, setSizeGrade] =  useState<number>(0);
  const [noGrade, setNoGrade] =  useState<number>(0);
  const [busOpeGrade, setBusOpeGrade] =  useState<number>(0);
  const [comAvaGrade, setComAvaGrade] =  useState<number>(0);

  // State management for total marks and grade
  const [totalMarks, setTotalMarks] =  useState<number>(0);
  const [finalGrade, setFinalGrade] = useState('');

  // State management for dropdowns
  ////////
  const [electoralAreas, setElectoralAreas] = useState<string[]>([]);
  const [bussTypes, setBussTypes] = useState<BusinessTypeData[]>([]);
  const [propertyClasses, setPropertyClasses] = useState<string[]>([]);
  const [assessments, setAssessments] = useState<string[]>([]);
  ///////

  const [electoralArea, setElectoralArea] = useState('');
  let [assessment, setAssessment] = useState('');

  const [transdate, setTransDate] = useState(new Date());
  let [businesses, setBusinesses] = useState<BusinessData[]>([]);

  const [selectedBusinessType, setSelectedBusinessType] = useState('');
  let [selectedOfficer, setSelectedOfficer] = useState('');
 

  const dispatch = useAppDispatch();

  // Fetch data on component mount
  useEffect(() => {
    dispatch(fetchElectoralAreas());
    dispatch(fetchBusinessTypes());
    dispatch(fetchPropertyClasses());
    dispatch(fetchOfficers());
  }, [dispatch])
  /////////

  // Get property rate and current rate from the Redux store
  //const propertyRateData = useAppSelector((state) => state.propertyRate.rates);
  

  // Get businesses from the Redux store
  const businessesData = useAppSelector((state) => state.business.businesses);
  //console.log('businessesData:', businessesData);
  useEffect(() => {
    if (Array.isArray(businessesData)) {
      setBusinesses(businessesData as BusinessData[]);
    } else {
      console.error('Expected businesses to be an array but got:', businessesData);
    }
  }, [businessesData]);
     
  

    const electoralAreaResponse = useAppSelector((state) => state.electoralArea.electoralAreas);
    //console.log('electoralAreaResponse:', electoralAreaResponse);
    useEffect(() => {
      if (Array.isArray(electoralAreaResponse)) {
        setElectoralAreas(electoralAreaResponse.map((area: ElectoralArea) => area.electoral_area));
      } else {
        console.error('Expected electoralArea to be an array but got:', electoralAreaResponse);
      }
    }, [electoralAreaResponse]);

     // Get business types from the Redux store
     const businessTypes = useAppSelector((state) => state.businessType.businessTypes); // as BusinessTypeData[]
     console.log('businessTypes: ', businessTypes);
     
     useEffect(() => {
       if (Array.isArray(businessTypes)) {
         setBussTypes(businessTypes); // Update local state with fetched data
       }
     }, [businessTypes]); // Dependency array includes businessTypes


    // Get property classes from the Redux store
    const propertyClassData = useAppSelector((state) => state.propertyClass.propertyClasses);
        //console.log('propertyClassData:', propertyClassData);
    useEffect(() => {
      setPropertyClasses(propertyClassData.map((classType: any) => classType.property_class));
    }, [propertyClassData]);

 // Get officers from the Redux store
 const officers = useAppSelector((state) => state.officer.officers);

 useEffect(() => {
   if (Array.isArray(officers)) {
     const officerNames = officers.map((officer: any) => officer.officer_name);
     setAssessments(officerNames);
   } else {
     console.error('Expected officers to be an array but got:', officers);
   }
 }, [officers])
  ////////

  const handleRadioChange = (value: number, setter: React.Dispatch<React.SetStateAction<number>>) => {
    console.log('in handleRadioChange, value:', value)

    setter(value);
    updateTotalMarks();
  };

  // Update total marks whenever any grade changes
  useEffect(() => {
     updateTotalMarks();
  }, [strategicGrade, productGrade, busPopGrade, busEnvGrade, sizeGrade, noGrade, busOpeGrade, comAvaGrade]);
  

  const updateTotalMarks = () => {

    const marks = strategicGrade + productGrade + busPopGrade + busEnvGrade + sizeGrade + noGrade + busOpeGrade + comAvaGrade;
    console.log('in updateTotalMarks, marks:', marks)

    setTotalMarks(marks);
    determineFinalGrade(marks);
  };

  // Determine final grade
  const determineFinalGrade = (marks: number) => {
    // Define your grading logic here
    if (marks >= 40) { // 8 * 5 = 40
      setFinalGrade('Excellent');
    } else if (marks >= 32) { // 8 * 4 = 32
      setFinalGrade('Very Good');
    } else if (marks >= 24) { // 8 * 3 = 24
      setFinalGrade('Good');
    } else if (marks >= 16) { // 8 * 2 = 16
      setFinalGrade('Average');
    } else {
      setFinalGrade('L-Average');
    }
  };

  
  const mapToBusinessData = (data: any) => {
    return {
        buss_no: data.businessNo,
        buss_name: data.businessName,
        ceo: data.ceo,
        buss_address: data.businessAddress,
        telno: data.telNo,
        buss_type: data.businessType,
        buss_town: data.buss_town,
        street_name: data.streetName,
        landmark: data.landMark,
        electroral_area: electoralArea,
        property_class: propertyClass,
        tot_grade: finalGrade,
        current_rate: data.currentRate,
        property_rate: data.propertyRate,
        emailaddress: data.emailAddress,
        totalmarks: data.totalMarks,
        balance: data.balanceBF,
        status: data.status,
        strategiclocation: data.strategicGrade,
        productvariety: data.productGrade,
        businesspopularity: data.busPopGrade,
        businessenvironment: data.busEnvGrade,
        sizeofbusiness: data.sizeGrade,
        numberofworkingdays: data.noGrade,    
        businessoperatingperiod: data.busOpeGrade,
        competitorsavailable: data.comAvaGrade,
        assessment: assessment,
        transdate: data.transdate,
        gps_address: gpsAddress,
        noOfEmployees: data.noOfEmployees,
        noOfBranches: data.noOfBranches,
    };
};

const handleEditClick = async () => {
    console.log('in handleEditClick Edit record')
    console.log('tot_grade: ', finalGrade)

    const updatedBusiness = {
        buss_no: businessNo,
        data: mapToBusinessData({
            businessNo: businessNo,
            businessName: businessName,
            ceo: ceo,
            businessAddress: businessAddress,
            telNo: telNo,
            businessType: businessType,
            buss_town: bussTown,
            streetName: streetName,
            landMark: landMark,
            electoralArea: electoralArea,
            propertyClass: propertyClass,
            totGrade: finalGrade,
            currentRate: currentRate,
            propertyRate: propertyRate,
            totalMarks: totalMarks,
            balanceBF: balanceBF,
            status: status,            
            emailAddress: emailAddress,
            gps_address: gpsAddress,          
            strategicGrade: strategicGrade,
            productGrade: productGrade,
            busPopGrade: busPopGrade,
            busEnvGrade: busEnvGrade,
            sizeGrade: sizeGrade,
            noGrade: noGrade,
            busOpeGrade: busOpeGrade,
            comAvaGrade: comAvaGrade,
            assessment: assessments,
            transdate: transdate,
            noOfEmployees: noOfEmployees,
            noOfBranches: noOfBranches
        })
    };
    console.log('THIS IS THE UPDATED gps_address:  ', gpsAddress)

    const response = await dispatch(updateBusiness({
      buss_no: businessNo || 0,  // Ensure buss_no is a number, defaulting to 0 if businessNo is falsy,
      data:  {
        ...updatedBusiness.data,
        tot_grade: finalGrade,
        assessmentby: selectedOfficer || '',
        totalmarks: updatedBusiness.data.totalmarks || 0,
        buss_no: updatedBusiness.buss_no || 0,    
        noofemployees: updatedBusiness.data.noOfEmployees || 0,
        noofbranches: updatedBusiness.data.noOfBranches || 0,
        gps_address: gpsAddress || '',
      }
    })).unwrap(); 
    console.log('response:', response.message);
    alert(response.message)
};



  const handleExitClick = () => {
    // Reset form fields
    setBusinessNo(0);
    setBusinessName('');
    setCeo('');
    setBusinessAddress('');
    setTelNo('');
    setBusinessType('');
  
    setStreetName('');
    setLandMark('');
    setElectoralAreas([]);
    setPropertyClasses([]);
    totGrade = '';
    setTotGrade(totGrade);
    setTotGrade(finalGrade);
    setPropertyRate(0);
    setCurrentRate(0);
    setBalanceBF(0);
   
    setStatus('');
    setEmailAddress('');
    setGpsAddress('');
   
    setNoOfEmployees(0);
    setNoOfBranches(0);
   
    setStrategicGrade(0);
    setProductGrade(0);
    setBusPopGrade(0);
    setBusEnvGrade(0);
    setSizeGrade(0);
    setNoGrade(0);
    setBusOpeGrade(0);
    setComAvaGrade(0);

    setAssessments([]);
    assessment = ''
    setAssessment(assessment);

    setTotalMarks(0);
    setFinalGrade('');
    setTransDate(new Date());
    console.log('Exit');
  };

  const handleViewClick = () => {
    // Refetch businesses to reload spreadsheet
    dispatch(fetchBusinesses());
    console.log('Reload spreadsheet');
  };

  const handleListViewItemClick = (item: any) => {
    // Populate form fields with selected item data
    setBusinessNo(item.buss_no);
    setBusinessName(item.buss_name);
    setBusinessAddress(item.buss_address);
    setBusinessType(item.buss_type);
    setSelectedBusinessType(item.buss_type);
    setBussTown(item.buss_town);
    
    setStreetName(item.street_name);
    setLandMark(item.landmark);
    setElectoralAreas(item.electroral_area);
    setPropertyClasses(item.property_class);
    setTotGrade(item.tot_grade);
    setCeo(item.ceo);
    setTelNo(item.telno);
    setStrategicGrade(item.strategiclocation);
    setProductGrade(item.productvariety);
    setBusPopGrade(item.businesspopularity);
    setBusEnvGrade(item.businessenvironment);
    setSizeGrade(item.sizeofbusiness);
    setNoGrade(item.numberofworkingdays);
    setBusOpeGrade(item.businessoperatingperiod);
    setComAvaGrade(item.competitorsavailable);
    setAssessments(item.assessmentby);
    selectedOfficer = item.assessmentby;
    setSelectedOfficer(item.assessmentby);
  
    setTransDate(item.transdate);
    setBalanceBF(item.balance);
    setStatus(item.status);
 
    setPropertyRate(item.property_rate);
  
    setEmailAddress(item.emailaddress);
   
    setNoOfBranches(item.no_of_branches);
   
    setNoOfEmployees(item.no_of_employees);
    
    setTotalMarks(item.totalmarks);
    setGpsAddress(item.gps_address);
    setFinalGrade(item.tot_grade);
  };

  const getRate = async (propertyClass: string) => {
    console.log('in getRate, onBlur triggered with:', propertyClass);
    try {
      // Convert propertyClass to a number if necessary
      const propClass = propertyClass
      const fiscalYear = Number(new Date().getFullYear());

      // Dispatch the async thunk and unwrap the result
      const response = await dispatch(fetchPropertyRateByPropertyClassAndFiscalyear({property_Class: propClass, fiscalyear: fiscalYear})).unwrap();

      console.log('response:', response);
      // Check if response is an array or an object
      if (Array.isArray(response) && response[0].rate !== undefined) {
        setPropertyRate(response[0].rate);
      } else if (response && response.rate !== undefined) {
        setPropertyRate(response.rate);
      } else {
        console.error('rate is undefined in the response');
        setPropertyRate(0); // or some default value
      }
    } catch (error: any) {
      console.error('Error fetching property rate:', error);
    }
  };

  const getBusiness = async (businessId: string) => {
    console.log('in getBusiness, onBlur triggered with:', businessId);
  
    try {
      // Convert businessId to a number if necessary
      const id = Number(businessId);
  
      console.log('before  dispatch(fetchBusinessById(id)).unwrap();')
      // Dispatch the async thunk and unwrap the result
      const response = await dispatch(fetchBusinessById(id)).unwrap();

      console.log('after  dispatch(fetchBusinessById(id)).unwrap(); response:', response.data)

      console.log('response: ', response.data)

      // Check if response is an array or an object
     // if(Array.isArray(response)) {
        
     if (response) {
          setBusinessNo(response.data.buss_no || ''); // This can now be an empty string
          setBusinessName(response.data.buss_name || '');
          // Handle other fields similarly...
      }



        // set response fields to the following state variables
        setBusinessNo(response.data.buss_no);
        setBusinessName(response.data.buss_name);
        setBusinessAddress(response.data.buss_address);

         // Populate form fields with selected item data
        setBusinessNo(response.data.buss_no);
        setBusinessName(response.data.buss_name);
        setBusinessAddress(response.data.buss_address);
        setBusinessType(response.data.buss_type);
        // setSelectedBusinessType(response.data.buss_type);
        console.log('buss_town:', response.data.buss_town)
        setBussTown(response.data.buss_town);
       
        setStreetName(response.data.street_name);
        setLandMark(response.data.landmark);
        setElectoralArea(response.data.electroral_area);
        setPropertyClass(response.data.property_class);

        //getRate(response.data.property_class)
      
        setCeo(response.data.ceo);
        setTelNo(response.data.telno);
        console.log('response.data.assessmentby:  ', response.data.assessmentby)
        selectedOfficer = response.data.assessmentby;
        setSelectedOfficer(response.data.assessmentby);
        setAssessment(response.data.assessmentby);

        console.log('selectedOfficer:  ', selectedOfficer)
        console.log('assessments:  ', assessments)
        console.log('assessment:  ', assessment)
        setAssessments(response.assessmentby);
      
        setTransDate(response.transdate);
      
        setStatus(response.status);
        
        
        setEmailAddress(response.emailaddress);
        setSelectedBusinessType(response.buss_type)
      
        setGpsAddress(response.gps_address);
         // alert("Business found")
      // } else if (response) {
      //   console.log('Response is an object:', response);
      // } 
    } catch (error: any) {
     
      console.error('Error fetching businesses:', error);

      if (fetchBusinessById.rejected.match(error)) {
        alert('Error fetching business');
      }
    }
  };
  

  return (
  <div className="container" style={{ backgroundColor: '#add8e6' }}>
    <div>
    <div>
          <Row className="mb-3">
            <Col>
              <h4 className="text-primary">Update Old Business Client</h4>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <Form.Label>Business Number:</Form.Label>
              <Form.Control 
                    value={businessNo} 
                    onChange={(e) => setBusinessNo(e.target.value ? Number(e.target.value) : '')} 
                    onBlur={(e) => getBusiness(e.target.value)}
              />
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <Form.Label>Business Name:</Form.Label>
              <Form.Control value={businessName} onChange={(e) => setBusinessName(e.target.value)} />
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <Form.Label>CEO:</Form.Label>
              <Form.Control value={ceo} onChange={(e) => setCeo(e.target.value)} />
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <Form.Label>Business Address:</Form.Label>
              <Form.Control value={businessAddress} onChange={(e) => setBusinessAddress(e.target.value)} />
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <Form.Label>Tel No:</Form.Label>
              <Form.Control value={telNo} onChange={(e) => setTelNo(e.target.value)} />
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <Form.Label>Business Type:</Form.Label>
              <Form.Select value={selectedBusinessType} onChange={(e) => setSelectedBusinessType(e.target.value)}>
                <option>Select Business Type</option>
                {bussTypes.map((businessType, index) => (
                    <option key={index} value={businessType.business_type}>
                      {businessType.business_type}
                    </option>
                  ))}
              </Form.Select>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <Form.Label>Town:</Form.Label>
              <Form.Control value={bussTown} onChange={(e) => setBussTown(e.target.value)} />
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <Form.Label>Street Name:</Form.Label>
              <Form.Control value={streetName} onChange={(e) => setStreetName(e.target.value)} />
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <Form.Label>Land Mark:</Form.Label>
              <Form.Control value={landMark} onChange={(e) => setLandMark(e.target.value)} />
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <Form.Label>Electoral Area:</Form.Label>
              <Form.Select value={electoralArea} onChange={(e) => setElectoralArea(e.target.value)}>
                <option>Select Electoral Area</option>
                {electoralAreas.map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </Form.Select>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <Form.Label>Property Class:</Form.Label>
                <Form.Select 
                  value={propertyClass} 
                  onChange={(e) => setPropertyClass(e.target.value)}
                  onBlur={(e) => getRate(e.target.value)}
                >
                <option>Select Property Class</option>
                {propertyClasses.map((cls, index) => (
                  <option key={index} value={cls}>
                    {cls}
                  </option>
                ))}
              </Form.Select>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col>
              <Form.Label>Status:</Form.Label>
              <Form.Control value={status} onChange={(e) => setStatus(e.target.value)} />
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <Form.Label>Collector:</Form.Label>
              {/* <Form.Select value={selectedOfficer} onChange={(e) => setSelectedOfficer(e.target.value)}> */}
              <Form.Select value={assessment} onChange={(e) => setAssessment(e.target.value)}>
                <option>Select Collector</option>
                {officers.map((officer, index) => (
                  <option key={index} value={officer.officer_name}>
                    {officer.officer_name}
                  </option>
                ))}
              </Form.Select>
            </Col>
          </Row>
  </div>
  <div>
          <Row className="mb-3">
            <Col>
              <Form.Label>Email Address:</Form.Label>
              <Form.Control value={emailAddress} onChange={(e) => setEmailAddress(e.target.value)} />
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <Form.Label>GPS Address:</Form.Label>
              <Form.Control value={gpsAddress} onChange={(e) => setGpsAddress(e.target.value)} />
            </Col>
          </Row>

          <Row className="mb-2">
            <Col>
              <p className="text-primary">Fill the Values Below</p>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <Form.Label>Property Rate:</Form.Label>
              <Form.Control value={propertyRate} onChange={(e) => setPropertyRate(Number(e.target.value))} />
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <Form.Label>Current Rate:</Form.Label>
              <Form.Control value={currentRate} onChange={(e) => setCurrentRate(Number(e.target.value))} />
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <Form.Label>Balance BF:</Form.Label>
              <Form.Control value={balanceBF} onChange={(e) => setBalanceBF(Number(e.target.value))} />
            </Col>
          </Row>
 
          <Row className="mb-3">
            <Col>
              <Form.Label>No Of Branches:</Form.Label>
              <Form.Control value={noOfBranches} onChange={(e) => setNoOfBranches(Number(e.target.value))} />
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <Form.Label>No Of Employees:</Form.Label>
              <Form.Control value={noOfEmployees} onChange={(e) => setNoOfEmployees(Number(e.target.value))} />
            </Col>
          </Row>
    </div>
    <div>
      <Row className="mb-3">
          <Col>
              <Form.Label>Strategic Location</Form.Label>
              <br />
              <Form.Check
                inline
                label="Excellent"
                type="radio"
                name="strategicLocation"
                id="strategicLocation1"
                value={5}
                checked={strategicGrade === 5}
                onChange={() => handleRadioChange(5, setStrategicGrade)}
              />
              <Form.Check
                inline
                label="Very Good"
                type="radio"
                name="strategicLocation"
                id="strategicLocation2"
                value={4}
                checked={strategicGrade === 4}
                onChange={() => handleRadioChange(4, setStrategicGrade)}
              />
              <Form.Check
                inline
                label="Good"
                type="radio"
                name="strategicLocation"
                id="strategicLocation3"
                value={3}
                checked={strategicGrade === 3}
                onChange={() => handleRadioChange(3, setStrategicGrade)}
              />
              <Form.Check
                inline
                label="Average"
                type="radio"
                name="strategicLocation"
                id="strategicLocation4"
                value={2}
                checked={strategicGrade === 2}
                onChange={() => handleRadioChange(2, setStrategicGrade)}
              />
              <Form.Check
                inline
                label="L-Avg"
                type="radio"
                name="strategicLocation"
                id="strategicLocation5"
                value={1}
                checked={strategicGrade === 1}
                onChange={() => handleRadioChange(1, setStrategicGrade)}
              />
            </Col>

      </Row>
      </div>
      <div>
      <Row className="mb-3">
        <Col>
          <Form.Label>Product Grade</Form.Label>
          <br />
          <Form.Check
            inline
            label="Excellent"
            type="radio"
            name="productGrade"
            id="productGrade1"
            value={5}
            checked={productGrade === 5}
            onChange={() => handleRadioChange(5, setProductGrade)}
          />
          <Form.Check
            inline
            label="Very Good"
            type="radio"
            name="productGrade"
            id="productGrade2"
            value={4}
            checked={productGrade === 4}
            onChange={() => handleRadioChange(4, setProductGrade)}
          />
          <Form.Check
            inline
            label="Good"
            type="radio"
            name="productGrade"
            id="productGrade3"
            value={3}
            checked={productGrade === 3}
            onChange={() => handleRadioChange(3, setProductGrade)}
          />
          <Form.Check
            inline
            label="Average"
            type="radio"
            name="productGrade"
            id="productGrade4"
            value={2}
            checked={productGrade === 2}
            onChange={() => handleRadioChange(2, setProductGrade)}
          />
          <Form.Check
            inline
            label="L-Avg"
            type="radio"
            name="productGrade"
            id="productGrade5"
            value={1}
            checked={productGrade === 1}
            onChange={() => handleRadioChange(1, setProductGrade)}
          />
        </Col>
      </Row>
      </div>
      <div>
      <Row className="mb-3">
        <Col>
          <Form.Label>Business Population Grade</Form.Label>
          <br />
          <Form.Check
            inline
            label="Excellent"
            type="radio"
            name="busPopGrade"
            id="busPopGrade1"
            value={5}
            checked={busPopGrade === 5}
            onChange={() => handleRadioChange(5, setBusPopGrade)}
          />
          <Form.Check
            inline
            label="Very Good"
            type="radio"
            name="busPopGrade"
            id="busPopGrade2"
            value={4}
            checked={busPopGrade === 4}
            onChange={() => handleRadioChange(4, setBusPopGrade)}
          />
          <Form.Check
            inline
            label="Good"
            type="radio"
            name="busPopGrade"
            id="busPopGrade3"
            value={3}
            checked={busPopGrade === 3}
            onChange={() => handleRadioChange(3, setBusPopGrade)}
          />
          <Form.Check
            inline
            label="Average"
            type="radio"
            name="busPopGrade"
            id="busPopGrade4"
            value={2}
            checked={busPopGrade === 2}
            onChange={() => handleRadioChange(2, setBusPopGrade)}
          />
          <Form.Check
            inline
            label="L-Avg"
            type="radio"
            name="busPopGrade"
            id="busPopGrade5"
            value={1}
            checked={busPopGrade === 1}
            onChange={() => handleRadioChange(1, setBusPopGrade)}
          />
        </Col>
      </Row>
      </div>
      <div>
      <Row className="mb-3">
        <Col>
          <Form.Label>Business Environment Grade</Form.Label>
          <br />
          <Form.Check
            inline
            label="Excellent"
            type="radio"
            name="busEnvGrade"
            id="busEnvGrade1"
            value={5}
            checked={busEnvGrade === 5}
            onChange={() => handleRadioChange(5, setBusEnvGrade)}
          />
          <Form.Check
            inline
            label="Very Good"
            type="radio"
            name="busEnvGrade"
            id="busEnvGrade2"
            value={4}
            checked={busEnvGrade === 4}
            onChange={() => handleRadioChange(4, setBusEnvGrade)}
          />
          <Form.Check
            inline
            label="Good"
            type="radio"
            name="busEnvGrade"
            id="busEnvGrade3"
            value={3}
            checked={busEnvGrade === 3}
            onChange={() => handleRadioChange(3, setBusEnvGrade)}
          />
          <Form.Check
            inline
            label="Average"
            type="radio"
            name="busEnvGrade"
            id="busEnvGrade4"
            value={2}
            checked={busEnvGrade === 2}
            onChange={() => handleRadioChange(2, setBusEnvGrade)}
          />
          <Form.Check
            inline
            label="L-Avg"
            type="radio"
            name="busEnvGrade"
            id="busEnvGrade5"
            value={1}
            checked={busEnvGrade === 1}
            onChange={() => handleRadioChange(1, setBusEnvGrade)}
          />
        </Col>
      </Row>
      </div>
      <div>
      <Row className="mb-3">
        <Col>
          <Form.Label>Size Grade</Form.Label>
          <br />
          <Form.Check
            inline
            label="Excellent"
            type="radio"
            name="sizeGrade"
            id="sizeGrade1"
            value={5}
            checked={sizeGrade === 5}
            onChange={() => handleRadioChange(5, setSizeGrade)}
          />
          <Form.Check
            inline
            label="Very Good"
            type="radio"
            name="sizeGrade"
            id="sizeGrade2"
            value={4}
            checked={sizeGrade === 4}
            onChange={() => handleRadioChange(4, setSizeGrade)}
          />
          <Form.Check
            inline
            label="Good"
            type="radio"
            name="sizeGrade"
            id="sizeGrade3"
            value={3}
            checked={sizeGrade === 3}
            onChange={() => handleRadioChange(3, setSizeGrade)}
          />
          <Form.Check
            inline
            label="Average"
            type="radio"
            name="sizeGrade"
            id="sizeGrade4"
            value={2}
            checked={sizeGrade === 2}
            onChange={() => handleRadioChange(2, setSizeGrade)}
          />
          <Form.Check
            inline
            label="L-Avg"
            type="radio"
            name="sizeGrade"
            id="sizeGrade5"
            value={1}
            checked={sizeGrade === 1}
            onChange={() => handleRadioChange(1, setSizeGrade)}
          />
        </Col>
      </Row>
      </div>
      <div>
        <Row className="mb-3">
          <Col>
            <Form.Label>No Of Working Days</Form.Label>
            <br />
            <Form.Check
              inline
              label="7 Days"
              type="radio"
              name="noOfWorkingDays"
              id="noOfWorkingDays1"
              value={5}
              checked={noGrade === 5}
              onChange={() => handleRadioChange(5, setNoGrade)}
            />
            <Form.Check
              inline
              label="6 Days"
              type="radio"
              name="noOfWorkingDays"
              id="noOfWorkingDays2"
              value={4}
              checked={noGrade === 4}
              onChange={() => handleRadioChange(4, setNoGrade)}
            />
            <Form.Check
              inline
              label="5 Days"
              type="radio"
              name="noOfWorkingDays"
              id="noOfWorkingDays3"
              value={3}
              checked={noGrade === 3}
              onChange={() => handleRadioChange(3, setNoGrade)}
            />
            <Form.Check
              inline
              label="4 Days"
              type="radio"
              name="noOfWorkingDays"
              id="noOfWorkingDays4"
              value={2}
              checked={noGrade === 2}
              onChange={() => handleRadioChange(2, setNoGrade)}
            />
            <Form.Check
              inline
              label="3 Days"
              type="radio"
              name="noOfWorkingDays"
              id="noOfWorkingDays5"
              value={1}
              checked={noGrade === 1}
              onChange={() => handleRadioChange(1, setNoGrade)}
            />
          </Col>
        </Row>
      </div>
      <div>
        <Row className="mb-3">
          <Col>
            <Form.Label>Business Operating Period</Form.Label>
            <br />
            <Form.Check
              inline
              label="24 Hours"
              type="radio"
              name="businessOperatingPeriod"
              id="businessOperatingPeriod1"
              value={5}
              checked={busOpeGrade === 5}
              onChange={() => handleRadioChange(5, setBusOpeGrade)}
            />
            <Form.Check
              inline
              label="18 Hours"
              type="radio"
              name="businessOperatingPeriod"
              id="businessOperatingPeriod2"
              value={4}
              checked={busOpeGrade === 4}
              onChange={() => handleRadioChange(4, setBusOpeGrade)}
            />
            <Form.Check
              inline
              label="12 Hours"
              type="radio"
              name="businessOperatingPeriod"
              id="businessOperatingPeriod3"
              value={3}
              checked={busOpeGrade === 3}
              onChange={() => handleRadioChange(3, setBusOpeGrade)}
            />
            <Form.Check
              inline
              label="8 Hours"
              type="radio"
              name="businessOperatingPeriod"
              id="businessOperatingPeriod4"
              value={2}
              checked={busOpeGrade === 2}
              onChange={() => handleRadioChange(2, setBusOpeGrade)}
            />
            <Form.Check
              inline
              label="6 Hours"
              type="radio"
              name="businessOperatingPeriod"
              id="businessOperatingPeriod5"
              value={1}
              checked={busOpeGrade === 1}
              onChange={() => handleRadioChange(1, setBusOpeGrade)}
            />
          </Col>
        </Row>
      </div>
      <div>
        <Row className="mb-3">
          <Col>
            <Form.Label>Competitors Available</Form.Label>
            <br />
            <Form.Check
              inline
              label="Pure Mono"
              type="radio"
              name="competitorsAvailable"
              id="competitorsAvailable1"
              value={5}
              checked={comAvaGrade === 5}
              onChange={() => handleRadioChange(5, setComAvaGrade)}
            />
            <Form.Check
              inline
              label="Mono(3)"
              type="radio"
              name="competitorsAvailable"
              id="competitorsAvailable2"
              value={4}
              checked={comAvaGrade === 4}
              onChange={() => handleRadioChange(4, setComAvaGrade)}
            />
            <Form.Check
              inline
              label="Moderate(2)"
              type="radio"
              name="competitorsAvailable"
              id="competitorsAvailable3"
              value={3}
              checked={comAvaGrade === 3}
              onChange={() => handleRadioChange(3, setComAvaGrade)}
            />
            <Form.Check
              inline
              label="Fierce(1)"
              type="radio"
              name="competitorsAvailable"
              id="competitorsAvailable4"
              value={2}
              checked={comAvaGrade === 2}
              onChange={() => handleRadioChange(2, setComAvaGrade)}
            />
            <Form.Check
              inline
              label="Not Applicable(0)"
              type="radio"
              name="competitorsAvailable"
              id="competitorsAvailable5"
              value={1}
              checked={comAvaGrade === 1}
              onChange={() => handleRadioChange(1, setComAvaGrade)}
            />
          </Col>
        </Row>
     </div>

        
    <div>
    <Row className="mb-3">
      <Col>
        <Form.Label>Total Marks:</Form.Label>
        <Form.Control value={totalMarks} readOnly />
      </Col>
    </Row>
    <Row className="mb-3">
      <Col>
        <Form.Label>Final Grade:</Form.Label>
        <Form.Control value={finalGrade} readOnly />
      </Col>
    </Row>
  </div>
  <div>
    <Row className="mb-3">
      <Col>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>BUSS NO</th>
              <th>BUSS NAME</th>          
            </tr>
          </thead>
          <tbody>
            {businesses.map((business: any) => (
              <tr key={business.buss_no} onClick={() => handleListViewItemClick(business)}>
                <td>{business.buss_no}</td>
                <td>{business.buss_name}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Col>
    </Row>
    </div>
    <div>
        <Row className="mb-3">
          <Col>
            <Button variant="primary" onClick={handleEditClick}>
              Update Business Client
            </Button>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col>
            <Button variant="danger" onClick={handleExitClick}>
              Zero All Values
            </Button>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col>
            <Button variant="primary" onClick={handleViewClick}>
              RELOAD SPREADSHEET
            </Button>
          </Col>
        </Row>

        <Row className="mt-3">
          <Col>
            <Link to="/main" style={{ textDecoration: "none" }}>  
              Go Back
            </Link>
          </Col>
        </Row>
    </div>
    </div>
  </div>
);
;
};

export default FrmUpdateClient;

