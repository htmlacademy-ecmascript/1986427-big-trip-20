import OffersApiService from './offers-api-service.js';
import { render, RenderPosition } from './framework/render.js';
import RoutePointsApiService from './route-points-api-service.js';
import DestinationsApiService from './destinations-api-service.js';
import BigTripView from './view/big-trip-view.js';
import TripInfoView from './view/trip-info-view.js';
import NewRoutePointButtonView from './view/new-route-point-button-view.js';
import TripFormPresenter from './presenter/trip-form-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import OffersModel from './model/offers-model.js';
import RoutePointsModel from './model/route-points-model.js';
import DestinationsModel from './model/destinations-model.js';
import FilterModel from './model/filter-model.js';
import {BASE_END_POINT, BEARER_AUTHORIZATION_TOKEN} from './const';

const tripInfoContainer = document.querySelector('.trip-main');
const bigTripContainer = document.querySelector('.trip-events');

const routePointsModel = new RoutePointsModel({
  routePointsApiService: new RoutePointsApiService(
    BASE_END_POINT,
    BEARER_AUTHORIZATION_TOKEN
  )
});
const filterModel = new FilterModel();
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
  bigTripContainer,
  routePointsModel,
  destinationsModel,
  offersModel,
  filterModel,
});

const newRoutePointButtonComponent = new NewRoutePointButtonView({
  onClick: () => {
    formPresenter.createRoutePoint();
    newRoutePointButtonComponent.element.disabled = true;
  }
});

const filterPresenter = new FilterPresenter({
  filterContainer: document.querySelector('.trip-controls__filters'),
  filterModel,
  routePointsModel
});

render(
  new TripInfoView,
  tripInfoContainer,
  RenderPosition.AFTERBEGIN
);
render(
  newRoutePointButtonComponent,
  tripInfoContainer
);
filterPresenter.init();
render(
  new BigTripView(),
  bigTripContainer
);
formPresenter.init();
routePointsModel.init()
  .finally(() => {
    render(
      newRoutePointButtonComponent,
      tripInfoContainer
    );
  });
destinationsModel.init();
offersModel.init();
