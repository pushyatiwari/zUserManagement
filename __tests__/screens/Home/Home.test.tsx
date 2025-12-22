import React, { act } from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import HomeScreen from '../../../src/screens/Home/Home';
import { useZellerUsersDb } from '../../../src/hooks/useZellerUsersDb';

jest.mock('../../../src/hooks/useZellerUsersDb', () => ({
  useZellerUsersDb: jest.fn(),
}));

const mockUsers = [
  { id: '1', name: 'Barbara Streider', role: 'Admin' },
  { id: '2', name: 'Brad Herman', role: 'Manager' },
  { id: '3', name: 'Camille Cummerata', role: 'Manager' },
  { id: '4', name: '', role: 'Manager' },
];

type MockHookOptions = {
  users?: typeof mockUsers;
  loading?: boolean;
  error?: string | null;
  reload?: jest.Mock;
  addUser?: jest.Mock;
};

function mockUsersHook({
  users = mockUsers,
  loading = false,
  error = null,
  reload = jest.fn(),
  addUser = jest.fn(),
}: MockHookOptions = {}) {
  (useZellerUsersDb as jest.Mock).mockReturnValue({
    users,
    loading,
    error,
    reload,
    addUser,
  });
}

describe('HomeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should be able to render all tabs', () => {
    mockUsersHook();
    const { getByTestId } = render(<HomeScreen />);
    expect(getByTestId('all_id')).toBeTruthy();
    expect(getByTestId('admin_id')).toBeTruthy();
    expect(getByTestId('manager_id')).toBeTruthy();
  });

  it('should be able to render user names from hook', () => {
    mockUsersHook();
    const { getByText } = render(<HomeScreen />);
    expect(getByText('Barbara Streider')).toBeTruthy();
    expect(getByText('Brad Herman')).toBeTruthy();
    expect(getByText('Camille Cummerata')).toBeTruthy();
  });

  it('shows error message when hook returns error', () => {
    mockUsersHook({ error: 'Failed to load users' });
    const { getByText } = render(<HomeScreen />);
    expect(getByText('Failed to load users')).toBeTruthy();
  });

  it('should be able to filter users when Admin tab is clicked', () => {
    mockUsersHook();
    const { getByTestId, getByText, queryByText } = render(<HomeScreen />);
    fireEvent.press(getByTestId('admin_id'));

    expect(getByText('Barbara Streider')).toBeTruthy();
    expect(queryByText('Brad Herman')).toBeNull();
    expect(queryByText('Camille Cummerata')).toBeNull();
  });

  it('should be able to filter users when Manager tab is clicked', () => {
    mockUsersHook();
    const { getByTestId, getByText, queryByText } = render(<HomeScreen />);
    fireEvent.press(getByTestId('manager_id'));

    expect(getByText('Brad Herman')).toBeTruthy();
    expect(getByText('Camille Cummerata')).toBeTruthy();
    expect(queryByText('Barbara Streider')).toBeNull();
  });

  it('should be able to filter users by search text', () => {
    mockUsersHook();
    const { getByTestId, getByText, queryByText } = render(<HomeScreen />);
    fireEvent.press(getByTestId('search-button'));
    fireEvent.changeText(getByTestId('search-input'), 'brad');

    expect(getByText('Brad Herman')).toBeTruthy();
    expect(queryByText('Barbara Streider')).toBeNull();
    expect(queryByText('Camille Cummerata')).toBeNull();
  });
  it('should be able to render add user form', async () => {
    const addUserMock = jest.fn();
    mockUsersHook({ addUser: addUserMock });
    const { getByTestId } = render(<HomeScreen />);
    fireEvent.press(getByTestId('add_user_btn'));
    fireEvent.changeText(getByTestId('first_name'), 'test');
    fireEvent.changeText(getByTestId('last_name'), 'user');
    await act(async () => {
      fireEvent.press(getByTestId('create_user'));
    });
    expect(addUserMock).toHaveBeenCalledTimes(1);
  });
});
