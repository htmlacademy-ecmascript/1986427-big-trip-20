import AbstractView from '../framework/view/abstract-view.js';

function createNoAvailableServerMessageTemplate() {
  return ('<p class="trip-events__msg">server not available, try again later</p>');
}

export default class NotAvailableView extends AbstractView {
  get template() {
    return createNoAvailableServerMessageTemplate();
  }
}
