import AbstractView from '../framework/view/abstract-view.js';

function createNewRoutePointTemplateButton() {
  return ('<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button">New event</button>');
}

export default class NewRoutePointButtonView extends AbstractView {
  #handleClick = null;

  constructor({onClick}) {
    super();
    this.#handleClick = onClick;
    this.element.addEventListener('click', (evt) => {
      evt.preventDefault();
      this.#handleClick();
    });
  }

  get template() {
    return createNewRoutePointTemplateButton();
  }

}
