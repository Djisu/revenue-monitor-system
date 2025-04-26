import React, { useState } from 'react';
import { Form, Button, Alert, Container } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const FrmLogin: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate(); 

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        //console.log('in frmlogin handlesubmit Username:', username, 'Password:', password);

        // Validate inputs
        if (!username || !password) {
            setError('Username and password cannot be blank!');
            return;
        }

        try {
            //console.log('Logging in with username:', username, 'and password:', password);

            await login(username, password); 

            //console.log('About to navigate to MainMenu!');

            navigate('/main'); // Redirect to MainMenu on successful login
        } catch (error) {
            console.error('Login failed:', error);
            setError('Error during login');
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
            <Form onSubmit={handleSubmit} style={{ width: '300px', margin: '0 auto' }}>
                <Form.Group controlId="formUsername">
                    <h1>Login</h1>
                    <Form.Label>User Name</Form.Label>
                    <Form.Control
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter username"
                        autoComplete="current-username"
                        required
                    />
                </Form.Group>
                <Form.Group controlId="formPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password"
                        autoComplete="current-password"
                        required
                    />
                </Form.Group>
                <Button variant="success" type="submit" className="mt-3" style={{ width: '100%' }}>
                    OK
                </Button>
                <Button variant="danger" type="button" className="mt-3" style={{ width: '100%' }} onClick={() => navigate('/main')}>
                    Cancel
                </Button>
                {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
                <div className="mt-3 text-center" style={{ color: 'red' }}>
                    (c) SoftPlus Solutions
                </div>
            </Form>
        </Container>
    );
};

export default FrmLogin;