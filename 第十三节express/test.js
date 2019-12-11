const express=require('./express')
const app=express();


//req:http中的req
//res:http中的res
//添加了一些总结的属性和方法
app.get('/1',function(req,res,next){
    console.log("1.0");
    // res.end('this is 1')
    next();
},function(req,res,next){
    console.log("1.01");
    // res.end('this is 1')
    next();
}
,function(req,res,next){
    console.log("1.02");
    // res.end('this is 1')
    next();
}
,function(req,res,next){
    console.log("1.03");
    // res.end('this is 1')
    next();
})

app.get('/1',function(req,res,next){
    console.log("1.1");
    next()
})

app.get('/1',function(req,res,next){
    console.log("1.2");
    res.end('this is 1')
})


app.listen(3000)
 