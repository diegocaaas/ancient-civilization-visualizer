 export class Civilization{

    constructor(name, startYear, endYear, coordinates, description) {
        this.name = name;
        this.startYear = startYear;
        this.endYear = endYear;
        this.coordinates = coordinates;
        this.description = description;
    }
    
    static jsonToCivilization(json){
      return new Civilization(
        json.name, 
        json.startYear,
        json.endYear,
        json.coordinates,
        json.description, 
      );
    }
}