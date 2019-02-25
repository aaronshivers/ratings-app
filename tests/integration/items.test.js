const request = require('supertest')
const expect = require('expect')
const { ObjectId } = require('mongodb')
const { app } = require('../../index')
const { Item } = require('../../models/items')

describe('/items', () => {

  const items = [
    { _id: new ObjectId(), name: 'item0', rating: 4 },
    { _id: new ObjectId(), name: 'item1', rating: 5 }
  ]

  beforeEach(async () => {
    const item0 = new Item(items[0])
    const item1 = new Item(items[1])
    await item0.save()
    await item1.save()
  })

  afterEach(async () => {
    await Item.deleteMany()
  })

  describe('GET /items', () => {
    it('should return all items', async () => {
      await request(app)
        .get('/items')
        .expect(200)
        .then(res => {
          expect(res.body.length).toBe(2)
          expect(res.body.some(item => item.name === items[0].name)).toBeTruthy()
          expect(res.body.some(item => item.name === items[1].name)).toBeTruthy()
        })
    })

    it('should return 404 if no items are found', async () => {
      await Item.deleteMany()

      await request(app)
        .get('/items')
        .expect(404)
    })
  })

  describe('GET /items/:id', () => {
    it('should return 404 if invalid Id is passed', async () => {
      await request(app)
        .get('/items/1234')
        .expect(404)
    })

    it('should return 404 if Id is not in the DB', async () => {
      const id = new ObjectId()

      await request(app)
        .get(`/items/${ id }`)
        .expect(404)
    })

    it('should return specified item', async () => {
      await request(app)
        .get(`/items/${ items[0]._id }`)
        .expect(200)
    })
  })

  describe('POST /', () => {

    it('should return 401 if user not logged in', async () => {
      await request(app)
        .post(`/items`)
        .expect(401)
    })
  })
})
