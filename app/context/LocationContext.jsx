import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';

const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [currentLocation, setCurrentLocation] = useState(null);

  // Initialize location from SecureStore
  useEffect(() => {
    const loadStoredLocation = async () => {
      try {
        const stored = await SecureStore.getItemAsync('user_location');
        if (stored) {
          setCurrentLocation(JSON.parse(stored));
        }
      } catch (error) {
        console.error('Error loading location from SecureStore:', error);
      }
    };
    loadStoredLocation();
  }, []);

  const updateLocation = async (locationData) => {
    try {
      // Logic to normalize location if needed (e.g., city only priority)
      const locationToSave = {
        city: locationData.city,
        pincode: locationData.pincode,
        locality: locationData.locality,
        display: locationData.display || locationData.city
      };
      
      setCurrentLocation(locationToSave);
      await SecureStore.setItemAsync('user_location', JSON.stringify(locationToSave));
    } catch (error) {
      console.error('Error saving location to SecureStore:', error);
    }
  };

  return (
    <LocationContext.Provider value={{ currentLocation, updateLocation }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};
