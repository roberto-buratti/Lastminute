import IHomeViewModel from "./IHomeViewModel";
import IServiceFactory from "../../Services/Interfaces/IServiceFactory";

import IHotelsViewModel from "../Hotels/IHotelsViewModel";

export default class HomeViewModel implements IHomeViewModel {
    private _serviceFactory: IServiceFactory;
    private _hotelsViewModel?: IHotelsViewModel

    constructor(serviceFactory: IServiceFactory) {
        this._serviceFactory = serviceFactory;
    }

    public get hotelsViewModel(): IHotelsViewModel {
        if (!this._hotelsViewModel) {
            this._hotelsViewModel = this._serviceFactory.hotelsViewModel()
        }
        return this._hotelsViewModel
    }

}