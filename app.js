const createError = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
const connectDB = require('./db');

require('dotenv').config();

// const indexRouter = require('./routes/index');
// const usersRouter = require('./routes/users');
const authRoutes = require('./routes/auth');
const transactionRoutes = require('./routes/transaction') ;

const app = express();
const port = process.env.PORT || 8001;

connectDB();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json());

const _api_v1 = '/api/v1';

app.use(_api_v1, authRoutes);
app.use(_api_v1, transactionRoutes);
// app.use('/', indexRouter);
// app.use('/users', usersRouter);

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

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


