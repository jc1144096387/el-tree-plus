<template>
  <div>
    <div class="main">
      <el-tree-plus ref="tree" :data="tree" :props="treeProps" :expand-on-click-node="false">
          <template v-slot="{node}">
            <item-slot :node="node" @edit-node="handleNodeEdit" @delete-node="handleNodeDelete"></item-slot>
          </template>
      </el-tree-plus>

      <div>
        父节点id<input v-model="pId" />
        新增节点名称<input v-model="nodeTitle" />
        新增节点位置<input v-model="addIndex" />
        <button @click="handleNodeAdd">新增</button>
      </div>
      <div>
        编辑节点名称<input v-model="editNodeTitle"/>
      </div>
    </div>
      <div>
    <!-- <div class="main">
      <el-tree :data="tree" :props="treeProps">
         <template v-slot="{data}">
            <item-slot :node="data"></item-slot>
          </template>
      </el-tree>
    </div> -->
    <p class="label">节点总数:{{ flattenTree.length }}</p>
  </div>
  </div>
</template>

<script>
import treeTools from "../mixins/treeTools";
import elTreePlus from "@/components/el-tree-plus";
import itemSlot from './virtualListDemo/slot.vue';

export default {
  name: "elTreePlusDemo",
  components:{
    elTreePlus,
    itemSlot
  },
    mixins: [treeTools],
  data(){
    return{
      treeProps: {
        children: "children",
        label: "title"
      },

      // test add
      pId: null,
      nodeTitle: '',
      addIndex: 0,
      // test edit
      editNodeTitle: ''
    }
  },
  methods:{
    handleNodeAdd(){
      // 注意id的类型
      let node ={
        id: this.nodeTitle,
        title: this.nodeTitle
      }
      this.$refs.tree.addNode(this.pId, node, Number(this.addIndex));
    },
    handleNodeEdit(node){
      let newNode = {
        id: node.id,
        title: this.editNodeTitle
      }
      this.$refs.tree.editNode(newNode);
    },
    handleNodeDelete(node){
      this.$refs.tree.deleteNode(node.id);
    }
  },
  created(){
    console.log(this.tree,this.flattenTree);
  }
};
</script>
