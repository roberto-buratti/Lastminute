import IServiceFactory from './Interfaces/IServiceFactory'
import IServiceManager from './Interfaces/IServiceManager'
import ServiceManager from './ServiceManager'

export default class ServiceFactory implements IServiceFactory {

  public get serviceManager(): IServiceManager {
    return ServiceManager.shared;
  }
}