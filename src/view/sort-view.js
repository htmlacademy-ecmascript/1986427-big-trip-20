import AbstractView from '../framework/view/abstract-view.js';
import { SortType } from '../const.js';

function createSortTemplate(currentSortType) {
  return `<form class="trip-events__trip-sort trip-sort" action="#" method="get">
    <div class="trip-sort__item  trip-sort__item--day">
      <input
         id="sort-day"
         class="trip-sort__input visually-hidden"
         type="radio"
         name="trip-sort"
         value="sort-day"
         ${currentSortType === SortType.DEFAULT ? 'checked' : ''}
         data-sort-type="${SortType.DEFAULT}"
       >
      <label class="trip-sort__btn" for="sort-day">Day</label>
    </div>

    <div class="trip-sort__item  trip-sort__item--event">
      <input
         id="sort-event"
         class="trip-sort__input visually-hidden"
         type="radio"
         name="trip-sort"
         value="sort-event"
         disabled
      >
      <label class="trip-sort__btn" for="sort-event">Event</label>
    </div>

    <div class="trip-sort__item  trip-sort__item--time">
       <input
          id="sort-time"
          class="trip-sort__input  visually-hidden"
          type="radio"
          name="trip-sort"
          value="sort-time"
          ${currentSortType === SortType.DURATION_TIME ? 'checked' : ''}
          data-sort-type="${SortType.DURATION_TIME}"
        >
      <label class="trip-sort__btn" for="sort-time">Time</label>
    </div>

    <div class="trip-sort__item  trip-sort__item--price">
       <input
          id="sort-price"
          class="trip-sort__input visually-hidden"
          type="radio"
          name="trip-sort"
          value="sort-price"
          ${currentSortType === SortType.PRICE ? 'checked' : ''}
          data-sort-type="${SortType.PRICE}"
       >
      <label class="trip-sort__btn" for="sort-price">Price</label>
    </div>

    <div class="trip-sort__item  trip-sort__item--offer">
      <input
        id="sort-offer"
        class="trip-sort__input visually-hidden"
        type="radio"
        name="trip-sort"
        value="sort-offer"
        disabled
    >
      <label class="trip-sort__btn" for="sort-offer">Offers</label>
    </div>
  </form> `;
}

export default class SortView extends AbstractView{
  #handleSortTypeChange = null;
  #currentSortType = null;

  constructor({
    currentSortType,
    onSortTypeChange
  }) {
    super();
    this.#currentSortType = currentSortType;
    this.#handleSortTypeChange = onSortTypeChange;

    this.element.addEventListener('click', (evt) => {
      if (evt.target.tagName !== 'INPUT') {
        return;
      }

      if (
        evt.target.dataset.sortType === 'event'
        || evt.target.dataset.sortType === 'offer'
      ) {
        evt.preventDefault();
        return;
      }

      evt.preventDefault();
      this.#handleSortTypeChange(evt.target.dataset.sortType);
    });
  }

  get template() {
    return createSortTemplate(this.#currentSortType);
  }

}
