const request = require('supertest')
const expect = require('expect')
const { ObjectId } = require('mongodb')
const { app } = require('../../index')
const { Item } = require('../../models/items')
const { User } = require('../../models/users')

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
        .send({ name: 'item3', rating: 2 })
        .expect(401)
    })

    it('should return 400 if data is invalid', async () => {
      const token = new User().createAuthToken()

      await request(app)
        .post('/items')
        .set('x-auth-token', token)
        .send({ name: 'item3', rating: 'asdf' })
        .expect(400)
    })

    it('should return 400 if item already exists', async () => {
      const token = new User().createAuthToken()

      await request(app)
        .post('/items')
        .set('x-auth-token', token)
        .send({ name: items[0].name, rating: items[0].rating })
        .expect(400)

      const foundItems = await Item.find()
      expect(foundItems.length).toBe(2)
    })

    it('should save the item if data is valid', async () => {
      const token = new User().createAuthToken()

      await request(app)
        .post('/items')
        .set('x-auth-token', token)
        .send({ name: 'item3', rating: 4 })
        .expect(200)

      const foundItem = await Item.find({ name: 'item3', rating: 4 })
      expect(foundItem).toBeTruthy()
    })

    it('should return the item if data is valid', async () => {
      const token = new User().createAuthToken()

      await request(app)
        .post('/items')
        .set('x-auth-token', token)
        .send({ name: 'item3', rating: 4 })
        .expect(200)
        .expect(res => {
          expect(res.body).toHaveProperty('name', 'item3')
          expect(res.body).toHaveProperty('rating', 4)
        })
    })
  })

  describe('DELETE /:id', () => {

    it('should respond 401 if user not logged in', async () => {
      await request(app)
        .delete(`/items/${ items[0]._id }`)
        .expect(401)

      const foundItem = await Item.findById(items[0]._id)
      expect(foundItem).toBeTruthy()
    })

    it('should respond 400 if id is invalid', async () => {
      const token = new User().createAuthToken()

      await request(app)
        .delete(`/items/3214`)
        .set('x-auth-token', token)
        .expect(400)

      const foundItems = await Item.find()
      expect(foundItems.length).toBe(2)
    })

    it('should respond 404 if id is not in DB', async () => {
      const token = new User().createAuthToken()

      await request(app)
        .delete(`/items/${ new ObjectId() }`)
        .set('x-auth-token', token)
        .expect(404)

      const foundItems = await Item.find()
      expect(foundItems.length).toBe(2)
    })

    it('should remove item from DB', async () => {
      const token = new User().createAuthToken()

      await request(app)
        .delete(`/items/${ items[0]._id }`)
        .set('x-auth-token', token)
        .expect(200)

      const foundItems = await Item.find()
      expect(foundItems.length).toBe(1)
    })

    it('should return the deleted item', async () => {
      const token = new User().createAuthToken()

      await request(app)
        .delete(`/items/${ items[0]._id }`)
        .set('x-auth-token', token)
        .expect(200)
        .expect(res => {
          expect(res.body).toHaveProperty('name', items[0].name)
          expect(res.body).toHaveProperty('rating', items[0].rating)
        })
    })
  })
})
