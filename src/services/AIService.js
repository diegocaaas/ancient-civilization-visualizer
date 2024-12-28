import { GoogleGenerativeAI } from "@google/generative-ai";
import { Civilization } from "../models/Civilization.js";

const genAI = new GoogleGenerativeAI("AIzaSyBn4kJU3uBOCemsTYgrILo9plkX-gUR49I");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-8b" });


export const getCivilivations = async (year, era)  => {
  const prompt = 
    `Send me around 10-20 most known ancient civilizations in africa, europe, asia, americas that lived during the year ${year + ' ' + era}.
     Only send me the name of the civlization, the approximate start and end years of the civilization,
     the approximate coordinates of their location, and a paragraph describing about the civilization with at least 10 sentences.
     Send this data in a JSON array format with the fields being name, startYear, endYear, latitude, longitude, description. 
     For the name, startYear, endYear, and description the data must be in string format.
     For the latitude and longitude fields, only return a float with the N being positive and E being positive for reference..
     make sure it is a valid JSON.
  `;

  try{
    const response  = await model.generateContent(prompt);
    console.log(response);
    const jsonArray = parseAIResponse(response.response.text());
    let civilizations = Array.from(jsonArray, (civilizationData) => Civilization.jsonToCivilization(civilizationData));
    console.log(civilizations);
    return civilizations;
  } catch(error){
    console.error('Error fetching user data:', error);
    return [];
  }
}

const parseAIResponse = (response) => {
  response = response.replace("json", "");
  response = response.replace(/```/g, "");
  return JSON.parse(response);
}




