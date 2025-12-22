import { useState } from 'react';
import { UserRole } from '../types/user';

export type UserForm = {
  firstName: string;
  lastName: string;
  email?: string;
  role: UserRole;
};

type Errors = Partial<Record<keyof UserForm, string>>;

export function useAddUserForm(initialValues: UserForm) {
  const [values, setValues] = useState<UserForm>(initialValues);
  const [errors, setErrors] = useState<Errors>({});

  const validate = () => {
    const e: Errors = {};
    const nameRegex = /^[A-Za-z\s]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!values.firstName.trim()) {
      e.firstName = 'Name is required';
    } else if (!nameRegex.test(values.firstName)) {
      e.firstName = 'Only alphabets and spaces allowed';
    } else if (values.firstName.length > 50) {
      e.firstName = 'Maximum 50 characters allowed';
    }

    if (!values.lastName.trim()) {
      e.lastName = 'Name is required';
    } else if (!nameRegex.test(values.lastName)) {
      e.lastName = 'Only alphabets and spaces allowed';
    } else if (values.lastName.length > 50) {
      e.lastName = 'Maximum 50 characters allowed';
    }

    if (values.email?.trim()) {
      if (!emailRegex.test(values.email)) {
        e.email = 'Invalid email format';
      }
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const setField = <K extends keyof UserForm>(key: K, value: UserForm[K]) => {
    setValues(prev => ({ ...prev, [key]: value }));
    setErrors(prev => ({ ...prev, [key]: undefined }));
  };

  const reset = () => {
    setValues(initialValues);
    setErrors({});
  };

  return {
    values,
    errors,
    setField,
    validate,
    reset,
  };
}
