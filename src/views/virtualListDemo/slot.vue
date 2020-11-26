<template>
  <div>
    <span>{{node.title}}</span>
    <span @click="handleNodeEdit">编辑 </span>
    <span>移动 </span>
    <span @click="handleNodeDelete">删除 </span>
  </div>
</template>

<script>
export default {
  name: "item-slot",
  props:{
    node: Object
  },
  data(){
    return {
      txt: "I am slot"
    }
  },
  methods:{
    handleNodeEdit(){
      this.$emit('edit-node', this.node);
    },
    handleNodeDelete(){
      this.$emit('delete-node', this.node)
    }
  }
}
</script>

<style>

</style>