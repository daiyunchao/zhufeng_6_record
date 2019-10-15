const fs = require('fs');
const path = require('path')

function mkdir(dirpath) {
  let absolutePath = path.join(__dirname, dirpath);
  console.log(absolutePath);

  //将路径拆分
  //分段判断是否文件夹存在
  //如果不存在,创建文件夹
  let dirpaths = dirpath.split('/');
  let index = 1;
  function next() {
    if (index === dirpaths.length + 1) {
      return;
    }
    let currentDirpath = dirpaths.slice(0, index++).join('/');
    console.log(currentDirpath);

    let isExists = fs.existsSync(currentDirpath);
    if (isExists) {
      //文件是存在的,创建下一级
      next();
    } else {
      //文件不存在,创建文件夹
      fs.mkdirSync(currentDirpath);
      next();
    }
  }

  next();

}

// mkdir('./a/b/c/d/e/f');
console.log("创建完成....");


// function rmdir(dirpath) {
//   //读取目的,判断目录中是否有文件或是文件夹
//   //如果有文件删除文件
//   //如果有文件夹再判断它其中是否有文件或文件夹
//   let absolutePath = path.join(__dirname, dirpath);
//   let currentPath = absolutePath;
//   function next(rmpath) {
//     let dirs = fs.readdirSync(rmpath);
//     if (dirs.length == 0) {
//       //如果是没有长度,则说明没有文件或是文件夹
//       return fs.rmdirSync(rmpath);
//     }
//     dirs.forEach(item => {
//       let newPath = path.join(rmpath, item);
//       let stat = fs.statSync(newPath);
//       if (stat.isFile()) {
//         //如果是文件
//         fs.unlinkSync(newPath)
//       } else {
//         //如果是文件夹
//         next(newPath);
//       }
//     });

//     //执行完了内部文件的删除再删除本文件夹
//     fs.rmdirSync(rmpath);
//   }
//   next(currentPath);

// }

const { stat, readdir, rmdir, unlink } = require('fs').promises;

async function rmdirNew(dirpath) {
  let s=await stat(dirpath);
  if (s.isFile()) {
    //如果是文件
    await unlink(dirpath);
  } else {
    //如果是文件夹
    let dirs = await readdir(dirpath);
    dirs = dirs.map(item => rmdirNew(path.join(dirpath, item)));
    await Promise.all(dirs);
    await rmdir(dirpath);
  }
}
rmdirNew(path.join(__dirname, './a'));



