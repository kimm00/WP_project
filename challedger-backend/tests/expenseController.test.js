const expenseController = require('../controllers/expenseController');

describe('expenseController', () => {
  test('expenseController 객체는 정의되어 있어야 함', () => {
    expect(expenseController).toBeDefined();
  });
});
