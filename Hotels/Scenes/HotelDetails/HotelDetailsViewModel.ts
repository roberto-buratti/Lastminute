import { Alert } from "react-native";

import HotelModel from "../../Models/HotelModel"

import IServiceFactory from "../../Services/Interfaces/IServiceFactory"

import BaseViewModel from "../BaseViewModel"
import IHotelDetailsViewModel from "./IHotelDetailsViewModel"

export default class HotelDetailsViewModel extends BaseViewModel implements IHotelDetailsViewModel {
    private _hotel: HotelModel

    constructor(serviceFactory: IServiceFactory, hotel: HotelModel) {
      super(serviceFactory)
      this._hotel = hotel
    }

    public get title(): string {
      return this._hotel.name
    }

    public get hotel(): HotelModel {
      return this._hotel
    }

}