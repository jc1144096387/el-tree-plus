<template>
  <div>
    <list-main>
      <item-slot></item-slot>
    </list-main>
  </div>
</template>
<script>
import listMain from './Main.vue';
import itemSlot from './slot.vue';
export default {
  name: "",
  components:{
    listMain,
    itemSlot
  },
  data() {
    return {

    }
  },
  methods: {

  }
}
</script>
<style>
</style>
