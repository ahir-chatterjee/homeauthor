import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the context object and set default values
const ListingsContext = createContext({
  listings: [],
  setListings: () => {}
});

// Custom hook to use the ListingsContext
export const useListings = () => {
  return useContext(ListingsContext);
};

// Provider component to wrap around components that will use the ListingsContext
export const ListingsProvider = ({ children }) => {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    const savedListings = JSON.parse(localStorage.getItem('listings')) || [];
    setListings(savedListings);
  }, []);

  const setListingsAndStore = (newListings) => {
    localStorage.setItem('listings', JSON.stringify(newListings));
    setListings(newListings);
  };

  const scrapeListing = (mlsListing) => {
    return {
      listingId: mlsListing.listingId,
      uniqueId: mlsListing.uniqueId,
      databaseId: mlsListing.databaseId,
      image: mlsListing.Media[0].MediaURL,
      streetAddress: mlsListing.UnparsedAddress,
      price: mlsListing.ListPrice,
      listingStatus: mlsListing.MlsStatus,
      userId: mlsListing.userId,
      bedrooms: mlsListing.BedroomsTotal,
      bathrooms: mlsListing.BathroomsTotalInteger,
      squareFeet: mlsListing.LivingArea,
      propertyType: mlsListing.PropertySubType,
      yearBuilt: mlsListing.YearBuilt,
      heating: mlsListing.Heating,
      cooling: mlsListing.Cooling,
      parking: mlsListing.ParkingTotal,
      descriptions: mlsListing.descriptions || [],
    };
  }

  const upsertListing = (upsertedListing) => {
    let updated = false;
    const scrapedListing = scrapeListing(upsertedListing);
    const updatedListings = listings.map(listing => {
      if (listing.uniqueId === scrapedListing.uniqueId) {
        updated = true;
        return scrapedListing;
      }
      return listing;
    });

    if (!updated) {
      updatedListings.push(scrapedListing);
    }

    setListingsAndStore(updatedListings);
  };

  return (
    <ListingsContext.Provider 
      value={{ 
        listings, 
        setListings: setListingsAndStore,
        upsertListing,
        scrapeListing,
      }}
    >
      {children}
    </ListingsContext.Provider>
  );
};
