import AbstractView from '../framework/view/abstract-view.js';

export default class RoutePointListView extends AbstractView {
  get template() {
    return '<ul class="trip-events__list"></ul>';
  }

}
