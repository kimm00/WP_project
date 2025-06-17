const authMiddleware = require('../middleware/auth');

describe('auth middleware', () => {
  test('auth middleware should be defined', () => {
    expect(authMiddleware).toBeDefined();
  });
});
