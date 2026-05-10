import { graphql } from '../../gql';

export const GET_FACETS = graphql(`
  query GetFacets {
    facets {
      items {
        id
        code
        name
        values {
          id
          code
          name
        }
      }
    }
  }
`);

export const SEARCH_LISTINGS = graphql(`
  query SearchListings($input: SearchInput!) {
    search(input: $input) {
      totalItems
      items {
        productId
        productName
        slug
        productAsset { preview }
        priceWithTax {
          ... on SinglePrice { value }
          ... on PriceRange { min max }
        }
        currencyCode
        facetValueIds
      }
      facetValues {
        count
        facetValue {
          id
          code
          name
          facet { id code name }
        }
      }
    }
  }
`);

export const GET_PRODUCTS = graphql(`
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
`);

export const GET_PRODUCT = graphql(`
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
`);

export const GET_MY_GARAGE = graphql(`
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
      listingProductId
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
`);

export const GET_PUBLIC_GARAGE = graphql(`
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
      listingProductId
      setupSheets {
        id
        trackName
        trackDate
      }
    }
  }
`);

export const GET_ACTIVE_CUSTOMER = graphql(`
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
`);

export const GET_MY_LISTINGS = graphql(`
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
`);

export const GET_ACTIVE_ORDER = graphql(`
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
            customFields { sellerPaypalEmail }
          }
        }
      }
    }
  }
`);

export const GET_ELIGIBLE_SHIPPING_METHODS = graphql(`
  query EligibleShippingMethods {
    eligibleShippingMethods {
      id
      name
      priceWithTax
      description
    }
  }
`);

export const GET_CUSTOMER_ORDERS = graphql(`
  query CustomerOrders {
    activeCustomer {
      orders {
        totalItems
        items {
          id
          code
          state
          orderPlacedAt
          totalWithTax
          currencyCode
          lines {
            id
            quantity
            unitPriceWithTax
            productVariant {
              id
              name
              product { name }
            }
          }
        }
      }
    }
  }
`);

export const GET_MY_SALES = graphql(`
  query MySales {
    mySales {
      id
      code
      state
      orderPlacedAt
      totalWithTax
      currencyCode
      customer {
        firstName
        lastName
        emailAddress
      }
      lines {
        id
        quantity
        unitPriceWithTax
        productVariant {
          name
          product { name }
        }
      }
      fulfillments {
        id
        state
        method
        trackingCode
      }
    }
  }
`);

export const GET_ALL_GARAGES = graphql(`
  query AllGarages {
    allGarages {
      customerId
      customerName
      carCount
      previewCars {
        id
        name
        brand
        rcClass
        driveType
        setupSheets { id }
      }
    }
  }
`);

export const GET_PUBLIC_LISTINGS = graphql(`
  query PublicListings($customerId: ID!) {
    publicListings(customerId: $customerId) {
      id
      name
      slug
      variants { id price currencyCode }
      customFields { rcClass condition brand model }
    }
  }
`);
