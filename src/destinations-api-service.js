import ApiService from './framework/api-service.js';
import {DESTINATIONS_END_POINT} from './const';

export default class DestinationsApiService extends ApiService {

  get destinations() {
    return this._load({
      url: DESTINATIONS_END_POINT
    }).then(ApiService.parseResponse);
  }
}
