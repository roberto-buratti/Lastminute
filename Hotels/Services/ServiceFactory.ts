import IServiceFactory from './Interfaces/IServiceFactory';
import IServiceManager from './Interfaces/IServiceManager';
import ServiceManager from './ServiceManager';


import IAppViewModel from '../IAppViewModel'
import AppViewModel from '../AppViewModel'
import IHotelsViewModel from '../Scenes/Hotels/IHotelsViewModel'
import HotelsViewModel from '../Scenes/Hotels/HotelsViewModel'

export default class ServiceFactory implements IServiceFactory {
    
    public get serviceManager(): IServiceManager {
        return ServiceManager.shared;
    }

    public appViewModel(): IAppViewModel {
        return new AppViewModel(this);
    }

    public hotelsViewModel(): IHotelsViewModel {
        return new HotelsViewModel(this);
    }

}