var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var sassMiddleware = require('node-sass-middleware');
let config = require('./config');
const mongoose = require('mongoose');
const tokenService = require('./services/tokenService');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var authRouter = require('./routes/auth');
var seansesRouter = require('./routes/seanses');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: false, // true = .sass and false = .scss
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/files',express.static(path.join(__dirname, 'files')));

app.use((req,res,next)=>{
  const token = tokenService.getToken(req);
  if(token){
    const jwtDecoded = tokenService.getDecoded(token);
    req.jwt = jwtDecoded;
  }else{
    console.error('No token found')
  }
  next();
});
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/seanses', seansesRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



const db = mongoose.connection;
db.on('error', err => console.log(err));

db.once('open', () => {
  console.log(`Server started on port ${config.PORT}`);
});

app.listen(config.PORT,()=>{
  mongoose.set('useFindAndModify', false);
  mongoose.connect(
    config.MONGODB_URI,
    { useNewUrlParser: true }, 
    (err, info)=> { 
      if(err) throw new Error(err);
      console.log('db connected!');
    }
  );
});


module.exports = app;
