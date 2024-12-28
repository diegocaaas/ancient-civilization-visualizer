import './App.css';
import Globe from './components/Globe';
import InfoPanel from './components/InfoPanel';
import { createContext, useState} from 'react';

export const CivilizationsContext = createContext();

const CivilizationsProvider = ({ children }) => {
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

function App() {
  return (
    <div className="App">
      <CivilizationsProvider>
        <InfoPanel/>
        <Globe/>
      </CivilizationsProvider>
    </div>
  );
}

export default App;
