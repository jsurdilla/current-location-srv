/* global describe it */

import { expect } from 'chai';
import visits from '../../src/handlers/visits';

const res = {
  sendCalledWith: '',
  code: 0,

  send(arg) {
    this.sendCalledWith = arg;
    return this;
  },

  status(code) {
    this.code = code;
    return this;
  },

  json(data) {
    this.data = data;
    return this;
  },
};

const mockReq = () => ({
  body: {},
});

describe('visit handler', () => {
  describe('handleCreateVisit', () => {
    it('should return an error if userID is missing', async () => {
      const handler = visits({
        db: {
          createVisit: () => [],
        },
      });

      const req = mockReq();
      req.body.name = 'foo';
      await handler.handleCreateVisit(req, res);

      expect(res.data.code).to.eq(400);
      expect(res.data.message).to.eq('userId and name are required');
    });

    it('should return an error if name is missing', async () => {
      const handler = visits({
        db: {
          createVisit: () => [],
        },
      });

      const req = mockReq();
      req.body.userId = 'foo';
      await handler.handleCreateVisit(req, res);

      expect(res.code).to.eq(400);
      expect(res.data).to.eql({ code: 400, message: 'userId and name are required' });
    });

    it('create the visit', async () => {
      const handler = visits({
        db: {
          createVisit: () => [{ id: 'foo', userId: 'bar', name: 'baz' }],
        },
      });

      const req = mockReq();
      req.body.userId = 'foo';
      req.body.name = 'bar';
      await handler.handleCreateVisit(req, res);

      expect(res.code).to.eq(201);
      expect(res.data).to.eql([{ id: 'foo', userId: 'bar', name: 'baz' }]);
    });
  });
});
