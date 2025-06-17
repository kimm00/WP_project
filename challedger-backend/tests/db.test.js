const db = require('../models/db');

describe('db 모듈', () => {
  test('DB 객체가 정의되어 있어야 함', () => {
    expect(db).toBeDefined();
  });
});
