const express = require('express');
const bodeyParser = require('body-parser');
const dotEnv = require('dotenv');
const morgan = require('morgan');
const fileUpload = require('express-fileupload');
const { path } = require('app-root-path');
const join = require('path');
const expressEjsLayouts = require('express-ejs-layouts');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');
const { logger } = require('./config/winston');
const { connectDb } = require('./utils/database');
const { dashRouter } = require('./routes/dashRoutes');
const { blogRouter } = require('./routes/blogRouter');
const { usersRouter } = require('./routes/usersRouter');
const { get404 } = require('./views/errors/errors');


const app = express();

//initialize envirement varialbles
dotEnv.config({ path: "./config/config.env" })
    //initialize envirement varialbles

//connect to database
connectDb()
    //connect to database

//passport configuration
require('./config/passport');
//passport configuration


//MiddleWares
app.use(bodeyParser.urlencoded({ extended: false }));
app.use(bodeyParser.json());
app.use(fileUpload());

// if(process.env.NODE_ENV==="development"){
//     app.use(morgan("combined",{stream:logger.stream}))
// }
app.use(expressEjsLayouts)

app.use(session({
    secret: process.env.sessionSecret,
    // cookie:{maxAge:86400000},
    unset: "destroy",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.mongoURI, collectionName: "session" })
}))
app.use(passport.initialize());
app.use(passport.session());

app.use(flash())
    // end of MiddleWares

//set statics
app.use(express.static(join.join(path, "public")))
    //set statics

//set view engine
app.set("view engine", "ejs");
app.set("views", "views");
app.set("layout", "./layout/mainLayout")


//end of set view engine

//routes
app.use("/dashboard", dashRouter);
app.use("/users", usersRouter);
app.use("/", blogRouter);
app.use(get404)

//end of routes

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`app is runnig in ${process.env.NODE_ENV} mode on port ${port}`))