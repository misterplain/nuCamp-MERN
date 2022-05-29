var createError = require("http-errors");
var express = require("express");
var path = require("path");
// var cookieParser = require("cookie-parser");
var logger = require("morgan");
//express session, file store is function that returns another function
// const session = require("express-session");
// const FileStore = require("session-file-store")(session);
//passport and authenticate
const passport = require("passport");
const authenticate = require("./authenticate");
const config = require("./config");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
const campsiteRouter = require("./routes/campsiteRouter");
const promotionRouter = require("./routes/promotionRouter");
const partnerRouter = require("./routes/partnerRouter");
const uploadRouter = require("./routes/uploadRouter");

const mongoose = require("mongoose");

const url = config.mongoUrl;
const connect = mongoose.connect(url, {
  useCreateIndex: true,
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

connect.then(
  () => console.log("Connected correctly to server"),
  (err) => console.log(err)
);

var app = express();

//reroute from http to https
app.all("*", (req, res, next) => {
  if (req.secure) {
    return next();
  } else {
    console.log(
      `Redirecting to: https://${req.hostname}:${app.get("secPort")}${req.url}`
    );
    res.redirect(
      301,
      `https://${req.hostname}:${app.get("secPort")}${req.url}`
    );
  }
});

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//parse incoming cookies and help prove authenticity of a cookie, prodive secret key as argumemt, below line is commented out once we started using express sessions
// app.use(cookieParser("12345-67890-09876-54321"));

// app.use(
//   session({
//     name: "session id",
//     secret: "12345-67890-09876-54321",
//     //once a session has been created and updated and saved, it will continue to be resaved when a request is made for that session, keeps session marked as active
//     resave: false,
//     //when a new session is created but then no updates are made, end of request it won't get saved bcit will be empty sesion without useful info, no cookie will be sent to client, prevents having empty session files and cookies being set up
//     saveUninitialized: false,
//     //createa  new file store as an object that we can use to save session info
//     store: new FileStore(),
//   })
// );

//set up passport and session
app.use(passport.initialize());
app.use(passport.session());

//put here so that unauthenticated users can access this before tey're challenged to authenticate themselves, this also redirects unauthenticated users to the index page
app.use("/", indexRouter);
app.use("/users", usersRouter);

//this is where we will make authenticated requests so that only users can access static data, put beneath if it's okay that users can see static data from the database
// function auth(req, res, next) {
//   console.log(req.user);

//   if (!req.user) {
//     const err = new Error("You are not authenticated!");
//     err.status = 401;
//     return next(err);
//   } else {
//     return next();
//   }
// }

// app.use(auth);

app.use(express.static(path.join(__dirname, "public")));

app.use("/campsites", campsiteRouter);
app.use("/promotions", promotionRouter);
app.use("/partners", partnerRouter);
app.use('/imageUpload', uploadRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
