import { Alert } from "react-native"
import { EventEmitter } from "events"

import HotelModel from "../../Models/HotelModel"
import FilterAndSortingModel, { SortingCriteria } from "../../Models/FilterAndSortingModel"

import IServiceFactory from "../../Services/Interfaces/IServiceFactory"

import BaseViewModel from "../BaseViewModel";
import IHotelsListViewModel, { HotelsViewModelEvents } from "./IHotelsListViewModel"

export default class HotelsListViewModel extends BaseViewModel implements IHotelsListViewModel {
  private _hotels: HotelModel[] = []
  private _events: EventEmitter = new EventEmitter()
  private _filterAndSortingModel?: FilterAndSortingModel
  private _filteredHotels: HotelModel[] = []

  constructor(serviceFactory: IServiceFactory) {
    super(serviceFactory)
    this._serviceFactory = serviceFactory
    this.refresh()
  }

  public get events(): EventEmitter {
    return this._events
  }

  public get hotels(): HotelModel[] {
    return this._filteredHotels
  }

  public get filterAndSortingModel(): FilterAndSortingModel {
    // [ROB] return just a clone, not the actual instance. See `this.apply()`
    if (!this._filterAndSortingModel) {
      this._filterAndSortingModel = new FilterAndSortingModel(this._prices())
    }
    return this._filterAndSortingModel.clone()
  }

  public getHotelById(id: string) {
    return this._hotels.find((h) => h.id == id)
  }

  public reverseSorting() {
    this._events.emit(HotelsViewModelEvents.isLoading, true)
    this._filteredHotels.reverse()
    this._events.emit(HotelsViewModelEvents.isLoading, false)
  }

  public refresh() {
    this._events.emit(HotelsViewModelEvents.isLoading, true)
    this._serviceFactory.serviceManager.getHotels()
    .then((hotels: HotelModel[]) => {
      this._hotels = hotels
      this._filterAndSortingModel = new FilterAndSortingModel(this._prices())
      this.apply(this.filterAndSortingModel)
    })
    .catch(error => {
      // [ROB] FIXME: should manage this better than this
      this._hotels = []
      Alert.alert(error.message)
    })
    .finally(() => {
      // [ROB] it is too fast, add a short delay to show visual effects ;)
      setTimeout(() => {
        this._events.emit(HotelsViewModelEvents.isLoading, false)
      }, 1000)
    })
  }  

  public apply(filterAndSortingModel: FilterAndSortingModel, simulateOnly: boolean = false) {
    if (!simulateOnly) {
      this._events.emit(HotelsViewModelEvents.isLoading, true)
      // [ROB] if not `simulateOnly`, then set the actual instance
      this._filterAndSortingModel = filterAndSortingModel
    }
    const filteredHotels = this._hotels.filter((hotel) => {
      if (filterAndSortingModel.name) {
        if (!hotel.name.toLocaleLowerCase().includes(filterAndSortingModel.name.toLocaleLowerCase())) {
          return false
        }
      }
      if (filterAndSortingModel.stars) {
        if (hotel.stars < filterAndSortingModel.stars) {
          return false
        }
      }
      if (filterAndSortingModel.userRating) {
        if (hotel.userRating < filterAndSortingModel.userRating) {
          return false
        }
      }
      if (filterAndSortingModel.currency) {
        if (hotel.price.currency != filterAndSortingModel.currency) {
          return false
        }
      }
      if (filterAndSortingModel.price) {
        if (hotel.price.value > filterAndSortingModel.price) {
          return false
        }
      }
      return true
    })
    if (!simulateOnly) {
      this._filteredHotels = filteredHotels
      this._filteredHotels.sort((a: HotelModel, b: HotelModel) => {
        switch (filterAndSortingModel.orderBy) {
          case SortingCriteria.name:
            return a.name.localeCompare(b.name)
          case SortingCriteria.stars:
            return a.stars - b.stars
          case SortingCriteria.userRating:
            return a.userRating - b.userRating
          case SortingCriteria.price:
            return a.price.value - b.price.value
        }
        return 0
        }
      )  
      this._events.emit(HotelsViewModelEvents.isLoading, false)
    }
    return filteredHotels.length
  }

  // MARK: - Private 

  _prices() {
    return this._hotels.map(h => h.price)
  }

}