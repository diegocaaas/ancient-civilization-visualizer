import React, { useContext, useState, useRef } from "react";
import { CivilizationsContext} from "../providers/CivilizationsProvider";
import AIService from "../services/AIService";

const InfoPanel = () => {

    const [era, setEra] = useState("BC");
    const [yearOfInterest, setYearOfInterest] = useState(0);
    const [isError, setError] = useState(false);
    const { civilizations, setCivilizations, pickedCivilization, setPickedCivilization, isLoading, setLoading} = useContext(CivilizationsContext);
    const AIserviceRef = useRef(new AIService())

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
            const result = await AIserviceRef.current.getCivilivations(yearOfInterest, era)
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
                {(!isLoading && civilizations.length === 0) && 
                    <div className="row" style={{justifyContent: "center", gap: "20px"}}>
                        <input style={{width: "50%"}} type="range"  min="0" max="1500" step="1" onChange={handleYearSliderChange}/>
                        <select defaultValue={era} onChange={handleEraSelection}>
                            <option value="BC">BC</option>
                            <option value="AD">AD</option>
                        </select>
                    </div>
                }
                <h2> {yearOfInterest + " " + era} </h2>
                {(!isLoading && civilizations.length === 0) &&
                    <button className="submit-button" onClick={handleOnSubmit}>
                        <div className="button-text">Submit</div>
                    </button>
                }
                {isLoading && <div className="loading-spinner"></div>}
                
                {(!isLoading && civilizations.length > 0) && 
                    <div className="row">
                        <span>Select marker on globe. or <span className="text-button" onClick={handleGoBack}> Go Back?</span> </span>
                    </div>
                }
                
            </div>
        }
        {pickedCivilization && <div className="column" style={{border: "2px solid black", borderRadius: "5px", width: "90%", marginTop: "30px", overflowY: "auto"}}>
            <h2> {pickedCivilization.name}</h2>
            <div className="row">
                <h3> Start Year: {pickedCivilization.startYear}</h3>
                <h3> End Year: {pickedCivilization.endYear}</h3>
            </div>
            <p style={{paddingLeft: "20px", paddingRight: "20px", height: "275px" }}> {pickedCivilization.description} </p>
        </div>}
        
    </div>
}

export default InfoPanel;