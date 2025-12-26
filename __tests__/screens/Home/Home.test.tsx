import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import HomeScreen from '../../../src/screens/Home/Home';

jest.mock('react-native-heroicons/outline', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return {
    MagnifyingGlassIcon: () => <Text>SearchIcon</Text>,
    XMarkIcon: () => <Text>CloseIcon</Text>,
  };
});

jest.mock('react-native-pager-view', () => {
  const React = require('react');
  const { View } = require('react-native');

  const PagerView = React.forwardRef(
    ({ children, initialPage = 0, onPageSelected }: any, ref: any) => {
      const pages = React.Children.toArray(children);
      const [pageIndex, setPageIndex] = React.useState(initialPage);

      React.useImperativeHandle(ref, () => ({
        setPage: (i: number) => {
          setPageIndex(i);
          onPageSelected?.({ nativeEvent: { position: i } });
        },
      }));

      return <View testID="pager-view">{pages[pageIndex] ?? null}</View>;
    },
  );

  return PagerView;
});

const mockReload = jest.fn();
const mockAddUser = jest.fn();

jest.mock('../../../src/hooks/useZellerUsersDb', () => ({
  useZellerUsersDb: () => ({
    users: [
      { id: '1', name: 'Brad Pitt', role: 'Admin' },
      { id: '2', name: 'Alice Johnson', role: 'Manager' },
    ],
    loading: false,
    error: null,
    reload: mockReload,
    addUser: mockAddUser,
  }),
}));

describe('HomeScreen', () => {
  it('filters users by search text', () => {
    const { getByTestId, queryByText } = render(<HomeScreen />);

    expect(queryByText('Brad Pitt')).toBeTruthy();
    expect(queryByText('Alice Johnson')).toBeTruthy();

    try {
      fireEvent.press(getByTestId('search-button'));
    } catch (e: any) {
      console.log(e?.errors ?? e);
      throw e;
    }

    fireEvent.changeText(getByTestId('search-input'), 'brad');

    expect(queryByText('Brad Pitt')).toBeTruthy();
    expect(queryByText('Alice Johnson')).toBeNull();
  });

  it('opens add user modal', () => {
    const { getByTestId } = render(<HomeScreen />);

    fireEvent.press(getByTestId('add_user_btn'));
    expect(getByTestId('first_name')).toBeTruthy();
    expect(getByTestId('last_name')).toBeTruthy();
    expect(getByTestId('create_user')).toBeTruthy();    
  });

  it('switches to Admin tab using the first Admin tab button', () => {
    const { getAllByText, queryByText } = render(<HomeScreen />);

    expect(queryByText('Brad Pitt')).toBeTruthy();
    expect(queryByText('Alice Johnson')).toBeTruthy();

    fireEvent.press(getAllByText('Admin')[0]);

    expect(queryByText('Brad Pitt')).toBeTruthy();
    expect(queryByText('Alice Johnson')).toBeNull();
  });
  
});
