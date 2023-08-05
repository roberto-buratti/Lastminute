import HotelModel from "../../Models/HotelModel"
import IHotelDetailsViewModel from "../HotelDetails/IHotelDetailsViewModel"
import IHotelsListViewModel from "../HotelsList/IHotelsListViewModel"
import IBaseViewModel from "../IBaseViewModel"

export default interface IHomeViewModel extends IBaseViewModel {
    hotelsViewModel(): IHotelsListViewModel
    hotelDetailsViewModel(hotel: HotelModel): IHotelDetailsViewModel
}