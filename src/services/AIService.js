import { GoogleGenerativeAI } from "@google/generative-ai";
import { Civilization } from "../models/Civilization.js";


class AIService{

  constructor(){
    this.genAI = new GoogleGenerativeAI("AIzaSyBn4kJU3uBOCemsTYgrILo9plkX-gUR49I");
    this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    this.session = this.model.startChat();
  }

  async getCivilivations(year, era)  {
    const prompt = 
      `Send me 10 ancient civilizations in the whole world that lived during the year ${year + ' ' + era}.
       Only send me the name of the civlization, the approximate start and end years of the civilization,
       the approximate coordinates of their location, and a paragraph describing about the civilization with at least 10 sentences.
       Send this data in a JSON array format with the fields being name, startYear, endYear, latitude, longitude, description. 
       For the name, startYear, endYear, and description the data must be in string format.
       For the latitude and longitude fields, only return a float for them and determine the sign of the float by North is positive for latitude and East is positive longitude for reference.
       make sure it is a valid JSON.
    `;
  
    try{
      const response  = await this.session.sendMessage(prompt);
      console.log(response);
      const jsonArray = this.parseAIResponse(response.response.text());
      let civilizations = Array.from(jsonArray, (civilizationData) => Civilization.jsonToCivilization(civilizationData));
      console.log(civilizations);
      return civilizations;
    } catch(error){
      console.error('Error fetching user data:', error);
      return [];
    }
  }

  
  parseAIResponse(response){
    response = response.replace("json", "");
    response = response.replace(/```/g, "");
    return JSON.parse(response);
  }

}

export default AIService;




