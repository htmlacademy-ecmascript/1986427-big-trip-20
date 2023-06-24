import OffersApiService from './offers-api-service.js';
import RoutePointsApiService from './route-points-api-service.js';
import DestinationsApiService from './destinations-api-service.js';
import TripFormPresenter from './presenter/trip-form-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import OffersModel from './model/offers-model.js';
import RoutePointsModel from './model/route-points-model.js';
import DestinationsModel from './model/destinations-model.js';
import FilterModel from './model/filter-model.js';
import {BASE_END_POINT, BEARER_AUTHORIZATION_TOKEN} from './const';

const filterModel = new FilterModel();
const routePointsModel = new RoutePointsModel({
  routePointsApiService: new RoutePointsApiService(
    BASE_END_POINT,
    BEARER_AUTHORIZATION_TOKEN
  )
});
const destinationsModel = new DestinationsModel({
  destinationsApiService: new DestinationsApiService(
    BASE_END_POINT,
    BEARER_AUTHORIZATION_TOKEN
  )
});
const offersModel = new OffersModel({
  offersApiService: new OffersApiService(
    BASE_END_POINT,
    BEARER_AUTHORIZATION_TOKEN
  )
});

const formPresenter = new TripFormPresenter({
  bigTripContainer: document.querySelector('.trip-events'),
  tripInfoContainer: document.querySelector('.trip-main'),
  routePointsModel,
  destinationsModel,
  offersModel,
  filterModel,
});

const filterPresenter = new FilterPresenter({
  filterContainer: document.querySelector('.trip-controls__filters'),
  filterModel,
  routePointsModel
});

filterPresenter.init();
destinationsModel.init();
offersModel.init();
routePointsModel.init();
formPresenter.init();
