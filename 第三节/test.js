
//二叉树
class TwoTree {
  constructor() {
    this.root = null;
    this.level = 0;
  }
  addValue(value) {
    let newNode = new Node(value);
    if (!this.root) {
      this.root = newNode;
    }
    else {
      //如果有根节点
      let find = false;
      let currentNode = this.root;
      while (!find) {
        let left = currentNode.left;
        let right = currentNode.right;
        if (value < currentNode.val && !left) {
          //如果要放左边,并且左边是空值,则说明找到了对象
          currentNode.left = newNode;
          find = true;
        }
        else if (value > currentNode.val && !right) {
          currentNode.right = newNode;
          find = true;
        } else {
          if (value < currentNode.val) {
            currentNode = currentNode.left;
          } else if (value > currentNode.val) {
            currentNode = currentNode.right;
          }
        }
      }
    }
    console.log(JSON.stringify(this));
    
  }
}

//节点
class Node {
  constructor(val) {
    this.val = val;
    this.left = null;
    this.right = null;
  }
}

let twoTree = new TwoTree();
twoTree.addValue(100);
twoTree.addValue(60);
twoTree.addValue(150);
twoTree.addValue(50);
twoTree.addValue(70);
twoTree.addValue(140);
twoTree.addValue(160);