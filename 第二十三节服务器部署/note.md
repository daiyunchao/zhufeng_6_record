### Docker最常规操作
- Docker
- Docker 让开发者可以打包他们的应用以及依赖包到一个可移植的镜像中,然后发布到任何服务器上去,容器之间都是沙盒状态
- Docker分为企业版(EE)和社区版(CE)
- 安装Docker安装官方文档步骤安装
- Docker的理解: Docker就像一个虚拟机,在每一个容器中有这个项目的依赖,这就避免了相同的代码在不同的环境中出现的问题
![Docker构架图](https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1578376208889&di=18321b200b9cb9701f25258dc54d8040&imgtype=jpg&src=http%3A%2F%2Fimg.dongcoder.com%2Fup%2Finfo%2F201807%2F20180715132007371540.png)

- Docker核心的命令:`docker build 通过配置文件构建自己的景象` `docker pull 下载景象到本地` `docker run 通过景象启动容器`
- 查看当前启动的docker容器 `docker container ls` `docker container ls -a 查看全部`
- 删除容器 `docker container rm (-f 强行删除) 容器ID`
- 查看当前的景象 `docker image ls`

#### 自己配置一个镜像启动Node进程
```javascript
//当前有项目docker,项目中包含文件 dockerenv/app/server.js
const http=require('http');
let app=http.createServer((req,res)=>{
    res.end('hello world')
})
app.listen(3000);

//项目中包含文件 dockerenv/app/package.json
{
    "scripts":{
        "start":"node server.js"
    }
}

//创建一个dockerfile,用于创建镜像 DOCKERFile
FROM node:last //居于node的最新版本的镜像
COPY ./app /app //将当前目录的./app文件夹copy到镜像中的app文件夹中
WORKDIR /app //镜像的执行目录
RUN npm install //当启动镜像时执行的命令
EXPOSE 3000 //暴露当前镜像的3000端口
CMD npm start //当容器启动时执行命令
//然后在app外层 执行命令进行docker对image的编译
// 参数 -t 是指定镜像的名称 . 是指编译的目录 "."表示当前目录 
docker build -t dockertest .

//编译镜像完成后,再执行docker run 启动一个刚编译好的容器
//参数 -p 端口映射 当访问本机的3333端口时将映射到docker的3000端口(相当于访问的时候访问3333端口了) -it将容器的shell映射到当前的shell中,在当前执行的shell中执行的命令将会在容器中执行, dockertest是使用镜像的名称 /bin/bash 容器启动后执行的第一个命令,这里启动了bash容器以便执行脚本 -d 后台运行
docker run -p 3333:3000 -it dockertest /bin/bash

```