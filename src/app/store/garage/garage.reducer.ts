import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createFeature, createReducer, on } from '@ngrx/store';
import { GarageActions } from './garage.actions';
import { GarageCar } from './garage.model';

export interface GarageState {
  cars: EntityState<GarageCar>;
  loaded: boolean;
  loading: boolean;
  submitting: boolean;
  error: string | null;
  publishError: Record<string, string>; // carId → error message
}

export const carsAdapter: EntityAdapter<GarageCar> = createEntityAdapter<GarageCar>();

const initialState: GarageState = {
  cars: carsAdapter.getInitialState(),
  loaded: false,
  loading: false,
  submitting: false,
  error: null,
  publishError: {},
};

export const garageFeature = createFeature({
  name: 'garage',
  reducer: createReducer(
    initialState,

    on(GarageActions.loadGarage, state => ({
      ...state,
      loading: true,
      error: null,
    })),
    on(GarageActions.loadGarageSuccess, (state, { cars }) => ({
      ...state,
      cars: carsAdapter.setAll(cars, state.cars),
      loaded: true,
      loading: false,
    })),
    on(GarageActions.loadGarageFailure, (state, { error }) => ({
      ...state,
      loaded: true,
      loading: false,
      error,
    })),

    on(GarageActions.addCar, state => ({
      ...state,
      submitting: true,
      error: null,
    })),
    on(GarageActions.addCarSuccess, (state, { car }) => ({
      ...state,
      cars: carsAdapter.addOne(car, state.cars),
      submitting: false,
    })),
    on(GarageActions.addCarFailure, (state, { error }) => ({
      ...state,
      submitting: false,
      error,
    })),

    on(GarageActions.removeCarSuccess, (state, { id }) => ({
      ...state,
      cars: carsAdapter.removeOne(id, state.cars),
    })),
    on(GarageActions.removeCarFailure, (state, { id, error }) => ({
      ...state,
      error,
    })),

    on(GarageActions.publishListing, state => ({
      ...state,
      publishError: {},
    })),
    on(GarageActions.publishListingFailure, (state, { carId, error }) => ({
      ...state,
      publishError: { ...state.publishError, [carId]: error },
    })),

    on(GarageActions.linkListingToCarSuccess, (state, { carId, productId }) => ({
      ...state,
      cars: carsAdapter.updateOne(
        { id: carId, changes: { listingProductId: productId } },
        state.cars
      ),
    })),
  ),
});
