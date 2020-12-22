var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const jwt = require('jsonwebtoken');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
// +++++++++++++++++++++++++++++++++++++++++++++++++

var mongojs = require('mongojs')

var db = mongojs("database",["login"],["register"])

var mongo = require ('mongodb');
var assert = require('assert');

app.post("/login",function(req,res,next){

	console.log("login body ==>>",req.body);
	var mail = req.body.mail;
	console.log('mail: ', mail);
	var password = req.body.password
	console.log('password: ', password);
       var user ={
		mail:mail,
		password:password
	   }
	db.login.find({mail:mail,password:password}).toArray(function(err,result){
		if (result.length == 0) {
		console.log("result not found",result);
        res.send({status:false,message:"invalide user"})

	}else{
		console.log("result  found",result);
		var time = '4h'
		jwt.sign({ user }, 'secretkey', { expiresIn: time }, (err, token) => {
			console.log(" token ==>>", token);
			token = {
				token: token
			}
		res.send({status:true,message:"login successfully",token: token})
			
	});  
	}
	})
})
app.post("/adduser_api",function(req,res,next){

	console.log("adduser_api body ==>>",req.body);
	var name   =req.body.name;  
	console.log('name: ', name);
	var mail =req.body.emailid;
	console.log('mail: ', mail);
	var password =req.body.password; 
	console.log('password: ', password);

	db.login.insert({ mail:mail,password:password,name:name}, function (err, result) {
		console.log(" result ", result)
		// res.send({ status: true, message: "state has been inserted" })
	  })
})

function verifyToken(req, res, next) {
    console.log(" verifyToken ==>>", req.headers);
    // Get auth header value
    const bearerHeader = req.headers['authorization'];
    // Check if bearer is undefined
    if (typeof bearerHeader !== 'undefined') {
        // Split at the space
        const bearer = bearerHeader.split(' ');
        // Get token from array
        const bearerToken = bearer[1];
        // Set the token
        req.token = bearerToken;
        // Next middleware
        jwt.verify(req.token, 'secretkey', (err, authData) => {

            if (err) {
                console.log(" unaoutherized user ==>>");
                res.sendStatus(403);
            } else {
                console.log(" data =authData==>>", authData);

                next()
            }
        });
    } else {
        // Forbidden
        res.sendStatus(403);
    }


}

// ++++++++++++++++++++++++++++++++++++++++++++++
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

module.exports = app;
app.listen("4444",function(){
	console.log("server start on 4444");
})