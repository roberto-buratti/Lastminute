import LocationModel from "./LocationModel"

export default class MapPointModel {

  public id: string
  public name: string
  public imageSource: any
  public location: LocationModel
  
  constructor(
    id: string,
    name: string,
    imageSource: any,
    location: LocationModel
  ) {
      this.id = id
      this.name = name
      this.imageSource = imageSource
      this.location = location
  }
  
}