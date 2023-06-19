import AbstractView from '../framework/view/abstract-view.js';
import {capitalizeName} from '../utils/common.js';

function createFilterItemTemplate(filter, currentFilterType) {
  const {type, count} = filter;
  const checkedAttr = type === currentFilterType ? 'checked' : '';
  const disabledAttr = !count ? 'disabled' : '';

  return `
    <div class="trip-filters__filter">
      <input
        id="filter-${type}"
        class="trip-filters__filter-input  visually-hidden"
        type="radio"
        name="trip-filter"
        value="${type}"
        ${checkedAttr}
        ${disabledAttr}
      >
      <label class="trip-filters__filter-label" for="filter-${type}">${capitalizeName(type)}</label>
    </div> `;
}

function createFilterTemplate(filterItems, currentFilterType) {
  const itemsTemplate = filterItems
    .map((filter) => createFilterItemTemplate(filter, currentFilterType))
    .join('');

  return `
  <form class="trip-filters" action="#" method="get">
      ${itemsTemplate}
      <button class="visually-hidden" type="submit">Accept filter</button>
  </form>`;
}

export default class FilterView extends AbstractView {
  #filters = null;
  #currentFilter = null;
  #handleFilterTypeChange = null;

  constructor({
    filters,
    currentFilterType,
    onFilterTypeChange
  }) {
    super();
    this.#filters = filters;
    this.#currentFilter = currentFilterType;
    this.#handleFilterTypeChange = onFilterTypeChange;
    this.element.addEventListener('change',(evt) => {
      evt.preventDefault();
      this.#handleFilterTypeChange(evt.target.value);
    });
  }

  get template() {
    return createFilterTemplate(this.#filters, this.#currentFilter);
  }

}
