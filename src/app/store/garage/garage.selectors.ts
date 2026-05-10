import { createSelector } from '@ngrx/store';
import { carsAdapter, garageFeature } from './garage.reducer';

export const {
  selectLoaded,
  selectLoading,
  selectSubmitting,
  selectError,
  selectPublishError,
} = garageFeature;

const { selectAll, selectEntities } = carsAdapter.getSelectors(garageFeature.selectCars);

export const selectAllCars = selectAll;
export const selectCarEntities = selectEntities;

export const selectCarById = (id: string) => createSelector(
  selectCarEntities,
  entities => entities[id] ?? null,
);

export const selectPublishErrorForCar = (carId: string) => createSelector(
  selectPublishError,
  errors => errors[carId] ?? null,
);
