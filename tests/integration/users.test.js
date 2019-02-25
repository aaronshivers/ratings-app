const request = require('supertest')
const expect = require('expect')
const { ObjectId } = require('mongodb')
const { app } = require('../../index')
const { User } = require('../../models/users')

describe('/users', () => {

  const users = [
    { _id: new ObjectId(), email: 'user0@test.com', password: 'asdfASDF1234!@#$', isAdmin: false },
    { _id: new ObjectId(), email: 'user1@test.com', password: 'asdfASDF1234!@#$', isAdmin: false }
  ]

  beforeEach(async () => {
    const user0 = new User(users[0])
    const user1 = new User(users[1])
    await user0.save()
    await user1.save()
  })

  afterEach(async () => {
    await User.deleteMany()
  })

  describe('GET /users', () => {
    it('should return 404 if no users are found', async () => {
      await User.deleteMany()

      await request(app)
        .get('/users')
        .expect(404)
    })
  })

  it('should return all users', async () => {
    await request(app)
      .get('/users')
      .expect(200)
      .then(res => {
        expect(res.body.length).toBe(2)
        expect(res.body.some(user => user.name === users[0].name)).toBeTruthy()
        expect(res.body.some(user => user.name === users[1].name)).toBeTruthy()
      })
  })

  describe('GET /users/:id', () => {
    it('should return 404 if invalid Id is passed', async () => {
      await request(app)
        .get('/users/1234')
        .expect(404)
    })

    it('should return 404 if Id is not in the DB', async () => {
      const id = new ObjectId()

      await request(app)
        .get(`/users/${ id }`)
        .expect(404)
    })

    it('should return specified user', async () => {
      await request(app)
        .get(`/users/${ users[0]._id }`)
        .expect(200)
    })
  })

  // describe('POST /', () => {

  //   it('should return 401 if user not logged in', async () => {
  //     await request(app)
  //       .post(`/users`)
  //       .expect(401)
  //   })
  // })
})
