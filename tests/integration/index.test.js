const request = require('supertest')
const { app } = require('../../index')

describe('index', () => {
  it('should return 200', () => {
    request(app)
      .get('/')
      .expect(200)
  })

  it('should return 404 if page not found', () => {
    request(app)
      .get('/asdfklj2134jhasdf')
      .expect(404)
  })
})
