<template>
  <div class="item-inner">
    <span># {{ source.index }}</span>
    <br />
    <span>{{ source.name }}</span>
    <slot></slot>
    <!-- <node-content :scopedSlots="$scopedSlots" :source="source"></node-content> -->
  </div>
</template>

<script>
export default {
  name: "fix-size-item",
  props: {
    source: {
      type: Object,
      default() {
        return {};
      },
    },
    extra:{
      type: String,
      default: ""
    }
  },
  components: {
    // NodeContent: {
    //   props: {
    //     scopedSlots: {
    //       type: Object,
    //       default(){
    //         return {};
    //       }
    //     },
    //     source:{
    //       type: Object,
    //       default(){
    //         return {};
    //       }
    //     }
    //   },
    //   render(h) {
    //     const scopedSlots = this.scopedSlots;
    //     const source = this.source;
    //     // console.log(scopedSlots, source)
    //     return (
    //       scopedSlots
    //           ? scopedSlots.itemSlot
    //           : <span class="el-tree-node__label">{ source.name }</span>
    //     );
    //   }
    // }
  },
  method:{

  },
  created(){
    console.log(this)
    console.log(this.source, this.extra)
    console.log(this.$scopedSlots);
  },
  mounted(){
    console.log(this.$scopedSlots);
  }
};
</script>

<style scoped>
</style>