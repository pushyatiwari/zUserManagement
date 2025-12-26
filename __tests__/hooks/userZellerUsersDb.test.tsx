import { renderHook, act, waitFor } from '@testing-library/react-native';

import {
  initDB,
  saveUsers,
  fetchUsersFromDB,
  insertUser,
} from '../../src/db/zellerDb';
import { fetchZellerCustomers } from '../../src/api/zellerApi';
import { useZellerUsersDb } from '../../src/hooks/useZellerUsersDb';

jest.mock('../../src/api/zellerApi', () => ({
  fetchZellerCustomers: jest.fn(),
}));

jest.mock('../../src/db/zellerDb', () => ({
  initDB: jest.fn(),
  saveUsers: jest.fn(),
  fetchUsersFromDB: jest.fn(),
  insertUser: jest.fn(),
}));

describe('useZellerUsersDb', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('bootstrap loads users from DB when DB has data', async () => {
    (initDB as jest.Mock).mockResolvedValue(undefined);
    (fetchUsersFromDB as jest.Mock).mockResolvedValue([
      {
        id: '1',
        firstName: 'test',
        lastName: 'user',
        email: null,
        role: 'Admin',
      },
    ]);

    const { result } = renderHook(() => useZellerUsersDb());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(initDB).toHaveBeenCalledTimes(1);
    expect(fetchUsersFromDB).toHaveBeenCalledTimes(1);
    expect(fetchZellerCustomers).not.toHaveBeenCalled();
    expect(saveUsers).not.toHaveBeenCalled();
    expect(result.current.users).toEqual([
      { id: '1', name: 'test user', role: 'Admin', email: undefined },
    ]);
    expect(result.current.error).toBeNull();
  });

  it('bootstrap syncs from API when DB is empty', async () => {
    (initDB as jest.Mock).mockResolvedValue(undefined);
    (fetchUsersFromDB as jest.Mock)
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([
        {
          id: 'a1',
          firstName: 'A',
          lastName: 'B',
          email: 'a@test.com',
          role: 'Manager',
        },
      ]);

    (fetchZellerCustomers as jest.Mock).mockResolvedValue([
      { id: 'a1', name: 'A B', email: 'a@test.com', role: 'Manager' },
    ]);

    const { result } = renderHook(() => useZellerUsersDb());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(fetchUsersFromDB).toHaveBeenCalledTimes(2);
    expect(fetchZellerCustomers).toHaveBeenCalledTimes(1);
    expect(saveUsers).toHaveBeenCalledTimes(1);
    expect(result.current.users).toEqual([
      { id: 'a1', name: 'A B', role: 'Manager', email: 'a@test.com' },
    ]);
  });

  it('addUser inserts trimmed user and then reads from DB', async () => {
    const nowSpy = jest.spyOn(Date, 'now').mockReturnValue(123);
    const randSpy = jest.spyOn(Math, 'random').mockReturnValue(0.5);

    (initDB as jest.Mock).mockResolvedValue(undefined);
    (insertUser as jest.Mock).mockResolvedValue(undefined);
    (fetchUsersFromDB as jest.Mock).mockResolvedValue([
      {
        id: 'local_123_8',
        firstName: 'Test',
        lastName: 'User',
        email: null,
        role: 'Admin',
      },
    ]);

    const { result } = renderHook(() => useZellerUsersDb());

    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.addUser({
        firstName: '  Test  ',
        lastName: '  User ',
        email: '   ',
        role: 'Admin',
      });
    });

    expect(initDB).toHaveBeenCalledTimes(2);
    expect(insertUser).toHaveBeenCalledTimes(1);

    const inserted = (insertUser as jest.Mock).mock.calls[0][0];
    expect(inserted.firstName).toBe('Test');
    expect(inserted.lastName).toBe('User');
    expect(inserted.email).toBeNull();
    expect(inserted.role).toBe('Admin');
    expect(inserted.id).toBe('local_123_8');

    expect(fetchUsersFromDB).toHaveBeenCalled();
    expect(result.current.users).toEqual([
      { id: 'local_123_8', name: 'Test User', role: 'Admin', email: undefined },
    ]);

    nowSpy.mockRestore();
    randSpy.mockRestore();
  });

  it('bootstrap sets error when initDB fails', async () => {
    (initDB as jest.Mock).mockRejectedValue(new Error('db error'));

    const { result } = renderHook(() => useZellerUsersDb());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBe('db error');
    expect(result.current.users).toEqual([]);
  });
});
