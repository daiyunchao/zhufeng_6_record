@type('哺乳类')
@name('张三')
class Animal {

}

let dog=new Animal();
console.log(dog);


function type(typeName) {
  console.log(typeName);
  return function (Constructor) {
    console.log(Constructor);
  }
}

function name(name) {
  console.log(name);
  return function (Constructor) {
    console.log(Constructor);
  }
}