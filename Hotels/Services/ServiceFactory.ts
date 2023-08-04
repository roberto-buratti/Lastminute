import IServiceFactory from './Interfaces/IServiceFactory'
import IServiceManager from './Interfaces/IServiceManager'
import ServiceManager from './ServiceManager'

import IAppViewModel from '../IAppViewModel'
import AppViewModel from '../AppViewModel'
import IHotelsViewModel from '../Scenes/Hotels/IHotelsViewModel'
import HotelsViewModel from '../Scenes/Hotels/HotelsViewModel'
import IHomeViewModel from '../Scenes/Home/IHomeViewModel'
import HomeViewModel from '../Scenes/Home/HomeViewModel'
import HotelModel from '../Models/HotelModel'
import IHotelDetailsViewModel from '../Scenes/HotelDetails/IHotelDetailsViewModel'
import HotelDetailsViewModel from '../Scenes/HotelDetails/HotelDetailsViewModel'
import BaseViewModel from '../Scenes/BaseViewModel'

export default class ServiceFactory implements IServiceFactory {

  private _viewModelsCache: { [key: string] : BaseViewModel | undefined } = {}

  public get serviceManager(): IServiceManager {
    return ServiceManager.shared;
  }

  public appViewModel(): IAppViewModel {
    return new AppViewModel(this)
  }

  public homeViewModel(): IHomeViewModel {
    return new HomeViewModel(this)
  }

  public hotelsViewModel(): IHotelsViewModel {
    return new HotelsViewModel(this);
  }
  
  public hotelDetailsViewModel(hotel: HotelModel): IHotelDetailsViewModel {
    return new HotelDetailsViewModel(this, hotel)
  }

  pushViewModel(viewModel: BaseViewModel): void {
    const uuid = viewModel.uuid
    this._viewModelsCache[uuid] = viewModel
  }

  popViewModel(uuid: string): BaseViewModel {
    const viewModel = this._viewModelsCache[uuid]
    if (viewModel == undefined) {
      throw `Panic: view model not found for uuid ${uuid}`
    }
    this._viewModelsCache[uuid] = undefined
    return viewModel
  }


}