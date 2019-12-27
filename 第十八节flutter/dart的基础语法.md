### Dart的基础语法

1. 可以通过var声明变量 类型可以通过值来推断具体的类型
```dart
var name = "hi"; //String类型
var age = 18; //int类型
var high = 1.70; //double类型

```
如上变量定义后其类型已经确定，不可再将其他类型的值赋给变量
```dart
var name = "hi"; //String类型
name = 3; //此处编译器会报错，name被定义赋值之后已经是一个String类型，不可再赋值int类型值

```
2. 也可以使用特定类型来定义变量
```dart
String name = "bruce"; //String类型
int age = 18; //int类型

```
3. 如果变量不限于单个类型，则可以使用dynamic或Object来定义变量
```dart
dynamic value = 18;
print("value = $value");
value = "bruce";
print("value = $value");
value = 3.5;
print("value = $value");
 
Object val = 18;
print("val = $val");
val = "bruce";
print("val = $val");
val = 3.5;
print("val = $val");

```
4. 如何类型的值没有赋值默认值都是null
```dart
String name;
var age;
//默认值都是null值
```

5. final和const 都表示该值不能修改,但final是运行时的赋值包含就是说 如果一旦赋值,初始化时可以不赋值,就不能更改为其他的值,但const是编译期间的赋值保护 初始化时必须赋值
```dart
// Person类
class Person {
  static const desc = "This is a Person class"; //必须定义时赋值，否则编译时报错
  final name;//初始化时可以不赋值
  Person(this.name); //对象初始化时赋值一次
}

// 定义一个Person对象
Person p = Person("Bruce"); //创建对象时设置一次name
print("p.name = ${p.name}"); //可正常输出 p.name = Bruce
p.name = "haha"; //编译器报错


//
void main(){
 final a={"name":"zhagsan"};
 const b={"name":"lisi"};
 a["name"]="wangwu";//正确,如果是final 是可以修改对象中的属性的
 b["name"]="zhaoliu";//错误不能修改const定义的对象中的属性
  print("a $a");//这种方式将 插值表达式 还有一种方式是 ${a+b} 要执行的代码
  print("a $b");
}
```
6. 内置类型:
 1. number类型 1)int 2)double
 2. String 单行字符串 `String name='zhangsan' ` 多行字符串 `String name=""" name is 张三
age is 18"""` r原样输出 `String name='zhangsan \n lisi' //输出两行  String name= r'zhangsan \n lisi' //输出\n而不是转义`
String中还有添加了js中没有的方法`replaceAll` `String name ='zhangsan'*3` 表示循环zhangsan3次
 3. Boolean true false
 4. List `List names=['zhangsan','lisi','wangwu',true,1,2]` 创建一个不可变的数组`List list=const[1,2,3]` ,创建一个只有单一类型的List `List list=<int>[1,2,3]`
   数组中的一些方法 `add` 同js中的`push` `insert(index,value)` 在指定的index位置插入一个值 `remove(value)` 删除值相同的项,只会删除第一个找到的 `clear`清空数组
 5. Map `Map users={name:'zhangsan',age:18}` Map的循环使用`forEach`
```dart
//和js不同的是,dart中的map的key值也可以是不同的数据类型
var list=[1,2,3]
Map map={
  "name":"zhangsan",//key值是一个正常的字符串
  true:2,//key值是一个boolean类型
  3:false,//key值是一个int类型
  list:"wangwu"//key值是一个变量
}
  print(map["name"]);
  print(map[true]);
  print(map[3]);
  print(map[list]);
  //都能正常的打印出结果
```



1. 函数
函数的定义:
```dart
String getName() {
  return "Bruce";
}

//箭头函数的写法:
String getName() => "Bruce";

```

函数的参数
```dart
// 参数是可选的
void showDesc({var name, var age}) {
  if(name != null) {
    print("name = $name");
  }
  if(age != null) {
    print("age = $age");
  }
}

// 函数调用
showDesc(name: "Bruce");

// 输出结果
name = Bruce

//或是使用[]标记参数的可选
// 函数定义
void showDesc(var name, [var age]) {
  print("name = $name");
 
  if(age != null) {
    print("age = $age");
  }
}

// 函数调用
showDesc("Bruce");

// 输出结果
name = Bruce


//默认值参数,只能为可选参数添加默认值,必填参数不能添加默认值
// 函数定义
void showDesc(var name, [var age = 18]) {
  print("name = $name");
 
  if(age != null) {
    print("age = $age");
  }
}

// 函数调用
showDesc("Bruce");

// 输出结果
name = Bruce
age = 18

```

main函数,程序的人口函数

函数可当成参数传递
```dart
// 函数定义
void println(String name) {
  print("name = $name");
}

void showDesc(var name, Function log) {
  log(name);
}

// 函数调用
showDesc("Bruce", println);

// 输出结果
name = Bruce

```

匿名函数
```dart
// 函数定义
void showDesc(var name, Function log) {
  log(name);
}

// 函数调用，匿名函数作为参数
showDesc("Bruce", (name) {
    print("name = $name");
  });

// 输出结果
name = Bruce

```

函数的嵌套(和js类似)
```dart
// 函数定义
void showDesc(var name) {
  print("That is a nested function!");
 
  //函数中定义函数
  void println(var name) {
    print("name = $name");
  }
 
  println(name);
}

// 函数调用
showDesc("Bruce");

// 输出结果
That is a nested function!
name = Bruce

```
7 运算符
基本和js类似 js中没有的`??`非空判断 级联操作`..`

```dart
//?.的使用
//定义类
class Person {
  var name;
  Person(this.name);
}

// 调用
Person p;
var name = p?.name; //先判断p是否为null，如果是，则name为null；如果否，则返回p.name值
print("name = $name");

// 输出结果
name = null


// ~/的使用
// 代码语句
var num = 10;
var result = num ~/ 3; //得出一个小于等于(num/3)的最大整数
print("result = $result");

// 输出结果
result = 3

// as的使用，as用来做类型转化
// 类定义
class Banana {
  var weight;
  Banana(this.weight);
}

class Apple {
  var weight;
  Apple(this.weight);
}

// 调用
dynamic b = Banana(20);
(b as Banana).weight = 20; // 正常执行
print("b.weight = ${(b as Banana).weight}");
(b as Apple).weight = 30; // 类型转换错误，运行报错
print("b.weight = ${(b as	Apple).weight}");

//输出结果
b.weight = 20
Uncaught exception:
CastError: Instance of 'Banana': type 'Banana' is not a subtype of type 'Apple'

//is的使用
// 函数和类代码定义
getFruit() => Banana(20); // 获取一个水果对象

class Banana {
  var weight;
  Banana(this.weight);
}

class Apple {
  var color;
  Apple(this.color);
}

// 调用
var b = getFruit();
if(b is Apple) { //判断对象是否为Apple类
  print("The fruit is an apple");
} else if(b is Banana) { //判断水果是否为Banana类
  print("The fruit is a banana");
}

// 输出结果
The fruit is a banana

//??的使用
// 操作代码块
String name;
String nickName = name ?? "Nick"; //如果name不为null，则nickName值为name的值，否则值为Nick
print("nickName = $nickName");
 
name = "Bruce";
nickName = name ?? "Nick"; //如果name不为null，则nickName值为name的值，否则值为Nick
print("nickName = $nickName");
 
// 输出结果
nickName = Nick
nickName = Bruce

//..的使用，级联操作允许对同一个对象进行一系列操作
// 类定义
class Banana {
  var weight;
  var color;
  Banana(this.weight, this.color);
 
  void showWeight() {
    print("weight = $weight");
  }
 
  void showColor() {
    print("color = $color");
  }
}

// 调用
Banana(20, 'yellow')
    ..showWeight()
    ..showColor();
   
// 输出结果
weight = 20
color = yellow


```

8. 流程控制语句	和js类似 不同的是 switch case 可以使用continue指定下一个case
```dart
var fruit = 'apple';
switch (fruit) {
  case 'banana':
    print("this is a banana");
    continue anotherFruit;
     
  anotherFruit:
  case 'apple':
    print("this is an apple");
    break;
}

// 输出结果
this is an apple

```

9. try-catch-finally
```dart
// 定义一个抛出异常的函数
void handleOperator() => throw Exception("this operator exception!");

// 函数调用
try {
  handleOperator();
} on Exception catch(e) {
  print(e);
} finally { // finally语句可选
  print("finally");
}

// 输出结果
Exception: this operator exception!
finally

```
10. 类
```dart
// 类定义
class Tree {
  var desc;
 
  // 命名构造函数
  //当调用该方法时也会产生一个类的实例
  Tree.init() {
    desc = "this is a seed";
  }
 
  // 函数体运行之前初始化实例变量
  //实例化对象时给desc赋值
  Tree(var des) : desc = des;
}

// 构造函数调用
Tree t = Tree.init();
print("${t.desc}");

Tree t1 = Tree("this is a tree");
print("${t1.desc}");

// 输出结果
this is a seed
this is a tree

```
构造函数的 继承
``dart
// 类定义
class Fruit {
  Fruit() {
    print("this is Fruit constructor with no param");
  }
 
  Fruit.desc(var desc) {
    print("$desc in Fruit");
  }
}

class Apple extends Fruit {
  Apple():super() {
    print("this is Apple constructor with no param");
  }
 
  // 默认继承无参构造函数
  //执行该方法时会先执行Fruit()无参的构造函数
  Apple.desc(var desc) {
    print('$desc in Apple');
  }
}

// 构造函数调用
Apple();
Apple.desc("say hello");
 
// 输出结果
this is Fruit constructor with no param
this is Apple constructor with no param
this is Fruit constructor with no param
say hello in Apple

```
mixin继承
```dart
// 类定义
class LogUtil {
  void log() {
    print("this is a log");
  }
}

class Fruit {
  Fruit() {
    print("this is Fruit constructor with no param");
  }
}

//感觉就像是多根继承一样
class Apple extends Fruit with LogUtil {
  Apple():super() {
    print("this is Apple constructor with no param");
  }
}

// 调用
Apple a = Apple();
a.log(); //可执行从LogUtil继承过来的方法

// 输出结果
this is Fruit constructor with no param
this is Apple constructor with no param
this is a log

```

11. 泛型
```dart
// 类定义
class Apple {
  var desc;
  Apple(this.desc);
 
  void log() {
    print("${this.desc}");
  }
}

class Banana {
  var desc;
  Banana(this.desc);
 
  void log() {
    print("${this.desc}");
  }
}

class FruitFactory<T> {
  T produceFruit(T t) {
    return t;
  }
}

// 调用
FruitFactory<Banana> f = FruitFactory<Banana>();
Banana b = f.produceFruit(Banana("a banana"));
b.log();
 
FruitFactory<Apple> f1 = FruitFactory<Apple>();
Apple a = f1.produceFruit(Apple("an apple"));
a.log();
 
// 输出结果
a banana
an apple 

```