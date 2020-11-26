<template>
  <div>test</div>
</template>

<script>
export default {
  data(){
    return{

    }
  },
  methods:{
    testTravel(){
      let simpleObj = {a:1};
      let complexObj = {a:1, b:2, c:3, srcObj:{a:1,b:2,c:3,d:4,e:5}};
      let simpleArr = new Array(100000).fill(simpleObj);
      let complexArr = new Array(100000).fill(complexObj);
      let arr = {};
      console.time('simpleArr');
      simpleArr.map(i => {
        Object(arr, JSON.parse(JSON.stringify(i)));
      })
      console.timeEnd('simpleArr');
      console.time('complexArr');
      complexArr.map(i => {
        Object(arr, JSON.parse(JSON.stringify(i)));
      })
      console.timeEnd('complexArr');

    }
  },
  created(){
    this.testTravel();
  }
}
</script>

<style>

</style>