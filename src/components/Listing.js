import React, { useState, useEffect } from 'react';
import { Link, useLocation } from "react-router-dom";
import { useUser } from '../contexts/User';
import { useListings } from '../contexts/Listings';
import axios from 'axios';
import Logout from './Logout';
import "../styles/Listing.css"
import { findDictWithSpecificStrings, parseUrl } from '../Utils';

const ViewListing = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [listing, setListing] = useState(null);
  const [editedText, setEditedText] = useState('');
  const location = useLocation();
  const { user } = useUser();
  const { listings, upsertListing } = useListings();
  const handleTextareaChange = (e) => {
    setEditedText(e.target.value);
  };
  
  const urlParts = parseUrl(location.pathname);

  let header = '';
  let remainingDescription = '';
  
  if (listing && listing.descriptions.length > 0) {
    const descriptionLines = listing.descriptions[selectedTab]?.split('\n\n') || [];
    header = descriptionLines[0];
    remainingDescription = descriptionLines.slice(1).join('\n\n');
  }

  const handleTabClick = (index) => {
    setSelectedTab(index);
    setEditedText(listing.descriptions[index]);
  };

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    // Save your changes here
    let newDescriptions = listing.descriptions;
    //const convertedText = editedText.replace(/\n/g, "\\n\\n");
    newDescriptions[selectedTab] = editedText;
    const payload = {"operation": "UpdateListing",
               "userId": user.userId,
               "databaseId": listing.databaseId,
               "listingId": listing.listingId,
               "updates": {"descriptions": newDescriptions},
    }
    const apiUrl = 'https://3mllscdebc.execute-api.us-east-1.amazonaws.com/prod/listing'; 
    const response = await axios.post(apiUrl, payload);
    console.log(response);
    if (response.status === 200) {
      upsertListing(response.data.body);
      console.log("saved successfully");
    } else {
      console.error("error with saving");
    }
    setIsEditing(false);
  };

  const handleDelete = async () => {
    let newDescriptions = listing.descriptions;
    if (newDescriptions.length == 0) {
      return;
    }
    newDescriptions.splice(selectedTab, 1); // 2nd parameter means remove one item only
    const payload = {"operation": "UpdateListing",
               "userId": user.userId,
               "databaseId": listing.databaseId,
               "listingId": listing.listingId,
               "updates": {"descriptions": newDescriptions},
    }
    const apiUrl = 'https://3mllscdebc.execute-api.us-east-1.amazonaws.com/prod/listing'; 
    const response = await axios.post(apiUrl, payload);
    console.log(response);
    if (response.status === 200) {
      upsertListing(response.data.body);
      console.log("deleted successfully");
    } else {
      console.error("error with deleting");
    }
    setSelectedTab(selectedTab > 0 ? selectedTab - 1 : 0);
    setIsEditing(false);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(editedText);
      console.log('Text copied to clipboard');
    } catch (err) {
      console.log('Failed to copy text: ', err);
    }
  };  

  useEffect( () => {
    if (user && listings) {
      console.log(user, listings);
      const foundListing = findDictWithSpecificStrings(listings, [user.userId, urlParts[1], urlParts[2]]);
      console.log(foundListing);
      setListing(foundListing);
      setIsLoading(false);
    }
    if(listing) {
      setEditedText(listing.descriptions[selectedTab] || '');
    }
  }, [user, listings, listing]);
  

  return (
    <>
    {isLoading ? (
      <div>Loading...</div>
    ) : (
    <div className="view-listing">
      <div className="top-bar">
        <Link to="/dashboard" className="back-button">{"<< Dashboard"}</Link>
        <h1>{listing.streetAddress}</h1>
        <Logout></Logout>
      </div>

      <div className="listing-row">
        <img src={listing.image} alt="house" className="listing-image"/>
        <div className="listing-info">
          <div className="listing-info">
            {/* <button className="archive-button">Archive</button> */}
            <h3>Property Details</h3>
            <ul>
                <li><strong>Price:</strong> {listing.price} </li>
                <li><strong>Bedrooms:</strong> {listing.bedrooms} </li>
                <li><strong>Bathrooms:</strong> {listing.bathrooms} </li>
                <li><strong>Square Feet:</strong> {listing.squareFeet} </li>
                <li><strong>Type:</strong> {listing.propertyType} </li>
                <li><strong>Year Built:</strong> {listing.yearBuilt} </li>
                <li><strong>Heating:</strong> {listing.heating} </li>
                <li><strong>Cooling:</strong> {listing.cooling} </li>
                <li><strong>Parking:</strong> {listing.parking} </li>
            </ul>
            </div>
        </div>
      </div>

      <h2 className="sub-header">Generated Descriptions</h2>
      <p style={{"text-align" : "center"}}>Double click on a description to edit it.</p>

      <div className="description-box">
        <div className="tabs">
        {listing.descriptions.length > 0 ? (
            listing.descriptions.map((_, index) => (
                <button
                key={index}
                className={`tab ${index === selectedTab ? 'active' : ''}`}
                onClick={() => handleTabClick(index)}
                >
                Description {index + 1}
                </button>
            ))
        ) : (
            <span>Generate a description using the button below!</span>
        )}
        </div>
        <div className="tab-content" onDoubleClick={handleDoubleClick}>
          {listing.descriptions.length > 0 ? (
            isEditing ? (
              <textarea value={editedText} onChange={handleTextareaChange} style={{ width: '100%', height: '100%' }} />
            ) : (
              <pre>
                <span className="description-header">{header}</span><br/>
                {remainingDescription}
              </pre>
            )
          ) : null}
        </div>
      </div>


      <div className="button-row">
        {isEditing ? (
          <button onClick={handleSave}>Save Description</button>
        ) : (
          <>
            <button onClick={handleDelete}>Delete Description</button>
            <button onClick={handleCopy}>Copy to Keyboard</button>
          </>
        )}
      </div>

      <Link to={`${location.pathname}/generate`} className="generate-new-desc-button">
          Generate New Description
      </Link>
    </div>
    )}
  </>
  );
};

export default ViewListing;
