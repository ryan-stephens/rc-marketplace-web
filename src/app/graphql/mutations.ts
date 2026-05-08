import { gql } from 'apollo-angular';

export const LOGIN = gql`
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
`;

export const LOGOUT = gql`
  mutation Logout {
    logout { success }
  }
`;

export const REGISTER = gql`
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
`;

export const ADD_TO_ORDER = gql`
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
`;

export const ADD_GARAGE_CAR = gql`
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
`;

export const UPDATE_GARAGE_CAR = gql`
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
`;

export const REMOVE_GARAGE_CAR = gql`
  mutation RemoveGarageCar($id: ID!) {
    removeGarageCar(id: $id)
  }
`;

export const ADD_SETUP_SHEET = gql`
  mutation AddSetupSheet($input: AddSetupSheetInput!) {
    addSetupSheet(input: $input) {
      id
      trackName
      trackDate
    }
  }
`;

export const UPDATE_SETUP_SHEET = gql`
  mutation UpdateSetupSheet($input: UpdateSetupSheetInput!) {
    updateSetupSheet(input: $input) {
      id
      trackName
      trackDate
    }
  }
`;

export const REMOVE_SETUP_SHEET = gql`
  mutation RemoveSetupSheet($id: ID!) {
    removeSetupSheet(id: $id)
  }
`;

export const CREATE_LISTING = gql`
  mutation CreateListing($input: CreateListingInput!) {
    createListing(input: $input) {
      id
      name
      slug
    }
  }
`;

export const UPDATE_LISTING = gql`
  mutation UpdateListing($input: UpdateListingInput!) {
    updateListing(input: $input) {
      id
      name
      slug
    }
  }
`;

export const DELETE_LISTING = gql`
  mutation DeleteListing($id: ID!) {
    deleteListing(id: $id)
  }
`;
