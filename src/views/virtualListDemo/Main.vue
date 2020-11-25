<template>
  <div class="example">
    <!-- <virtual-list class="list scroll-touch"
      ref="list"
      :data-key="'id'"
      :data-sources="items"
      :data-component="itemComponent"
      
      :keeps="keeps"
      :extra-props="extraProps"
      :estimate-size="estimateSize"

      :start="Number(start)"
      :offset="Number(offset)"
      @scroll="handleListScroll"
      @totop="handleListTotop"
      @tobottom="handleListTobottom"
      @resized="handleListResized"
      :direction="direction"
      :page-mode="pageMode"
      :top-threshold="topThreshold"
      :bottom-threshold="bottomThreshold"
      :root-tag="rootTag"
      :wrap-tag="wrapTag"
      :wrap-class="wrapClass"
      :wrap-style="wrapStyle"
      :item-tag="itemTag"
      :item-class="itemClass"
      :item-class-add="itemClassAdd"
      :item-style="itemStyle"
      :item-scoped-slots="itemScopedSlots"
      :header-tag="headerTag"
      :header-class="headerClass"
      :header-style="headerStyle"
      :footer-tag="footerTag"
      :footer-class="footerClass"
      :footer-style="footerStyle"

    >
      <item-slot></item-slot>
    </virtual-list>

    <div>
      <div>
        <span>滚动</span><input v-model="start">
      </div>
    </div>

    <item ref="item">
      <template slot="itemSlot">
        <div>test slot</div>
      </template>
    </item> -->
    <list class="list scroll-touch"
      ref="list"
      :data="_data"
      :data-key="'id'"
      :data-sources="items"
      :data-component="itemComponent"
      
      :keeps="keeps"
      :extra-props="extraProps"
      :estimate-size="estimateSize"

      :start="Number(start)"
      :offset="Number(offset)"
      @scroll="handleListScroll"
      @totop="handleListTotop"
      @tobottom="handleListTobottom"
      @resized="handleListResized"
      :direction="direction"
      :page-mode="pageMode"
      :top-threshold="topThreshold"
      :bottom-threshold="bottomThreshold"
      :root-tag="rootTag"
      :wrap-tag="wrapTag"
      :wrap-class="wrapClass"
      :wrap-style="wrapStyle"
      :item-tag="itemTag"
      :item-class="itemClass"
      :item-class-add="itemClassAdd"
      :item-style="itemStyle"
      :item-scoped-slots="itemScopedSlots"
      :header-tag="headerTag"
      :header-class="headerClass"
      :header-style="headerStyle"
      :footer-tag="footerTag"
      :footer-class="footerClass"
      :footer-style="footerStyle"
      ></list>
  </div>
</template>

<script>
import VirtualList from "@/components/virtual-list/index.js";
import Item from './Item';

const TOTAL_COUNT = 100000

const DataItems = []
let count = TOTAL_COUNT
while (count--) {
  const index = TOTAL_COUNT - count
  DataItems.push({
    index,
    name: index,
    id: index,
  })
}

export default {
  name: 'virtualListDemo',
  components:{
    VirtualList,
    Item,
    List:{
      props:{
        data: Object,
        itemScopedSlots: Object
      },
      render(h){
        console.log(this)
        console.log(this.$scopedSlots)
        const data = this.data;
        const itemScopedSlots = this.itemScopedSlots;
        console.log(data);
        console.log(this.itemScopedSlots)
        return(
          h(
            VirtualList,
            {
              props: {
                dataKey: 'id',
                dataSources: DataItems,
                dataComponent: Item,
                itemScopedSlots: itemScopedSlots,
                ...data
              }
            }
          )
        )
      }
    }
  },
  data () {
    return {
      total: TOTAL_COUNT.toLocaleString(),
      activeIndex: 2,


      items: DataItems,
      itemComponent: Item,
      // 想要真实渲染的个数 How many items you are expecting the virtual list to keep rendering in the real dom.
      keeps: 30,
      // 另外的属性，data-source数组中不包含的属性 Extra props assign to item component that are not in data-sources. Notice: index and source are both occupied inner.
      extraProps: {
        extra: "extra"
      },
      // item的高度，越接近平均值，虚拟列表越真实 The estimate size of each item, if it is closer to the average size, the scrollbar length looks more accurately. It is recommended to assign the average that calculate by yourself.
      estimateSize: 61,
      // 滚动条滚动的位置，单位个数，位置=start*estimateSize
      start: 1,
      // 滚动条滚动的位置，单位px，start为0时生效，
      offset: 0,
      //
      direction: 'vertical',
      //
      pageMode: false,
      //
      topThreshold: 0,
      // 
      bottomThreshold: 0,
      // 
      rootTag: 'div',
      // 
      wrapTag: 'div',
      // 
      wrapClass: 'wrap',
      // 
      wrapStyle: {},
      //
      itemTag: 'div',
      // 
      itemClass: 'item',
      // 
      itemClassAdd: this.addItemExtraClass,
      //
      itemStyle: {},
      // 
      // itemScopedSlots: this.$scopedSlots,
      //
      headerTag: 'div',
      //
      headerClass: 'header',
      //
      headerStyle: {},
      //
      footerTag: 'div',
      // 
      footerClass: 'footer',
      //
      footerStyle: {}
    }
  },
  computed:{
    itemScopedSlots(){
      console.log(this.$scopedSlots)
      return this.$scopedSlots;
    }
  },
  methods: {
    handleListScroll(e, range){
      console.log(e, range);
    },
    handleListTotop(){
      console.log("to top");
    },
    handleListTobottom(){
      console.log("to bottom");
    },
    handleListResized(){
      console.log("resized");
    },
    addItemExtraClass(index){
      // console.log(index ,this.activeIndex)
      if(index === this.activeIndex){
        return 'item-active';
      }
      return '';
    }
  },
  created(){
    console.log(this.$scopedSlots);
  },
  mounted(){
    console.log(this.$scopedSlots);
    console.log(this.$refs.item.$scopedSlots);
  }
}
</script>

<style>
.list {
  width: 100%;
  height: 500px;
  border: 2px solid;
  border-radius: 3px;
  overflow-y: auto;
  border-color: dimgray;
}
.list  .list-item-fixed {
    display: flex;
    align-items: center;
    padding: 0 1em;
    height: 60px;
    border-bottom: 1px solid;
    border-color: lightgray;
  }
</style>
