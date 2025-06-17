const expenseRoutes = require('../routes/expenses');

describe('expenseRoutes router existence', () => {
  test('Router object should be defined', () => {
    expect(expenseRoutes).toBeDefined();
  });
});
