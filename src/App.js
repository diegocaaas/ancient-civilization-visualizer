import './App.css';
import Globe from './components/Globe';
import InfoPanel from './components/InfoPanel';
import { CivilizationsProvider } from './providers/CivilizationsProvider'


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
