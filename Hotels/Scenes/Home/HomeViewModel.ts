import IServiceFactory from "../../Services/Interfaces/IServiceFactory"

import BaseViewModel from "../BaseViewModel"
import IHomeViewModel from "./IHomeViewModel";
import IHotelsViewModel from "../Hotels/IHotelsViewModel"

export default class HomeViewModel extends BaseViewModel implements IHomeViewModel {
  private _hotelsViewModel?: IHotelsViewModel

  constructor(serviceFactory: IServiceFactory) {
    super(serviceFactory)
  }

  public get hotelsViewModel(): IHotelsViewModel {
    if (!this._hotelsViewModel) {
      this._hotelsViewModel = this._serviceFactory.hotelsViewModel()
    }
    return this._hotelsViewModel
  }

}