import IServiceManager from "./Interfaces/IServiceManager";
import NetworkManager from "./NetworkManager";

import HotelModel from "../Models/HotelModel";

export default class ServiceManager implements IServiceManager {
    private static _shared: IServiceManager = new ServiceManager();
    public static get shared(): IServiceManager
    {
        return this._shared;
    }

    private _networkManager: NetworkManager = new NetworkManager();

    public async getHotels(): Promise<HotelModel[]> {
        let result = await this._networkManager.getHotels();
        console.log(`*** ServiceManager:getHotels: result=${JSON.stringify(result)}`);
        let hotels = result.map((json: any) => {
            return HotelModel.fromJSON(json)
        })
        return hotels;
    }

    // MARK: - Private

}