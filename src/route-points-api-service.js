import ApiService from './framework/api-service.js';
import {Method} from './const';

export default class RoutePointsApiService extends ApiService {
  get routePoints() {
    return this._load({url: 'points'})
      .then(ApiService.parseResponse);
  }

  async updateRoutePoint(routePoint) {
    const response = await this._load({
      url: `points/${routePoint.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(routePoint)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    return await ApiService.parseResponse(response);
  }

  async deleteRoutePoint(routePoint) {
    return await this._load({
      url: `points/${routePoint.id}`,
      method: Method.DELETE,
    });
  }

  #adaptToServer(routePoint) {
    const dateFrom = routePoint.dateFrom instanceof Date ? routePoint.dateFrom.toISOString() : null;
    const dateTo = routePoint.dateTo instanceof Date ? routePoint.dateTo.toISOString() : null;

    const adaptedRoutePoint = {
      ...routePoint,
      'is_favorite': routePoint.isFavorite,
      'base_price': routePoint.basePrice,
      'date_from': dateFrom,
      'date_to': dateTo,
    };

    delete adaptedRoutePoint.basePrice;
    delete adaptedRoutePoint.dateFrom;
    delete adaptedRoutePoint.dateTo;
    delete adaptedRoutePoint.isFavorite;

    return adaptedRoutePoint;
  }

  async addRoutePoint(routePoint) {
    const response = await this._load({
      url: 'points',
      method: Method.POST,
      body: JSON.stringify(this.#adaptToServer(routePoint)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    return await ApiService.parseResponse(response);
  }
}
