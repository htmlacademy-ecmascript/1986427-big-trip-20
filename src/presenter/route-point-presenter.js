import {render, replace, remove} from '../framework/render.js';
import RoutePointView from '../view/route-point-view.js';
import EditFormView from '../view/edit-form-view.js';
import {UserAction, UpdateType, Mode} from '../const.js';
import RoutePointsModel from '../model/route-points-model.js';
import {isDateMatch} from '../utils/route-point-utils.js';

export default class RoutePointPresenter {
  #routePointListContainer = null;
  #handleDataChange = null;
  #handleModeChange = null;
  #routePointComponent = null;
  #editFormComponent = null;
  #destinationsModel = null;
  #routePointsModel = null;
  #offersModel = null;
  #routePoint = null;
  #destination = null;
  #offers = [];
  #offersByType = [];
  #mode = Mode.DEFAULT;

  constructor({
    routePointListContainer,
    destinationsModel,
    routePointsModel,
    offersModel,
    onDataChange,
    onModeChange
  }) {
    this.#routePointListContainer = routePointListContainer;
    this.#destinationsModel = destinationsModel;
    this.#routePointsModel = routePointsModel;
    this.#offersModel = offersModel;
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
  }

  init(routePoint){
    this.#routePoint = routePoint;
    this.#destination = this.#destinationsModel.getById(this.#routePoint);
    this.#offers = this.#offersModel.getById(this.#routePoint);
    this.#offersByType = this.#offersModel.getByType(this.#routePoint);

    const prevRoutePointComponent = this.#routePointComponent;
    const prevEditFormComponent = this.#editFormComponent;

    this.#routePointComponent = new RoutePointView({
      routePoint: this.#routePoint,
      destination: this.#destination,
      offers: this.#offers,
      onClick: () => {
        this.#replaceRoutePointToForm();
      },
      onFavoriteClick: this.#handleFavoriteClick
    });

    this.#editFormComponent = new EditFormView({
      destinationsModel: this.#destinationsModel,
      routePoint: this.#routePoint,
      offersModel: this.#offersModel,
      onFormSubmit: this.#handleFormSubmit,
      onFormCancel:  () => {
        this.#editFormComponent.reset(this.#routePoint);
        this.#replaceFormToRoutePoint();
      },
      onDeleteClick: this.#handleDeleteClick
    });

    if (
      prevRoutePointComponent === null
      || prevEditFormComponent === null
    ) {
      render(this.#routePointComponent, this.#routePointListContainer);
      return;
    }

    if (this.#routePointListContainer.contains(prevRoutePointComponent.element)) {
      replace(this.#routePointComponent, prevRoutePointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#routePointComponent, prevEditFormComponent);
      this.#mode = Mode.DEFAULT;
    }

    remove(prevRoutePointComponent);
    remove(prevEditFormComponent);
  }

  destroy() {
    remove(this.#routePointComponent);
    remove(this.#editFormComponent);
  }

  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#editFormComponent.reset(this.#routePoint);
      this.#replaceFormToRoutePoint();
    }
  }

  #replaceRoutePointToForm() {
    replace(this.#editFormComponent, this.#routePointComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#handleModeChange();
    this.#mode = Mode.EDITING;
  }

  #replaceFormToRoutePoint() {
    replace(this.#routePointComponent, this.#editFormComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#editFormComponent.reset(this.#routePoint);
      this.#replaceFormToRoutePoint();
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    }
  };

  #handleFavoriteClick = () => {
    this.#handleDataChange(
      UserAction.UPDATE_ROUTEPOINT,
      UpdateType.MINOR,
      {
        ...this.#routePoint,
        isFavorite: !this.#routePoint.isFavorite
      },
      this.#destination,
      this.#offers,
      this.#offersByType
    );
  };

  #handleFormSubmit = (
    update,
    destination,
    offers,
    offersByType
  ) => {
    let minorType = UpdateType.MINOR;
    const isPricesMatch = (firstPrice, secondPrice) => (firstPrice === null && secondPrice === null) || firstPrice === secondPrice;
    if (
      !isDateMatch(this.#routePoint.dateFrom, update.dateFrom)
      || !isPricesMatch(this.#routePoint.basePrice, update.basePrice)
    ) {
      minorType = UpdateType.PATCH;
    }

    if (RoutePointsModel.isFilled(update)) {
      this.#handleDataChange(
        UserAction.UPDATE_ROUTEPOINT,
        minorType,
        update,
        destination,
        offers,
        offersByType
      );
    }
  };

  #handleDeleteClick = (routePoint) => {
    this.#handleDataChange(
      UserAction.DELETE_ROUTEPOINT,
      UpdateType.MINOR,
      routePoint
    );
  };

  setSaving() {
    if (this.#mode === Mode.EDITING) {
      this.#editFormComponent.updateElement({
        isDisabled: true,
        isSaving: true,
      });
    }
  }

  setDeleting() {
    if (this.#mode === Mode.EDITING) {
      this.#editFormComponent.updateElement({
        isDisabled: true,
        isDeleting: true,
      });
    }
  }

  setAborting() {
    if (this.#mode === Mode.DEFAULT) {
      this.#routePointComponent.shake();
      return;
    }

    const resetFormState = () => {
      this.#editFormComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#editFormComponent.shake(resetFormState);
  }
}
