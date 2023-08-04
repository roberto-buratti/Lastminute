import IAppViewModel from "./IAppViewModel"
import BaseViewModel from "./Scenes/BaseViewModel"
import IHomeViewModel from "./Scenes/Home/IHomeViewModel"
import IServiceFactory from "./Services/Interfaces/IServiceFactory"

export default class AppViewModel extends BaseViewModel implements IAppViewModel {
    private _homeViewModel?: IHomeViewModel

    constructor(serviceFactory: IServiceFactory) {
        super(serviceFactory)
    }

    public get homeViewModel(): IHomeViewModel {
        if (!this._homeViewModel) {
            this._homeViewModel = this._serviceFactory.homeViewModel()
        }
        return this._homeViewModel
    }

}