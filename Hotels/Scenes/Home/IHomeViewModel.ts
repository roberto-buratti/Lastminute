import IHotelsViewModel from "../Hotels/IHotelsViewModel"
import IBaseViewModel from "../IBaseViewModel"

export default interface IHomeViewModel extends IBaseViewModel {
    hotelsViewModel: IHotelsViewModel
}