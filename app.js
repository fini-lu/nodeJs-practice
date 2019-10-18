var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// session 模块引入
var session =require('express-session')
//favicon
var favicon=require('serve-favicon')
// 连接数据库
var db = require('./db/connect')
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
//引入路由文件
var articleRouter=require('./routes/articles')

var app = express();
//favicon 配置
app.use(favicon(path.join(__dirname,'public','favicon.ico')))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
//基于body-parser把客户端post请求中的body数据进行解析，得到json格式的数据
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//静态资源目录
app.use(express.static(path.join(__dirname, 'public')));


//session 中间件配置
app.use(session({
  secret:'keyboard cat', //可以随便改
  resave:false,   //一般false
  saveUninitialized:true,
  cookie:{maxAge:1000*60*60*24}  //设置登入存储时间，单位毫秒值
}))

//用户登入拦截
app.get('*',(req,res,next)=>{
  let{username}=req.session
  let url =req.url

  if(url !='/login' && url != '/regist'){
      if(!username){
        //用户未登入
        res.redirect('/login')
      }
  }
  next()
})


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/articles',articleRouter)  //所有usr带articles 的走articleRouter 路由

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
