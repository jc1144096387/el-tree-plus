let id = 0;

function createTreeData(){
  let root = {
    id: id,
    title: id++,
    children: createChildren(10000)
  }
  return [root];
}

function createChildren(num){
  let children = [];
  for(let i = 0; i < num; i ++){
    children.push({
      id: id,
      title: id++
    })
  }
  return children;
}

const treeData = createTreeData();

export default treeData;