const request = require('supertest')
const { app } = require('../../index')

describe('/', () => {

  describe('GET /', () => {
    it('should return 200', async () => {
      await request(app)
        .get('/')
        .expect(200)
    })

    it('should return 404 if page not found', async () => {
      await request(app)
        .get('/jhgkjhg876')
        .expect(404)
    })
  })
})
