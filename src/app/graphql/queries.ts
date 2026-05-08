import { gql } from 'apollo-angular';

export const GET_PRODUCTS = gql`
  query GetProducts($options: ProductListOptions) {
    products(options: $options) {
      totalItems
      items {
        id
        name
        slug
        description
        featuredAsset { preview }
        variants {
          id
          price
          currencyCode
        }
        customFields {
          rcClass
          driveType
          condition
          surfaceType
          brand
          model
        }
      }
    }
  }
`;

export const GET_PRODUCT = gql`
  query GetProduct($slug: String!) {
    product(slug: $slug) {
      id
      name
      slug
      description
      assets { preview }
      featuredAsset { preview }
      variants {
        id
        price
        currencyCode
        stockLevel
      }
      customFields {
        rcClass
        driveType
        condition
        surfaceType
        brand
        model
      }
    }
  }
`;

export const GET_MY_GARAGE = gql`
  query MyGarage {
    myGarage {
      id
      name
      brand
      model
      rcClass
      driveType
      year
      notes
      imageUrl
      setupSheets {
        id
        trackName
        trackDate
        motor
        esc
        battery
        servo
        frontTireBrand
        frontTireCompound
        rearTireBrand
        rearTireCompound
        pinion
        spur
        suspensionNotes
        generalNotes
      }
    }
  }
`;

export const GET_PUBLIC_GARAGE = gql`
  query PublicGarage($customerId: ID!) {
    publicGarage(customerId: $customerId) {
      id
      name
      brand
      model
      rcClass
      driveType
      year
      imageUrl
      setupSheets {
        id
        trackName
        trackDate
      }
    }
  }
`;

export const GET_ACTIVE_CUSTOMER = gql`
  query ActiveCustomer {
    activeCustomer {
      id
      firstName
      lastName
      emailAddress
      customFields {
        paypalEmail
        bio
        location
      }
    }
  }
`;

export const GET_MY_LISTINGS = gql`
  query MyListings {
    myListings {
      id
      name
      slug
      variants { id price currencyCode }
      customFields {
        condition
        rcClass
        driveType
        brand
        model
      }
    }
  }
`;

export const GET_ACTIVE_ORDER = gql`
  query ActiveOrder {
    activeOrder {
      id
      code
      state
      totalWithTax
      currencyCode
      lines {
        id
        quantity
        unitPriceWithTax
        productVariant {
          id
          name
          product {
            name
            featuredAsset { preview }
          }
        }
      }
    }
  }
`;
