import { EventEmitter } from "events"

import HotelModel from "../../Models/HotelModel"

import IBaseViewModel from "../IBaseViewModel"

export default interface IHotelsListViewModel extends IBaseViewModel {
    events: EventEmitter
    hotels: HotelModel[]

    getHotelById(id: string): HotelModel | undefined
    reverseSorting(): void
    refresh(): void
}

export enum HotelsViewModelEvents {
    isLoading = 'isLoading'
}