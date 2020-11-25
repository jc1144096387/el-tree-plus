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

