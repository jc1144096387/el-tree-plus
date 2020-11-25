<template>
  <div
    class="el-tree-node"
    @click.stop="handleClick"
    @contextmenu="($event) => this.handleContextMenu($event)"
    v-show="node.visible"
    :class="{
      'is-expanded': expanded,
      'is-current': node.isCurrent,
      'is-hidden': !node.visible,
      'is-focusable': !node.disabled,
      'is-checked': !node.disabled && node.checked
    }"
    role="treeitem"
    tabindex="-1"
    :aria-expanded="expanded"
    :aria-disabled="node.disabled"
    :aria-checked="node.checked"
    :draggable="tree.draggable"
    @dragstart.stop="handleDragStart"
    @dragover.stop="handleDragOver"
    @dragend.stop="handleDragEnd"
    @drop.stop="handleDrop"
    ref="node"
  >
    <div class="el-tree-node__content"
      :style="{ 'padding-left': (node.level - 1) * tree.indent + 'px' }">
      <span
        @click.stop="handleExpandIconClick"
        :class="[
          { 'is-leaf': node.isLeaf, expanded: !node.isLeaf && expanded },
          'el-tree-node__expand-icon',
          tree.iconClass ? tree.iconClass : 'el-icon-caret-right'
        ]"
      >
      </span>
      <el-checkbox
        v-if="showCheckbox"
        v-model="node.checked"
        :indeterminate="node.indeterminate"
        :disabled="!!node.disabled"
        @click.native.stop
        @change="handleCheckChange"
      >
      </el-checkbox>
      <span
        v-if="node.loading"
        class="el-tree-node__loading-icon el-icon-loading">
      </span>
      <node-content :node="node" :itemScopedSlots="itemScopedSlots"></node-content>
    </div>
  </div>
</template>

<script type="text/jsx">
  import ElCollapseTransition from 'element-ui/src/transitions/collapse-transition';
  import ElCheckbox from 'element-ui/packages/checkbox';
  import emitter from 'element-ui/src/mixins/emitter';
  import { getNodeKey } from './model/util';

  export default {
    name: 'TreeItem',

    componentName: 'TreeItem',

    mixins: [emitter],

    props: {
      source: {
        type: Object,
        default () {
          return {}
        }
      },
      props: {},
      renderContent: Function,
      renderAfterExpand: {
        type: Boolean,
        default: true
      },
      showCheckbox: {
        type: Boolean,
        default: false
      }
    },

    components: {
      ElCollapseTransition,
      ElCheckbox,
      NodeContent: {
        props: {
          node: {
            required: true
          },
          itemScopedSlots: Object
        },
        render(h) {
          const node = this.node;
          // console.log(node);
          // console.log(this.source)
          const itemScopedSlots = this.itemScopedSlots;
          return (
            itemScopedSlots? itemScopedSlots.default({node}) : <span class="el-tree-node__label">{ node.label }</span>
          );
        }
      }
    },

    data() {
      return {
        node: null,
        tree: null,
        expanded: false,
        childNodeRendered: false,
        oldChecked: null,
        oldIndeterminate: null
      };
    },
    computed:{
      itemScopedSlots(){
        // console.log(this.$scopedSlots)
        return this.$scopedSlots;
      }
    },
    watch: {
      'node.indeterminate'(val) {
        this.handleSelectChange(this.node.checked, val);
      },

      'node.checked'(val) {
        this.handleSelectChange(val, this.node.indeterminate);
      },

      'node.expanded'(val) {
        console.log(this.node.id, val);
        this.$nextTick(() => this.expanded = val);
        if (val) {
          this.childNodeRendered = true;
        }
      }
    },

    methods: {
      getNodeKey(node) {
        return getNodeKey(this.tree.nodeKey, node.data);
      },

      handleSelectChange(checked, indeterminate) {
        if (this.oldChecked !== checked && this.oldIndeterminate !== indeterminate) {
          this.tree.$emit('check-change', this.node.data, checked, indeterminate);
        }
        this.oldChecked = checked;
        this.indeterminate = indeterminate;
      },

      handleClick() {
        const store = this.tree.store;
        store.setCurrentNode(this.node);
        this.tree.$emit('current-change', store.currentNode ? store.currentNode.data : null, store.currentNode);
        this.tree.currentNode = this;
        if (this.tree.expandOnClickNode) {
          this.handleExpandIconClick();
        }
        if (this.tree.checkOnClickNode && !this.node.disabled) {
          this.handleCheckChange(null, {
            target: { checked: !this.node.checked }
          });
        }
        this.tree.$emit('node-click', this.node.data, this.node, this);
      },

      handleContextMenu(event) {
        if (this.tree._events['node-contextmenu'] && this.tree._events['node-contextmenu'].length > 0) {
          event.stopPropagation();
          event.preventDefault();
        }
        this.tree.$emit('node-contextmenu', event, this.node.data, this.node, this);
      },

      handleExpandIconClick() {
        if (this.node.isLeaf) return;
        if (this.expanded) {
          // this.tree.$emit('node-collapse', this.node.data, this.node, this);
          this.node.collapse();
          this.expanded = false;
        } else {
          this.node.expand();
          this.expanded = true;
          // this.$emit('node-expand', this.node.data, this.node, this);
        }
      },

      handleCheckChange(value, ev) {
        this.node.setChecked(ev.target.checked, !this.tree.checkStrictly);
        this.$nextTick(() => {
          const store = this.tree.store;
          this.tree.$emit('check', this.node.data, {
            checkedNodes: store.getCheckedNodes(),
            checkedKeys: store.getCheckedKeys(),
            halfCheckedNodes: store.getHalfCheckedNodes(),
            halfCheckedKeys: store.getHalfCheckedKeys(),
          });
        });
      },

      handleChildNodeExpand(nodeData, node, instance) {
        this.broadcast('ElTreeNode', 'tree-node-expand', node);
        this.tree.$emit('node-expand', nodeData, node, instance);
      },

      handleDragStart(event) {
        if (!this.tree.draggable) return;
        this.tree.$emit('tree-node-drag-start', event, this);
      },

      handleDragOver(event) {
        if (!this.tree.draggable) return;
        this.tree.$emit('tree-node-drag-over', event, this);
        event.preventDefault();
      },

      handleDrop(event) {
        event.preventDefault();
      },

      handleDragEnd(event) {
        if (!this.tree.draggable) return;
        this.tree.$emit('tree-node-drag-end', event, this);
      }
    },

    created() {
      // console.log(this.source)
      this.node = this.source;
      let parent = this.$parent;
      while(parent.$options.name !== 'ElTreePlus'){
        parent = parent.$parent;
      }
      this.tree = parent;
      const tree = this.tree;
      
      if (!tree) {
        console.warn('Can not find node\'s tree.');
      }

      const props = tree.props || {};
      const childrenKey = props['children'] || 'children';

      this.$watch(`node.data.${childrenKey}`, () => {
        this.node.updateChildren();
      });

      if (this.node.expanded) {
        this.expanded = true;
        this.childNodeRendered = true;
      }

      if(this.tree.accordion) {
        this.$on('tree-node-expand', node => {
          if(this.node !== node) {
            this.node.collapse();
          }
        });
      }
    }
  };
</script>
