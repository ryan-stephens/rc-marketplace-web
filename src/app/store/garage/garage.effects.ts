import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Apollo } from 'apollo-angular';
import { catchError, map, of, switchMap } from 'rxjs';
import { GET_MY_GARAGE } from '../../graphql/queries';
import {
  ADD_GARAGE_CAR,
  CREATE_LISTING,
  REMOVE_GARAGE_CAR,
  UPDATE_GARAGE_CAR,
} from '../../graphql/mutations';
import { GarageActions } from './garage.actions';

@Injectable()
export class GarageEffects {
  private actions$ = inject(Actions);
  private apollo = inject(Apollo);

  loadGarage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GarageActions.loadGarage),
      switchMap(() =>
        this.apollo.query({ query: GET_MY_GARAGE, fetchPolicy: 'network-only' }).pipe(
          map((res: any) => GarageActions.loadGarageSuccess({
            cars: res.data?.myGarage ?? [],
          })),
          catchError(err => of(GarageActions.loadGarageFailure({
            error: err.message ?? 'Failed to load garage.',
          }))),
        )
      ),
    )
  );

  addCar$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GarageActions.addCar),
      switchMap(({ input }) =>
        this.apollo.mutate({ mutation: ADD_GARAGE_CAR, variables: { input } }).pipe(
          map((res: any) => {
            const car = res.data?.addGarageCar;
            // Backend doesn't return setupSheets on create — normalise
            return GarageActions.addCarSuccess({ car: { ...car, setupSheets: [] } });
          }),
          catchError(err => of(GarageActions.addCarFailure({
            error: err.graphQLErrors?.[0]?.message ?? err.message ?? 'Failed to add car.',
          }))),
        )
      ),
    )
  );

  removeCar$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GarageActions.removeCar),
      switchMap(({ id }) =>
        this.apollo.mutate({ mutation: REMOVE_GARAGE_CAR, variables: { id } }).pipe(
          map(() => GarageActions.removeCarSuccess({ id })),
          catchError(err => of(GarageActions.removeCarFailure({
            id,
            error: err.graphQLErrors?.[0]?.message ?? err.message ?? 'Failed to remove car.',
          }))),
        )
      ),
    )
  );

  // Step 1: create the listing
  publishListing$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GarageActions.publishListing),
      switchMap(({ input }) =>
        this.apollo.mutate({
          mutation: CREATE_LISTING,
          variables: {
            input: {
              name: input.name,
              brand: input.brand || undefined,
              model: input.model || undefined,
              rcClass: input.rcClass || undefined,
              driveType: input.driveType || undefined,
              description: input.description || undefined,
              condition: input.condition,
              price: input.price,
              paypalEmail: input.paypalEmail,
            },
          },
        }).pipe(
          map((res: any) => {
            const productId = res.data?.createListing?.id;
            if (!productId) {
              return GarageActions.publishListingFailure({
                carId: input.carId,
                error: 'Listing created but no product ID returned.',
              });
            }
            return GarageActions.publishListingSuccess({ carId: input.carId, productId: String(productId) });
          }),
          catchError(err => of(GarageActions.publishListingFailure({
            carId: input.carId,
            error: err.graphQLErrors?.[0]?.message ?? err.message ?? 'Failed to create listing.',
          }))),
        )
      ),
    )
  );

  // Step 2: save the link on the garage car (triggered by publish success)
  linkListingToCar$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GarageActions.publishListingSuccess),
      switchMap(({ carId, productId }) =>
        this.apollo.mutate({
          mutation: UPDATE_GARAGE_CAR,
          variables: { input: { id: carId, listingProductId: productId } },
        }).pipe(
          map(() => GarageActions.linkListingToCarSuccess({ carId, productId })),
          catchError(() => of(GarageActions.linkListingToCarSuccess({ carId, productId }))), // still update store even if DB link fails
        )
      ),
    )
  );
}
