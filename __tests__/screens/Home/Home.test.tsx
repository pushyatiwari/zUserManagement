import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import HomeScreen from '../../../src/screens/Home/Home';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View } from 'react-native';

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

jest.mock('react-native/Libraries/Lists/VirtualizedList', () => {
  const React = require('react');
  const { View } = require('react-native');

  const VirtualizedList = ({ data = [], renderItem }: any) => (
    <View>
      {data.map((item: any, index: number) => (
        <View key={item?.id ?? String(index)}>
          {renderItem({ item, index })}
        </View>
      ))}
    </View>
  );

  return { VirtualizedList };
});

const mockReload = jest.fn();
const mockAddUser = jest.fn();

const renderWithProviders = (ui: React.ReactElement) =>
  render(
    <SafeAreaProvider
      initialMetrics={{
        frame: { x: 0, y: 0, width: 390, height: 844 },
        insets: { top: 44, bottom: 34, left: 0, right: 0 },
      }}
    >
      <View style={{ flex: 1 }}>{ui}</View>
    </SafeAreaProvider>,
  );

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
  it('filters users by search text', async () => {
    const { getByTestId, queryByText } = renderWithProviders(<HomeScreen />);

    await waitFor(() => {
      expect(queryByText('Brad Pitt')).not.toBeNull();
      expect(queryByText('Alice Johnson')).not.toBeNull();
    });

    fireEvent.press(getByTestId('search-button'));
    fireEvent.changeText(getByTestId('search-input'), 'brad');

    await waitFor(() => {
      expect(queryByText('Brad Pitt')).not.toBeNull();
      expect(queryByText('Alice Johnson')).toBeNull();
    });
  });

  it('opens add user modal', async () => {
    const { getByTestId, queryByTestId } = renderWithProviders(<HomeScreen />);

    await waitFor(() => {
      expect(queryByTestId('add_user_btn')).not.toBeNull();
    });

    fireEvent.press(getByTestId('add_user_btn'));

    await waitFor(() => {
      expect(queryByTestId('first_name')).not.toBeNull();
      expect(queryByTestId('last_name')).not.toBeNull();
      expect(queryByTestId('create_user')).not.toBeNull();
    });
  });

  it('switches to Admin tab using the first Admin tab button', async () => {
    const { getAllByText, queryByText } = renderWithProviders(<HomeScreen />);

    await waitFor(() => {
      expect(queryByText('Brad Pitt')).not.toBeNull();
      expect(queryByText('Alice Johnson')).not.toBeNull();
    });

    fireEvent.press(getAllByText('Admin')[0]);

    await waitFor(() => {
      expect(queryByText('Brad Pitt')).not.toBeNull();
      expect(queryByText('Alice Johnson')).toBeNull();
    });
  });
});
