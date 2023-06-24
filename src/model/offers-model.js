import {UpdateType} from '../const.js';
import Observable from '../framework/observable.js';

export default class OffersModel extends Observable{
  #offers = [];
  #offersApiService = null;

  constructor({
    offersApiService
  }) {
    super();
    this.#offersApiService = offersApiService;
  }

  get offers() {
    return this.#offers;
  }

  getByType(routePoint) {
    if (!this.#offers.length) {
      return [];
    }
    return this.#offers.find((offer) => offer.type === routePoint.type).offers;
  }

  getById(routePoint){
    if (!this.#offers.length) {
      return null;
    }
    return this.getByType(routePoint).filter((offer) => routePoint.offers.includes(offer.id));
  }

  getTypes() {
    return this.#offers.map((item) => item.type);
  }

  async init() {
    try {
      this.#offers = await this.#offersApiService.offers;
    } catch(err) {
      this.#offers = [];
      this._notify(UpdateType.ERROR);
    } finally {
      this._notify(UpdateType.OFFERS);
      this._notify(UpdateType.INIT);
    }
  }

}
