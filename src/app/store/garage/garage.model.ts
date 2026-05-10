export interface SetupSheet {
  id: string;
  trackName?: string;
  trackDate?: string;
  motor?: string;
  esc?: string;
  battery?: string;
  servo?: string;
  frontTireBrand?: string;
  frontTireCompound?: string;
  rearTireBrand?: string;
  rearTireCompound?: string;
  pinion?: number;
  spur?: number;
  suspensionNotes?: string;
  generalNotes?: string;
}

export interface GarageCar {
  id: string;
  name: string;
  brand?: string;
  model?: string;
  rcClass?: string;
  driveType?: string;
  year?: number;
  notes?: string;
  imageUrl?: string;
  listingProductId?: string;
  setupSheets: SetupSheet[];
}

export interface AddGarageCarInput {
  name: string;
  brand?: string;
  model?: string;
  rcClass?: string;
  driveType?: string;
  year?: number;
  notes?: string;
}

export interface PublishListingInput {
  carId: string;
  name: string;
  brand?: string;
  model?: string;
  rcClass?: string;
  driveType?: string;
  description?: string;
  condition: string;
  price: number;
  paypalEmail: string;
}
