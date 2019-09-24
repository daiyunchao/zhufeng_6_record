### NMP的使用

#### 项目的初始化
```javascript
npm init -y //使用默认的方式直接生成
yarn init -y
```

#### 包的下载
```javascript
//安装全局包
npm i http-server -g
yarn global add http-server

//安装本地包
npm i jquery //将会放到package.json中的 dependencies中 表示开发和产品都需要用到该库
//或
npm i jquery -S

//只有在开发时才用到该库 会放置到 devDependencies中
npm i jquery --only=dev
npm i jquery --save-dev
npm i jquery -D
```
放置到`dependencies`中和放置到`devDependencies`的区别:
在项目使用中,无论放置到哪都是可以的,真实的区别在于 当我们将 我们的项目发布到`npm`或是`git`时候,用户在下载使用库时
只会下载`dependencies`关联的库而不会下载`devDependencies`

指定版本安装包
`npm install jquery@2.2.0`

#### 版本号
> 一般的版本号都是3位 `1.0.0` 第一位表示大的更新,可能对旧的代码不兼容了 第二位是增加一些功能 第三位是修复一些bug
> `^2.1.0` 大于该版本并且小于`3`版本
> `~2.1.0` 中间的版本号 不超过`1`
> `>=2.1.0`只要大于`2.1.0`
> `Alpha` `Beta` `RC` `Alpha`还有大量的bug版本 `Beta`已经没有大bug了 `RC`已经很成熟了
> `^2.1.0-beta.1`
#### npm install --production 
> 只安装`dependencies`中的依赖项


#### npm link(本地全局包)
1. 新创建项目
2. 创建`bin`文件夹
3. 在`bin`文件夹中创建`www`文件
4. 在文件中写入`#! /usr/bin/env node` `console.log('my global package')`
5. 在`package.json`文件中添加配置`"bin":{"gpt":"./bin/www"}`
6. 在项目根目录执行 `sudo npm link`
7. 在命令行中输入 `gpt` 就可看到结果了
8. 如果测试没有问题则可以将包放到`npm`官网
`npm` 的作用其实就是在 `usr/local/bin`中建立一个软连接,连接到项目,当执行`gpt`命令时就会通过这个软连接找到项目的`www`文件,再通过`#!`配置的环境运行代码


#### sudo npm cache clean --force 强制清除缓存信息
> 有时候安装库一半的时候取消了,再次安装时可能会出现问题
> 这时候使用该命令就会出现没权限的问题,需要使用该命令清除缓存

#### peerDependencies 要求安装的版本
> 当我们再项目中需要安装特定的版本库的时候可以在`package.json`中添加`peerDependencies`,例如:
 ```javascript
 "peerDependencies":{
   "jquery":"3.4.1"
 }
 ```
 如果版本不匹配或是没有安装`jquery`的话将会被提示

 #### npm pack 打包当前项目
 执行该命令,就会把刚项目自动打包成一个`.tgz`文件
 
 #### bundleDependencies 打包项目时,将包含的依赖一起打包
 > 当我们在执行 `npm pack`时 会生成一个`.tgz`文件,但依赖的包默认是不会被打包到里面的,可以通过`bundleDependencies`将需要的安装包一起打包

 #### optionalDependencies 可选包
 > 可下载可不下载的包,就算下载失败也可以

 #### 使用npm升级项目版本 npm version xxx
 > 升级最小的版本(如该版本修复一些bug)使用 `npm version patch`
 > 添加了一些小的功能 `npm version minor`
 > 大的改动 `npm version major`
 > 使用`npm version`的方式升级版本和`直接在 package.json`中修改代码有什么不一样呢?
 > 使用该功能可连通`git`的`tag`一起升级


#### npm script
使用`package.json`中的`scripts`字段配置要执行的脚本
1. 可执行 `scripts:{"test":"mocha ./test.js"}`
2. 可执行`node_modules/.bin`下的文件
3. 可使用`npx`直接执行 `node_modules/.bin`下的文件 如:`npx mime 1.jpg`
4. 使用`npx`的好处是啥呢? 如果当前没有使用到的模块,可以立即安装该模块,使用完成后销毁该模块(相当于临时使用)
5. `npx`举例,`npx create-react-app project name` 如果使用`npx`去安装`react`每次都是最新的包,如果使用`npm`下载到本地每次想用最新版本还需要升级

#### nrm切换npm源
> 安装全局`nrm` `sudo npm install nrm -g `
> `nrm ls` 可查看到全部的源
> `nrm use npm` 切换到`npm`的官方源


#### npm发布流程
1. 切换`npm`源到官方源(使用`nrm`,见上例)
2. `npm addUser `或是 `npm login`
3. `npm publish`

