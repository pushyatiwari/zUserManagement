const executeSql = jest.fn();
const transaction = jest.fn(cb => cb({ executeSql }));

const mockDb = {
  executeSql,
  transaction,
};

export default {
  enablePromise: jest.fn(),
  openDatabase: jest.fn(() => Promise.resolve(mockDb)),
};
