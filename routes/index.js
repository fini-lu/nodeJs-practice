var express = require('express');
var router = express.Router();
var articleModel = require('../db/articleModel')
var moment = require('moment')

/*首页路由*/
router.get('/', function (req, res, next) {
  //数据类型，要求是int
  let page = parseInt(req.query.page || 1)
  let size = parseInt(req.query.size || 5)
  let username=req.session.username
  //第一步：查询文章总数和总页数
  articleModel.find().count().then((total) => {
    //获取总页数
    var pages = Math.ceil(total / size)
    //第二部：分页查询
    //sort()按文章时间，倒序查询
    //limit() 每页显示多少条
    //skip() 分页实现
    articleModel.find().sort({ "createTime": -1 }).limit(size).skip((page - 1) * size).then((docs) => {
      //对数据中的数据进行处理，docs不是纯粹意义上的JS数组，要使用slice()方法把它转成JS数组
      var arr = docs.slice()
      for (let i = 0; i < arr.length; i++) {
        arr[i].createTimeZH = moment(arr[i].createTime).format("YYYY-MM-DD HH:mm:ss")
      }
      res.render('index', { data: { list: arr, total: pages, username:username} })
    }).catch(err => {
      res.redirect('/')
    })
  }).catch(err => {
    res.redirect('/')
  })
});

//注册页面路由
router.get('/regist', function (req, res, next) {
  res.render('regist', {});
});

//登入页面路由
router.get('/login', function (req, res, next) {
  res.render('login', {});
});

//写文章路由
router.get('/write', function (req, res, next) {
  var id = req.query.id
  // let username=req.session.username
  if (id) {
    id = new Object(id)
    //用ID查询
    articleModel.findById(id).then((doc) => {
      // res.send({data:docs})
      res.render("write", { doc: doc })
    }).catch((err) => {
      // res.send(err)
      res.redirect('/')
    })
  } else {
    //新增
    var doc={
      _id:'',
      username:req.session.username,
      title:'',
      content:''
    }
    res.render('write', {doc}); 
  }

});

//详情页路由
router.get('/detail', function (req, res, next) {
  //查询当前文章详情
  var id = new Object(req.query.id)

  //用ID查询
  articleModel.findById(id).then((doc) => {
    // res.send({data:docs})
    doc.createTimeZH = moment(doc.createTime).format("YYYY-MM-DD HH:mm:ss") //时间处理
    res.render("detail", { doc: doc })
  }).catch((err) => {
    res.send(err)
  })

  //用time查询
  // articleModel.find({"createTime":parseInt(req.query.id)}).then((docs)=>{
  //   res.send({data:docs})
  // }).catch((err)=>{
  //   res.send(err)
  // })

});

module.exports = router;
