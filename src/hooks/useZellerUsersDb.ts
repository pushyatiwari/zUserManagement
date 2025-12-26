import { useCallback, useEffect, useState } from 'react';
import type { User, UserRole } from '../types/user';
import { fetchZellerCustomers } from '../api/zellerApi';
import {
  initDB,
  saveUsers,
  fetchUsersFromDB,
  insertUser,
  type DbUser,
  NewDbUserInput,
} from '../db/zellerDb';

type ApiUser = {
  id: string;
  name: string;
  role: UserRole;
  email: string | null;
};

// helpers
function splitName(name: string) {
  const parts = name.trim().split(/\s+/);
  return {
    firstName: parts[0] ?? '',
    lastName: parts.slice(1).join(' ') || '',
  };
}

function apiToDbUsers(apiUsers: ApiUser[]): DbUser[] {
  return apiUsers.map(u => {
    const { firstName, lastName } = splitName(u.name);

    return {
      id: u.id,
      firstName,
      lastName,
      email: u.email ?? null,
      role: u.role,
    };
  });
}

function dbToUiUsers(dbUsers: DbUser[]): User[] {
  return dbUsers.map(u => ({
    id: u.id,
    name: `${u.firstName} ${u.lastName}`.trim(),
    role: u.role as UserRole,
    email: u.email ?? undefined,
  }));
}
function createId() {
  return `local_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

// Hook
export function useZellerUsersDb() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const readFromDB = useCallback(async () => {
    const dbUsers = await fetchUsersFromDB();
    setUsers(dbToUiUsers(dbUsers));
    return dbUsers.length;
  }, []);

  const syncFromApi = useCallback(async () => {
    const apiUsers = (await fetchZellerCustomers()) as ApiUser[];
    const dbUsers = apiToDbUsers(apiUsers);
    await saveUsers(dbUsers);
  }, []);

  const bootstrap = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      await initDB();
      const count = await readFromDB();

      if (count === 0) {
        await syncFromApi();
        await readFromDB();
      }
    } catch (e: any) {
      setError(e?.message ?? 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [readFromDB, syncFromApi]);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      await syncFromApi();
      await readFromDB();
    } catch (e: any) {
      setError(e?.message ?? 'Failed to refresh users');
    } finally {
      setLoading(false);
    }
  }, [readFromDB, syncFromApi]);

  const addUser = useCallback(
    async (input: NewDbUserInput) => {
      setLoading(true);
      setError(null);

      try {
        await initDB();
        const newUser: DbUser = {
          id: createId(),
          firstName: input.firstName.trim(),
          lastName: input.lastName.trim(),
          email: input.email?.trim() ? input.email.trim() : null,
          role: input.role,
        }; 
        await insertUser(newUser);
        await readFromDB();
      } catch (e: any) {
        setError(e?.message ?? 'Failed to add user');
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [readFromDB],
  );

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  return { users, loading, error, addUser, reload };
}
