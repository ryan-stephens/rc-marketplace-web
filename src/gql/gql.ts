/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  mutation Login($username: String!, $password: String!) {\n    login(username: $username, password: $password) {\n      ... on CurrentUser {\n        id\n        identifier\n      }\n      ... on InvalidCredentialsError {\n        errorCode\n        message\n      }\n    }\n  }\n": typeof types.LoginDocument,
    "\n  mutation Logout {\n    logout { success }\n  }\n": typeof types.LogoutDocument,
    "\n  mutation Register($input: RegisterCustomerInput!) {\n    registerCustomerAccount(input: $input) {\n      ... on Success {\n        success\n      }\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n": typeof types.RegisterDocument,
    "\n  mutation AddItemToOrder($variantId: ID!, $quantity: Int!) {\n    addItemToOrder(productVariantId: $variantId, quantity: $quantity) {\n      ... on Order {\n        id\n        totalWithTax\n        lines { id quantity }\n      }\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n": typeof types.AddItemToOrderDocument,
    "\n  mutation AddGarageCar($input: AddGarageCarInput!) {\n    addGarageCar(input: $input) {\n      id\n      name\n      brand\n      model\n      rcClass\n      driveType\n      year\n    }\n  }\n": typeof types.AddGarageCarDocument,
    "\n  mutation UpdateGarageCar($input: UpdateGarageCarInput!) {\n    updateGarageCar(input: $input) {\n      id\n      name\n      brand\n      model\n      rcClass\n      driveType\n      year\n      notes\n    }\n  }\n": typeof types.UpdateGarageCarDocument,
    "\n  mutation RemoveGarageCar($id: ID!) {\n    removeGarageCar(id: $id)\n  }\n": typeof types.RemoveGarageCarDocument,
    "\n  mutation AddSetupSheet($input: AddSetupSheetInput!) {\n    addSetupSheet(input: $input) {\n      id\n      trackName\n      trackDate\n    }\n  }\n": typeof types.AddSetupSheetDocument,
    "\n  mutation UpdateSetupSheet($input: UpdateSetupSheetInput!) {\n    updateSetupSheet(input: $input) {\n      id\n      trackName\n      trackDate\n    }\n  }\n": typeof types.UpdateSetupSheetDocument,
    "\n  mutation RemoveSetupSheet($id: ID!) {\n    removeSetupSheet(id: $id)\n  }\n": typeof types.RemoveSetupSheetDocument,
    "\n  mutation CreateListing($input: CreateListingInput!) {\n    createListing(input: $input) {\n      id\n      name\n      slug\n    }\n  }\n": typeof types.CreateListingDocument,
    "\n  mutation UpdateListing($input: UpdateListingInput!) {\n    updateListing(input: $input) {\n      id\n      name\n      slug\n    }\n  }\n": typeof types.UpdateListingDocument,
    "\n  mutation DeleteListing($id: ID!) {\n    deleteListing(id: $id)\n  }\n": typeof types.DeleteListingDocument,
    "\n  mutation SetOrderShippingAddress($input: CreateAddressInput!) {\n    setOrderShippingAddress(input: $input) {\n      ... on Order { id }\n      ... on ErrorResult { errorCode message }\n    }\n  }\n": typeof types.SetOrderShippingAddressDocument,
    "\n  mutation SetOrderShippingMethod($shippingMethodId: [ID!]!) {\n    setOrderShippingMethod(shippingMethodId: $shippingMethodId) {\n      ... on Order { id }\n      ... on ErrorResult { errorCode message }\n    }\n  }\n": typeof types.SetOrderShippingMethodDocument,
    "\n  mutation TransitionOrderToState($state: String!) {\n    transitionOrderToState(state: $state) {\n      ... on Order { id state }\n      ... on ErrorResult { errorCode message }\n    }\n  }\n": typeof types.TransitionOrderToStateDocument,
    "\n  mutation AddPaymentToOrder($input: PaymentInput!) {\n    addPaymentToOrder(input: $input) {\n      ... on Order {\n        id\n        state\n        payments { id state metadata }\n      }\n      ... on ErrorResult { errorCode message }\n    }\n  }\n": typeof types.AddPaymentToOrderDocument,
    "\n  mutation ShipSaleOrder($input: ShipSaleOrderInput!) {\n    shipSaleOrder(input: $input) {\n      id\n      state\n      fulfillments {\n        id\n        state\n        method\n        trackingCode\n      }\n    }\n  }\n": typeof types.ShipSaleOrderDocument,
    "\n  mutation ConfirmPayPalPayment($paypalOrderId: String!) {\n    confirmPayPalPayment(paypalOrderId: $paypalOrderId) {\n      id\n      code\n      state\n      totalWithTax\n      currencyCode\n    }\n  }\n": typeof types.ConfirmPayPalPaymentDocument,
    "\n  query GetFacets {\n    facets {\n      items {\n        id\n        code\n        name\n        values {\n          id\n          code\n          name\n        }\n      }\n    }\n  }\n": typeof types.GetFacetsDocument,
    "\n  query SearchListings($input: SearchInput!) {\n    search(input: $input) {\n      totalItems\n      items {\n        productId\n        productName\n        slug\n        productAsset { preview }\n        priceWithTax {\n          ... on SinglePrice { value }\n          ... on PriceRange { min max }\n        }\n        currencyCode\n        facetValueIds\n      }\n      facetValues {\n        count\n        facetValue {\n          id\n          code\n          name\n          facet { id code name }\n        }\n      }\n    }\n  }\n": typeof types.SearchListingsDocument,
    "\n  query GetProducts($options: ProductListOptions) {\n    products(options: $options) {\n      totalItems\n      items {\n        id\n        name\n        slug\n        description\n        featuredAsset { preview }\n        variants {\n          id\n          price\n          currencyCode\n        }\n        customFields {\n          rcClass\n          driveType\n          condition\n          surfaceType\n          brand\n          model\n        }\n      }\n    }\n  }\n": typeof types.GetProductsDocument,
    "\n  query GetProduct($slug: String!) {\n    product(slug: $slug) {\n      id\n      name\n      slug\n      description\n      assets { preview }\n      featuredAsset { preview }\n      variants {\n        id\n        price\n        currencyCode\n        stockLevel\n      }\n      customFields {\n        rcClass\n        driveType\n        condition\n        surfaceType\n        brand\n        model\n      }\n    }\n  }\n": typeof types.GetProductDocument,
    "\n  query MyGarage {\n    myGarage {\n      id\n      name\n      brand\n      model\n      rcClass\n      driveType\n      year\n      notes\n      imageUrl\n      listingProductId\n      setupSheets {\n        id\n        trackName\n        trackDate\n        motor\n        esc\n        battery\n        servo\n        frontTireBrand\n        frontTireCompound\n        rearTireBrand\n        rearTireCompound\n        pinion\n        spur\n        suspensionNotes\n        generalNotes\n      }\n    }\n  }\n": typeof types.MyGarageDocument,
    "\n  query PublicGarage($customerId: ID!) {\n    publicGarage(customerId: $customerId) {\n      id\n      name\n      brand\n      model\n      rcClass\n      driveType\n      year\n      imageUrl\n      listingProductId\n      setupSheets {\n        id\n        trackName\n        trackDate\n      }\n    }\n  }\n": typeof types.PublicGarageDocument,
    "\n  query ActiveCustomer {\n    activeCustomer {\n      id\n      firstName\n      lastName\n      emailAddress\n      customFields {\n        paypalEmail\n        bio\n        location\n      }\n    }\n  }\n": typeof types.ActiveCustomerDocument,
    "\n  query MyListings {\n    myListings {\n      id\n      name\n      slug\n      variants { id price currencyCode }\n      customFields {\n        condition\n        rcClass\n        driveType\n        brand\n        model\n      }\n    }\n  }\n": typeof types.MyListingsDocument,
    "\n  query ActiveOrder {\n    activeOrder {\n      id\n      code\n      state\n      totalWithTax\n      currencyCode\n      lines {\n        id\n        quantity\n        unitPriceWithTax\n        productVariant {\n          id\n          name\n          product {\n            name\n            featuredAsset { preview }\n            customFields { sellerPaypalEmail }\n          }\n        }\n      }\n    }\n  }\n": typeof types.ActiveOrderDocument,
    "\n  query EligibleShippingMethods {\n    eligibleShippingMethods {\n      id\n      name\n      priceWithTax\n      description\n    }\n  }\n": typeof types.EligibleShippingMethodsDocument,
    "\n  query CustomerOrders {\n    activeCustomer {\n      orders {\n        totalItems\n        items {\n          id\n          code\n          state\n          orderPlacedAt\n          totalWithTax\n          currencyCode\n          lines {\n            id\n            quantity\n            unitPriceWithTax\n            productVariant {\n              id\n              name\n              product { name }\n            }\n          }\n        }\n      }\n    }\n  }\n": typeof types.CustomerOrdersDocument,
    "\n  query MySales {\n    mySales {\n      id\n      code\n      state\n      orderPlacedAt\n      totalWithTax\n      currencyCode\n      customer {\n        firstName\n        lastName\n        emailAddress\n      }\n      lines {\n        id\n        quantity\n        unitPriceWithTax\n        productVariant {\n          name\n          product { name }\n        }\n      }\n      fulfillments {\n        id\n        state\n        method\n        trackingCode\n      }\n    }\n  }\n": typeof types.MySalesDocument,
    "\n  query AllGarages {\n    allGarages {\n      customerId\n      customerName\n      carCount\n      previewCars {\n        id\n        name\n        brand\n        rcClass\n        driveType\n        setupSheets { id }\n      }\n    }\n  }\n": typeof types.AllGaragesDocument,
    "\n  query PublicListings($customerId: ID!) {\n    publicListings(customerId: $customerId) {\n      id\n      name\n      slug\n      variants { id price currencyCode }\n      customFields { rcClass condition brand model }\n    }\n  }\n": typeof types.PublicListingsDocument,
};
const documents: Documents = {
    "\n  mutation Login($username: String!, $password: String!) {\n    login(username: $username, password: $password) {\n      ... on CurrentUser {\n        id\n        identifier\n      }\n      ... on InvalidCredentialsError {\n        errorCode\n        message\n      }\n    }\n  }\n": types.LoginDocument,
    "\n  mutation Logout {\n    logout { success }\n  }\n": types.LogoutDocument,
    "\n  mutation Register($input: RegisterCustomerInput!) {\n    registerCustomerAccount(input: $input) {\n      ... on Success {\n        success\n      }\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n": types.RegisterDocument,
    "\n  mutation AddItemToOrder($variantId: ID!, $quantity: Int!) {\n    addItemToOrder(productVariantId: $variantId, quantity: $quantity) {\n      ... on Order {\n        id\n        totalWithTax\n        lines { id quantity }\n      }\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n": types.AddItemToOrderDocument,
    "\n  mutation AddGarageCar($input: AddGarageCarInput!) {\n    addGarageCar(input: $input) {\n      id\n      name\n      brand\n      model\n      rcClass\n      driveType\n      year\n    }\n  }\n": types.AddGarageCarDocument,
    "\n  mutation UpdateGarageCar($input: UpdateGarageCarInput!) {\n    updateGarageCar(input: $input) {\n      id\n      name\n      brand\n      model\n      rcClass\n      driveType\n      year\n      notes\n    }\n  }\n": types.UpdateGarageCarDocument,
    "\n  mutation RemoveGarageCar($id: ID!) {\n    removeGarageCar(id: $id)\n  }\n": types.RemoveGarageCarDocument,
    "\n  mutation AddSetupSheet($input: AddSetupSheetInput!) {\n    addSetupSheet(input: $input) {\n      id\n      trackName\n      trackDate\n    }\n  }\n": types.AddSetupSheetDocument,
    "\n  mutation UpdateSetupSheet($input: UpdateSetupSheetInput!) {\n    updateSetupSheet(input: $input) {\n      id\n      trackName\n      trackDate\n    }\n  }\n": types.UpdateSetupSheetDocument,
    "\n  mutation RemoveSetupSheet($id: ID!) {\n    removeSetupSheet(id: $id)\n  }\n": types.RemoveSetupSheetDocument,
    "\n  mutation CreateListing($input: CreateListingInput!) {\n    createListing(input: $input) {\n      id\n      name\n      slug\n    }\n  }\n": types.CreateListingDocument,
    "\n  mutation UpdateListing($input: UpdateListingInput!) {\n    updateListing(input: $input) {\n      id\n      name\n      slug\n    }\n  }\n": types.UpdateListingDocument,
    "\n  mutation DeleteListing($id: ID!) {\n    deleteListing(id: $id)\n  }\n": types.DeleteListingDocument,
    "\n  mutation SetOrderShippingAddress($input: CreateAddressInput!) {\n    setOrderShippingAddress(input: $input) {\n      ... on Order { id }\n      ... on ErrorResult { errorCode message }\n    }\n  }\n": types.SetOrderShippingAddressDocument,
    "\n  mutation SetOrderShippingMethod($shippingMethodId: [ID!]!) {\n    setOrderShippingMethod(shippingMethodId: $shippingMethodId) {\n      ... on Order { id }\n      ... on ErrorResult { errorCode message }\n    }\n  }\n": types.SetOrderShippingMethodDocument,
    "\n  mutation TransitionOrderToState($state: String!) {\n    transitionOrderToState(state: $state) {\n      ... on Order { id state }\n      ... on ErrorResult { errorCode message }\n    }\n  }\n": types.TransitionOrderToStateDocument,
    "\n  mutation AddPaymentToOrder($input: PaymentInput!) {\n    addPaymentToOrder(input: $input) {\n      ... on Order {\n        id\n        state\n        payments { id state metadata }\n      }\n      ... on ErrorResult { errorCode message }\n    }\n  }\n": types.AddPaymentToOrderDocument,
    "\n  mutation ShipSaleOrder($input: ShipSaleOrderInput!) {\n    shipSaleOrder(input: $input) {\n      id\n      state\n      fulfillments {\n        id\n        state\n        method\n        trackingCode\n      }\n    }\n  }\n": types.ShipSaleOrderDocument,
    "\n  mutation ConfirmPayPalPayment($paypalOrderId: String!) {\n    confirmPayPalPayment(paypalOrderId: $paypalOrderId) {\n      id\n      code\n      state\n      totalWithTax\n      currencyCode\n    }\n  }\n": types.ConfirmPayPalPaymentDocument,
    "\n  query GetFacets {\n    facets {\n      items {\n        id\n        code\n        name\n        values {\n          id\n          code\n          name\n        }\n      }\n    }\n  }\n": types.GetFacetsDocument,
    "\n  query SearchListings($input: SearchInput!) {\n    search(input: $input) {\n      totalItems\n      items {\n        productId\n        productName\n        slug\n        productAsset { preview }\n        priceWithTax {\n          ... on SinglePrice { value }\n          ... on PriceRange { min max }\n        }\n        currencyCode\n        facetValueIds\n      }\n      facetValues {\n        count\n        facetValue {\n          id\n          code\n          name\n          facet { id code name }\n        }\n      }\n    }\n  }\n": types.SearchListingsDocument,
    "\n  query GetProducts($options: ProductListOptions) {\n    products(options: $options) {\n      totalItems\n      items {\n        id\n        name\n        slug\n        description\n        featuredAsset { preview }\n        variants {\n          id\n          price\n          currencyCode\n        }\n        customFields {\n          rcClass\n          driveType\n          condition\n          surfaceType\n          brand\n          model\n        }\n      }\n    }\n  }\n": types.GetProductsDocument,
    "\n  query GetProduct($slug: String!) {\n    product(slug: $slug) {\n      id\n      name\n      slug\n      description\n      assets { preview }\n      featuredAsset { preview }\n      variants {\n        id\n        price\n        currencyCode\n        stockLevel\n      }\n      customFields {\n        rcClass\n        driveType\n        condition\n        surfaceType\n        brand\n        model\n      }\n    }\n  }\n": types.GetProductDocument,
    "\n  query MyGarage {\n    myGarage {\n      id\n      name\n      brand\n      model\n      rcClass\n      driveType\n      year\n      notes\n      imageUrl\n      listingProductId\n      setupSheets {\n        id\n        trackName\n        trackDate\n        motor\n        esc\n        battery\n        servo\n        frontTireBrand\n        frontTireCompound\n        rearTireBrand\n        rearTireCompound\n        pinion\n        spur\n        suspensionNotes\n        generalNotes\n      }\n    }\n  }\n": types.MyGarageDocument,
    "\n  query PublicGarage($customerId: ID!) {\n    publicGarage(customerId: $customerId) {\n      id\n      name\n      brand\n      model\n      rcClass\n      driveType\n      year\n      imageUrl\n      listingProductId\n      setupSheets {\n        id\n        trackName\n        trackDate\n      }\n    }\n  }\n": types.PublicGarageDocument,
    "\n  query ActiveCustomer {\n    activeCustomer {\n      id\n      firstName\n      lastName\n      emailAddress\n      customFields {\n        paypalEmail\n        bio\n        location\n      }\n    }\n  }\n": types.ActiveCustomerDocument,
    "\n  query MyListings {\n    myListings {\n      id\n      name\n      slug\n      variants { id price currencyCode }\n      customFields {\n        condition\n        rcClass\n        driveType\n        brand\n        model\n      }\n    }\n  }\n": types.MyListingsDocument,
    "\n  query ActiveOrder {\n    activeOrder {\n      id\n      code\n      state\n      totalWithTax\n      currencyCode\n      lines {\n        id\n        quantity\n        unitPriceWithTax\n        productVariant {\n          id\n          name\n          product {\n            name\n            featuredAsset { preview }\n            customFields { sellerPaypalEmail }\n          }\n        }\n      }\n    }\n  }\n": types.ActiveOrderDocument,
    "\n  query EligibleShippingMethods {\n    eligibleShippingMethods {\n      id\n      name\n      priceWithTax\n      description\n    }\n  }\n": types.EligibleShippingMethodsDocument,
    "\n  query CustomerOrders {\n    activeCustomer {\n      orders {\n        totalItems\n        items {\n          id\n          code\n          state\n          orderPlacedAt\n          totalWithTax\n          currencyCode\n          lines {\n            id\n            quantity\n            unitPriceWithTax\n            productVariant {\n              id\n              name\n              product { name }\n            }\n          }\n        }\n      }\n    }\n  }\n": types.CustomerOrdersDocument,
    "\n  query MySales {\n    mySales {\n      id\n      code\n      state\n      orderPlacedAt\n      totalWithTax\n      currencyCode\n      customer {\n        firstName\n        lastName\n        emailAddress\n      }\n      lines {\n        id\n        quantity\n        unitPriceWithTax\n        productVariant {\n          name\n          product { name }\n        }\n      }\n      fulfillments {\n        id\n        state\n        method\n        trackingCode\n      }\n    }\n  }\n": types.MySalesDocument,
    "\n  query AllGarages {\n    allGarages {\n      customerId\n      customerName\n      carCount\n      previewCars {\n        id\n        name\n        brand\n        rcClass\n        driveType\n        setupSheets { id }\n      }\n    }\n  }\n": types.AllGaragesDocument,
    "\n  query PublicListings($customerId: ID!) {\n    publicListings(customerId: $customerId) {\n      id\n      name\n      slug\n      variants { id price currencyCode }\n      customFields { rcClass condition brand model }\n    }\n  }\n": types.PublicListingsDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation Login($username: String!, $password: String!) {\n    login(username: $username, password: $password) {\n      ... on CurrentUser {\n        id\n        identifier\n      }\n      ... on InvalidCredentialsError {\n        errorCode\n        message\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation Login($username: String!, $password: String!) {\n    login(username: $username, password: $password) {\n      ... on CurrentUser {\n        id\n        identifier\n      }\n      ... on InvalidCredentialsError {\n        errorCode\n        message\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation Logout {\n    logout { success }\n  }\n"): (typeof documents)["\n  mutation Logout {\n    logout { success }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation Register($input: RegisterCustomerInput!) {\n    registerCustomerAccount(input: $input) {\n      ... on Success {\n        success\n      }\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation Register($input: RegisterCustomerInput!) {\n    registerCustomerAccount(input: $input) {\n      ... on Success {\n        success\n      }\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation AddItemToOrder($variantId: ID!, $quantity: Int!) {\n    addItemToOrder(productVariantId: $variantId, quantity: $quantity) {\n      ... on Order {\n        id\n        totalWithTax\n        lines { id quantity }\n      }\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation AddItemToOrder($variantId: ID!, $quantity: Int!) {\n    addItemToOrder(productVariantId: $variantId, quantity: $quantity) {\n      ... on Order {\n        id\n        totalWithTax\n        lines { id quantity }\n      }\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation AddGarageCar($input: AddGarageCarInput!) {\n    addGarageCar(input: $input) {\n      id\n      name\n      brand\n      model\n      rcClass\n      driveType\n      year\n    }\n  }\n"): (typeof documents)["\n  mutation AddGarageCar($input: AddGarageCarInput!) {\n    addGarageCar(input: $input) {\n      id\n      name\n      brand\n      model\n      rcClass\n      driveType\n      year\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateGarageCar($input: UpdateGarageCarInput!) {\n    updateGarageCar(input: $input) {\n      id\n      name\n      brand\n      model\n      rcClass\n      driveType\n      year\n      notes\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateGarageCar($input: UpdateGarageCarInput!) {\n    updateGarageCar(input: $input) {\n      id\n      name\n      brand\n      model\n      rcClass\n      driveType\n      year\n      notes\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation RemoveGarageCar($id: ID!) {\n    removeGarageCar(id: $id)\n  }\n"): (typeof documents)["\n  mutation RemoveGarageCar($id: ID!) {\n    removeGarageCar(id: $id)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation AddSetupSheet($input: AddSetupSheetInput!) {\n    addSetupSheet(input: $input) {\n      id\n      trackName\n      trackDate\n    }\n  }\n"): (typeof documents)["\n  mutation AddSetupSheet($input: AddSetupSheetInput!) {\n    addSetupSheet(input: $input) {\n      id\n      trackName\n      trackDate\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateSetupSheet($input: UpdateSetupSheetInput!) {\n    updateSetupSheet(input: $input) {\n      id\n      trackName\n      trackDate\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateSetupSheet($input: UpdateSetupSheetInput!) {\n    updateSetupSheet(input: $input) {\n      id\n      trackName\n      trackDate\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation RemoveSetupSheet($id: ID!) {\n    removeSetupSheet(id: $id)\n  }\n"): (typeof documents)["\n  mutation RemoveSetupSheet($id: ID!) {\n    removeSetupSheet(id: $id)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateListing($input: CreateListingInput!) {\n    createListing(input: $input) {\n      id\n      name\n      slug\n    }\n  }\n"): (typeof documents)["\n  mutation CreateListing($input: CreateListingInput!) {\n    createListing(input: $input) {\n      id\n      name\n      slug\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateListing($input: UpdateListingInput!) {\n    updateListing(input: $input) {\n      id\n      name\n      slug\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateListing($input: UpdateListingInput!) {\n    updateListing(input: $input) {\n      id\n      name\n      slug\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteListing($id: ID!) {\n    deleteListing(id: $id)\n  }\n"): (typeof documents)["\n  mutation DeleteListing($id: ID!) {\n    deleteListing(id: $id)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation SetOrderShippingAddress($input: CreateAddressInput!) {\n    setOrderShippingAddress(input: $input) {\n      ... on Order { id }\n      ... on ErrorResult { errorCode message }\n    }\n  }\n"): (typeof documents)["\n  mutation SetOrderShippingAddress($input: CreateAddressInput!) {\n    setOrderShippingAddress(input: $input) {\n      ... on Order { id }\n      ... on ErrorResult { errorCode message }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation SetOrderShippingMethod($shippingMethodId: [ID!]!) {\n    setOrderShippingMethod(shippingMethodId: $shippingMethodId) {\n      ... on Order { id }\n      ... on ErrorResult { errorCode message }\n    }\n  }\n"): (typeof documents)["\n  mutation SetOrderShippingMethod($shippingMethodId: [ID!]!) {\n    setOrderShippingMethod(shippingMethodId: $shippingMethodId) {\n      ... on Order { id }\n      ... on ErrorResult { errorCode message }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation TransitionOrderToState($state: String!) {\n    transitionOrderToState(state: $state) {\n      ... on Order { id state }\n      ... on ErrorResult { errorCode message }\n    }\n  }\n"): (typeof documents)["\n  mutation TransitionOrderToState($state: String!) {\n    transitionOrderToState(state: $state) {\n      ... on Order { id state }\n      ... on ErrorResult { errorCode message }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation AddPaymentToOrder($input: PaymentInput!) {\n    addPaymentToOrder(input: $input) {\n      ... on Order {\n        id\n        state\n        payments { id state metadata }\n      }\n      ... on ErrorResult { errorCode message }\n    }\n  }\n"): (typeof documents)["\n  mutation AddPaymentToOrder($input: PaymentInput!) {\n    addPaymentToOrder(input: $input) {\n      ... on Order {\n        id\n        state\n        payments { id state metadata }\n      }\n      ... on ErrorResult { errorCode message }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation ShipSaleOrder($input: ShipSaleOrderInput!) {\n    shipSaleOrder(input: $input) {\n      id\n      state\n      fulfillments {\n        id\n        state\n        method\n        trackingCode\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation ShipSaleOrder($input: ShipSaleOrderInput!) {\n    shipSaleOrder(input: $input) {\n      id\n      state\n      fulfillments {\n        id\n        state\n        method\n        trackingCode\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation ConfirmPayPalPayment($paypalOrderId: String!) {\n    confirmPayPalPayment(paypalOrderId: $paypalOrderId) {\n      id\n      code\n      state\n      totalWithTax\n      currencyCode\n    }\n  }\n"): (typeof documents)["\n  mutation ConfirmPayPalPayment($paypalOrderId: String!) {\n    confirmPayPalPayment(paypalOrderId: $paypalOrderId) {\n      id\n      code\n      state\n      totalWithTax\n      currencyCode\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetFacets {\n    facets {\n      items {\n        id\n        code\n        name\n        values {\n          id\n          code\n          name\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetFacets {\n    facets {\n      items {\n        id\n        code\n        name\n        values {\n          id\n          code\n          name\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query SearchListings($input: SearchInput!) {\n    search(input: $input) {\n      totalItems\n      items {\n        productId\n        productName\n        slug\n        productAsset { preview }\n        priceWithTax {\n          ... on SinglePrice { value }\n          ... on PriceRange { min max }\n        }\n        currencyCode\n        facetValueIds\n      }\n      facetValues {\n        count\n        facetValue {\n          id\n          code\n          name\n          facet { id code name }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query SearchListings($input: SearchInput!) {\n    search(input: $input) {\n      totalItems\n      items {\n        productId\n        productName\n        slug\n        productAsset { preview }\n        priceWithTax {\n          ... on SinglePrice { value }\n          ... on PriceRange { min max }\n        }\n        currencyCode\n        facetValueIds\n      }\n      facetValues {\n        count\n        facetValue {\n          id\n          code\n          name\n          facet { id code name }\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetProducts($options: ProductListOptions) {\n    products(options: $options) {\n      totalItems\n      items {\n        id\n        name\n        slug\n        description\n        featuredAsset { preview }\n        variants {\n          id\n          price\n          currencyCode\n        }\n        customFields {\n          rcClass\n          driveType\n          condition\n          surfaceType\n          brand\n          model\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetProducts($options: ProductListOptions) {\n    products(options: $options) {\n      totalItems\n      items {\n        id\n        name\n        slug\n        description\n        featuredAsset { preview }\n        variants {\n          id\n          price\n          currencyCode\n        }\n        customFields {\n          rcClass\n          driveType\n          condition\n          surfaceType\n          brand\n          model\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetProduct($slug: String!) {\n    product(slug: $slug) {\n      id\n      name\n      slug\n      description\n      assets { preview }\n      featuredAsset { preview }\n      variants {\n        id\n        price\n        currencyCode\n        stockLevel\n      }\n      customFields {\n        rcClass\n        driveType\n        condition\n        surfaceType\n        brand\n        model\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetProduct($slug: String!) {\n    product(slug: $slug) {\n      id\n      name\n      slug\n      description\n      assets { preview }\n      featuredAsset { preview }\n      variants {\n        id\n        price\n        currencyCode\n        stockLevel\n      }\n      customFields {\n        rcClass\n        driveType\n        condition\n        surfaceType\n        brand\n        model\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query MyGarage {\n    myGarage {\n      id\n      name\n      brand\n      model\n      rcClass\n      driveType\n      year\n      notes\n      imageUrl\n      listingProductId\n      setupSheets {\n        id\n        trackName\n        trackDate\n        motor\n        esc\n        battery\n        servo\n        frontTireBrand\n        frontTireCompound\n        rearTireBrand\n        rearTireCompound\n        pinion\n        spur\n        suspensionNotes\n        generalNotes\n      }\n    }\n  }\n"): (typeof documents)["\n  query MyGarage {\n    myGarage {\n      id\n      name\n      brand\n      model\n      rcClass\n      driveType\n      year\n      notes\n      imageUrl\n      listingProductId\n      setupSheets {\n        id\n        trackName\n        trackDate\n        motor\n        esc\n        battery\n        servo\n        frontTireBrand\n        frontTireCompound\n        rearTireBrand\n        rearTireCompound\n        pinion\n        spur\n        suspensionNotes\n        generalNotes\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query PublicGarage($customerId: ID!) {\n    publicGarage(customerId: $customerId) {\n      id\n      name\n      brand\n      model\n      rcClass\n      driveType\n      year\n      imageUrl\n      listingProductId\n      setupSheets {\n        id\n        trackName\n        trackDate\n      }\n    }\n  }\n"): (typeof documents)["\n  query PublicGarage($customerId: ID!) {\n    publicGarage(customerId: $customerId) {\n      id\n      name\n      brand\n      model\n      rcClass\n      driveType\n      year\n      imageUrl\n      listingProductId\n      setupSheets {\n        id\n        trackName\n        trackDate\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query ActiveCustomer {\n    activeCustomer {\n      id\n      firstName\n      lastName\n      emailAddress\n      customFields {\n        paypalEmail\n        bio\n        location\n      }\n    }\n  }\n"): (typeof documents)["\n  query ActiveCustomer {\n    activeCustomer {\n      id\n      firstName\n      lastName\n      emailAddress\n      customFields {\n        paypalEmail\n        bio\n        location\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query MyListings {\n    myListings {\n      id\n      name\n      slug\n      variants { id price currencyCode }\n      customFields {\n        condition\n        rcClass\n        driveType\n        brand\n        model\n      }\n    }\n  }\n"): (typeof documents)["\n  query MyListings {\n    myListings {\n      id\n      name\n      slug\n      variants { id price currencyCode }\n      customFields {\n        condition\n        rcClass\n        driveType\n        brand\n        model\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query ActiveOrder {\n    activeOrder {\n      id\n      code\n      state\n      totalWithTax\n      currencyCode\n      lines {\n        id\n        quantity\n        unitPriceWithTax\n        productVariant {\n          id\n          name\n          product {\n            name\n            featuredAsset { preview }\n            customFields { sellerPaypalEmail }\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query ActiveOrder {\n    activeOrder {\n      id\n      code\n      state\n      totalWithTax\n      currencyCode\n      lines {\n        id\n        quantity\n        unitPriceWithTax\n        productVariant {\n          id\n          name\n          product {\n            name\n            featuredAsset { preview }\n            customFields { sellerPaypalEmail }\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query EligibleShippingMethods {\n    eligibleShippingMethods {\n      id\n      name\n      priceWithTax\n      description\n    }\n  }\n"): (typeof documents)["\n  query EligibleShippingMethods {\n    eligibleShippingMethods {\n      id\n      name\n      priceWithTax\n      description\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query CustomerOrders {\n    activeCustomer {\n      orders {\n        totalItems\n        items {\n          id\n          code\n          state\n          orderPlacedAt\n          totalWithTax\n          currencyCode\n          lines {\n            id\n            quantity\n            unitPriceWithTax\n            productVariant {\n              id\n              name\n              product { name }\n            }\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query CustomerOrders {\n    activeCustomer {\n      orders {\n        totalItems\n        items {\n          id\n          code\n          state\n          orderPlacedAt\n          totalWithTax\n          currencyCode\n          lines {\n            id\n            quantity\n            unitPriceWithTax\n            productVariant {\n              id\n              name\n              product { name }\n            }\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query MySales {\n    mySales {\n      id\n      code\n      state\n      orderPlacedAt\n      totalWithTax\n      currencyCode\n      customer {\n        firstName\n        lastName\n        emailAddress\n      }\n      lines {\n        id\n        quantity\n        unitPriceWithTax\n        productVariant {\n          name\n          product { name }\n        }\n      }\n      fulfillments {\n        id\n        state\n        method\n        trackingCode\n      }\n    }\n  }\n"): (typeof documents)["\n  query MySales {\n    mySales {\n      id\n      code\n      state\n      orderPlacedAt\n      totalWithTax\n      currencyCode\n      customer {\n        firstName\n        lastName\n        emailAddress\n      }\n      lines {\n        id\n        quantity\n        unitPriceWithTax\n        productVariant {\n          name\n          product { name }\n        }\n      }\n      fulfillments {\n        id\n        state\n        method\n        trackingCode\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query AllGarages {\n    allGarages {\n      customerId\n      customerName\n      carCount\n      previewCars {\n        id\n        name\n        brand\n        rcClass\n        driveType\n        setupSheets { id }\n      }\n    }\n  }\n"): (typeof documents)["\n  query AllGarages {\n    allGarages {\n      customerId\n      customerName\n      carCount\n      previewCars {\n        id\n        name\n        brand\n        rcClass\n        driveType\n        setupSheets { id }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query PublicListings($customerId: ID!) {\n    publicListings(customerId: $customerId) {\n      id\n      name\n      slug\n      variants { id price currencyCode }\n      customFields { rcClass condition brand model }\n    }\n  }\n"): (typeof documents)["\n  query PublicListings($customerId: ID!) {\n    publicListings(customerId: $customerId) {\n      id\n      name\n      slug\n      variants { id price currencyCode }\n      customFields { rcClass condition brand model }\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;