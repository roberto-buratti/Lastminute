import PriceModel from "./PriceModel"

export enum SortingCriteria {
  name = 0,
  stars = 1,
  userRating = 2,
  price = 3
}

export default class FilterAndSortingModel {
  public name?: string
  public stars?: number
  public userRating?: number
  private _currency?: string
  public price?: number
  public orderBy?: SortingCriteria

  private _prices: PriceModel[]

  constructor(
    prices: PriceModel[],
    name?: string,
    stars?: number,
    userRating?: number,
    currency?: string,
    price?: number,
    orderBy?: SortingCriteria,
  ) {
    this._prices = prices
    this.name = name
    this.stars = stars
    this.userRating = userRating
    this._currency = currency
    this.price = price
    this.orderBy = orderBy
  }

  public clone() {
    const clone = new FilterAndSortingModel(
      this._prices,
      this.name,
      this.stars,
      this.userRating,
      this._currency,
      this.price,
      this.orderBy
    )
    return clone
  }

  public reset() {
    this.name = undefined
    this.stars = undefined
    this.userRating = undefined
    this.currency = undefined
    this.price = undefined
    this.orderBy = undefined
  }

  public get currency() {
    return this._currency
  }

  public set currency(newValue: string | undefined) {
    this._currency = newValue
    // [ROB] when changing currency, it makes sense to reset `price` to its max value
    const maxPrice = this.maxPrice
    if (maxPrice) {
      this.price = maxPrice.value
    }
  }

  public get  currencies() {
    return [...new Set(this._prices.map(p => p.currency)).values()]
  }

  public get minPrice(): PriceModel | undefined {
    if (this._prices.length == 0) {
      return undefined
    }
    const currency = this._currency
    const values = this._prices.map(p => (currency == undefined || p.currency == currency) ? p.value : Number.MAX_SAFE_INTEGER)
    const max = Math.min(...values)
    return this._prices.find((p) => (currency == undefined || p.currency == currency) && p.value == max)!
  }

  public get maxPrice(): PriceModel | undefined {
    if (this._prices.length == 0) {
      return undefined
    }
    const currency = this._currency
    const values = this._prices.map(p => (currency == undefined || p.currency == currency) ? p.value : -Number.MAX_SAFE_INTEGER)
    const max = Math.max(...values)
    return this._prices.find((p) => (currency == undefined || p.currency == currency) && p.value == max)!
  }

  public get hasFilters() {
    if (this.name) { return true }
    if (this.stars) { return true }
    if (this.userRating) { return true }
    if (this.currency) { return true }
    if (this.price) { return true }
    return false
  }
}