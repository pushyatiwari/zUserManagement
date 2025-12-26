export type UserRole = 'Admin' | 'Manager';

export type User = {
  id: string;
  name: string;
  email?: string | null;
  role: UserRole;
};
