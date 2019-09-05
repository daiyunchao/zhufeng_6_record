//观察者模式和订阅发布模式的不同点在于,订阅发布模式 订阅者和发布者是解耦的,他们的关联是通过第三方来的
//而观察者模式 是观察者和被观察者有关系,被观察者身上存放了观察者信息,被观察者主动通知观察者,被观察者通知观察者他的改变


//小宝宝
//小宝宝是被观察者
class XiaoBaoBao {
  //添加观察者,
  constructor(name) {

    //小宝贝自己的名字
    this.name = name;

    //存放观察者
    this.observers = [];

    //小宝宝的初始状态
    this.state = "开心的";
    console.log(`我是${this.name}小朋友,我现在的状态是:${this.state}`);

  }

  //小宝贝添加观察他的家长
  addObserver(jiazhang) {
    this.observers.push(jiazhang);
  }

  //当小宝宝的状态改变了
  setState(newState) {
    this.state = newState;
    //告诉家长,他的状态改变
    this.observers.forEach(jiazhang => {
      jiazhang.updateState(newState);
    })
  }
}

//家长
//家长是观察者
class JiaZhang {
  constructor(name, shenfen) {
    this.name = name;
    this.shenfen = shenfen;
  }
  updateState(newState) {
    console.log(`我是${this.shenfen},我知道了,小宝宝的状态改变了,现在的状态时:${newState}`);
  }
}

//一个叫 double的小朋友
let double = new XiaoBaoBao('double');

//这是他的爸爸妈妈
let baba = new JiaZhang('dai', 'baba');
let mama = new JiaZhang('liping', 'mama');

//建立关系:
double.addObserver(baba);
double.addObserver(mama);

//小宝宝的状态产生了改变
double.setState('不开心了');
double.setState('要看电视了,开心的飞起');





