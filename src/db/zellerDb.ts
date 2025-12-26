import SQLite from 'react-native-sqlite-storage';
import { UserRole } from '../types/user';

SQLite.enablePromise(true);

const DB_NAME = 'zeller.db';
const DB_LOCATION = 'default';

let dbInstance: any = null;

export type DbUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  role: UserRole;
};

export type NewDbUserInput = {
  firstName: string;
  lastName: string;
  email?: string | null;
  role: UserRole;
};

export async function getDB() {
  if (dbInstance) return dbInstance;
  dbInstance = await SQLite.openDatabase({
    name: DB_NAME,
    location: DB_LOCATION,
  });

  return dbInstance;
}

// sets up db and creates table if not exists
export async function initDB() {
  const db = await getDB();

  await db.executeSql(`
    CREATE TABLE IF NOT EXISTS ZellerUsers (
      id TEXT PRIMARY KEY NOT NULL,
      firstName TEXT NOT NULL,
      lastName TEXT NOT NULL,
      email TEXT NULL,
      role TEXT NOT NULL
    );
  `);
}

export async function saveUsers(users: DbUser[]) {
  const db = await getDB();

  await db.transaction((tx: any) => {
    for (const u of users) {
      // try to update
      tx.executeSql(
        `
        UPDATE ZellerUsers
        SET firstName = ?, lastName = ?, email = ?, role = ?
        WHERE id = ?;
        `,
        [u.firstName, u.lastName, u.email, u.role, u.id],
        // if not updated => insert
        (_: any, result: any) => {
          if (result.rowsAffected === 0) {
            tx.executeSql(
              `
              INSERT INTO ZellerUsers (id, firstName, lastName, email, role)
              VALUES (?, ?, ?, ?, ?);
              `,
              [u.id, u.firstName, u.lastName, u.email, u.role],
            );
          }
        },
      );
    }
  });
}

export async function fetchUsersFromDB(): Promise<DbUser[]> {
  const db = await getDB();
  const result = await db.executeSql(
    `SELECT * FROM ZellerUsers ORDER BY firstName ASC;`,
  );

  const rows = result[0].rows;
  const users: DbUser[] = [];

  for (let i = 0; i < rows.length; i++) {
    users.push(rows.item(i));
  }

  return users;
}

export async function insertUser(user: DbUser) {
  const db = await getDB();

  await db.executeSql(
    `
    INSERT INTO ZellerUsers (id, firstName, lastName, email, role)
    VALUES (?, ?, ?, ?, ?);
    `,
    [user.id, user.firstName, user.lastName, user.email, user.role],
  );
}
