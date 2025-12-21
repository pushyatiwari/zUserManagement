import awsconfig from './aws-exports';
import { LIST_ZELLER_CUSTOMERS } from './queries';

type ListZellerCustomersResponse = {
  data?: {
    listZellerCustomers?: {
      items?: Array<{
        id: string;
        name: string;
        role: 'Admin' | 'Manager';
        email?: string | null;
      }> | null;
    } | null;
  };
  errors?: Array<{ message: string }>;
};

export async function fetchZellerCustomers() {
  const res = await fetch(awsconfig.aws_appsync_graphqlEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': awsconfig.aws_appsync_apiKey,
    },
    body: JSON.stringify({
      query: LIST_ZELLER_CUSTOMERS,
      variables: {},
    }),
  });

  const json: ListZellerCustomersResponse = await res.json();

  if (!res.ok || json.errors?.length) {
    const message =
      json.errors?.[0]?.message ?? `Request failed: ${res.status}`;
    throw new Error(message);
  }

  return json.data?.listZellerCustomers?.items ?? [];
}
