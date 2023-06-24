import {remove, render, RenderPosition} from '../framework/render.js';
import EditFormView from '../view/edit-form-view.js';
import {UserAction, UpdateType} from '../const.js';
import RoutePointsModel from '../model/route-points-model.js';

export default class NewRoutePointPresenter {
  #routePointListContainer = null;
  #handleDataChange = null;
  #handleDestroy = null;
  #destinationsModel = null;
  #offersModel = null;
  #routePointEditComponent = null;

  constructor({
    routePointListContainer,
    destinationsModel,
    offersModel,
    onDataChange,
    onDestroy
  }) {
    this.#routePointListContainer = routePointListContainer;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#handleDataChange = onDataChange;
    this.#handleDestroy = onDestroy;
  }

  init() {
    if (this.#routePointEditComponent !== null) {
      return;
    }

    this.#routePointEditComponent = new EditFormView({
      destinationsModel: this.#destinationsModel,
      offersModel: this.#offersModel,
      onFormSubmit: this.#handleFormSubmit,
      onFormCancel: () => {
        this.destroy();
      },
      isNewRoutePoint : true,
    });

    render(this.#routePointEditComponent, this.#routePointListContainer, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#escKeyDownHandle);
  }

  setSaving() {
    this.#routePointEditComponent.updateElement({
      isDisabled: true,
      isSaving: true,
    });
  }

  setAborting() {
    const resetFormState = () => {
      this.#routePointEditComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#routePointEditComponent.shake(resetFormState);
  }

  destroy() {
    if (this.#routePointEditComponent === null) {
      return;
    }

    this.#handleDestroy();

    remove(this.#routePointEditComponent);
    this.#routePointEditComponent = null;

    document.removeEventListener('keydown', this.#escKeyDownHandle);
  }

  #handleFormSubmit = (routePoint) => {
    if(RoutePointsModel.isFilled(routePoint)) {
      this.#handleDataChange(
        UserAction.ADD_ROUTEPOINT,
        UpdateType.MINOR,
        routePoint,
      );
    }
  };

  #escKeyDownHandle = (evt) => {
    if (evt.key === 'Esc' || evt.key === 'Escape') {
      evt.preventDefault();
      this.destroy();
    }
  };
}
