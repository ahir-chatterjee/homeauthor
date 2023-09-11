import { Link } from 'react-router-dom';
import { useUser } from '../contexts/User';
import { useListings } from '../contexts/Listings';
import React, { useEffect } from 'react';
import axios from 'axios';
import Logout from './Logout';
import GenerateButton from './GenerateButton';
import "../styles/Dashboard.css"

const Dashboard = () => {
  const { user } = useUser();
  const {listings, setListings, scrapeListing} = useListings();
  const userId = user ? user.userId : "";

  // Dummy data for test listings
  if (!listings) {
    setListings([]);
  }

  useEffect(() => {
    const fetchListings = async () => {
      if (user && user.userId) {
        try {
          const apiUrl = 'https://3mllscdebc.execute-api.us-east-1.amazonaws.com/prod/listing'; 
          const payload = { "operation": "GetAllListings", "userId": userId };
          const response = await axios.post(apiUrl, payload);

          if (response.status === 200) {
            console.log("Received data: ", response)
            const fetchedListings = response.data.body.items.map(item => (scrapeListing(item)));
            await setListings(fetchedListings);
          } else {
            console.error('Failed to fetch listings:', response);
            setListings(Array.from({ length: 20 }, (_, index) => ({
              id: index,
              streetAddress: '123 Main St',
              county: 'Some County',
              price: '$400,000',
              listingStatus: 'Available',
            })));
          }
        } catch (error) {
          console.error('Error fetching listings:', error);
          setListings(Array.from({ length: 20 }, (_, index) => ({
              id: index,
              streetAddress: '123 Main St',
              county: 'Some County',
              price: '$400,000',
              listingStatus: 'Available',
            })));
        }
      }
    };
    fetchListings();
  }, [user?.userId]);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>HomeAuthor Dashboard</h1>
        <Logout></Logout>
      </div>
      <div className="dashboard-container">
        <GenerateButton></GenerateButton>
        <div className="listings-section">
          <h2>Your Listings</h2>
          <div className="listings-box">  {/* New wrapping div */}
              <div className="listings">
              {listings && listings.length > 0 ? listings.map((listing) => (
                  <Link to={{
                    pathname: "/listing/" + listing.databaseId + "/" + listing.listingId, 
                    state: { 
                      previousTab: "/dashboard", 
                      currentListing: listing
                    }
                    }} 
                    className="listing-card">
                    <img src={listing.image} alt="listing image" />
                    <div className="listing-info">
                        <ul>
                        <li>Address: {listing.streetAddress}</li>
                        <li>Price: {listing.price}</li>
                        <li>Status: {listing.listingStatus}</li>
                        </ul>
                    </div>
                  </Link>
              )) : <div>This is where your listings will appear. Generate a new description first!</div>}
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;