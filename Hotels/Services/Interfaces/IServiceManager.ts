import HotelModel from "../../Models/HotelModel"

export default interface IServiceManager {
    getHotels(): Promise<HotelModel[]>
}
