import RoutePointListView from '../view/route-point-list-view.js';
import NoRoutePointView from '../view/no-route-point-view.js';
import SortView from '../view/sort-view.js';
import BigTripView from '../view/big-trip-view.js';
import RoutePointPresenter from './route-point-presenter.js';
import NewRoutePointPresenter from './new-route-point-presenter.js';
import {render, RenderPosition, remove} from '../framework/render.js';
import { sortByDay, sortByDurationTime, sortByPrice } from '../utils/route-point-utils.js';
import {SortType, UpdateType, UserAction, FilterType} from '../const.js';
import {filter} from '../utils/filter-utils.js';

export default class TripFormPresenter {
  #bigTripComponent = new BigTripView();
  #bigTripContainer = null;
  #routePointsModel = null;
  #destinationsModel = null;
  #offersModel = null;
  #filterModel = null;
  #routePointListComponent = new RoutePointListView();
  #sortComponent = null;
  #noRoutePointComponent = null;
  #routePointsPresenters = new Map();
  #newRoutePointPresenter = null;
  #currentSortType = SortType.DEFAULT;
  #filterType = FilterType.EVERYTHING;

  constructor({
    bigTripContainer,
    routePointsModel,
    destinationsModel,
    offersModel,
    filterModel,
    onNewRoutePointDestroy
  }) {
    this.#bigTripContainer = bigTripContainer;
    this.#routePointsModel = routePointsModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#filterModel = filterModel;
    this.#routePointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);

    this.#newRoutePointPresenter = new NewRoutePointPresenter({
      routePointListContainer: this.#routePointListComponent.element,
      destinationsModel: this.#destinationsModel,
      offersModel: this.#offersModel,
      onDataChange: this.#handleViewAction,
      onDestroy: onNewRoutePointDestroy
    });
  }

  get routePoints() {
    this.#filterType = this.#filterModel.filter;
    const routePoints = this.#routePointsModel.routePoints;
    const filteredRoutePoints = filter[this.#filterType](routePoints);

    if (this.#currentSortType === SortType.DURATION_TIME) {
      return filteredRoutePoints.sort(sortByDurationTime);
    }
    if (this.#currentSortType === SortType.PRICE) {
      return filteredRoutePoints.sort(sortByPrice);
    }
    if (this.#currentSortType === SortType.DEFAULT) {
      return filteredRoutePoints.sort(sortByDay);
    }

    return filteredRoutePoints;
  }

  init() {
    this.#renderBigTrip();
  }

  createRoutePoint() {
    this.#currentSortType = SortType.DEFAULT;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#newRoutePointPresenter.init();
  }

  #handleModeChange = () => {
    this.#newRoutePointPresenter.destroy();
    this.#routePointsPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleViewAction = (actionType, updateType, update) => {
    if (actionType === UserAction.UPDATE_ROUTEPOINT) {
      this.#routePointsModel.updateRoutePoint(updateType, update);
    }
    if (actionType === UserAction.ADD_ROUTEPOINT) {
      this.#routePointsModel.addRoutePoint(updateType, update);
    }
    if (actionType === UserAction.DELETE_ROUTEPOINT) {
      this.#routePointsModel.deleteRoutePoint(updateType, update);
    }
  };

  #handleModelEvent = (updateType, data) => {
    if (updateType === UpdateType.PATCH) {
      this.#routePointsPresenters.get(data.id).init(data);
    }
    if (updateType === UpdateType.MINOR) {
      this.#clearTripForm();
      this.#renderBigTrip();
    }
    if (updateType === UpdateType.MAJOR) {
      this.#clearTripForm({
        resetSortType: true
      });
      this.#renderBigTrip();
    }
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType;
    this.#clearTripForm();
    this.#renderBigTrip();
  };

  #renderSort() {
    this.#sortComponent = new SortView({
      currentSortType: this.#currentSortType,
      onSortTypeChange: this.#handleSortTypeChange
    });
    render(
      this.#sortComponent,
      this.#bigTripComponent.element,
      RenderPosition.AFTERBEGIN
    );
  }

  #renderNoRoutePoints() {
    this.#noRoutePointComponent = new NoRoutePointView({
      filterType: this.#filterType
    });
    render(
      this.#noRoutePointComponent,
      this.#bigTripComponent.element,
      RenderPosition.AFTERBEGIN
    );
  }

  #clearTripForm({resetSortType = false} = {}) {
    this.#newRoutePointPresenter.destroy();

    this.#routePointsPresenters.forEach((presenter) => presenter.destroy());
    this.#routePointsPresenters.clear();

    remove(this.#sortComponent);
    if (this.#noRoutePointComponent) {
      remove(this.#noRoutePointComponent);
    }
    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  }


  #renderRoutePoints(){
    this.routePoints.forEach((routePoint) => this.#renderRoutePoint(routePoint));
  }

  #renderRoutePoint(routePoint) {
    const routePointPresenter = new RoutePointPresenter({
      routePointListContainer: this.#routePointListComponent.element,
      destinationsModel: this.#destinationsModel,
      routePointsModel: this.#routePointsModel,
      offersModel: this.#offersModel,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange
    });
    routePointPresenter.init(routePoint);
    this.#routePointsPresenters.set(routePoint.id, routePointPresenter);
  }

  #renderBigTrip(){
    render(this.#bigTripComponent, this.#bigTripContainer);
    if (this.routePoints.length === 0) {
      this.#renderNoRoutePoints();
      return;
    }
    this.#renderSort();
    render(this.#routePointListComponent, this.#bigTripComponent.element);
    this.#renderRoutePoints();
  }

}
