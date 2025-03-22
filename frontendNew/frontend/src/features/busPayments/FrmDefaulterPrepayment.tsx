import React, { useState, useEffect } from 'react';
import {useAppDispatch, useAppSelector} from '../../app/store'
import { Button, Form, Container, Row, Col } from 'react-bootstrap';

import { Link } from 'react-router-dom';
import { fetchElectoralAreas, ElectoralArea } from '../electoralArea/electoralAreaSlice';
import { fetchPaymentDefaulters } from './busPaymentsSlice';
import { fetchBalances } from '../balance/balanceSlice';
import BalanceTable from '../balance/BalanceTable';
//import DummyBalanceTable from '../balance/DummyBalanceTable';

export interface Balance {
  buss_no: number;
  buss_name: string;
  billamount: number;
  paidamount: number;
  balance: number;
  electroral_area: string;
  street_name: string;
}

const DefaulterPrepaymentForm: React.FC = () => {
  let [electoralArea, setElectoralArea] = useState<string>('');
  let [electoralAreasData, setElectoralAreasData] = useState<ElectoralArea[]>([]);

  let dispatch = useAppDispatch()

  let {electoralAreas, loading, error} = useAppSelector(state => state.electoralArea)

  const balanceData = useAppSelector(state => state.balance.balances); // Should be an array of Balance

  console.log('THIS IS THE balanceData.data: ', balanceData);

  useEffect(() => {
      const fetchBalancesData = async () => {
          try {
             const resDB = await dispatch(fetchBalances()); // Dispatch the thunk
             console.log('fetchBalancesData resDB:', resDB.payload) //data)
             
          } catch (error) {
              console.error("Error fetching balances:", error);
              alert("Error fetching balances");
          }
      };

      fetchBalancesData();
  }, [dispatch]); // Dependency array includes dispatch

  useEffect(() => {
    const fetchElectoralAreasData = async () => {
      try {
        await dispatch(fetchElectoralAreas());
        electoralAreasData = electoralAreas;

        setElectoralAreasData(electoralAreasData);
      } catch (error) {
        console.error("Error fetching electoral areas:", error);
        alert("Error fetching electoral areas");
      }
    };
  
    fetchElectoralAreasData();
  }, [dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLElement>) => {
    const target = e.target as HTMLSelectElement;
    const selectedArea = target.value;
    setElectoralArea(selectedArea);    
  };

  const handleDefaultersClick = async () => {
    if (!electoralArea) {
      alert("Select the electoral area");
      return;
    }

    try {
      const response = await dispatch(fetchPaymentDefaulters(electoralArea)).unwrap()

      if (response.data.length > 0) {

        // window.open('/report/defaulters-list.rpt', '_blank');
        // alert(`This is the report for ${electoralArea}`);
        await dispatch(fetchBalances());
        alert(`This is the report for ${electoralArea}`);
      } else {
        alert("No records found");
      }
    } catch (error) {
      console.error("Error fetching defaulters list:", error);
      alert("Error fetching defaulters list");
    }
  };

  if (loading){
    <div>Loading...</div>
  }

  if (error ){
    <div>Error: error.message</div>
  }

  return (
    <Container fluid className="bg-light">
      <Row className="mt-3">
        <Col className="text-center">
          <h2 style={{ textDecoration: 'underline', color: '#0000C0' }}>MARCORY MUNICIPAL ASSEMBLY</h2>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col>
              <Form.Group>
                <Form.Label htmlFor="electoral_area">Electoral Area:</Form.Label>
                 <Form.Select  name="electoral_area" id="electoral_area" value={electoralArea} onChange={handleChange}>
                      <option>Select...</option>
                      {electoralAreas.map((area, index) => (
                          <option key={index} value={area.electoral_area}>
                              {area.electoral_area}
                          </option>
                      ))}
                </Form.Select >
              </Form.Group>
        </Col>
      </Row>

      <Row className="mt-3">
        <Col className="text-center">
          <Button variant="primary" onClick={handleDefaultersClick}>
            Defaulters List
          </Button>
        </Col>
      </Row>
   
      <Row className="mt-3">
          <Col>
          <Link to="/main" className="primary m-3">
              Go Back
          </Link>
          </Col>
      </Row>
       {balanceData.length > 0  && <BalanceTable balanceData={balanceData} />}
       {/* {balanceData.length === 0 && <DummyBalanceTable />} */}
    </Container>
  );
};

export default DefaulterPrepaymentForm;
