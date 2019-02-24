const request = require('supertest')
const { app } = require('../../index')

describe('index', () => {
  it('should return 200', () => {
    request(app)
      .get('/')
      .expect(200)
  })
})
