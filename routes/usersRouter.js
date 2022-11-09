const { Router } = require('express');

const { registerHandler, resetPassword, resetPasswordHandle, handleLogin, getLogin, getRegister, logout, remember, forgetPassword, forgetPasswordHandle } = require('../controller/userController');
const usersRouter = new Router();
const { authenticated } = require('../middlewares/auth');

//@desc login page
//@route GET /users/login 
usersRouter.get("/login", getLogin)

//@desc register page
//@route GET /users/register
usersRouter.get("/register", getRegister)

//@desc login handle
//@route POST /users/login
usersRouter.post("/login", handleLogin, remember)

//@desc register handle
//@route POST /users/register
usersRouter.post("/register", registerHandler)

//@desc logout handle
//@route GET /users/logout
usersRouter.get("/logout", authenticated, logout)


//@desc forgetPassword page
//@route GET /users/forgetPassword
usersRouter.get("/forgetPassword", forgetPassword)

//@desc forgetPassword handle
//@route POST /users/forgetPassword
usersRouter.post("/forgetPassword", forgetPasswordHandle)

//@desc resetPassword page
//@route GET /users/resetPassword/:token
usersRouter.get("/resetPassword/:token", resetPassword)

//@desc resetPasswordHandle handle
//@route POST /users/resetPassword
usersRouter.post("/resetPassword/:userId", resetPasswordHandle)






module.exports = { usersRouter }