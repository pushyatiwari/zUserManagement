// graphql query
export const LIST_ZELLER_CUSTOMERS = `
  query listZellerCustomersQuery {
    listZellerCustomers {
      items {
        id
        name
        role
        email
      }
    }
  }
`;
