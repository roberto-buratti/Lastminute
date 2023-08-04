import UUID from 'react-native-uuid'

import IServiceFactory from '../Services/Interfaces/IServiceFactory'

import IBaseViewModel from './IBaseViewModel'

export default class BaseViewModel implements IBaseViewModel {
  protected _serviceFactory: IServiceFactory;
  private _uuid: string

  constructor(serviceFactory: IServiceFactory) {
    this._serviceFactory = serviceFactory;
    this._uuid = UUID.v4().toString()
  }

  public get uuid() {
    return this._uuid
  }

  public popViewModel(uuid: string): IBaseViewModel {
    return this._serviceFactory.popViewModel(uuid)
  }

}
