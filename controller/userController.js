const bcrypt = require('bcryptjs');
const passport = require('passport');
const fetch = require('node-fetch');
const jwt = require('jsonwebtoken');

const { sendMailForClient } = require('../utils/mailer');
const { User } = require('../model/usersSchema');
const { get500 } = require('../views/errors/errors');

const getLogin = (req, res) => {
    res.render("login", {
        pageTitle: "ورود | Login",
        path: "/login",
        success: req.flash("success-msg") || "",
        error: req.flash("error") || ""
    })
}
const getRegister = (req, res) => {
    res.render("register.ejs", {
        pageTitle: "ثبت نام | register",
        path: "/register",
        errors: []
    })
}
const registerHandler = async(req, res) => {
    const errors = [];
    try {
        const user = await User.findOne({ email: req.body.email });
        if (user) {
            errors.push({
                name: "duplicationErr",
                message: "این ایمیل قبلا در پایگاه داده موجود بوده است"
            })
            return res.render("register.ejs", { pageTitle: "ثبت نام | register", path: "/register", errors: errors })
        } else {
            await User.userValidation(req.body);
            // const pass = await bcrypt.hash(req.body.password,10)

            User.create(req.body);
            req.flash("success-msg", "شما با موفقیت ثبت نام شدید")
            res.redirect("/users/login")
        }
    } catch (error) {
        if (error) {
            error.inner.forEach(e => {
                errors.push({ name: e.path, message: e.message })
            })
        }
        return res.render("register.ejs", { pageTitle: "ثبت نام | register", path: "/register", errors: errors })

    }

}

const handleLogin = async(req, res, next) => {

    if (!req.body["g-recaptcha-response"]) {
        req.flash("error", "پر کردن captcha الزامی میباشد");
        return res.redirect("/users/login");
    } else {
        const URL = `https://google.com/recaptcha/api/siteverify?secret=${process.env.SECRET_KEY}
        &response=${req.body["g-recaptcha-response"]}&remoteip=${req.connection.remoteAddress}`

        // passport.authenticate('local', {
        //         // successRedirect:"/dashboard",
        //         failureRedirect: "/users/login",
        //         failureFlash: true
        //     })(req, res, next)
        try {
            const response = await fetch(URL, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/x-www-form-urlencoded; charset=utf-8"
                }
            })
            const json = await response.json();
            if (json.success) {
                passport.authenticate('local', {
                    // successRedirect:"/dashboard",
                    failureRedirect: "/users/login",
                    failureFlash: true
                })(req, res, next)
            } else {
                req.flash("error", "مشکلی وجود دارد");
                res.redirect("/users/login");
            }
        } catch (error) {
            get500();
        }

    }
}

const logout = (req, res, next) => {
    req.session = null;
    // req.flash("success-msg", "شما با موفقیت خارج شدید");
    req.logout();
    res.redirect("/users/login")
}

const remember = (req, res) => {
    if (req.body.remember) {
        req.session.cookie.originalMaxAge = 24 * 60 * 60 * 1000;
    } else {
        req.session.cookie.originalMaxAge = null;
    }

    res.redirect("/dashboard")

}
const forgetPassword = (req, res) => {
    res.render("./private/forgetPass.ejs", {
        pageTitle: "فراموشی رمز عبور",
        path: "/login",
        error: req.flash("error") || ""
    })
}
const forgetPasswordHandle = async(req, res) => {
    try {
        const user = await User.findOne({ email: req.body.forgetEmail });
        if (!user) {
            req.flash("error", "کاربری با این ایمیل یافت نشد");
            return res.render("./private/forgetPass.ejs", {
                pageTitle: "بازیابی رمز عبور",
                path: "/login",
                error: req.flash("error") || ""
            })
        }
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        const resetLink = `http://localhost:3000/users/resetPassword/${token}`;
        text = `
        برای بازیابی کلمه عبور روی لینک زیر کلیک کنید
        <br/>
        <a href="${resetLink}">لینک تغییر رمز عبور</a>
        `
        sendMailForClient(req.body.forgetEmail, "بازیابی رمز عبور", text);

        res.send(resetLink)

    } catch (error) {
        console.log(error);
    }
}


const resetPassword = (req, res) => {
    let decodedToken;
    try {

        const token = req.params.token;
        decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decodedToken);

        res.render("./private/resetPass.ejs", {
            pageTitle: "بازیابی رمز عبور",
            path: "/login",
            error: req.flash("error") || "",
            userId: decodedToken.userId
        })

    } catch (error) {
        console.log(error);
        if (!decodedToken) {
            return res.redirect("/404");
        }
    }
}

const resetPasswordHandle = async(req, res) => {
    try {
        const userId = req.params.userId;
        if (req.body.pass !== req.body.confirmPass) {
            return res.render("./private/resetPass.ejs", {
                pageTitle: "بازیابی رمز عبور",
                path: "/login",
                error: "کلمه عبور و تکرار کلمه عبور  باید یکسان باشند",
                userId
            })
        }
        if (req.body.pass.length < 5) {
            return res.render("./private/resetPass.ejs", {
                pageTitle: "بازیابی رمز عبور",
                path: "/login",
                error: "کلمه عبور باید دارای حداقل پنج کاراکتر باشد",
                userId
            })
        }
        const user = await User.findOne({ _id: userId });
        if (!user) {
            return res.redirect("/404");
        }
        user.password = req.body.pass;
        user.save();
        return res.render("login", {
            pageTitle: "ورود | Login",
            path: "/login",
            success: "رمز شما با موفقیت تغییر کرد",
            error: req.flash("error") || ""
        })

    } catch (error) {
        console.log(error);
    }
}
module.exports = {
    registerHandler,
    handleLogin,
    logout,
    getLogin,
    remember,
    getRegister,
    forgetPassword,
    forgetPasswordHandle,
    resetPassword,
    resetPasswordHandle
}