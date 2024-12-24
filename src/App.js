import './App.css';
import Globe from './components/Globe';
import InfoDialog from './components/InfoDialog';
import InfoPanel from './components/InfoPanel';
import { createContext, useState} from 'react';

export const CivilizationsContext = createContext();

const CivilizationsProvider = ({ children }) => {
  const [civilizations, setCivilizations] = useState([]);
  const [pickedCivilization, setPickedCivilization] = useState(null);


  const value = {
    civilizations,
    setCivilizations,
    pickedCivilization,
    setPickedCivilization,
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
        <InfoDialog/>
      </CivilizationsProvider>
    </div>
  );
}

export default App;
