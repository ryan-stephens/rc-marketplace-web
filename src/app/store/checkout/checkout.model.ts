export interface ShippingAddress {
  fullName: string;
  streetLine1: string;
  city: string;
  province: string;
  postalCode: string;
  countryCode: string;
}

export interface ShippingMethod {
  id: string;
  name: string;
  priceWithTax: number;
  description: string;
}

export interface CompletedOrder {
  code: string;
  sellerPaypalEmail: string;
  amountDue: string;
  currencyCode: string;
}

export interface CheckoutState {
  activeOrder: any | null;
  orderLoaded: boolean;
  shippingMethods: ShippingMethod[];
  selectedShippingMethodId: string | null;
  completedOrder: CompletedOrder | null;
  loading: boolean;
  error: string | null;
}
