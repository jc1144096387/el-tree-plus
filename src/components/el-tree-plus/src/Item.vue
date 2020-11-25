<template>
  <div class="item-inner">
    <div class="head">
      <span class="index"># {{ source.index }}</span>
      <span class="name">{{ source.name }}</span>
    </div>
    <div class="desc">{{ source.desc }}</div>
  </div>
</template>

<script>

export default {
  name: 'infinite-loading-item',

  props: {
    source: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  created(){
    console.log(this.source)
  }
}
</script>

<style scoped>
</style>