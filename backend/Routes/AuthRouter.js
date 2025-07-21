const {
  signup,
  login,
  getSignup,
  getLogin,
  getuser,
  updateUser,
  deleteUser
} = require('../Controllers/AuthController');

const {
  signupValidation,
  loginValidation,
  getLoginValidation,
  getuservalidation,
  updateUserValidation,
  deleteUserValidation
} = require('../Middlewares/AuthValidation');

const router = require('express').Router();



// POST routes
router.post('/login', loginValidation, login);
router.post('/signup', signupValidation, signup);
// GET routes
router.get('/user', getuservalidation, getuser);
// PUT route (update user)
router.put("/user/email", updateUser, updateUserValidation);

// DELETE route (delete user)
router.delete('/user/email', deleteUser, deleteUserValidation);


module.exports = router;
