 export class Civilization{

    constructor(name, startYear, endYear, latitude, longitude, description) {
        this.name = name;
        this.startYear = startYear;
        this.endYear = endYear;
        this.latitude = latitude;
        this.longitude = longitude;
        this.description = description;
    }
    
    static jsonToCivilization(json){
      return new Civilization(
        json.name, 
        json.startYear,
        json.endYear,
        json.latitude,
        json.longitude,
        json.description, 
      );
    }
}