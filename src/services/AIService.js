import { GoogleGenerativeAI } from "@google/generative-ai";
import { Civilization } from "../models/Civilization.js";

const genAI = new GoogleGenerativeAI("AIzaSyBn4kJU3uBOCemsTYgrILo9plkX-gUR49I");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-8b" });


export const getCivilivations = async (year, era)  => {
  const prompt = 
    `Only send me max 5 most known ancient civilizations that lived during the year ${year + ' ' + era}.
     Only send me the name of the civlization, the approximate start and end years of the civilization,
     the approximate coordinates of their location, and a short paragraph about the civilization no more than 10 sentences.
     Send this data in a numbered JSON format with the fields being name, startYear, endYear, coordinates, description.
  `;

  try{
    const response  = await model.generateContent(prompt);
    const jsonArray = parseAIResponse(response.response.text());
    let civilizations = Array.from(jsonArray, (civilizationData) => Civilization.jsonToCivilization(civilizationData));
    console.log(civilizations);
    return civilizations;
  } catch(error){
    console.error('Error fetching user data:', error);
    return {};
  }
}

const parseAIResponse = (response) => {
  response = response.replace("json", "");
  response = response.replace(/```/g, "");
  return JSON.parse(response);
}




