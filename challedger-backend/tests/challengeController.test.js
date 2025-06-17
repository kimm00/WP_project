const challengeController = require('../controllers/challengeController');

describe('challengeController', () => {
  test('challengeController 객체는 정의되어 있어야 함', () => {
    expect(challengeController).toBeDefined();
  });
});
