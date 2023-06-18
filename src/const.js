export const BEARER_AUTORIZATION_TOKEN = 'Basic w3wcFG7445lZXCHM';
export const BASE_END_POINT = 'https://20.ecmascript.pages.academy/big-trip';
export const OFFERS_END_POINT = 'offers';
export const DESTINATIONS_END_POINT = 'destinations';

export const Method = {
  GET: 'GET',
  PUT: 'PUT',
};


export const SortType = {
  DEFAULT: 'day',
  DURATION_TIME: 'time',
  PRICE: 'price',
};

export const UserAction = {
  UPDATE_ROUTEPOINT: 'UPDATE_ROUTEPOINT',
  ADD_ROUTEPOINT: 'ADD_ROUTEPOINT',
  DELETE_ROUTEPOINT: 'DELETE_ROUTEPOINT',
};

export const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};

export const EMPTY_ROUTE_POINT = {
  id: '',
  type: 'taxi',
  isFavorite: false,
  offers: [],
  basePrice: 0,
  dateFrom: null,
  dateTo: null,
  destination: null,
};

export const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past',
};
export const NoRoutepointsTextType = {
  [FilterType.EVERYTHING]: 'Click "New Event" to create your first point',
  [FilterType.FUTURE]: 'There are no future events now',
  [FilterType.PRESENT]: 'There are no present events now',
  [FilterType.PAST]: 'There are no past events now',
};
