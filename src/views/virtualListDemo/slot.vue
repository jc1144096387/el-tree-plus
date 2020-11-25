<template>
  <div>
    <span>{{node.title}}</span>
    <span>编辑 </span>
    <span>移动 </span>
    <span>删除 </span>
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
  }
}
</script>

<style>

</style>