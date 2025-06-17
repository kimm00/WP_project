jest.mock('../models/db', () => ({
    query: jest.fn()
  }));
  
  const pool = require('../models/db'); 
  const badgeModel = require('../models/badgeModel');
  
  describe('badgeModel.grantBadge', () => {
    test('badge가 없으면 insert하고 [badgeName] 리턴', async () => {
      // First SELECT query: no badge exists
      pool.query.mockResolvedValueOnce({ rows: [] });
      // Second INSERT query: success
      pool.query.mockResolvedValueOnce({});
  
      const result = await badgeModel.grantBadge('user1', 'First Badge');
      expect(result).toEqual(['First Badge']);
    });
  
    test('이미 badge가 있으면 [] 리턴', async () => {
      // Second INSERT query: success
      pool.query.mockResolvedValueOnce({ rows: [{ user_id: 'user1', badge_name: 'First Badge' }] });
  
      const result = await badgeModel.grantBadge('user1', 'First Badge');
      expect(result).toEqual([]);
    });
  });
  