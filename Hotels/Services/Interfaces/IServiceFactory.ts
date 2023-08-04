import IServiceManager from './IServiceManager';

import HotelModel from '../../Models/HotelModel'

import IBaseViewModel from '../../Scenes/IBaseViewModel'
import IAppViewModel from '../../IAppViewModel'
import IHomeViewModel from '../../Scenes/Home/IHomeViewModel'
import IHotelsViewModel from '../../Scenes/Hotels/IHotelsViewModel'
import IHotelDetailsViewModel from '../../Scenes/HotelDetails/IHotelDetailsViewModel'

export default interface IServiceFactory {
    serviceManager: IServiceManager
    appViewModel(): IAppViewModel
    homeViewModel(): IHomeViewModel
    hotelsViewModel(): IHotelsViewModel
    hotelDetailsViewModel(hotel: HotelModel): IHotelDetailsViewModel
    pushViewModel(viewModel: IBaseViewModel): void
    popViewModel(uuid: string): IBaseViewModel
}