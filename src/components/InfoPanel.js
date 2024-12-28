import React, { useContext, useState } from "react";
import { getCivilivations } from "../services/AIService";
import { CivilizationsContext} from "../App";
import { div } from "three/tsl";

const InfoPanel = () => {

    const [era, setEra] = useState("BC");
    const [yearOfInterest, setYearOfInterest] = useState(0);
    const [isError, setError] = useState(false);
    const { civilizations, setCivilizations, pickedCivilization, setPickedCivilization, isLoading, setLoading} = useContext(CivilizationsContext);

    const handleEraSelection = (event) => {
        setEra(event.target.value);
    };
   
    const handleYearSliderChange = (event) => {
        setYearOfInterest(event.target.value);
    };
    
    const handleOnSubmit = async () =>  { 
        if(!isLoading){
            setLoading(true);
            setPickedCivilization(null);
            const result = await getCivilivations(yearOfInterest, era)
            if(result.length === 0){
                setError(true);
            } else{
                setCivilizations(result);
            }
            setLoading(false);
        }
    }
    
    const handleGoBack = () => {
        setCivilizations([]);
        setPickedCivilization(null);
        setEra("BC");
        setYearOfInterest(0);
    }


    return <div className="InfoPanel">
        <h1> Ancient Civilization Explorer</h1>
        {isError ? 
            <div className="column">
                <h3> Oops! An error occured please try again.</h3>
                <button className="submit-button" onClick={() => setError(false)}> Try Again</button>
            </div> 
            : 
            <div className="column">
                {(!isLoading && civilizations.length === 0) && <label>Select a year in history</label>}
                {(!isLoading && civilizations.length === 0) && <input style={{width: "50%"}} type="range"  min="0" max="1500" step="1" onChange={handleYearSliderChange}/>}
                {(!isLoading && civilizations.length === 0) && 
                    <select defaultValue={era} onChange={handleEraSelection}>
                        <option value="BC">BC</option>
                        <option value="AD">AD</option>
                    </select>
                }
                <h2> {yearOfInterest + " " + era} </h2>
                {(!isLoading && civilizations.length === 0) &&
                    <button className="submit-button" onClick={handleOnSubmit}>
                        <div className="button-text">Submit</div>
                    </button>
                }
                {isLoading && <div className="loading-spinner"></div>}
                {(!isLoading && civilizations.length > 0) && 
                    <button className="submit-button" onClick={handleGoBack}>
                        <div className="button-text">Go Back?</div>
                    </button>
                }
            </div>
        }
        {pickedCivilization && <div className="column">
            <h1> {pickedCivilization.name}</h1>
            <div className="row">
                <h3> Start Year: {pickedCivilization.startYear}</h3>
                <h3> End Year: {pickedCivilization.endYear}</h3>
            </div>
            <p> {pickedCivilization.description} </p>
        </div>}
        
    </div>
}

export default InfoPanel;