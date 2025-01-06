import { useState, createContext } from "react";

export const CivilizationsContext = createContext();

export const CivilizationsProvider = ({ children }) => {
  const [civilizations, setCivilizations] = useState([]);
  const [pickedCivilization, setPickedCivilization] = useState(null);
  const [isLoading, setLoading] = useState(false);


  const value = {
    civilizations,
    setCivilizations,
    pickedCivilization,
    setPickedCivilization,
    isLoading,
    setLoading,
  };
  
  return (
    <CivilizationsContext.Provider value={value}>
      {children}
    </CivilizationsContext.Provider>
  );
};