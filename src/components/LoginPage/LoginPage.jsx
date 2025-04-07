// src/components/LoginPage/LoginPage.js
import React, { useState } from 'react'; // Import useState for handling form inputs
import './LoginPage.css'; // Import the specific CSS for this component

function LoginPage() {
    // Optional: State for controlled inputs
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);

    const handleLogin = (event) => {
        event.preventDefault(); // Prevent default form submission
        // --- Add Login Logic Here ---
        // e.g., validation, API call
        console.log('Login attempt:', { email, password, rememberMe });
        alert('Login Submitted (check console)');
        // --- --- --- --- --- --- --- ---
    };

    return (
        // Container to help with centering if needed
        <div className="login-page-container">
            <div className="wrapper">
                <form onSubmit={handleLogin}> {/* Add onSubmit handler */}
                    <h2>Login Form</h2>
                    <div className="input-field">
                        <input
                            type="text"
                            id="email" // Add id for label association
                            required
                            value={email} // Controlled component
                            onChange={(e) => setEmail(e.target.value)} // Update state
                        />
                        <label htmlFor="email">Enter your email</label> {/* Use htmlFor */}
                    </div>

                    <div className="input-field">
                        <input
                            type="password"
                            id="password" // Add id for label association
                            required
                            value={password} // Controlled component
                            onChange={(e) => setPassword(e.target.value)} // Update state
                        />
                        <label htmlFor="password">Enter your password</label> {/* Use htmlFor */}
                    </div>

                    <div className="forget">
                        <label htmlFor="remember"> {/* Wrap input+p in label */}
                            <input
                                type="checkbox"
                                id="remember"
                                checked={rememberMe} // Controlled component
                                onChange={(e) => setRememberMe(e.target.checked)} // Update state
                            />
                            <p>Remember me</p>
                        </label>
                        {/* Use Link from react-router-dom if you add routing */}
                        <a href="#">Forgot password?</a>
                    </div>

                    <button type="submit">Log In</button>

                    <div className="register">
                        <p>Don't have an account? <a href="#">Register</a></p>
                        {/* Use Link from react-router-dom if you add routing */}
                    </div>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;