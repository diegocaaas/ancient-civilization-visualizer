import React, { useRef, useState } from "react";
import { getCivilivationData } from "./services/AIService";

const InfoPanel = () => {

    const timeEraRef = useRef("BC");
    const [yearOfInterest, setYearOfInterest] = useState(0);
    const [data, setData] = useState({});

    const handleTimeEraSelection = (event) => {
        timeEraRef.current = event.target.value;
    };
   
    const handleYearSliderChange = (event) => {
        setYearOfInterest(event.target.value);
    };
    
    const handleOnSubmit = (event) => { 
        console.log("GETTING");
        getCivilivationData(yearOfInterest, timeEraRef.current)
        .then((result) => {
            setData(result);
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
        <pre>
            {JSON.stringify(data, null, 2)}
        </pre>
    </div>
}

export default InfoPanel;