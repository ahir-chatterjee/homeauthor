import React, { useEffect, useState, useRef } from 'react';
import { Link, useLocation } from "react-router-dom";
import { useUser } from '../contexts/User';
import { useListings } from '../contexts/Listings';
import axios from 'axios';
import "../styles/Generate.css"
import Logout from './Logout';
import { findDictWithSpecificStrings, parseUrl } from '../Utils';
import ResponseDisplay from './ResponseDisplay';

const GeneratePage = () => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [header, setHeader] = useState('');
  const [description, setDescription] = useState('');
  const [listing, setListing] = useState(null);
  const { user } = useUser();
  const { listings, upsertListing } = useListings();
  const location = useLocation();
  const urlParts = parseUrl(location.pathname);
  const previousTab = location.state?.previousTab;
  const mlsDropdownRef = useRef(null);
  const templateDropdownRef = useRef(null);
  const listingIdRef = useRef(null);
  const wordCountRef = useRef(null);
  const featuresRef = useRef(null);
  const amenitiesRef = useRef(null);

  const toggleAdvanced = () => {
    setShowAdvanced(!showAdvanced);
  };

  const handleGeneration = async (payload) => {
    axios.post('https://3mllscdebc.execute-api.us-east-1.amazonaws.com/prod/homeauthor', payload)
      .then(async response => {
        // Handle success
        console.log(response.data);
        const fullDescription = JSON.parse(response.data.generated_description);
        await upsertListing(response.data.body);
        const firstDoubleNewline = fullDescription.indexOf('\n\n');
        const header = fullDescription.slice(0, firstDoubleNewline);
        const description = fullDescription.slice(firstDoubleNewline + 2);
        setHeader(header);
        setDescription(description);
        await setListing(response.data.body);
      })
      .catch(error => {
        // Handle error
        setError('An error occurred while processing your request.');
        console.error(error);
      })
      .finally(() => setLoading(false));
  }

  const generate = () => {
    setLoading(true);
    setError(null);
    const mlsValue = mlsDropdownRef.current.value;
    const listingIdValue = listingIdRef.current.value;
    const templateDropdownValue = templateDropdownRef.current.value;
    if (!mlsValue || !listingIdValue) { 
      setError("Please fill out all required fields!");
      setLoading(false);
      return;
    }
    // Prepare request payload in the required format
    const payload = {
      "userId": user.userId,
      "databaseId": mlsValue,
      "listingId": listingIdValue,
    };

    if (showAdvanced) {
      const wordCountValue = wordCountRef.current.value;
      const amenitiesValue = amenitiesRef.current.value;
      const featuresValue = featuresRef.current.value;

      if (wordCountValue) payload["word_count"] = wordCountValue;
      if (featuresValue) payload["unique_features"] = featuresValue.split(",").filter(feature => feature !== "");
      if (amenitiesValue) payload["nearby_amenities"] = amenitiesValue.split(",").filter(amenity => amenity !== "");
      console.log(featuresValue);
      console.log(amenitiesValue);
    }
    templateDropdownValue ? payload["promptType"] = templateDropdownValue : payload["promptType"] = "base"

    console.log("Request Payload:", payload);

    handleGeneration(payload);
  };

  useEffect(() => {
    const userId = user ? user.userId : "";
    console.log(userId);
    console.log(listings);
    console.log(urlParts);
    if (urlParts.length == 4) {
      console.log([userId, urlParts[1], urlParts[2]]);
      const foundListing = findDictWithSpecificStrings(listings, [userId, urlParts[1], urlParts[2]]);
      console.log(foundListing);
      setListing(foundListing);
    }
    console.log(listing);
    if (listing) {
      mlsDropdownRef.current.value = listing.databaseId;
      listingIdRef.current.value = listing.listingId;
    } else {
      mlsDropdownRef.current.value = 'Select MLS System'; // your default value
      listingIdRef.current.value = ''; // your default value
    }
  }, [user, listings, listing]);

  return (
    <div className="generate-page">
      <div className='navBar'>
        <div className='back-button-wrapper'>
          <Link to={previousTab ? previousTab : '/dashboard'} className="back-button">{"<< Dashboard"}</Link>
        </div>
        <div className='logout-wrapper'>
          <Logout></Logout>
        </div>
      </div>
      <div className="top-bar">
        <h1>Generate New Description</h1>
      </div>
      <p style={{"text-align": "center"}}>Generate a new description by selecting your MLS System and entering your listing's id. Currently we only support actris_ref.</p>
      <p style={{"text-align": "center"}}>If you don't want to leave this page, here are some sample listingIds for you to try: 9341767, 2004912, 7608968.</p>
      <div className="input-row">
        <select className="mls-dropdown" ref={mlsDropdownRef}>
          <option disabled selected>Select MLS System</option>
          <option value="actris_ref">actris_ref</option>
          {/* MLS System Options */}
        </select>
        <input type="text" placeholder="Listing ID" className="listing-id" ref={listingIdRef}/>
      </div>
      
      <div className="advanced-toggle">
        <a href="#" onClick={toggleAdvanced}>
          {showAdvanced ? "Hide Advanced Options" : "Advanced Options"}
        </a>
      </div>
      
      {showAdvanced && (
        <div className="advanced-options">
          <div className="input-row">
            <input type="text" placeholder="Word Count" className="word-count centered-input" ref={wordCountRef}/>
          </div>
          <div className="input-row">
            <input type="text" placeholder="Unique Features" className="centered-input" ref={featuresRef} />
            <input type="text" placeholder="Nearby Amenities" className="centered-input" ref={amenitiesRef} />
          </div>
          <div className="input-row">
            <select className="template-dropdown" ref={templateDropdownRef}>
              <option selected>Base</option>
              <option value="traditional">Traditional</option>
              <option value="trendy">Trendy</option>
              <option value="luxury">Luxury</option>
              <option value="investor">Investor</option>
              <option value="vacation">Vacation</option>
              <option value="fixer">Fixer</option>
              <option value="land">Land</option>
            </select>
          </div>
      </div>
      )}
      
      <div className="button-container">
        <button className="generate-desc-button" onClick={generate}>Generate Description</button>
        {description ? (<Link to={`/listing/${listing.databaseId}/${listing.listingId}`} className="go-to-button">Go To Listing</Link>) : null}
      </div>
      {error && <div className="error">{error}</div>}
      {loading ? (
        <div className="loading-wrapper">
          <div className="loading">Writing... </div>
          <div className="loading-spinner"></div>
        </div>
      ) : null}
      <div className="response-display">
        <h2>{header}</h2>
        <ResponseDisplay description={description} />
      </div>
    </div>
  );
};

export default GeneratePage;