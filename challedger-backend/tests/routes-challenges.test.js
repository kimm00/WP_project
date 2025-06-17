const challengeRoutes = require('../routes/challenges');

describe('challengeRoutes router existence', () => {
  test('Router object should be defined', () => {
    expect(challengeRoutes).toBeDefined();
  });
});
