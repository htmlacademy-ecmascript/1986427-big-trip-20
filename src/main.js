import BigTripView from './view/big-trip-view.js';
import TripInfoView from './view/trip-info-view.js';
import NewRoutePointButtonView from './view/new-route-point-button-view.js';
import TripFormPresenter from './presenter/trip-form-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import RoutePointsModel from './model/route-points-model.js';
import DestinationsModel from './model/destinations-model.js';
import OffersModel from './model/offers-model.js';
import { render, RenderPosition } from './framework/render.js';
import FilterModel from './model/filter-model.js';
import RoutePointsApiService from './route-points-api-service.js';
import DestinationsApiService from './destinations-api-service.js';
import OffersApiService from './offers-api-service.js';

const AUTHORIZATION = 'Basic w3wcFG7445lZXCHM';
const END_POINT = 'https://20.ecmascript.pages.academy/big-trip';

const tripInfoContainer = document.querySelector('.trip-main');
const filterContainer = document.querySelector('.trip-controls__filters');
const bigTripContainer = document.querySelector('.trip-events');
const routePointsModel = new RoutePointsModel({
  routePointsApiService: new RoutePointsApiService(END_POINT, AUTHORIZATION)
});
const filterModel = new FilterModel();
const destinationsModel = new DestinationsModel({
  destinationsApiService: new DestinationsApiService(END_POINT, AUTHORIZATION)
});
const offersModel = new OffersModel({
  offersApiService: new OffersApiService(END_POINT, AUTHORIZATION)
});
const formPresenter = new TripFormPresenter({
  bigTripContainer: bigTripContainer,
  routePointsModel,
  destinationsModel,
  offersModel,
  filterModel,
  onNewRoutePointDestroy: handleNewRoutePointFormClose
});
const filterPresenter = new FilterPresenter({
  filterContainer: filterContainer,
  filterModel,
  routePointsModel
});
const newRoutePointButtonComponent = new NewRoutePointButtonView({
  onClick: handleNewRoutePointButtonClick
});

function handleNewRoutePointFormClose() {
  newRoutePointButtonComponent.element.disabled = false;
}

function handleNewRoutePointButtonClick() {
  formPresenter.createRoutePoint();
  newRoutePointButtonComponent.element.disabled = true;
}

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
routePointsModel.init().finally(() => {
  render(newRoutePointButtonComponent, tripInfoContainer);
});
destinationsModel.init();
offersModel.init();
