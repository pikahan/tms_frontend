<template>
  <div class="panel">
    <div class="panel_list">
      <div class="title">{{ title }}</div>
      <div class="list_ltem" :style="currPos === pos ? { background: 'rgba(208, 230, 255, 0.65)' } : {}" v-for="(name, pos) of nameList" @click="handleItemClick(pos)">
        {{ name }}
      </div>
    </div>
    <div class="btn_list" v-if="hasBtn">
      <a-button @click="addBtnClick(currPos)">+</a-button>
      <a-button @click="deleteBtnClick(currPos)">-</a-button>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'

  export default Vue.extend({
    data() {
      return {
        _hovorPos: null
      }
    },
    props: {
      nameList: {
        type: Array,
        default: []
      },
      clickCallback: {
        type: Function,
        default: () => {}
      },
      title: {
        type: String,
        default: 'Title'
      },
      hoverPos: {
        type: Number
      },
      hasBtn: {
        type: Boolean,
        default: true
      },
      addBtnClick: {
        type: Function,
        default: () => {}
      },
      deleteBtnClick: {
        type: Function,
        default: () => {}
      }
    },
    methods: {
      handleItemClick(pos) {
        this._hovorPos = pos
        this.clickCallback(pos)
      },
      // _handleAddBtnClick() {
      //   console.log(this.currPos)
      //   this.addBtnClick(this.currPos)
      // },
      // _handleDeleteBtnClick() {
      //   console.log(this.currPos)
      //   this.deleteBtnClick(this.currPos)
      // }
    },
    computed: {
      currPos() {
        // console.log(typeof this.hoverPos === 'undefined' ? this._hovorPos : this.hoverPos)
        return typeof this.hoverPos === 'undefined' ? this._hovorPos : this.hoverPos
      }
    }
  })
</script>

<style scoped lang="scss">
  .panel {
    flex: 1;
    margin-right: 20px;
  }

  .btn_list {
    margin-top: 10px;
  }

  .panel_list {
    border: 1px solid rgba(0,0,0,.05);
    border-radius: 3px;
    min-height: 200px;

    &:last-child {
      margin-right: 0;
    }

    * {
      padding: 10px;
      line-height: 18px;
      font-size: 16px;
    }

    .title {
      background: rgba(0,0,0,.05);
      color: rgba(0,0,0,.85);
    }

    .list_ltem {
      font-size: 14px;
      color: rgba(0,0,0,.65);
    }
  }
</style>
