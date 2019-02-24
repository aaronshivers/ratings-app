const request = require('supertest')
// const expect = require('expect')
const { app } = require('../../index')

describe('items', () => {
  it('should return 200', async () => {
    await request(app)
      .get('/items')
      .expect(200)
  })

  it('should return 404 if no items are found', async () => {
    await request(app)
      .get('/items/')
      .expect(404)
      .expect(res => {
        expect(res.body.length).toBe(2)
      })
  })
})
