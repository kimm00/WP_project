// ✅ pool.query를 mocking
jest.mock('../models/db', () => ({
    query: jest.fn()
  }));
  
  const pool = require('../models/db');  // <- 실제로는 mock된 객체로 바뀜
  const badgeModel = require('../models/badgeModel');
  
  describe('badgeModel.grantBadge', () => {
    test('badge가 없으면 insert하고 [badgeName] 리턴', async () => {
      // 첫 SELECT 결과: badge 없음
      pool.query.mockResolvedValueOnce({ rows: [] });
      // 두 번째 INSERT 쿼리: 성공
      pool.query.mockResolvedValueOnce({});
  
      const result = await badgeModel.grantBadge('user1', 'First Badge');
      expect(result).toEqual(['First Badge']);
    });
  
    test('이미 badge가 있으면 [] 리턴', async () => {
      // SELECT 결과: 이미 있음
      pool.query.mockResolvedValueOnce({ rows: [{ user_id: 'user1', badge_name: 'First Badge' }] });
  
      const result = await badgeModel.grantBadge('user1', 'First Badge');
      expect(result).toEqual([]);
    });
  });
  