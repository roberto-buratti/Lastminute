export default class ContactModelModel {

  public phoneNumber: string
  public email: string
  
  constructor(
    phoneNumber: string, 
    email: string,
  ) {
      this.phoneNumber = phoneNumber
      this.email= email
  }

  static fromJSON(json: any) {
    return new ContactModelModel(
        json.phoneNumber,
        json.email,
    )
  }
  
}