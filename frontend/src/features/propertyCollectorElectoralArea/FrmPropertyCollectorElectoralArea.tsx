import React, { useState } from 'react';
import { Button, Form, Table, Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const FrmPropertyCollectorElectoralArea: React.FC = () => {
  const [officerNo, setOfficerNo] = useState<string>('');
  const [electoralArea, setElectoralArea] = useState<string>('');
  const [collectors, setCollectors] = useState<any[]>([]);

  // Mock data for dropdowns
  const officerNos = ['001', '002', '003'];
  const electoralAreas = ['Area1', 'Area2', 'Area3'];

  // Mock function to simulate adding a record
  const handleAddRecord = () => {
    if (!officerNo || !electoralArea) {
      alert('Please fill in all fields');
      return;
    }
    const newCollector = { officerNo, officerName: 'John Doe', electoralArea };
    setCollectors([...collectors, newCollector]);
  };

  // Mock function to simulate deleting a record
  const handleDeleteRecord = (index: number) => {
    const updatedCollectors = collectors.filter((_, i) => i !== index);
    setCollectors(updatedCollectors);
  };

  return (
    <Container>
      <Row className="mt-4">
        <Col>
          <Card>
            <Card.Header as="h5" className="text-center bg-primary text-white">
              MARCORY MUNICIPAL ASSEMBLY
            </Card.Header>
            <Card.Body>
              <Form>
                <Form.Group controlId="formOfficerNo">
                  <Form.Label>Collector:</Form.Label>
                  <Form.Control
                    as="select"
                    value={officerNo}
                    onChange={(e) => setOfficerNo(e.target.value)}
                  >
                    <option value="">Select Officer No</option>
                    {officerNos.map((no) => (
                      <option key={no} value={no}>
                        {no}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>

                <Form.Group controlId="formElectoralArea">
                  <Form.Label>Suburb:</Form.Label>
                  <Form.Control
                    as="select"
                    value={electoralArea}
                    onChange={(e) => setElectoralArea(e.target.value)}
                  >
                    <option value="">Select Electoral Area</option>
                    {electoralAreas.map((area) => (
                      <option key={area} value={area}>
                        {area}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>

                <Button variant="primary" onClick={handleAddRecord}>
                  Add New Record
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col>
          <Card>
            <Card.Header as="h5" className="bg-primary text-white">
              List of Collectors And Their Layouts
            </Card.Header>
            <Card.Body>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>OFFICER NO</th>
                    <th>OFFICER NAME</th>
                    <th>ELECTORAL AREA</th>
                    <th>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {collectors.map((collector, index) => (
                    <tr key={index}>
                      <td>{collector.officerNo}</td>
                      <td>{collector.officerName}</td>
                      <td>{collector.electoralArea}</td>
                      <td>
                        <Button variant="danger" onClick={() => handleDeleteRecord(index)}>
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col>
          <Card>
            <Card.Header as="h5" className="bg-primary text-white">
              Activity
            </Card.Header>
            <Card.Body>
              <Button variant="secondary" onClick={() => alert('Exit clicked')}>
                Exit
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="mt-3">
          <Col>
          <Link to="/main" className="primary m-3">
              Go Back
          </Link>
          </Col>
      </Row>
    </Container>
  );
};

export default FrmPropertyCollectorElectoralArea;
