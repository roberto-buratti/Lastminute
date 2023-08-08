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
    // [ROB] randomly assign a different currency just to show visual effects
    const currency = Math.random() < 0.3 ? "USD" : Math.random() < 0.3 ? "GBP" : json.currency
    return new PriceModel(
      json.value,
      currency,
    )
  }
  
}