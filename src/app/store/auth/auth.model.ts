export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
  customFields?: {
    paypalEmail?: string;
    bio?: string;
    location?: string;
  };
}

export interface AuthState {
  customer: Customer | null;
  loaded: boolean;
  loading: boolean;
  error: string | null;
}
