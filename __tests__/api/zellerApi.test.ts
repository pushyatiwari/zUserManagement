import { fetchZellerCustomers } from '../../src/api/zellerApi';

jest.mock('../../src/api/queries', () => ({
  LIST_ZELLER_CUSTOMERS:
    'query listZellerCustomers { listZellerCustomers { items { id name role email } } }',
}));

describe('fetchZellerCustomers', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    globalThis.fetch = jest.fn() as any;
  });

  it('returns items on success', async () => {
    const items = [
      { id: '1', name: 'Barbara', role: 'Admin', email: null },
      { id: '2', name: 'Brad', role: 'Manager', email: 'brad@test.com' },
    ];

    (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({
        data: { listZellerCustomers: { items } },
      }),
    });

    await expect(fetchZellerCustomers()).resolves.toEqual(items);
  });

  it('returns empty array when items is missing', async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({
        data: { listZellerCustomers: { items: null } },
      }),
    });

    await expect(fetchZellerCustomers()).resolves.toEqual([]);
  });

  it('throws when response is not ok', async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({}),
    });

    await expect(fetchZellerCustomers()).rejects.toThrow('Request failed: 500');
  });

  it('throws graphql error message when present', async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({
        errors: [{ message: 'Bad API key' }],
      }),
    });

    await expect(fetchZellerCustomers()).rejects.toThrow('Bad API key');
  });
});
