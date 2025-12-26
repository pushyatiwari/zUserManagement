import SQLite from 'react-native-sqlite-storage';
import {
  getDB,
  initDB,
  insertUser,
  fetchUsersFromDB,
  saveUsers,
} from '../../src/db/zellerDb';
import { UserRole } from '../../src/types/user';

jest.mock('react-native-sqlite-storage');

describe('SQLite DB helpers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should open database only once (getDB)', async () => {
    const db1 = await getDB();
    const db2 = await getDB();

    expect(SQLite.openDatabase).toHaveBeenCalledTimes(1);
    expect(db1).toBe(db2);
  });

  it('should create table on initDB', async () => {
    const db = await getDB();

    await initDB();

    expect(db.executeSql).toHaveBeenCalledWith(
      expect.stringContaining('CREATE TABLE IF NOT EXISTS ZellerUsers'),
    );
  });

  it('should insert a user', async () => {
    const db = await getDB();

    const user = {
      id: '1',
      firstName: 'test',
      lastName: 'user',
      email: 'test.user@test.com',
      role: 'Admin' as UserRole,
    };

    await insertUser(user);

    expect(db.executeSql).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO ZellerUsers'),
      [user.id, user.firstName, user.lastName, user.email, user.role],
    );
  });

  it('updates user when rowsAffected > 0', async () => {
    const db = await getDB();

    db.transaction.mockImplementationOnce((cb: any) =>
      cb({ executeSql: db.executeSql }),
    );

    db.executeSql.mockImplementationOnce(
      (_sql: string, _params: any[], successCb: any) => {
        successCb(null, { rowsAffected: 1 });
      },
    );

    const users = [
      {
        id: '1',
        firstName: 'A',
        lastName: 'B',
        email: null,
        role: 'Admin' as UserRole,
      },
    ];

    await saveUsers(users);

    expect(db.executeSql).toHaveBeenCalledTimes(1);
    expect(db.executeSql).toHaveBeenCalledWith(
      expect.stringContaining('UPDATE ZellerUsers'),
      ['A', 'B', null, 'Admin', '1'],
      expect.any(Function),
    );
  });

  it('inserts user when rowsAffected = 0', async () => {
    const db = await getDB();

    db.transaction.mockImplementationOnce((cb: any) =>
      cb({ executeSql: db.executeSql }),
    );

    db.executeSql
      .mockImplementationOnce(
        (_sql: string, _params: any[], successCb: any) => {
          successCb(null, { rowsAffected: 0 });
        },
      )
      .mockImplementationOnce(() => {});

    const users = [
      {
        id: '2',
        firstName: 'P',
        lastName: 'T',
        email: 'p@test.com',
        role: 'Manager' as UserRole,
      },
    ];

    await saveUsers(users);

    expect(db.executeSql).toHaveBeenCalledTimes(2);
    expect(db.executeSql).toHaveBeenNthCalledWith(
      1,
      expect.stringContaining('UPDATE ZellerUsers'),
      ['P', 'T', 'p@test.com', 'Manager', '2'],
      expect.any(Function),
    );
    expect(db.executeSql).toHaveBeenNthCalledWith(
      2,
      expect.stringContaining('INSERT INTO ZellerUsers'),
      ['2', 'P', 'T', 'p@test.com', 'Manager'],
    );
  });

  it('should fetch users from DB', async () => {
    const db = await getDB();

    db.executeSql.mockResolvedValueOnce([
      {
        rows: {
          length: 1,
          item: () => ({
            id: '1',
            firstName: 'test',
            lastName: 'user',
            email: null,
            role: 'Admin',
          }),
        },
      },
    ]);

    const users = await fetchUsersFromDB();

    expect(users.length).toBe(1);
    expect(users[0].firstName).toBe('test');
  });
});
