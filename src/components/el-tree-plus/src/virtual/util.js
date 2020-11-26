export const flattenTree = function(
  tree,
  childKey = "children",
  level = 1,
  parent = null,
  defaultExpand = true
) {
  let arr = [];
  // console.log(tree);
  tree.forEach(item => {
    // console.log(item)
    if(item.id === 8){
      console.log(item)
    }
    item.level = level;
    if (item.expanded === undefined) {
      item.expanded = defaultExpand;
    }
    item.visible = true;
    if (parent && (!parent.visible || !parent.expanded)) {
      item.visible = false;
    }
    item.parent = parent;
    arr.push(item);
    if (item[childKey]) {
      arr.push(
        ...flattenTree(
          item[childKey],
          childKey,
          level + 1,
          item,
          defaultExpand
        )
      );
    }
  });
  return arr;
};

export const travelTree = function(node, childrenName, cb){
  // console.log(node, childrenName)
  if(typeof cb === 'function'){
    if(!cb(node)) return false;
  }
  const children = node[childrenName];
  if(children && children.length > 0){
    return !children.some(child => !travelTree(child, childrenName, cb));
  }
  return true;
}