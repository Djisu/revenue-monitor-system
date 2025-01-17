import React, { useState, useEffect } from 'react';
import { Button, Form, Table, Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';

interface Employee {
  officer_no: string;
  officer_name: string;
  photo: string;
}

const FrmPropertyEmployee: React.FC = () => {
  const [employee, setEmployee] = useState<Employee>({
    officer_no: '',
    officer_name: '',
    photo: '',
  });
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [addflag, setAddflag] = useState<string>('');
  const [editflag, setEditflag] = useState<string>('');
  const [delFlag, setDelFlag] = useState<string>('');

  useEffect(() => {
    populateListView();
  }, []);

  const populateListView = async () => {
    try {
      const response = await axios.get<Employee[]>('/api/employees');
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setEmployee((prevEmployee) => ({
      ...prevEmployee,
      [name]: value,
    }));
  };

  const handleAdd = async () => {
    try {
      if (!employee.officer_no || !employee.officer_name) {
        throw new Error('Officer ID and Name cannot be empty');
      }

      const response = await axios.post('/api/employees', employee);
      setAddflag(response.data.message);
      populateListView();
      setEmployee({ officer_no: '', officer_name: '', photo: '' });
    } catch (error) {
      console.error('Error adding employee:', error);
      setAddflag('Error in adding a record');
    }
  };

  const handleEdit = async () => {
    try {
      if (!employee.officer_no || !employee.officer_name) {
        throw new Error('Officer ID and Name cannot be empty');
      }

      const response = await axios.put(`/api/employees/${employee.officer_no}`, employee);
      setEditflag(response.data.message);
      populateListView();
      setEmployee({ officer_no: '', officer_name: '', photo: '' });
    } catch (error) {
      console.error('Error editing employee:', error);
      setEditflag('Error in editing a record');
    }
  };

  const handleDelete = async () => {
    try {
      if (!employee.officer_no) {
        throw new Error('Officer ID cannot be empty');
      }

      const response = await axios.delete(`/api/employees/${employee.officer_no}`);
      setDelFlag(response.data.message);
      populateListView();
      setEmployee({ officer_no: '', officer_name: '', photo: '' });
    } catch (error) {
      console.error('Error deleting employee:', error);
      setDelFlag('Error in deleting record');
    }
  };

  const handleSelectEmployee = (event: React.MouseEvent<HTMLElement>) => {
    const selectedOfficerNo = event.currentTarget.getAttribute('data-officerno');
    if (selectedOfficerNo) {
      const selectedEmployee = employees.find((emp) => emp.officer_no === selectedOfficerNo);
      if (selectedEmployee) {
        setEmployee(selectedEmployee);
      }
    }
  };

  const handlePhotoClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        const file = target.files[0];
        setEmployee((prevEmployee) => ({
          ...prevEmployee,
          photo: URL.createObjectURL(file),
        }));
      }
    };
    input.click();
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col xs={12} md={8}>
          <h1 className="text-center text-primary">Employees for Property Rates</h1>
          <h2 className="text-center text-info">MARKORY WEST MUNICIPAL ASSEMBLY</h2>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Employee ID:</Form.Label>
              <Form.Control
                type="text"
                name="officer_no"
                value={employee.officer_no}
                onChange={handleInputChange}
                placeholder="Enter Employee ID"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Name:</Form.Label>
              <Form.Control
                type="text"
                name="officer_name"
                value={employee.officer_name}
                onChange={handleInputChange}
                placeholder="Enter Name"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Photo:</Form.Label>
              <Form.Control
                type="text"
                name="photo"
                value={employee.photo}
                onClick={handlePhotoClick}
                readOnly
                placeholder="Select Photo"
              />
            </Form.Group>
            <div className="d-flex justify-content-between">
              <Button variant="primary" onClick={handleAdd}>
                Add
              </Button>
              <Button variant="warning" onClick={handleEdit}>
                Edit
              </Button>
              <Button variant="danger" onClick={handleDelete}>
                Delete
              </Button>
              <Button variant="info" onClick={() => alert('View Logins')}>
                View Logins
              </Button>
            </div>
            {addflag && <p className="text-success mt-2">{addflag}</p>}
            {editflag && <p className="text-success mt-2">{editflag}</p>}
            {delFlag && <p className="text-danger mt-2">{delFlag}</p>}
          </Form>
          <Table striped bordered hover className="mt-3">
            <thead>
              <tr>
                <th>OFFICER NO</th>
                <th>OFFICER NAME</th>
                <th>PHOTO</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp.officer_no} data-officerno={emp.officer_no} onClick={handleSelectEmployee}>
                  <td>{emp.officer_no}</td>
                  <td>{emp.officer_name.toUpperCase()}</td>
                  <td>
                    {emp.photo && emp.photo !== 'xx' ? (
                      <img src={emp.photo} alt={emp.officer_name} style={{ width: '100px', height: '100px' }} />
                    ) : (
                      'No Photo'
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
};

export default FrmPropertyEmployee;


// import express from 'express';
// import { Request, Response } from 'express';
// import { Pool } from 'pg';

// const app = express();
// app.use(express.json());

// const pool = new Pool({
//   user: 'sa',
//   host: 'localhost',
//   database: 'dsnSaltpond',
//   password: 'Timbuk2tu',
//   port: 5432,
// });

// app.get('/api/employees', async (req: Request, res: Response) => {
//   try {
//     const result = await pool.query<Employee[]>('SELECT * FROM tb_PropertyOfficer ORDER BY officer_no');
//     res.json(result.rows);
//   } catch (err) {
//     res.status(500).json({ message: 'Error fetching employees' });
//   }
// });

// app.post('/api/employees', async (req: Request, res: Response) => {
//   const { officer_no, officer_name, photo } = req.body;
//   try {
//     const result = await pool.query<Employee[]>(
//       'SELECT * FROM tb_PropertyOfficer WHERE officer_no = $1',
//       [officer_no]
//     );
//     if (result.rows.length > 0) {
//       return res.status(400).json({ message: 'Record already exists' });
//     }
//     await pool.query('INSERT INTO tb_PropertyOfficer(officer_no, officer_name, photo) VALUES($1, $2, $3)', [officer_no, officer_name, photo]);
//     res.json({ message: 'Record successfully added' });
//   } catch (err) {
//     res.status(500).json({ message: 'Error in adding a record' });
//   }
// });

// app.put('/api/employees/:officer_no', async (req: Request, res: Response) => {
//   const { officer_no } = req.params;
//   const { officer_name, photo } = req.body;
//   try {
//     const result = await pool.query<Employee[]>(
//       'SELECT * FROM tb_PropertyOfficer WHERE officer_no = $1',
//       [officer_no]
//     );
//     if (result.rows.length === 0) {
//       return res.status(404).json({ message: 'Record does NOT exists' });
//     }
//     await pool.query('UPDATE tb_PropertyOfficer SET officer_name = $1, photo = $2 WHERE officer_no = $3', [officer_name, photo, officer_no]);
//     res.json({ message: 'Record edited successfully' });
//   } catch (err) {
//     res.status(500).json({ message: 'Error in editing a record' });
//   }
// });

// app.delete('/api/employees/:officer_no', async (req: Request, res: Response) => {
//   const { officer_no } = req.params;
//   try {
//     await pool.query('DELETE FROM tb_PropertyOfficer WHERE officer_no = $1', [officer_no]);
//     res.json({ message: 'Deletion successful' });
//   } catch (err) {
//     res.status(500).json({ message: 'Error in deleting record' });
//   }
// });

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
