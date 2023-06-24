import Observable from '../framework/observable.js';
import {UpdateType} from '../const.js';

export default class RoutePointsModel extends Observable{
  #routePoints = [];
  #routePointsApiService = null;

  constructor({
    routePointsApiService
  }) {
    super();
    this.#routePointsApiService = routePointsApiService;
  }

  get routePoints() {
    return this.#routePoints;
  }

  async init() {
    try {
      const routePoints = await this.#routePointsApiService.routePoints;
      this.#routePoints = routePoints.map(this.#adaptToClient);
    } catch(err) {
      this.#routePoints = [];
      this._notify(UpdateType.ERROR);
    } finally {
      this._notify(UpdateType.ROUTEPOINTS);
      this._notify(UpdateType.INIT);
    }
  }

  async updateRoutePoint(updateType, update) {
    const index = this.#routePoints.findIndex((routePoint) => routePoint.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting routepoint');
    }
    try {
      const response = await this.#routePointsApiService.updateRoutePoint(update);
      const updatedRoutePoint = this.#adaptToClient(response);
      this.#routePoints = [
        ...this.#routePoints.slice(0, index),
        updatedRoutePoint,
        ...this.#routePoints.slice(index + 1),
      ];
      this._notify(updateType, updatedRoutePoint);
    } catch(err) {
      throw new Error('Can\'t update routePoint');
    }
  }

  async addRoutePoint(
    updateType,
    update
  ) {
    try {
      const response = await this.#routePointsApiService.addRoutePoint(update);
      const newRoutePoint = this.#adaptToClient(response);
      this.#routePoints = [
        newRoutePoint,
        ...this.#routePoints
      ];
      this._notify(updateType, newRoutePoint);
    } catch(err) {
      throw new Error('Can\'t add route point');
    }
  }

  async deleteRoutePoint(updateType, update) {
    const index = this.#routePoints.findIndex((routePoint) => routePoint.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting routePoint');
    }

    this.#routePoints = [
      ...this.#routePoints.slice(0, index),
      ...this.#routePoints.slice(index + 1),
    ];

    try {
      await this.#routePointsApiService.deleteRoutePoint(update);
      this.#routePoints = [
        ...this.#routePoints.slice(0, index),
        ...this.#routePoints.slice(index + 1),
      ];
      this._notify(updateType);
    } catch(err) {
      throw new Error('Can\'t delete route point');
    }
  }

  #adaptToClient(routePoint) {
    const dateFrom = routePoint['date_from'] !== null ? new Date(routePoint['date_from']) : routePoint['date_from'];
    const dateTo = routePoint['date_to'] !== null ? new Date(routePoint['date_to']) : routePoint['date_to'];
    const adaptedRoutePoint = {
      ...routePoint,
      isFavorite: routePoint['is_favorite'],
      basePrice: routePoint['base_price'],
      dateFrom,
      dateTo,
    };

    delete adaptedRoutePoint['base_price'];
    delete adaptedRoutePoint['date_from'];
    delete adaptedRoutePoint['date_to'];
    delete adaptedRoutePoint['is_favorite'];

    return adaptedRoutePoint;
  }

  static isFilled(routePoint) {
    return routePoint.basePrice
      && routePoint.dateFrom
      && routePoint.dateTo
      && routePoint.destination;
  }
}
