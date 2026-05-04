import { createContext, useContext, useState } from 'react';

const PostPropertyContext = createContext();

export const PostPropertyProvider = ({ children }) => {
  const [postData, setPostData] = useState({
    propertyDetails: {
      type: 'Independent House',
      bhk: '1 BHK',
      furnishing: 'Semi Furnished',
      builtUpArea: '',
      buildingName: '',
      locality: '',
    },
    furnishings: {
      selectedItems: [],
      counters: {
        AC: 0,
        Bed: 0,
        TV: 0,
        Geyser: 0,
        Wardrobe: 0,
        Lifts: 0,
      },
    },
    priceDetails: {
      expectedPrice: '',
      maintenance: '',
      isNegotiable: false,
    },
  });

  const updatePropertyDetails = (details) => {
    setPostData((prev) => ({
      ...prev,
      propertyDetails: { ...prev.propertyDetails, ...details },
    }));
  };

  const updateFurnishings = (furnishings) => {
    setPostData((prev) => ({
      ...prev,
      furnishings: { ...prev.furnishings, ...furnishings },
    }));
  };

  const updatePriceDetails = (price) => {
    setPostData((prev) => ({
      ...prev,
      priceDetails: { ...prev.priceDetails, ...price },
    }));
  };

  return (
    <PostPropertyContext.Provider
      value={{
        postData,
        updatePropertyDetails,
        updateFurnishings,
        updatePriceDetails,
      }}
    >
      {children}
    </PostPropertyContext.Provider>
  );
};

export const usePostProperty = () => {
  const context = useContext(PostPropertyContext);
  if (!context) {
    throw new Error('usePostProperty must be used within a PostPropertyProvider');
  }
  return context;
};
