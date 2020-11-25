# el-tree-plus
## 背景
大数据平台有海量数据，树组件需要展示大量节点，el-tree不满足展示大量节点的需求，数据量较大时，el-tree会出现卡死，甚至导致网页崩溃
为解决这一问题，需要修改el-tree源码，引入vue-virtual-scroll-list实现虚拟滚动


## TODO List
- 更仔细的了解vue-virtual-scroll-list的用法
- 考虑如何改造el-tree
  + 阅读el-tree store逻辑，考虑如何扁平化存储
  + 数组扁平化和添加level
  + 根据level缩进和处理细节样式
  + 展开、收缩、增删改、移动、复制、定位等操作实现
  + slot和render
  + 性能测试
  + 代码整理和封装，提供更好的接口

- 功能完善之后，考虑优化flatten操作，15w节点flatten操作栈溢出

## 实现思路
将树状结构的数据扁平化，得到带层级的节点列表
在修改过程中，尽量不修改vue-virtual-scroll-list的源码和el-tree的使用方式，通过修改el-tree的源码，在不改变使用方式的前提下引入虚拟滚动特性。

展开收缩通过修改传入虚拟列表的数组来实现，tree需要保留一份完整的数组和一份过滤后传给虚拟列表的数组
展开收缩应该借助一个栈，根据level和expand来遍历完整数组即可
估计这星期应该能把大致demo肝出来，后面再慢慢细化，以及考了替换数据源树
定位按理说只需要遍历过滤后的数组，然后传入start即可
slot和render都有现成案例，应该不难，主要是细节处理
每次计算只需要遍历一次完整数组，应该不会有太大的耗时
操作应该都是对数组进行相应修改，传入虚拟列表即可
增删改操作应该也不难，不过要考虑一下展开状态等细节，还有是否要相应改变传入的树形数据
最后就是性能是否能过关的问题了



### vue-virtual-scroll-list源码分析



### el-tree源码分析
tree.vue 树容器
tree-node.vue 递归实现的树节点


### vue-virtual-scroll-list使用
https://github.com/tangbc/vue-virtual-scroll-list

virtualListDemo


### el-tree-plus层级关系
入口组件tree.vue 引用virtual-list组件和tree-item.vue组件，把tree-item.vue作为data-component传入virtual-list，把tree.vue的$scopedSlot传入virtual-list，tree-item.vue中能够使用这个slot
tree-item.vue是节点组件，包含箭头、多选框和节点内容。对于节点内容，如果有slot则渲染slot，如果没有则渲染默认节点内容，后续考虑支持render函数

tree.vue中增加virtual属性，如果virtual为true，表示启用虚拟滚动，实例化FlattenTreeStore来管理整棵树，实例化FlattenNode来管理节点
暂时简单处理是否为virtual的逻辑，如果是virtual则进行virtual相关的操作，操作完之后return

### 注意点记录
关于组件内部更改了数据，要如何与外部通信？
1. 内部和外部双向绑定，外部修改数据会导致内部进行相关操作，内部修改了数据，直接修改传入的对象，避免外部自己修改导致内部重复操作
2. 外部修改数据，内部不做操作，提供强制更新接口，内部修改数据后，不修改传入的对象，通过触发事件的方式传递
3. 外部修改数据，内部不做操作，提供强制更新接口，内部修改数据后，修改传入的对象

考虑用1、3方式实现


栈溢出
15w个节点进行flatten操作时，出现了栈溢出
12w个节点不会溢出，且展开收缩良好
后续考虑优化flatten操作