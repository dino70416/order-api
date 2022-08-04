const { expect } = require('chai')
const supertest = require('supertest')

const api = supertest('http://localhost:3001')
let userCreated

const userData = {
  userName: 'name-test',
  userPassword: 'password-test',
  adminPermission: 1,
}

describe('User', () => {
  it('Create User: should return userId', (done) => {
    api
      .post('/user')
      .send(userData)
      .expect(200)
      .end((err, res) => {
        if (err) done(err)
        expect(res.body).to.have.property('userId')
        expect(res.body.userId).to.be.a('number')
        expect(res.body).to.have.property('userName')
        expect(res.body.userName).to.be.a('string')
        expect(res.body.userName).to.equal(userData.userName)
        expect(res.body).to.have.property('adminPermission')
        expect(res.body.adminPermission).to.be.a('number')
        expect(res.body.adminPermission).to.equal(userData.adminPermission)
        userCreated = res.body.userId
        done()
      })
  })

  it('Create User Failed: should return userId has been used', (done) => {
    api
      .post('/user')
      .send({
        userName: 'dino',
        userPassword: 'password-test',
        adminPermission: 1,
      })
      .expect(401)
      .end((err, res) => {
        if (err) done(err)
        expect(res.body).to.have.property('message')
        expect(res.body.message).to.be.a('string')
        expect(res.body.message).to.equal('使用者名稱已存在')
        done()
      })
  })

  it('Create User Failed: should return no data', (done) => {
    api
      .post('/user')
      .send({
        userPassword: 'password-test',
        adminPermission: 1,
      })
      .expect(404)
      .end((err, res) => {
        if (err) done(err)
        expect(res.body).to.have.property('message')
        expect(res.body.message).to.be.a('string')
        expect(res.body.message).to.equal('缺少必要的資料')
        done()
      })
  })

  it('Login: should return admin permission and user token after login', (done) => {
    api
      .post('/user/login')
      .send({
        userName: userData.userName,
        userPassword: userData.userPassword,
      })
      .expect(200)
      .end((err, res) => {
        if (err) done(err)
        expect(res.body).to.have.property('adminPermission')
        expect(res.body.adminPermission).to.be.a('number')
        expect(res.body.adminPermission).to.equal(userData.adminPermission)
        expect(res.body).to.have.property('token')
        expect(res.body.token).to.be.a('string')
        done()
      })
  })

  it('Login Failed: should return username or password is wrong', (done) => {
    api
      .post('/user/login')
      .send({
        userName: 'wrong-username',
        userPassword: 'wrong-password',
      })
      .expect(401)
      .end((err, res) => {
        if (err) done(err)
        expect(res.body).to.have.property('message')
        expect(res.body.message).to.be.a('string')
        expect(res.body.message).to.equal('使用者名稱或密碼錯誤')
        done()
      })
  })

  it('Read User: should get all the users by username, password, and admin permission', (done) => {
    api
      .get(`/user/${userCreated}`)
      .expect(200)
      .end((err, res) => {
        if (err) done(err)
        expect(res.body).to.have.property('userId')
        expect(res.body.userId).to.be.a('number')
        expect(res.body.userId).to.equal(userCreated)
        expect(res.body).to.have.property('userName')
        expect(res.body.userName).to.be.a('string')
        expect(res.body.userName).to.equal(userData.userName)
        expect(res.body).to.have.property('userPassword')
        expect(res.body.userPassword).to.be.a('string')
        expect(res.body).to.have.property('adminPermission')
        expect(res.body.adminPermission).to.be.a('number')
        expect(res.body.adminPermission).to.equal(userData.adminPermission)
        done()
      })
  })

  it('Read User Failed: should return no user', (done) => {
    api
      .get(`/user/1`)
      .expect(500)
      .end((err, res) => {
        if (err) done(err)
        expect(res.body).to.have.property('message')
        expect(res.body.message).to.be.a('string')
        expect(res.body.message).to.equal('查無此人')
        done()
      })
  })

  it('Read Users: should get all the users by username, password, and admin permission', (done) => {
    api
      .get('/user')
      .expect(200)
      .end((err, res) => {
        if (err) done(err)
        expect(res.body[0]).to.have.property('userId')
        expect(res.body[0].userId).to.be.a('number')
        expect(res.body[0]).to.have.property('userName')
        expect(res.body[0].userName).to.be.a('string')
        expect(res.body[0]).to.have.property('userPassword')
        expect(res.body[0].userPassword).to.be.a('string')
        expect(res.body[0]).to.have.property('adminPermission')
        expect(res.body[0].adminPermission).to.be.a('number')
        done()
      })
  })

  it('Update User: should return success message', (done) => {
    api
      .put(`/user/${userCreated}`)
      .send({
        userName: 'name-test-update',
        userPassword: 'password-test-update',
        adminPermission: 0,
      })
      .expect(200)
      .end((err, res) => {
        if (err) done(err)
        expect(res.body).to.have.property('success')
        expect(res.body.success).to.be.a('boolean')
        done()
      })
  })

  it('Update User Failed: should return success message', (done) => {
    api
      .put('/user/1')
      .send({
        userName: 'name-test-update',
        userPassword: 'password-test-update',
        adminPermission: 0,
      })
      .expect(404)
      .end((err, res) => {
        if (err) done(err)
        expect(res.body).to.have.property('success')
        expect(res.body.success).to.be.a('boolean')
        done()
      })
  })

  it('Delete User: should return success message', (done) => {
    api
      .delete(`/user/${userCreated}`)
      .expect(200)
      .end((err, res) => {
        if (err) done(err)
        expect(res.body).to.have.property('success')
        expect(res.body.success).to.be.a('boolean')
        done()
      })
  })

  it('Delete User Failed: should return success message', (done) => {
    api
      .delete('/user/1')
      .expect(404)
      .end((err, res) => {
        if (err) done(err)
        expect(res.body).to.have.property('success')
        expect(res.body.success).to.be.a('boolean')
        done()
      })
  })
})
