const badgeController = require('../controllers/badgeController');

describe('badgeController', () => {
  test('badgeController 객체는 정의되어 있어야 함', () => {
    expect(badgeController).toBeDefined();
  });
});
