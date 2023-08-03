export default class TimeModel {

  public from: string
  public to: string
  
  constructor(
    from: string, 
    to: string,
  ) {
    this.from = from
    this.to = to
  }

  static fromJSON(json: any) {
    return new TimeModel(
      json.from,
      json.to,
    )
  }
  
}