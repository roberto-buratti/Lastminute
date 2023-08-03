import RNFetchBlob from 'rn-fetch-blob'

export default class NetworkManager {
  public jwtToken?: string
  public refreshToken?: string

  public async getHotels(): Promise<any> {
    const url = `https://run.mocky.io/v3/eef3c24d-5bfd-4881-9af7-0b404ce09507`;
    const request = new Request(url, { 
      method: 'GET',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json'
      },
    })
    let response = await this._fetchWithTimeout(request, 15);
    console.log(`*** NetworkManager:getHotels: response=${JSON.stringify(response)}`)
    this._validateResponse(response)
    return response.json();
  }

  // MARK: - Private

  private _validateResponse(response: any) {
    if (response.status != 200) {
      throw new Error(`Bad status code ${response.status}`)
    }  
  }

  private async _fetchWithTimeout(request: Request, timeout: number | undefined = undefined): Promise<Response> {
      let _request: Request
      let abortController: AbortController = new AbortController()
  
      _request = new Request(request, { signal: abortController.signal })
  
      const headers = (_request.headers || {}) as any
      headers['Request-Timeout'] = timeout
  
      return new Promise<Response>((resolve, reject) => {
        let timerId = setTimeout(() => {
          abortController.abort()
        },
          timeout! * 1000
        )
        fetch(_request)
          .then((response) => resolve(response))
          .catch((err) => {
            console.log(`*** NetworkManager:fetchWithTimeout: got error for ${request.url}`, err.message)
            if (abortController.signal.aborted)
              reject(new Error('Network Request Timeout'))
            else
              reject(err)
          }
          )
          .finally(() => clearTimeout(timerId))
      })
    }
}