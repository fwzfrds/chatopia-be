const express = require('express')
const router = express.Router()
const {
  getUsers,
  insertUsers,
  updateUsers,
  // deleteUsers,
  getProfileDetail,
  loginUsers,
  userActivate,
  userLogout,
  getUserContact
  // refreshToken
} = require('../controllers/usersController')
const { protect, isUser, isTokenValid } = require('../middlewares/authMiddleware')
const uploadPhoto = require('../middlewares/uploadPhoto')

//  ----> /users.....
router
  .get('/', getUsers)
  .get('/user-contact', protect, isUser, getUserContact)
  .get('/active/:token', isTokenValid, userActivate)
  .get('/profile', protect, isUser, getProfileDetail)
  .post('/registration', uploadPhoto.single('photo'), insertUsers)
  .post('/login', loginUsers)
  .get('/logout', protect, isUser, userLogout)
  // .post('/refresh-token', refreshToken)
  .put('/edit', protect, isUser, uploadPhoto.single('photo'), updateUsers)
  // .delete('/:emailid', deleteUsers)

module.exports = router
