const { Router } = require('express');
const {
    getDashboard,
    getAddPosts,
    uploadImage,
    editPostHandle,
    handleAddPost,
    editPost,
    deletePost
} = require('../controller/adminController');
const dashRouter = new Router();
const { authenticated } = require('../middlewares/auth');

//@desc dashboard page
//@route GET /dashboard
dashRouter.get("/", authenticated, getDashboard)

//@desc dashboard page
//@route GET /dashboard/add-post
dashRouter.get("/add-post", authenticated, getAddPosts)

//@desc dashboard Handle
//@route POST /dashboard/add-post
dashRouter.post("/add-post", authenticated, handleAddPost)

//@desc upload image
//@route POST /dashboard/uploadImage
dashRouter.post("/uploadImage", authenticated, uploadImage)

//@desc edit post
//@route GET /dashboard/edit-post/:id
dashRouter.get("/edit-post/:id", authenticated, editPost)

//@desc delete post
//@route GET /dashboard/delete-post/:id
dashRouter.get("/delete-post/:id", authenticated, deletePost)

//@desc edit post
//@route POST /dashboard/edit-post/:id
dashRouter.post("/edit-post/:id", authenticated, editPostHandle)





module.exports = { dashRouter }