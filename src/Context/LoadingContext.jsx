import React, { createContext, useState, useContext, useRef, useCallback } from 'react';

const LoadingContext = createContext();

export const useLoading = () => useContext(LoadingContext);

export const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const loadingTimer = useRef(null);

  const showLoader = useCallback(() => {
    clearTimeout(loadingTimer.current);
    setIsLoading(true);
  }, []);

  const hideLoader = useCallback(() => {
    loadingTimer.current = setTimeout(() => {
      setIsLoading(false);
    }, 400);
  }, []);

  const value = { isLoading, showLoader, hideLoader };

  return (
    <LoadingContext.Provider value={value}>
      {children}
    </LoadingContext.Provider>
  );
};