import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import dayjs from 'dayjs';
import {FormatDatePattern, ROUTE_POINTS_COUNT_MAX} from '../const.js';
import he from 'he';

function createTripInfoTemplate(getDestinations, getDates, getPrice) {
  return `<section class="trip-main__trip-info  trip-info">
  <div class="trip-info__main">
    <h1 class="trip-info__title">
        ${getDestinations()}
    </h1>
    <p class="trip-info__dates">
        ${getDates()}
    </p>
  </div>

  <p class="trip-info__cost">
    Total: &euro;&nbsp;<span class="trip-info__cost-value">
        ${getPrice()}
    </span>
  </p>
</section>`;
}

export default class TripInfoView extends AbstractStatefulView {
  #routePoints = [];
  #destinations = [];
  #offers = [];

  constructor(
    routePoints,
    destinations,
    offers
  ) {
    super();
    this.#routePoints = routePoints;
    this.#destinations = destinations;
    this.#offers = offers;
  }

  get template() {
    return createTripInfoTemplate(
      this.#getDestinations,
      this.#getDates,
      this.#getPrice
    );
  }

  #getDestinations = () => {
    if (!this.#routePoints || !this.#routePoints.length) {
      return '';
    }
    const getDestination = (id, destinations) => destinations.find((destination) => destination.id === id);
    const selectedDestinations = this.#destinations
      .filter((destination) => this.#routePoints
        .find((routePoint) => routePoint.destination === destination.id))
      .map((destination) => destination.name);

    if (selectedDestinations.length > ROUTE_POINTS_COUNT_MAX) {
      const firstDestination = getDestination(this.#routePoints[0].destination, this.#destinations).name;
      const lastDestination = getDestination(this.#routePoints.at(-1).destination, this.#destinations).name;

      return [
        he.encode(firstDestination),
        he.encode(lastDestination)
      ].join(' &mdash; ... &mdash; ');
    }

    return selectedDestinations.join(' &mdash;');
  };

  #getPrice = () => {
    if (!this.#routePoints || !this.#routePoints.length) {
      return '';
    }
    const getCheckedOffers = (type, pointOffers, offers) => {
      const getByTypeOffers = (typeOffer, allOffers) => allOffers?.find((offer) => typeOffer === offer.type);
      const offersByType = getByTypeOffers(type, offers);
      if (
        !offersByType
        || !offersByType.offers
      ) {
        return;
      }
      return offersByType
        .offers
        .filter((offer) => pointOffers.some((offerId) => offerId === offer.id));
    };

    return this.#routePoints.reduce((total, routePoint) => {
      const checkedOffers = getCheckedOffers(
        routePoint.type,
        routePoint.offers,
        this.#offers
      );
      const totalSum = checkedOffers.reduce((sum, offer) => {
        sum += offer.price;
        return sum;
      }, 0);

      total += totalSum + routePoint.basePrice;
      return total;
    }, 0);
  };

  #getDates = () => {
    if (
      !this.#routePoints
      || !this.#routePoints.length
    ) {
      return '';
    }
    const normalizedDate = (date, isTripInfo) => {
      const pattern = isTripInfo ? FormatDatePattern.TRIP_INFO_DATE : FormatDatePattern.DATE;
      return date ? dayjs(date).format(pattern) : '';
    };
    const dateFrom = normalizedDate(this.#routePoints[0].dateFrom, true);
    const dateTo = normalizedDate(this.#routePoints.at(-1).dateTo, true);

    return [
      dateFrom,
      dateTo
    ].join(' - ');
  };

  _restoreHandlers(){}
}
