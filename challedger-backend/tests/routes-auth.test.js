const authRoutes = require('../routes/auth');

describe('authRoutes router existence', () => {
  test('Router object should be defined', () => {
    expect(authRoutes).toBeDefined();
  });
});
