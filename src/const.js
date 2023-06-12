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
};

export const CITY_NAMES = [
  'Amsterdam',
  'Chamonix',
  'Geneva',
  'Rome',
  'New York'
];

export const DESCRIPTIONS = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
  'Aliquam erat volutpat',
  'Nunc fermentum tortor ac porta dapibus',
  'In rutrum ac purus sit amet tempus.',
  'Cras aliquet varius magna, non porta ligula feugiat eget.'
];

export const OFFERS = [
  'Order Uber',
  'Add luggage',
  'Switch to comfort',
  'Rent a car',
  'Add breakfast',
  'Book tickets',
  'Lunch in city'
];

export const EMPTY_ROUTEPOINT = {
  id: '',
  basePrice: 0,
  dateFrom: null,
  dateTo: null,
  destination: null,
  isFavorite: false,
  offers: [],
  type: 'taxi',
};

export const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past',
};
