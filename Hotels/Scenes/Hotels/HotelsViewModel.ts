import { Alert } from "react-native";
import { EventEmitter } from "events";

import HotelModel from "../../Models/HotelModel";

import IServiceFactory from "../../Services/Interfaces/IServiceFactory";

import BaseViewModel from "../BaseViewModel";
import IHotelsViewModel, { HotelsViewModelEvents } from "./IHotelsViewModel"
import IHotelDetailsViewModel from "../HotelDetails/IHotelDetailsViewModel"
import IBaseViewModel from "../IBaseViewModel";

export default class HotelsViewModel extends BaseViewModel implements IHotelsViewModel {
  private _hotels: HotelModel[] = []
  private _events: EventEmitter = new EventEmitter()

  constructor(serviceFactory: IServiceFactory) {
    super(serviceFactory)
    this._serviceFactory = serviceFactory
    this.refresh()
  }

  public get events(): EventEmitter {
    return this._events
  }

  public get title(): string {
    return "Hotels"
  }

  public get hotels(): HotelModel[] {
    return this._hotels
  }

  public getHotelById(id: string) {
    return this._hotels.find((h) => h.id == id)
  }

  public reverseSorting() {
    this._events.emit(HotelsViewModelEvents.isLoading, true)
    this._hotels.reverse()
    this._events.emit(HotelsViewModelEvents.isLoading, false)
  }

  public refresh() {
    this._events.emit(HotelsViewModelEvents.isLoading, true)
    this._serviceFactory.serviceManager.getHotels()
    .then((hotels: HotelModel[]) => {
      this._hotels = hotels
    })
    .catch(error => {
      // [FIXME] manage this
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

  hotelDetailsViewModel(hotel: HotelModel): IHotelDetailsViewModel {
    const viewModel = this._serviceFactory.hotelDetailsViewModel(hotel)
    this._serviceFactory.pushViewModel(viewModel)
    return viewModel
  }

}