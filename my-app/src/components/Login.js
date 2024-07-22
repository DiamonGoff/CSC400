import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Ensure you have styling for your form

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:3001/auth/login', {
                email,
                password
            });
            console.log('Login response:', response.data); // Logging the response
            localStorage.setItem('userId', response.data.user.id); // Set userId in localStorage
            setMessage(response.data.message);
            navigate('/organizer'); // Redirect to the organizer interface
        } catch (error) {
            setMessage(`Error logging in: ${error.response.data.message || error.message}`);
        }
    };

    return (
        <div className="login-box">
            <h2 className="text-center">Login</h2>
            <form onSubmit={handleLogin}>
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input 
                        type="email" 
                        className="form-control" 
                        id="email" 
                        name="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required 
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input 
                        type="password" 
                        className="form-control" 
                        id="password" 
                        name="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required 
                    />
                </div>
                <input type="submit" value="Login" className="btn btn-primary btn-block" />
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}

export default Login;
