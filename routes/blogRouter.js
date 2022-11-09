const { Router } = require('express');

const { authenticated } = require('../middlewares/auth');
const { getIndex, getSinglePage, getSearchResults, getCaptcha, getContact, contactHandle } = require('../controller/blogController');
const blogRouter = new Router();

//@desc main page
//@route GET /
blogRouter.get("/", authenticated, getIndex)

//@desc single page
//@route GET /post/:id
blogRouter.get("/post/:id", authenticated, getSinglePage)

//@desc contact page
//@route GET /contact
blogRouter.get("/contact", authenticated, getContact)

//@desc contact page Handle
//@route POST /contact
blogRouter.post("/contact", authenticated, contactHandle)

//@desc get captcha image
//@route GET captcha.png
blogRouter.get("/captcha.png", getCaptcha)

//@desc handle search results
//@route POST /search
blogRouter.post("/search", authenticated, getSearchResults)

//@desc get search results
//@route GET /search
blogRouter.get("/search", authenticated, getSearchResults)







module.exports = { blogRouter };