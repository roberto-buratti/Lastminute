import IServiceFactory from "../../Services/Interfaces/IServiceFactory"

import BaseViewModel from "../BaseViewModel"
import IHomeViewModel from "./IHomeViewModel"
import IHotelsListViewModel from "../HotelsList/IHotelsListViewModel"
import HotelsListViewModel from "../HotelsList/HotelsListViewModel"
import IHotelDetailsViewModel from "../HotelDetails/IHotelDetailsViewModel"
import HotelDetailsViewModel from "../HotelDetails/HotelDetailsViewModel"
import HotelModel from "../../Models/HotelModel"

export default class HomeViewModel extends BaseViewModel implements IHomeViewModel {
  constructor(serviceFactory: IServiceFactory) {
    super(serviceFactory)
  }

  public hotelsViewModel(): IHotelsListViewModel {
    return new HotelsListViewModel(this._serviceFactory);
  }

  public hotelDetailsViewModel(hotel: HotelModel): IHotelDetailsViewModel {
    return new HotelDetailsViewModel(this._serviceFactory, hotel);
  }
}