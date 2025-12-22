import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Field } from '../Field/Field';
import { RoleButton } from '../RoleButton/RoleButton';
import { useAddUserForm } from '../../hooks/useAddUserForm';
import { NewDbUserInput } from '../../db/zellerDb';

type Props = {
  onClose: () => void;
  onSubmit: (values: NewDbUserInput) => Promise<void> | void;
};

export const AddUserForm = ({ onClose, onSubmit }: Props) => {
  const { values, errors, setField, validate } = useAddUserForm({
    firstName: '',
    lastName: '',
    email: '',
    role: 'Admin',
  });

  const handleSubmit = async () => {
    if (!validate()) return;
    await onSubmit({
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email?.trim() ? values.email.trim() : null,
      role: values.role,
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onClose} style={styles.close}>
        <Text style={styles.closeText}>×</Text>
      </TouchableOpacity>

      <Text style={styles.title}>New User</Text>

      <Field
        label="First Name"
        testId="first_name"
        value={values.firstName}
        onChangeText={v => setField('firstName', v)}
        placeholder="First Name"
        error={errors.firstName}
      />

      <Field
        label="Last Name"
        testId="last_name"
        value={values.lastName}
        onChangeText={v => setField('lastName', v)}
        placeholder="Last Name"
        error={errors.lastName}
      />

      <Field
        label="Email"
        testId="email"
        value={values.email ?? ''}
        onChangeText={v => setField('email', v)}
        placeholder="Email"
        error={errors.email}
      />

      <Text style={styles.section}>User Role</Text>

      <View style={styles.roleContainer}>
        <RoleButton
          title="Admin"
          active={values.role === 'Admin'}
          testId="admin"
          onPress={() => setField('role', 'Admin')}
        />
        <RoleButton
          title="Manager"
          testId="manager"
          active={values.role === 'Manager'}
          onPress={() => setField('role', 'Manager')}
        />
      </View>

      <TouchableOpacity style={styles.button} testID='create_user' onPress={handleSubmit}>
        <Text style={styles.buttonText}>Create User</Text>
      </TouchableOpacity>
    </View>
  );
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  close: {
    width: 30,
  },
  closeText: {
    fontSize: 28,
    color: '#2c6bed',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    marginVertical: 20,
  },
  section: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 12,
  },
  roleContainer: {
    flexDirection: 'row',
    backgroundColor: '#f2f2f2',
    borderRadius: 20,
    padding: 4,
    marginBottom: 30,
  },
  button: {
    height: 50,
    backgroundColor: '#2c6bed',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});
