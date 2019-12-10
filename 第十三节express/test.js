const express=require('./my_express')
const app=express();


//req:http中的req
//res:http中的res
//添加了一些总结的属性和方法
app.get('/',function(req,res){
    console.log("this is basic use");
    
})

app.listen(3000)
 