import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from '../contexts/User';
import axios from "axios";  
import "../styles/AuthPage.css"


const AuthPage = ({ isSignup }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const { user, setUser } = useUser();
  
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.userId) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const clearError = () => {
    console.log("hello");
    setError(null);
  }

  const handleAuth = async (e) => {  
    e.preventDefault();
    const apiUrl = "https://3mllscdebc.execute-api.us-east-1.amazonaws.com/prod/auth"; 
    const payload = {"email": email, "password": password, "isSignup": isSignup.toString()} 

    try {
      const response = await axios.post(apiUrl, payload);
      if (response.status === 200 && response.data.statusCode === 200) {
        console.log("Authentication successful:", response.data);
        await setUser(response.data.user);
        navigate('/dashboard');
      } else {
        console.log(response.data);
        if (response.data.statusCode === 400) {
          setError("A user already exists with this email. Please login.");
        }
        else if (response.data.statusCode === 402) {
          setError("Invalid email/password combination.");
        }
        else if (response.data.statusCode === 420 || response.data.statusCode === 421) {
          setError("Please fill out all required fields.");
        } else {
          setError("An unknown error occurred.");
        }
        console.log("Authentication failed" + response.data.body);
      }
    } catch (error) {
      setError("Error connecting to authentication service.");
      console.error("Error during authentication:" + error);
    }
  };

  return (
    <form onSubmit={handleAuth} className="auth-page">
        <h1>{isSignup ? "Signup" : "Login"}</h1>
        <p>Hey there, thanks for using HomeAuthor Alpha. Please do NOT use a secure password for your safety, as we are still working on encryption!</p>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {isSignup && (
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        )}
        <button onClick={handleAuth}>{isSignup ? "Signup" : "Login"}</button>
        {error && <div className="error">{error}</div>}
        <Link to={ isSignup ? "/login" : "/signup"} onClick={clearError}>
          {isSignup ? "Already have an account? Login" : "Don't have an account? Signup"}
        </Link>
        <br/>
        {/* {!isSignup && <Link to={"#"}>Forgot Login?</Link>} */}
      </form>
  );
};

export default AuthPage;