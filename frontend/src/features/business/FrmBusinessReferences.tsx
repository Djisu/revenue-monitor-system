import React, { useState, useEffect } from 'react';
import { useAppDispatch } from '../../app/store';
import { Container, Table } from 'react-bootstrap';

import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import { fetchBusinesses } from './businessSlice';

interface Business {
    buss_no: number;
    buss_name: string;
    buss_address: string;
    buss_type: string;
    buss_permitno: string;
    street_name: string;
    landmark: string;
    layout: string;
    property_class: string;
    tot_grade: string;
    ceo: string;
    telno: string;
    assessmentby: string;
    transdate: string;
    status: string;
    serialno: string;
    current_rate: number;
    property_rate: number;
  }

  const FrmBusinessReferences: React.FC = () => {
   
    const [businessList, setBusinessList] = useState<Business[]>([]);
    const dispatch = useAppDispatch()

    // const {businessData, loading, error} = useAppSelector((state) => state.business )
    // setBusinessList(businessData)
  
    useEffect(() => {
      fetchBusinessList();
    }, []);
  
    const fetchBusinessList = async () => {
      try {
        const response = await dispatch(fetchBusinesses()).unwrap();

        setBusinessList(response);
      } catch (error) {
        console.error(error);
      }
    };


    return (
      <Container>
        <h3>List of Business Clients</h3>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Buss No</th>
              <th>Buss Name</th>
              <th>Status</th>           
              <th>Current Rate</th>
              <th>Property Rate</th>
            </tr>
          </thead>
          <tbody>
            {businessList.map((business) => (
              <tr key={business.buss_no}>
                <td>{business.buss_no}</td>
                <td>{business.buss_name}</td>
                <td>{business.status}</td>            
                <td>{business.current_rate}</td>
                <td>{business.property_rate}</td>
              </tr>
            ))}
          </tbody>
        </Table>       
        <Link to="/main" className="primary m-3">
            Go Back
        </Link>   
      </Container>
    );
  };
  
  export default FrmBusinessReferences;
  
