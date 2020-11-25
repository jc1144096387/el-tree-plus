<template>
  <div>
    <div class="main">
      <el-tree-plus :data="tree" :props="treeProps">
          <template v-slot="{node}">
            <item-slot :node="node"></item-slot>
          </template>
      </el-tree-plus>
    </div>
      <div>
    <div class="main">
      <!-- <el-tree :data="tree" :props="treeProps">
         <template v-slot="{data}">
            <item-slot :node="data"></item-slot>
          </template>
      </el-tree> -->
    </div>
    <!-- <p class="label">节点总数:{{ flattenTree.length }}</p> -->
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
      }
    }
  },
  methods:{

  },
  created(){
    console.log(this.tree,this.flattenTree);
  }
};
</script>
