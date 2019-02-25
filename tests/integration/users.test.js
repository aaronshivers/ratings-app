const request = require('supertest')
const expect = require('expect')
const { ObjectId } = require('mongodb')
const { app } = require('../../index')
const { User } = require('../../models/users')

// const mochaAsync = fn => done => fn.call().then(done, err => done(err))

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

  describe('POST /', () => {

    it('should return 400 if user info is invalid', async () => {
      await request(app)
        .post(`/users`)
        .send({ email: 'asdf.234.dusdf', password: 'sdfjk' })
        .expect(400)
    })

    it('should return 400 if email is less than 7 characters', async () => {
      await request(app)
        .post('/users')
        .send({ email: 'a@a.uk', password: 'asdfASDF1234!@#$' })
        .expect(400)
    })

    it('should return 400 if email is greater than 50 characters', async () => {
      const email = new Array(100).join('a').concat(['@a.com'])
      await request(app)
        .post('/users')
        .send({ email: email, password: 'asdfASDF1234!@#$' })
        .expect(400)
    })

    it('should return 400 if password is less than 8 characters', async () => {
      await request(app)
        .post('/users')
        .send({ email: 'user3@test.com', password: 'aA1!' })
        .expect(400)
    })

    it('should return 400 if password is greater than 100 characters', async () => {
      const pass = new Array(101).join('aA1!')
      await request(app)
        .post('/users')
        .send({ email: 'user3@test.com', password: pass })
        .expect(400)
    })

    it('should save the user if it is valid', async () => {
      const user = {
        email: 'user3@test.com',
        password: 'asdfASDF1234!@#$'
      }

      await request(app)
        .post('/users')
        .send(user)
        .expect(200)      

      const foundUser = await User.findOne({ email: user.email })
      expect(foundUser).not.toBeNull()
    })
  })
})
