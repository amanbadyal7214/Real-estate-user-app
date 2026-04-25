import { createContext, useContext, useMemo, useState } from 'react';

const CategoryTabContext = createContext(null);

const TAB_ROUTES = {
  Buy: '/screens/Buy/Buy',
  Rent: '/screens/Rent/Rent',
  Project: '/screens/Project/Project',
    Plot: '/screens/Plot/Plot',
    PG: '/screens/PG/PG',
    Commercial: '/screens/Commercial/Commercial',
};

export const CategoryTabProvider = ({ children }) => {
  const [selectedTab, setSelectedTab] = useState('Buy');

  const value = useMemo(
    () => ({ selectedTab, setSelectedTab }),
    [selectedTab]
  );

  return (
    <CategoryTabContext.Provider value={value}>
      {children}
    </CategoryTabContext.Provider>
  );
};

export const useCategoryTab = () => {
  const context = useContext(CategoryTabContext);

  if (!context) {
    throw new Error('useCategoryTab must be used inside CategoryTabProvider');
  }

  return context;
};

export const getCategoryRoute = (tabId) => TAB_ROUTES[tabId] || null;
