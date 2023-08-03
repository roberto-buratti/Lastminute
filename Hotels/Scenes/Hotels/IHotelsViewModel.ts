import { EventEmitter } from "events"

import HotelModel from "../../Models/HotelModel"

export default interface IHotelsViewModel {
    events: EventEmitter
    title: string
    hotels: HotelModel[]

    getHotelById(id: string): HotelModel | undefined
    reverseSorting(): void
    refresh(): void
}

export enum HotelsViewModelEvents {
    isLoading = 'isLoading'
}