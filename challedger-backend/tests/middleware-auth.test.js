const authMiddleware = require('../middleware/auth');

describe('auth middleware', () => {
  test('auth 미들웨어는 정의되어 있어야 함', () => {
    expect(authMiddleware).toBeDefined();
  });
});
