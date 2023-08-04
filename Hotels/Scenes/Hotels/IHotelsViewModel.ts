import { EventEmitter } from "events"

import HotelModel from "../../Models/HotelModel"

import IBaseViewModel from "../IBaseViewModel"
import IHotelDetailsViewModel from "../HotelDetails/IHotelDetailsViewModel"

export default interface IHotelsViewModel extends IBaseViewModel {
    events: EventEmitter
    title: string
    hotels: HotelModel[]

    getHotelById(id: string): HotelModel | undefined
    reverseSorting(): void
    refresh(): void
    hotelDetailsViewModel(hotel: HotelModel): IHotelDetailsViewModel
}

export enum HotelsViewModelEvents {
    isLoading = 'isLoading'
}