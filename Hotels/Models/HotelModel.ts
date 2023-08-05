import LocationModel from "./LocationModel"
import TimeModel from "./TimeModel"
import ContactModel from "./ContactModel"
import PriceModel from "./PriceModel"

export default class HotelModel {

  public id: string
  public name: string
  public location: LocationModel
  public stars: number
  public checkIn: TimeModel
  public checkOut: TimeModel
  public contact: ContactModel
  public gallery: string[]
  public userRating: number
  public price: PriceModel
    
  constructor(
    id: string, 
    name: string,
    location: LocationModel,
    stars: number,
    checkIn: TimeModel,
    checkOut: TimeModel,
    contact: ContactModel,
    gallery: string[],
    userRating: number,
    price: PriceModel
  ) {
    this.id = id
    this.name = name
    this.location = location
    this.stars = stars
    this.checkIn = checkIn
    this.checkOut = checkOut
    this.contact = contact
    this.gallery = gallery
    this.userRating = userRating
    this.price = price
  }

  static fromJSON(json: any) {
    return new HotelModel(
      json.id,
      json.name,
      LocationModel.fromJSON(json.location),
      json.stars,
      TimeModel.fromJSON(json.checkIn),
      TimeModel.fromJSON(json.checkOut),
      ContactModel.fromJSON(json.contact),
      json.gallery,
      json.userRating,
      PriceModel.fromJSON({ value: json.price, currency: json.currency })
    )
  }
    
}