// GraphQL, fetches when App loads
import { useCallback, useEffect, useState } from 'react';
import type { User } from '../types/user';
import { fetchZellerCustomers } from '../api/zellerApi';

export function useZellerUsersApi() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const items = await fetchZellerCustomers();
      setUsers(items);
    } catch {
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  return {
    users,
    loading,
    error,
    reload: loadUsers,
  };
}
