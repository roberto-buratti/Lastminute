import { EventEmitter } from "events"

import HotelModel from "../../Models/HotelModel"
import FilterAndSortingModel from "../../Models/FilterAndSortingModel"
import PriceModel from "../../Models/PriceModel"

import IBaseViewModel from "../IBaseViewModel"

export default interface IHotelsListViewModel extends IBaseViewModel {
    events: EventEmitter
    hotels: HotelModel[]
    filterAndSortingModel: FilterAndSortingModel

    getHotelById(id: string): HotelModel | undefined
    reverseSorting(): void
    refresh(): void
    apply(filterAndSortingModel: FilterAndSortingModel, simulateOnly: boolean): number
}

export enum HotelsViewModelEvents {
    isLoading = 'isLoading'
}