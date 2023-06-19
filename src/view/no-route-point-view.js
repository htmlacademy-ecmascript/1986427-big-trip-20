import AbstractView from '../framework/view/abstract-view.js';
import {NoRoutepointsTextType} from '../const.js';

function createNoRoutePointTemplate(filterType) {
  return (`<p class="trip-events__msg">${NoRoutepointsTextType[filterType]}</p>`);
}

export default class NoRoutePointView extends AbstractView {
  #filterType = null;

  constructor({filterType}) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    return createNoRoutePointTemplate(this.#filterType);
  }

}
