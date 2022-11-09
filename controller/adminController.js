const multer = require('multer');
const { storage, fileFilter } = require('../utils/multer');
const shortId = require('shortid');
const sharp = require('sharp');
const appRoot = require('app-root-path');
const fs = require('fs');

const { Post } = require("../model/postsSchema")
const { formatDate } = require('../utils/formatDate');
const { get500 } = require('../views/errors/errors');
const { post } = require('jquery');


const getDashboard = async(req, res) => {
    try {
        const page = +req.query.page || 1;
        const postPerPage = 4;

        const numberOfPosts = await Post.find({ user: req.user._id }).countDocuments();
        const posts = await Post.find({ user: req.user._id }).skip((page - 1) * postPerPage).limit(postPerPage);

        res.render("./private/Blog.ejs", {
            pageTitle: "وبلاگ شخصی من",
            path: "/dashboard",
            layout: "./layout/dashLayout.ejs",
            fullName: req.user.fullName,
            posts,
            formatDate,
            currentPage: page,
            nextPage: page + 1,
            previosPage: page - 1,
            hasNextPage: postPerPage * page < numberOfPosts,
            hasPreviousPage: page > 1,
            numberOfPosts,
            lastPage: Math.ceil(numberOfPosts / postPerPage)

        })
    } catch (error) {
        console.log(error);
        get500;
    }
}

const getAddPosts = (req, res) => {
    res.render("./private/addPost.ejs", {
        pageTitle: "ساخت پست جدید",
        path: "/dashboard/add-post",
        layout: "./layout/dashLayout.ejs",
        fullName: req.user.fullName
    })
}

const handleAddPost = async(req, res) => {
    const errors = [];
    try {
        const thumbnail = req.files ? req.files.thumbnail : {};
        const fileName = `${shortId.generate()}_${thumbnail.name}`;
        const uploadPath = `${appRoot}/public/uploads/thumbnail/${fileName}`;
        req.body = {...req.body, thumbnail };

        await Post.postValidation(req.body);

        await sharp(thumbnail.data).jpeg({ quality: 50 }).toFile(uploadPath).catch(err => console.log(err));


        await Post.create({...req.body, user: req.user._id, thumbnail: fileName })

        res.redirect("/dashboard");

    } catch (error) {
        if (error) {
            error.inner.forEach(e => {
                errors.push({ name: e.path, message: e.message })
            })
        }
        res.render("./private/addPost.ejs", {
            pageTitle: "ساخت پست جدید",
            path: "/dashboard/add-post",
            layout: "./layout/dashLayout.ejs",
            fullName: req.user.fullName,
            errors
        })

    }
}


const uploadImage = (req, res) => {
    const upload = multer({
        limits: { fileSize: 4000000 },
        // dest: "uploads/",
        // storage: storage,
        fileFilter: fileFilter,
    }).single("image");

    upload(req, res, async(err) => {
        if (err) {
            if (err.code = "LIMIT_FILE_SIZE") {
                res.status(400).send("حجم فایل ارسالی نباید بیشتر از چهار مگابایت باشد");
            } else {
                res.send(err);
            }
        } else {
            const fileName = `${shortId.generate()}_${req.file.originalname}`;
            await sharp(req.file.buffer).jpeg({ quality: 50 }).toFile(`./public/uploads/${fileName}`)
            if (req.file) {
                res.status(200).send("آپلود عکس موفقیت آمیز بود");
            } else {
                res.send("جهت آپلود عکسی انتخاب کنید")
            }
        }
    });
};

const editPost = async(req, res) => {

    const posts = await Post.find({ _id: req.params.id });
    const post = posts[0];
    res.render("./private/editPost.ejs", {
        pageTitle: "ویرایش پست",
        path: "/dashboard/edit-post",
        layout: "./layout/dashLayout.ejs",
        fullName: req.user.fullName,
        post
    })


}
const deletePost = async(req, res) => {
    try {
        await Post.findByIdAndRemove({ _id: req.params.id });
        res.redirect("/dashboard")
    } catch (error) {
        console.log(error);

    }
}

const editPostHandle = async(req, res) => {
    let post;
    try {
        const thumbnail = req.files ? req.files.thumbnail : {};
        const fileName = `${shortId.generate()}_${thumbnail.name}`;
        const uploadPath = `${appRoot}/public/uploads/thumbnail/${fileName}`;

        post = await Post.findOne({ _id: req.params.id });

        if (!thumbnail.name) {
            await Post.postValidation({...req.body, thumbnail: { name: "placeHolder", size: 0, mimetype: "image/jpeg" } });
        } else {
            await Post.postValidation({...req.body, thumbnail });
        }


        if (!post) {
            return res.redirect("/404");
        }
        if (post.user.toString() !== req.user.id) {
            return res.redirect("/dashboard");
        }
        if (thumbnail.name) {
            fs.unlink(`${appRoot}/public/uploads/thumbnail/${post.thumbnail}`, async(err) => {
                if (err) {
                    console.log(err);
                } else {
                    await sharp(thumbnail.data).jpeg({ quality: 50 }).toFile(uploadPath).catch(err => console.log(err));
                }
            })
        }
        const { title, text, status } = req.body;
        post.title = title;
        post.text = text;
        post.status = status;
        post.thumbnail = thumbnail.name ? fileName : post.thumbnail;
        await post.save();
        res.redirect("/dashboard");


    } catch (error) {
        const errors = [];
        if (error) {
            error.inner.forEach(e => {
                errors.push({ name: e.path, message: e.message })
            })
        }


        res.render("./private/editPost.ejs", {
            pageTitle: "ساخت پست جدید",
            path: "/dashboard/edit-post",
            layout: "./layout/dashLayout.ejs",
            fullName: req.user.fullName,
            errors,
            post
        })
        console.log(error);

    }

}

module.exports = {
    getDashboard,
    getAddPosts,
    handleAddPost,
    uploadImage,
    editPost,
    deletePost,
    editPostHandle,
}