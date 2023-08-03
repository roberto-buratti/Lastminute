import IHotelsViewModel from "./Scenes/Hotels/IHotelsViewModel";
import IServiceFactory from "./Services/Interfaces/IServiceFactory";

export default class AppViewModel {
    private _serviceFactory: IServiceFactory;
    private _hotelsViewModel?: IHotelsViewModel

    constructor(serviceFactory: IServiceFactory) {
        this._serviceFactory = serviceFactory
    }

    public get hotelsViewModel(): IHotelsViewModel {
        if (!this._hotelsViewModel) {
            this._hotelsViewModel = this._serviceFactory.hotelsViewModel()
        }
        return this._hotelsViewModel
    }

}