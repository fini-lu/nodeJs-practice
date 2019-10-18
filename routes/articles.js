var express=require('express')
var router=express.Router();
var articleModel=require('../db/articleModel')

//图片解析
var multiparty=require('multiparty')  //引入模块


var fs=require('fs')

// 文章修改与新增
router.post('/write',(req,res,next)=>{
    let{title,content,username,id}=req.body
    let createTime=Date.now()
    if(id){
        //修改
        id=new Object(id)

        articleModel.updateOne({_id:id},{createTime,content,title,username}).then(date=>{
            res.redirect('/')  
        }).catch((err)=>{
            res.redirect('/write')
        })

    }else{
        //新增
        //记录写文章的用户名
        let username=req.session.username
        //插入数据库
        articleModel.insertMany({title,content,username,createTime}).then((date)=>{
            //入库成功
            // res.send('文章发表成功')
            res.redirect('/')  //发表成功跳转首页
        }).catch((err)=>{
            // res.send('文章发表失败')
            res.redirect('/write') //发表失败原页面刷新
        })
        // res.send({title,content})
    }
    

})

//图片上传与解析
router.post('/upload',(req,res,next)=>{
    var form=new multiparty.Form()
    form.parse(req,(err,field,files)=>{
        if(err){
            console.log('文件上传失败')
        }else{
            var file=files.filedata[0]
            // // //读取流
            var read=fs.createReadStream(file.path)
            // // //写入流
            var write=fs.createWriteStream('./public/imgs/'+file.originalFilename)
            // //管道流。图片写入指定目录
            read.pipe(write)
            write.on('close',()=>{
                res.send({err:0,msg:'/imgs/'+file.originalFilename})
            })
        }
    })
})

//删除文章
router.get('/delete',(req,res,next)=>{
    let id =req.query.id
    id=new Object(id)
    //执行删除
    articleModel.deleteOne({_id:id}).then((data)=>{
        res.redirect('/')
    }).catch(err=>{
        res.redirect('/')
    })
})

module.exports=router;