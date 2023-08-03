import { Alert } from "react-native";
import { EventEmitter } from "events";

import IHotelsViewModel, { HotelsViewModelEvents } from "./IHotelsViewModel";
import IServiceFactory from "../../Services/Interfaces/IServiceFactory";
import HotelModel from "../../Models/HotelModel";

export default class HotelsViewModel implements IHotelsViewModel {
    private _serviceFactory: IServiceFactory
    private _hotels: HotelModel[] = []
    private _events: EventEmitter = new EventEmitter()

    constructor(serviceFactory: IServiceFactory) {
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
            // [ROB] it is too fast, add a short delay to show visual effects
            setTimeout(() => {
                this._events.emit(HotelsViewModelEvents.isLoading, false)
            }, 1000)
        })
    }

}