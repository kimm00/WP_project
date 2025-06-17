const badgeRoutes = require('../routes/badge');

describe('badgeRoutes router existence', () => {
  test('Router object should be defined', () => {
    expect(badgeRoutes).toBeDefined();
  });
});
