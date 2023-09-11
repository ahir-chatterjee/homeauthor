// src/App.js
import React, { useState } from 'react';
import Header from './components/Header';
import InputFields from './components/InputFields';
import SubmitButton from './components/SubmitButton';
import ResponseDisplay from './components/ResponseDisplay';
import axios from 'axios';
import './App.css';


const OldApp = () => {
  const [params, setParams] = useState({});
  const [description, setDescription] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (key, value) => {
    setParams({ ...params, [key]: value });
  };

  const handleSubmit = () => {
    setLoading(true);
    setError(null);
    if (!params.databaseId || !params.listingId) {
      setError("Please fill out all required fields!");
      return;
    }
    // Prepare request payload in the required format
    const requestPayload = Object.entries(params).reduce((obj, [key, value]) => {
      if (value) obj[key] = value;
      return obj;
    }, {});

    console.log("Request Payload:", requestPayload);

    axios.post('https://3mllscdebc.execute-api.us-east-1.amazonaws.com/prod/homeauthor', requestPayload)
      .then(response => {
        // Handle success
        console.log(response.data)
        setDescription(JSON.parse(response.data.body));
      })
      .catch(error => {
        // Handle error
        setError('An error occurred while processing your request.');
        console.error(error);
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="container">
      <Header />
      <InputFields handleChange={handleChange} params={params} />
      <SubmitButton handleSubmit={handleSubmit} />
      {error && <div className="error">{error}</div>} {/* Display error message */}
      {loading && <div>Loading...</div>}
      <ResponseDisplay description={description} />
    </div>
  );
};

export default OldApp;

