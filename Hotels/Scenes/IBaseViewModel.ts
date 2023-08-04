export default interface IBaseViewModel {
  uuid: string

  popViewModel(uuid: string): IBaseViewModel
}
