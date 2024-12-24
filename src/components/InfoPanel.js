import React, { useContext, useRef, useState, useEffect } from "react";
import { getCivilivations } from "../services/AIService";
import { CivilizationsContext} from "../App";

const InfoPanel = () => {

    const timeEraRef = useRef("BC");
    const [yearOfInterest, setYearOfInterest] = useState(0);
    const { setCivilizations, pickedCivilization, setPickedCivilization} = useContext(CivilizationsContext);

    const handleTimeEraSelection = (event) => {
        timeEraRef.current = event.target.value;
    };
   
    const handleYearSliderChange = (event) => {
        setYearOfInterest(event.target.value);
    };
    
    const handleOnSubmit = (event) => { 
        setPickedCivilization(null);
        getCivilivations(yearOfInterest, timeEraRef.current)
        .then((result) => {
            setCivilizations([...result]);
        });
    }

    return <div className="InfoPanel">
        <h1> Ancient Civilization Explorer</h1>
        <label>Choose a year: {yearOfInterest}</label>
        <input type="range"  min="0" max="1500" step="1" onChange={handleYearSliderChange}/>
        <select defaultValue={timeEraRef.current} onChange={handleTimeEraSelection}>
            <option value="BC">BC</option>
            <option value="AD">AD</option>
        </select>
        <button onClick={handleOnSubmit}>Submit</button>
        {pickedCivilization && <h1> {pickedCivilization.name}</h1>}
        {pickedCivilization && <p> {pickedCivilization.description} </p>}
        <div> {JSON.stringify(pickedCivilization)} </div>
    </div>
}

export default InfoPanel;