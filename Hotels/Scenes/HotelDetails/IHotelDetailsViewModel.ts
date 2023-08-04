import IBaseViewModel from "../IBaseViewModel"
import HotelModel from "../../Models/HotelModel"

export default interface IHotelDetailsViewModel extends IBaseViewModel {
    title: string
    hotel: HotelModel
}