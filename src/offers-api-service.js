import ApiService from './framework/api-service.js';
import {Method, OFFERS_END_POINT} from './const';

export default class OffersApiService extends ApiService {
  get offers() {
    return this._load({url: OFFERS_END_POINT}).then(ApiService.parseResponse);
  }

  async updateOffer(offer) {
    const response = await this._load({
      url: `${OFFERS_END_POINT}/${offer.id}`,
      headers: new Headers({'Content-Type': 'application/json'}),
      method: Method.PUT,
      body: JSON.stringify(offer),
    });

    return await ApiService.parseResponse(response);
  }
}
