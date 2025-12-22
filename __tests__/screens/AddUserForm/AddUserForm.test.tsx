import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { AddUserForm } from '../../../src/components/AddUserForm/AddUserForm';

describe('AddUserForm (no mocking useUserForm)', () => {
  const onClose = jest.fn();
  const onSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should match snapshot', () => {
    const tree = render(
      <AddUserForm onClose={onClose} onSubmit={onSubmit} />,
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('should call onClose when close button is pressed', () => {
    const { getByText } = render(
      <AddUserForm onClose={onClose} onSubmit={onSubmit} />,
    );
    fireEvent.press(getByText('×'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should submit form with entered values', async () => {
    const { getByText, getByTestId } = render(
      <AddUserForm onClose={onClose} onSubmit={onSubmit} />,
    );

    fireEvent.changeText(getByTestId('first_name'), 'Shreya');
    fireEvent.changeText(getByTestId('last_name'), 'Test');
    fireEvent.changeText(getByTestId('email'), 'test@test.com');
    // Submit
    fireEvent.press(getByText('Create User'));
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith({
      firstName: 'Shreya',
      lastName: 'Test',
      email: 'test@test.com',
      role: 'Admin',
    });
  });

  it('should change role to Manager when Manager role button is pressed', () => {
    const { getByTestId, getByText } = render(
      <AddUserForm onClose={onClose} onSubmit={onSubmit} />,
    );

    fireEvent.changeText(getByTestId('first_name'), 'Shreya');
    fireEvent.changeText(getByTestId('last_name'), 'Test');

    fireEvent.press(getByTestId('admin'));
    fireEvent.press(getByTestId('manager'));


    fireEvent.press(getByText('Create User'));
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith({
      firstName: 'Shreya',
      lastName: 'Test',
      email: null,
      role: 'Manager',
    });
  });
});
