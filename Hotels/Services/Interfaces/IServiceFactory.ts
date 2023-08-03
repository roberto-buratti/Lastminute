import IServiceManager from './IServiceManager';

import IAppViewModel from '../../IAppViewModel'
import IHotelsViewModel from '../../Scenes/Hotels/IHotelsViewModel'

export default interface IServiceFactory {
    serviceManager: IServiceManager
    appViewModel(): IAppViewModel
    hotelsViewModel(): IHotelsViewModel
}