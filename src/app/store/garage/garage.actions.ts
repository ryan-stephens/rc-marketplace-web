import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { AddGarageCarInput, GarageCar, PublishListingInput } from './garage.model';

export const GarageActions = createActionGroup({
  source: 'Garage',
  events: {
    // Load my garage
    'Load Garage': emptyProps(),
    'Load Garage Success': props<{ cars: GarageCar[] }>(),
    'Load Garage Failure': props<{ error: string }>(),

    // Add car
    'Add Car': props<{ input: AddGarageCarInput }>(),
    'Add Car Success': props<{ car: GarageCar }>(),
    'Add Car Failure': props<{ error: string }>(),

    // Remove car
    'Remove Car': props<{ id: string }>(),
    'Remove Car Success': props<{ id: string }>(),
    'Remove Car Failure': props<{ id: string; error: string }>(),

    // Publish listing from garage car (2-step: create listing → update car with listingProductId)
    'Publish Listing': props<{ input: PublishListingInput }>(),
    'Publish Listing Success': props<{ carId: string; productId: string }>(),
    'Publish Listing Failure': props<{ carId: string; error: string }>(),

    // Link listing product ID to car after publish
    'Link Listing To Car Success': props<{ carId: string; productId: string }>(),
  },
});
