import FlattenNode from './flatten-node';
import { flattenTree, travelTree } from './util';

export default class TreeStore {
  constructor(options) {
    this.currentNode = null;
    this.currentNodeKey = null;

    for (let option in options) {
      if (options.hasOwnProperty(option)) {
        this[option] = options[option];
      }
    }

    this.itemsMap = {};
    this.nodesMap = {};

    console.log(this)
    console.time('init');
    // 将树状结构的data扁平化
    this.itemList = flattenTree(this.data, this.props.children, 1, null, this.defaultExpandAll);
    this.itemList.map(item =>{
      this.itemsMap[item.id] = item;
    })
    console.log(this.itemList);
    // 构造nodeList
    this.nodeList = this.itemList.map(item =>{
      let node = new FlattenNode({...item, store: this});
      this.nodesMap[node.id] = node;
      return node;
    })
    console.log(this.nodeList);

    // 过滤掉不显示的节点
    this.visibleNodeList = this.nodeList.filter(n => n.visible);
    console.log(this.visibleNodeList);
    console.timeEnd('init');
    return;

    this.root = new Node({
      data: this.data,
      store: this
    });

    if (this.lazy && this.load) {
      const loadFn = this.load;
      loadFn(this.root, (data) => {
        this.root.doCreateChildren(data);
        this._initDefaultCheckedNodes();
      });
    } else {
      this._initDefaultCheckedNodes();
    }
  }

  // 更新数据
  updateList(){
    // 将树状结构的data扁平化
    console.time("flattenTree");
    this.itemList = flattenTree(this.data, this.props.children, 1, null, this.defaultExpandAll);
    console.timeEnd("flattenTree");
    console.log(this.itemList);
    // 构造nodeList
    console.time("nodeList");
    // this.nodeList = this.itemList.map(item =>{
    //   return new FlattenNode({...item, store: this});
    // })
    this.updateNodeList();
    console.timeEnd("nodeList");
    console.log(this.nodeList);

    // 过滤掉不显示的节点
    console.time("visibleNodeList");
    this.visibleNodeList = this.nodeList.filter(n => n.visible);
    console.timeEnd("visibleNodeList");
    console.log(this.visibleNodeList);
  }

  // 更新节点列表
  updateNodeList(){
    // this.nodeList = this.itemList.map(item =>{
    //   return new FlattenNode({...item, store: this});
    // })
    let newNodeList = [];
    let node = null;
    console.log(this.itemList.length);
    for(let i = 0; i < this.itemList.length; i ++){
      for(let j = 0; j < this.itemList.length; j ++){
        console.log(i,j)
      }
    }
    this.nodeList = newNodeList;
  }




  // 展开节点
  expandNode(id){
    console.time("fn expandNode");
    setTimeout(()=>{
      console.timeEnd("fn expandNode");
    })
    let node = null;
    let tree = {};
    tree[this.props.children] = this.data;
    console.time("travelTree");
    travelTree(tree, this.props.children, n =>{
      // console.log(node.id, id)
      if(n.id == id){
        n.expanded = true;
        node = n;
        return false;
      }
      return true;
    })
    console.timeEnd("travelTree");
    // this.updateList();
    console.time("expandNode");
    console.time("expandNode flattenTree")
    console.log(this.data)
    this.itemList = flattenTree(this.data, this.props.children, 1, null, this.defaultExpandAll);
    console.timeEnd("expandNode flattenTree")
    this.itemList.map(item => {
      this.itemsMap[item.id] = item
      this.nodesMap[item.id].expanded = item.expanded;
      this.nodesMap[item.id].visible = item.visible;
    })
    console.log(this.nodesMap[1], this.itemsMap[1], this.data)
    this.visibleNodeList = this.nodeList.filter(n => n.visible);
    console.timeEnd("expandNode");
  }

  // 收缩节点
  collapseNode(id){
    console.time("fn collapseNode");
    setTimeout(()=>{
      console.timeEnd("fn collapseNode");
    })
    let node = null;
    let tree = {};
    tree[this.props.children] = this.data;
    console.time("travelTree");
    travelTree(tree, this.props.children, n =>{
      // console.log(node.id, id)
      if(n.id == id){
        n.expanded = false;
        node = n;
        return false;
      }
      return true;
    })
    console.timeEnd("travelTree");
    // this.updateList();
    console.time("collapseNode");
    this.itemList = flattenTree(this.data, this.props.children, 1, null, this.defaultExpandAll);
    this.itemList.map(item => {
      this.itemsMap[item.id].item
      this.nodesMap[item.id].expanded = item.expanded;
      this.nodesMap[item.id].visible = item.visible;
    })
    console.log(this.nodesMap[1], this.itemsMap[1])
    this.visibleNodeList = this.nodeList.filter(n => n.visible);
    console.timeEnd("collapseNode");
  }

  // 新增节点
  // index: 插入到父节点的指定位置，从0开始计数，无index或大于等于children.length时插到末尾，小于等于0插到头部
  addNode(pId, newNode, index){
    if(this.nodesMap[newNode.id]){
      console.error("the node is already exists");
      return;
    }
    console.time("fn addNode");
    setTimeout(()=>{
      console.timeEnd("fn addNode");
    })
    let node = null;
    let tree = {};
    tree[this.props.children] = this.data;
    console.log(this);
    console.time("travelTree");
    travelTree(tree, this.props.children, n =>{
      console.log(n.id, pId)
      if(n.id == pId){
        node = n;
        return false;
      }
      return true;
    })
    console.timeEnd("travelTree");
    console.log(this, node, this.props.children);
    if(!node){
      console.error("can not find the parent node!");
      return;
    }
    if(!node[this.props.children]){
      node[this.props.children] = [];
    }
    if(index === undefined || index === null || index >= node[this.props.children].length){
      node[this.props.children].push(newNode);
    }else if(index <= 0){
      node[this.props.children].unshift(newNode);
    }else {
      node[this.props.children].splice(index, 0, newNode);
    }
    node.isLeaf = false;
    this.nodesMap[node.id].isLeaf = false;
    console.log(this.data)
    this.itemList = flattenTree(this.data, this.props.children, 1, null, this.defaultExpandAll);
    this.itemList.map(item =>{
      this.itemsMap[item.id] = item;
    })
    let itemIndex = this.itemList.findIndex(item => item.id === newNode.id);
    console.log(itemIndex);
    if(itemIndex === -1){
      console.err("can not find the item!");
      return;
    }
    let flattenNode = new FlattenNode({...this.itemList[itemIndex], store: this});
    this.nodeList.splice(itemIndex, 0, flattenNode);
    this.nodesMap[flattenNode.id] = flattenNode;
    console.log(this.itemList[itemIndex])
    this.visibleNodeList = this.nodeList.filter(n => n.visible);
    console.log(this.nodeList, this.visibleNodeList)

  }

  // 编辑节点
  editNode(data){
    console.log(data);
    if(data.id === null || data.id === undefined){
      console.error("please set the node key");
      return;
    }
    console.time("fn editNode");
    setTimeout(()=>{
      console.timeEnd("fn editNode");
    })
    let node = null;
    let tree = {};
    tree[this.props.children] = this.data;
    console.log(this);
    console.time("travelTree");
    travelTree(tree, this.props.children, n =>{
      // console.log(n.id, data.id)
      if(n.id == data.id){
        node = n;
        return false;
      }
      return true;
    })
    console.timeEnd("travelTree");
    console.log(this, node, this.props.children);
    if(!node){
      console.error("can not find the node!");
      return;
    }
    Object.assign(node, data);
    this.itemList = flattenTree(this.data, this.props.children, 1, null, this.defaultExpandAll);
    this.itemList.map(item =>{
      this.itemsMap[item.id] = item;
    })
    let item = this.itemsMap[data.id];
    if(!item){
      console.error("can not find the item");
      return;
    }
    let flattenNode = new FlattenNode({...item, store: this});
    // let nodeIndex = this.nodeList.findIndex(n => n.id === data.id);
    // if(nodeIndex === -1){
    //   console.error("can not find the node");
    //   return;
    // }
    // Object.assign(this.nodeList[nodeIndex], flattenNode);
    Object.assign(this.nodesMap[flattenNode.id], flattenNode);
    flattenNode = null;
    this.visibleNodeList = this.nodeList.filter(n => n.visible);
  }

  // 删除节点
  deleteNode(id){
    if(id === null || id === undefined){
      console.error("please set the node key");
      return;
    }
    if(!this.nodesMap[id]){
      console.error("please set the correct node key");
      return;
    }
    console.time("fn deleteNode");
    setTimeout(()=>{
      console.timeEnd("fn deleteNode");
    })
    let node = null;
    let tree = {};
    tree[this.props.children] = this.data;
    // console.log(this);
    console.time("travelTree");
    // 找到要删除的节点
    travelTree(tree, this.props.children, n =>{
      // console.log(n.id, data.id)
      if(n.id == id){
        node = n;
        return false;
      }
      return true;
    })
    console.timeEnd("travelTree");
    // console.log(this, node, this.props.children);
    if(!node){
      console.error("can not find the node!");
      return;
    }
    if(!node.parent){
      node.parent = tree;
    }
    let childIndex = node.parent[this.props.children].findIndex(c => c.id === node.id);
    if(childIndex === -1){
      console.error(("can not find the child!"));
      return;
    }
    node.parent[this.props.children].splice(childIndex, 1);
    this.itemList = flattenTree(this.data, this.props.children, 1, null, this.defaultExpandAll);
    this.itemList.map(item =>{
      this.itemsMap[item.id] = item;
      this.nodesMap[item.id].isLeaf = !(item.children&&item.children.length>0);
    })
    let ids = [];
    travelTree(node, this.props.children, n =>{
      ids.push(n.id);
      return true;
    })
    // console.log(ids);
    ids.map(id => {
      this.nodesMap[id].isDelete = true;
      delete this.nodesMap[id];
    })
    // console.log(this.nodeList);
    this.nodeList = this.nodeList.filter(n => !n.isDelete);
    this.visibleNodeList = this.nodeList.filter(n => n.visible);
  }

  filter(value) {
    const filterNodeMethod = this.filterNodeMethod;
    const lazy = this.lazy;
    const traverse = function(node) {
      const childNodes = node.root ? node.root.childNodes : node.childNodes;

      childNodes.forEach((child) => {
        child.visible = filterNodeMethod.call(child, value, child.data, child);

        traverse(child);
      });

      if (!node.visible && childNodes.length) {
        let allHidden = true;
        allHidden = !childNodes.some(child => child.visible);

        if (node.root) {
          node.root.visible = allHidden === false;
        } else {
          node.visible = allHidden === false;
        }
      }
      if (!value) return;

      if (node.visible && !node.isLeaf && !lazy) node.expand();
    };

    traverse(this);
  }

  setData(newVal) {
    const instanceChanged = newVal !== this.root.data;
    if (instanceChanged) {
      this.root.setData(newVal);
      this._initDefaultCheckedNodes();
    } else {
      this.root.updateChildren();
    }
  }

  getNode(data) {
    if (data instanceof Node) return data;
    const key = typeof data !== 'object' ? data : getNodeKey(this.key, data);
    return this.nodesMap[key] || null;
  }

  insertBefore(data, refData) {
    const refNode = this.getNode(refData);
    refNode.parent.insertBefore({ data }, refNode);
  }

  insertAfter(data, refData) {
    const refNode = this.getNode(refData);
    refNode.parent.insertAfter({ data }, refNode);
  }

  remove(data) {
    const node = this.getNode(data);

    if (node && node.parent) {
      if (node === this.currentNode) {
        this.currentNode = null;
      }
      node.parent.removeChild(node);
    }
  }

  append(data, parentData) {
    const parentNode = parentData ? this.getNode(parentData) : this.root;

    if (parentNode) {
      parentNode.insertChild({ data });
    }
  }

  _initDefaultCheckedNodes() {
    const defaultCheckedKeys = this.defaultCheckedKeys || [];
    const nodesMap = this.nodesMap;

    defaultCheckedKeys.forEach((checkedKey) => {
      const node = nodesMap[checkedKey];

      if (node) {
        node.setChecked(true, !this.checkStrictly);
      }
    });
  }

  _initDefaultCheckedNode(node) {
    const defaultCheckedKeys = this.defaultCheckedKeys || [];

    if (defaultCheckedKeys.indexOf(node.key) !== -1) {
      node.setChecked(true, !this.checkStrictly);
    }
  }

  setDefaultCheckedKey(newVal) {
    if (newVal !== this.defaultCheckedKeys) {
      this.defaultCheckedKeys = newVal;
      this._initDefaultCheckedNodes();
    }
  }

  registerNode(node) {
    const key = this.key;
    if (!key || !node || !node.data) return;

    const nodeKey = node.key;
    if (nodeKey !== undefined) this.nodesMap[node.key] = node;
  }

  deregisterNode(node) {
    const key = this.key;
    if (!key || !node || !node.data) return;

    node.childNodes.forEach(child => {
      this.deregisterNode(child);
    });

    delete this.nodesMap[node.key];
  }

  getCheckedNodes(leafOnly = false, includeHalfChecked = false) {
    const checkedNodes = [];
    const traverse = function(node) {
      const childNodes = node.root ? node.root.childNodes : node.childNodes;

      childNodes.forEach((child) => {
        if ((child.checked || (includeHalfChecked && child.indeterminate)) && (!leafOnly || (leafOnly && child.isLeaf))) {
          checkedNodes.push(child.data);
        }

        traverse(child);
      });
    };

    traverse(this);

    return checkedNodes;
  }

  getCheckedKeys(leafOnly = false) {
    return this.getCheckedNodes(leafOnly).map((data) => (data || {})[this.key]);
  }

  getHalfCheckedNodes() {
    const nodes = [];
    const traverse = function(node) {
      const childNodes = node.root ? node.root.childNodes : node.childNodes;

      childNodes.forEach((child) => {
        if (child.indeterminate) {
          nodes.push(child.data);
        }

        traverse(child);
      });
    };

    traverse(this);

    return nodes;
  }

  getHalfCheckedKeys() {
    return this.getHalfCheckedNodes().map((data) => (data || {})[this.key]);
  }

  _getAllNodes() {
    const allNodes = [];
    const nodesMap = this.nodesMap;
    for (let nodeKey in nodesMap) {
      if (nodesMap.hasOwnProperty(nodeKey)) {
        allNodes.push(nodesMap[nodeKey]);
      }
    }

    return allNodes;
  }

  updateChildren(key, data) {
    const node = this.nodesMap[key];
    if (!node) return;
    const childNodes = node.childNodes;
    for (let i = childNodes.length - 1; i >= 0; i--) {
      const child = childNodes[i];
      this.remove(child.data);
    }
    for (let i = 0, j = data.length; i < j; i++) {
      const child = data[i];
      this.append(child, node.data);
    }
  }

  _setCheckedKeys(key, leafOnly = false, checkedKeys) {
    const allNodes = this._getAllNodes().sort((a, b) => b.level - a.level);
    const cache = Object.create(null);
    const keys = Object.keys(checkedKeys);
    allNodes.forEach(node => node.setChecked(false, false));
    for (let i = 0, j = allNodes.length; i < j; i++) {
      const node = allNodes[i];
      const nodeKey = node.data[key].toString();
      let checked = keys.indexOf(nodeKey) > -1;
      if (!checked) {
        if (node.checked && !cache[nodeKey]) {
          node.setChecked(false, false);
        }
        continue;
      }

      let parent = node.parent;
      while (parent && parent.level > 0) {
        cache[parent.data[key]] = true;
        parent = parent.parent;
      }

      if (node.isLeaf || this.checkStrictly) {
        node.setChecked(true, false);
        continue;
      }
      node.setChecked(true, true);

      if (leafOnly) {
        node.setChecked(false, false);
        const traverse = function(node) {
          const childNodes = node.childNodes;
          childNodes.forEach((child) => {
            if (!child.isLeaf) {
              child.setChecked(false, false);
            }
            traverse(child);
          });
        };
        traverse(node);
      }
    }
  }

  setCheckedNodes(array, leafOnly = false) {
    const key = this.key;
    const checkedKeys = {};
    array.forEach((item) => {
      checkedKeys[(item || {})[key]] = true;
    });

    this._setCheckedKeys(key, leafOnly, checkedKeys);
  }

  setCheckedKeys(keys, leafOnly = false) {
    this.defaultCheckedKeys = keys;
    const key = this.key;
    const checkedKeys = {};
    keys.forEach((key) => {
      checkedKeys[key] = true;
    });

    this._setCheckedKeys(key, leafOnly, checkedKeys);
  }

  setDefaultExpandedKeys(keys) {
    keys = keys || [];
    this.defaultExpandedKeys = keys;

    keys.forEach((key) => {
      const node = this.getNode(key);
      if (node) node.expand(null, this.autoExpandParent);
    });
  }

  setChecked(data, checked, deep) {
    const node = this.getNode(data);

    if (node) {
      node.setChecked(!!checked, deep);
    }
  }

  getCurrentNode() {
    return this.currentNode;
  }

  setCurrentNode(currentNode) {
    const prevCurrentNode = this.currentNode;
    if (prevCurrentNode) {
      prevCurrentNode.isCurrent = false;
    }
    this.currentNode = currentNode;
    this.currentNode.isCurrent = true;
  }

  setUserCurrentNode(node) {
    const key = node[this.key];
    const currNode = this.nodesMap[key];
    this.setCurrentNode(currNode);
  }

  setCurrentNodeKey(key) {
    if (key === null || key === undefined) {
      this.currentNode && (this.currentNode.isCurrent = false);
      this.currentNode = null;
      return;
    }
    const node = this.getNode(key);
    if (node) {
      this.setCurrentNode(node);
    }
  }
};
