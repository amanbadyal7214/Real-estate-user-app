import { createContext, useContext, useState } from 'react';

const PostPropertyContext = createContext();

export const PostPropertyProvider = ({ children }) => {
  const [postData, setPostData] = useState({
    propertyDetails: {
      category: '',
      type: '',
      subPropertyType: '',
      title: '',
      bhk: '',
      builtUpArea: '',
      measurementUnit: '',
      buildingName: '',
      locality: '',
      localityId: '',
      city: 'Gurugram',
      cityId: '',
      state: 'Haryana',
      stateId: '',
      country: 'India',
      countryId: '',
      projectId: '',
      furnishing: '',
      description: '',
      ownerName: '',
      address: '',
    },
    furnishings: {
      selectedItems: [],
      counters: {
        AC: 0,
        Bed: 0,
        TV: 0,
        Geyser: 0,
        Wardrobe: 0,
      },
    },
    priceDetails: {
      expectedPrice: '',
      maintenance: '',
      securityDeposit: '',
      isNegotiable: false,
      availableFrom: '',
    },
    advancedDetails: {
      floor: '',
      totalFloors: '',
      bathrooms: '',
      balconies: '',
      ageOfProperty: '',
      parking: {
        covered: 0,
        open: 0
      },
      tenantType: [], // Bachelors, Family, any
      petFriendly: null,
    },
    photos: [],
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

  const updateAdvancedDetails = (details) => {
    setPostData((prev) => ({
      ...prev,
      advancedDetails: { ...prev.advancedDetails, ...details },
    }));
  };

  const updatePhotos = (photos) => {
    setPostData((prev) => ({
      ...prev,
      photos: photos,
    }));
  };

  return (
    <PostPropertyContext.Provider
      value={{
        postData,
        updatePropertyDetails,
        updateFurnishings,
        updatePriceDetails,
        updateAdvancedDetails,
        updatePhotos,
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
