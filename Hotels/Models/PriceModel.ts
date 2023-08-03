export default class PriceModel {

  public value: number
  public currency: string
  
  constructor(
    value: number, 
    currency: string,
  ) {
    this.value = value
    this.currency = currency
  }

  public get description() {
    return `${this.value} ${this.currency}`
  }

  static fromJSON(json: any) {
    return new PriceModel(
      json.value,
      json.currency,
    )
  }
  
}