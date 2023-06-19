import ApiService from './framework/api-service.js';
import {Method, DESTINATIONS_END_POINT} from './const';

export default class DestinationsApiService extends ApiService {
  async updateDestination(destination) {
    const response = await this._load({
      url: `${DESTINATIONS_END_POINT}/${destination.id}`,
      headers: new Headers({'Content-Type': 'application/json'}),
      method: Method.PUT,
      body: JSON.stringify(destination),
    });

    return await ApiService.parseResponse(response);
  }

  get destinations() {
    return this._load({url: DESTINATIONS_END_POINT}).then(ApiService.parseResponse);
  }
}
