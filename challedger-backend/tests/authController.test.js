process.env.JWT_SECRET = 'testsecret';

jest.mock('../models/db', () => ({
  query: jest.fn()
}));
jest.mock('bcrypt', () => ({
  compare: jest.fn()
}));
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn()
}));

const db = require('../models/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authController = require('../controllers/authController');

describe('authController.login', () => {
  test('should return a token for valid credentials', async () => {
    db.query.mockResolvedValueOnce({
      rows: [{
        id: 1,
        email: 'kimdoyi11@naver.com',
        password: '$2b$10$mockedhash',
        username: 'doi'
      }]
    });

    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue('mocked_token');

    const req = {
      body: {
        email: 'kimdoyi11@naver.com',
        password: '1234'
      }
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await authController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      token: 'mocked_token',
      username: 'doi',
      email: 'kimdoyi11@naver.com'
    });
  });
});
