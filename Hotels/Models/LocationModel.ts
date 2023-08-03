export default class LocationModel {

  public address: string
  public city: string
  public latitude: number
  public longitude: number
  
  constructor(
    address: string, 
    city: string,
    latitude: number,
    longitude: number
  ) {
    this.address = address
    this.city = city
    this.latitude = latitude
    this.longitude = longitude
  }

  static fromJSON(json: any) {
    return new LocationModel(
      json.address,
      json.city,
      json.latitude,
      json.longitude,
    )
  }
  
}