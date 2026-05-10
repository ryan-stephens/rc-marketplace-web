import { graphql } from '../../gql';

export const LOGIN = graphql(`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      ... on CurrentUser {
        id
        identifier
      }
      ... on InvalidCredentialsError {
        errorCode
        message
      }
    }
  }
`);

export const LOGOUT = graphql(`
  mutation Logout {
    logout { success }
  }
`);

export const REGISTER = graphql(`
  mutation Register($input: RegisterCustomerInput!) {
    registerCustomerAccount(input: $input) {
      ... on Success {
        success
      }
      ... on ErrorResult {
        errorCode
        message
      }
    }
  }
`);

export const ADD_TO_ORDER = graphql(`
  mutation AddItemToOrder($variantId: ID!, $quantity: Int!) {
    addItemToOrder(productVariantId: $variantId, quantity: $quantity) {
      ... on Order {
        id
        totalWithTax
        lines { id quantity }
      }
      ... on ErrorResult {
        errorCode
        message
      }
    }
  }
`);

export const ADD_GARAGE_CAR = graphql(`
  mutation AddGarageCar($input: AddGarageCarInput!) {
    addGarageCar(input: $input) {
      id
      name
      brand
      model
      rcClass
      driveType
      year
    }
  }
`);

export const UPDATE_GARAGE_CAR = graphql(`
  mutation UpdateGarageCar($input: UpdateGarageCarInput!) {
    updateGarageCar(input: $input) {
      id
      name
      brand
      model
      rcClass
      driveType
      year
      notes
    }
  }
`);

export const REMOVE_GARAGE_CAR = graphql(`
  mutation RemoveGarageCar($id: ID!) {
    removeGarageCar(id: $id)
  }
`);

export const ADD_SETUP_SHEET = graphql(`
  mutation AddSetupSheet($input: AddSetupSheetInput!) {
    addSetupSheet(input: $input) {
      id
      trackName
      trackDate
    }
  }
`);

export const UPDATE_SETUP_SHEET = graphql(`
  mutation UpdateSetupSheet($input: UpdateSetupSheetInput!) {
    updateSetupSheet(input: $input) {
      id
      trackName
      trackDate
    }
  }
`);

export const REMOVE_SETUP_SHEET = graphql(`
  mutation RemoveSetupSheet($id: ID!) {
    removeSetupSheet(id: $id)
  }
`);

export const CREATE_LISTING = graphql(`
  mutation CreateListing($input: CreateListingInput!) {
    createListing(input: $input) {
      id
      name
      slug
    }
  }
`);

export const UPDATE_LISTING = graphql(`
  mutation UpdateListing($input: UpdateListingInput!) {
    updateListing(input: $input) {
      id
      name
      slug
    }
  }
`);

export const DELETE_LISTING = graphql(`
  mutation DeleteListing($id: ID!) {
    deleteListing(id: $id)
  }
`);

export const SET_ORDER_SHIPPING_ADDRESS = graphql(`
  mutation SetOrderShippingAddress($input: CreateAddressInput!) {
    setOrderShippingAddress(input: $input) {
      ... on Order { id }
      ... on ErrorResult { errorCode message }
    }
  }
`);

export const SET_ORDER_SHIPPING_METHOD = graphql(`
  mutation SetOrderShippingMethod($shippingMethodId: [ID!]!) {
    setOrderShippingMethod(shippingMethodId: $shippingMethodId) {
      ... on Order { id }
      ... on ErrorResult { errorCode message }
    }
  }
`);

export const TRANSITION_ORDER_TO_STATE = graphql(`
  mutation TransitionOrderToState($state: String!) {
    transitionOrderToState(state: $state) {
      ... on Order { id state }
      ... on ErrorResult { errorCode message }
    }
  }
`);

export const ADD_PAYMENT_TO_ORDER = graphql(`
  mutation AddPaymentToOrder($input: PaymentInput!) {
    addPaymentToOrder(input: $input) {
      ... on Order {
        id
        state
        payments { id state metadata }
      }
      ... on ErrorResult { errorCode message }
    }
  }
`);

export const SHIP_SALE_ORDER = graphql(`
  mutation ShipSaleOrder($input: ShipSaleOrderInput!) {
    shipSaleOrder(input: $input) {
      id
      state
      fulfillments {
        id
        state
        method
        trackingCode
      }
    }
  }
`);

export const CONFIRM_PAYPAL_PAYMENT = graphql(`
  mutation ConfirmPayPalPayment($paypalOrderId: String!) {
    confirmPayPalPayment(paypalOrderId: $paypalOrderId) {
      id
      code
      state
      totalWithTax
      currencyCode
    }
  }
`);
