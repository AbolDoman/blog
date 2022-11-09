const get404 = (req, res) => {
    res.render("errors/404.ejs", { pageTitle: "404", layout: "./layout/errLayout.ejs" })
}
const get500 = (req, res) => {
    res.render("errors/500.ejs", { pageTitle: "404", layout: "./layout/errLayout.ejs" })
}
const getNotAuth = (req, res) => {
    res.render("errors/notAuth.ejs", { pageTitle: "404", layout: "./layout/errLayout.ejs" })
}

module.exports = {
    get404,
}