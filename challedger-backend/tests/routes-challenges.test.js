const challengeRoutes = require('../routes/challenges');

describe('challengeRoutes 라우터 존재 여부', () => {
  test('라우터 객체가 정의되어 있어야 함', () => {
    expect(challengeRoutes).toBeDefined();
  });
});
