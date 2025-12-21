import React from 'react';
import { Text, Button } from 'react-native';
import { render, waitFor, fireEvent } from '@testing-library/react-native';
import { useZellerUsersApi } from '../../src/hooks/useZellerUsersApi';
import { fetchZellerCustomers } from '../../src/api/zellerApi';

jest.mock('../../src/api/zellerApi', () => ({
  fetchZellerCustomers: jest.fn(),
}));

const mockUsers = [
  { id: '1', name: 'Barbara Streider', role: 'Admin' },
  { id: '2', name: 'Brad Herman', role: 'Manager' },
];

function TestComponent() {
  const { users, loading, error, reload } = useZellerUsersApi();

  return (
    <>
      {loading && <Text testID="loading">Loading...</Text>}
      {error && <Text testID="error">{error}</Text>}
      <Text testID="count">{users.length}</Text>
      <Button title="reload" onPress={reload} />
    </>
  );
}

describe('useZellerUsers (without renderHook)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should load users on mount', async () => {
    (fetchZellerCustomers as jest.Mock).mockResolvedValueOnce(mockUsers);
    const { getByTestId } = render(<TestComponent />);
    expect(getByTestId('loading')).toBeTruthy();
    await waitFor(() => expect(getByTestId('count').props.children).toBe(2));
    expect(fetchZellerCustomers).toHaveBeenCalledTimes(1);
  });

  it('should show error when api fails', async () => {
    (fetchZellerCustomers as jest.Mock).mockRejectedValueOnce(
      new Error('fail'),
    );
    const { getByTestId } = render(<TestComponent />);
    await waitFor(() =>
      expect(getByTestId('error').props.children).toBe('Failed to load users'),
    );
  });

  it('should fetch users again when reload is called', async () => {
    (fetchZellerCustomers as jest.Mock)
      .mockResolvedValueOnce(mockUsers)
      .mockResolvedValueOnce([{ id: '9', name: 'New User', role: 'Admin' }]);
    const { getByText, getByTestId } = render(<TestComponent />);
    await waitFor(() => expect(getByTestId('count').props.children).toBe(2));
    fireEvent.press(getByText('reload'));
    await waitFor(() => expect(getByTestId('count').props.children).toBe(1));
    expect(fetchZellerCustomers).toHaveBeenCalledTimes(2);
  });
});
