const { formatDate } = require('../utils/formatDate');
const { Post } = require('../model/postsSchema');
const { truncate } = require('../utils/helpers');
const { contactValidationSchema } = require('../model/contactValidationSchema');
const { sendMailForClient } = require('../utils/mailer');
const captcha = require('captchapng');
const { transformNumberInfinityNullArrayReply } = require('@redis/client/dist/lib/commands/generic-transformers');
const { Search } = require('../model/searchSchema');

let CAPTCHA_NUM;

exports.getIndex = async(req, res) => {
    try {

        const page = +req.query.page || 1;
        const postPerPage = 4;
        const numberOfPosts = await Post.find({ status: "public" }).countDocuments();
        const posts = await Post.find({ status: "public" }).sort({ createAt: "desc" }).skip((page - 1) * postPerPage).limit(postPerPage);

        res.render("index.ejs", {
            pageTitle: "تمام پست ها",
            path: "/",
            layout: "./layout/dashLayout.ejs",
            fullName: req.user.fullName,
            posts,
            formatDate,
            truncate,
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
    }
}
exports.getSinglePage = async(req, res) => {
    const post = await Post.findOne({ _id: req.params.id }).populate("user");
    if (!post) {
        return res.redirect("/404");
    }
    res.render("private/singlePost.ejs", {
        pageTitle: post.title,
        path: "/post",
        layout: "./layout/dashLayout.ejs",
        post,
        formatDate,
        fullName: req.user.fullName,

    })
}
exports.getContact = (req, res) => {
    res.render("contactUs.ejs", {
        pageTitle: "تماس با ما",
        path: "/contact",
        fullName: req.user.fullName,
        layout: "./layout/dashLayout.ejs",
        errors: []
    })
}
exports.getCaptcha = (req, res) => {
    CAPTCHA_NUM = parseInt(Math.random() * 9000 + 1000);
    const p = new captcha(80, 30, CAPTCHA_NUM);
    p.color(0, 0, 0, 0);
    p.color(80, 80, 80, 255);
    const img = p.getBase64();
    const imgBase64 = Buffer.from(img, "base64");
    res.send(imgBase64);

}
exports.contactHandle = async(req, res) => {
    try {
        await contactValidationSchema.validate(req.body, { abortEarly: false });
        if (parseInt(req.body.captcha) !== CAPTCHA_NUM) {
            const error = new Error();
            error.inner = [{
                path: "captchaPath",
                message: "کد کپچای ورد شده صحیح نمیباشد"
            }]
            throw (error)
        }

        const subject = `شما پیامی از طرف شخص ${req.body.name} دارید`
        const text = `پیام مربوطه:${req.body.message}واز طرف ${req.body.email} میباشد`
        sendMailForClient("mfuofike@hi2.in", subject, text);

        res.redirect("/");

    } catch (error) {
        const errorArr = [];
        if (error) {
            error.inner.forEach(e => {
                errorArr.push({ name: e.path, message: e.message })
            })
        }
        return res.render("contactUs.ejs", {
            pageTitle: "تماس با ما",
            path: "/contact",
            fullName: req.user.fullName,
            layout: "./layout/dashLayout.ejs",
            errors: errorArr
        })
    }
}
exports.getSearchResults = async(req, res) => {
    try {
        const page = +req.query.page || 1;
        let search;
        if (page === 1) {
            search = await Search.find();
            search[0].text = req.body.search;
            await search[0].save();
        }
        let searchText;
        if (page === 1) {
            searchText = req.body.search
        } else {
            search = await Search.find();
            searchText = search[0].text;
        }
        const postPerPage = 4;
        const numberOfPosts = await Post.find({ status: "public", $text: { $search: searchText } }).countDocuments();
        const posts = await Post.find({ status: "public", $text: { $search: searchText } }).sort({ createAt: "desc" })
            .skip((page - 1) * postPerPage).limit(postPerPage);

        res.render("index.ejs", {
            pageTitle: "نتیجه جستجو",
            path: "/",
            layout: "./layout/dashLayout.ejs",
            fullName: req.user.fullName,
            posts,
            formatDate,
            truncate,
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
    }
}

// module.exports = {
//     getIndex,
//     getSinglePage,
//     getContact,
//     contactHandle,
//     getCaptcha
// }