import ApiService from './framework/api-service.js';
import {OFFERS_END_POINT} from './const';

export default class OffersApiService extends ApiService {
  get offers() {
    return this._load({
      url: OFFERS_END_POINT
    }).then(ApiService.parseResponse);
  }
}
