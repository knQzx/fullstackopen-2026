const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')
const helper = require('./test_helper')

const api = supertest(app)

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    const passwordHash = await bcrypt.hash('sekret', 10)
    await new User({ username: 'root', passwordHash }).save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = { username: 'mluukkai', name: 'Matti Luukkainen', password: 'salainen' }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)
    assert(usersAtEnd.map((u) => u.username).includes(newUser.username))
  })

  test('users are listed without password hashes', async () => {
    const response = await api.get('/api/users').expect(200)
    assert.strictEqual(response.body[0].passwordHash, undefined)
  })

  test('creation fails if username is taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const result = await api
      .post('/api/users')
      .send({ username: 'root', name: 'Superuser', password: 'salainen' })
      .expect(400)

    assert(result.body.error.includes('expected `username` to be unique'))
    assert.strictEqual((await helper.usersInDb()).length, usersAtStart.length)
  })

  test('creation fails if username is too short', async () => {
    const usersAtStart = await helper.usersInDb()

    const result = await api
      .post('/api/users')
      .send({ username: 'ro', password: 'salainen' })
      .expect(400)

    assert(result.body.error.includes('username'))
    assert.strictEqual((await helper.usersInDb()).length, usersAtStart.length)
  })

  test('creation fails if username is missing', async () => {
    const usersAtStart = await helper.usersInDb()

    await api.post('/api/users').send({ name: 'No Username', password: 'salainen' }).expect(400)

    assert.strictEqual((await helper.usersInDb()).length, usersAtStart.length)
  })

  test('creation fails if password is missing or too short', async () => {
    const usersAtStart = await helper.usersInDb()

    const result = await api
      .post('/api/users')
      .send({ username: 'newuser', password: 'pw' })
      .expect(400)

    assert(result.body.error.includes('password'))

    await api.post('/api/users').send({ username: 'newuser2' }).expect(400)

    assert.strictEqual((await helper.usersInDb()).length, usersAtStart.length)
  })
})

after(async () => {
  await mongoose.connection.close()
})
