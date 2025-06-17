const db = require('../models/db');

describe('db module', () => {
  test('DB object should be defined', () => {
    expect(db).toBeDefined();
  });
});
