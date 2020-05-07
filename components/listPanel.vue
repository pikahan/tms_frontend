<template>
  <div class="panel">
    <div class="panel_list">
      <div class="title">{{ type.title }}</div>
      <a-spin :spinning="spinning">
        <div class="list_item" :style="currPos === pos ? { background: 'rgba(208, 230, 255, 0.65)' } : {}" v-for="(name, pos) of nameList" @click="handleItemClick(pos)">
          {{ name }}
          <a-icon type="edit" theme="twoTone" class="edit_btn" v-show="currPos === pos" @click="btnClick(type, 'update', currPos, name)" />
        </div>
      </a-spin>
    </div>
    <div class="btn_list" v-if="hasBtn" >
      <a-button @click="btnClick(type, 'add', currPos)">+</a-button>
      <a-button @click="btnClick(type, 'delete', currPos)">-</a-button>
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
      type: {
        type: Object,
        default: { title: 'Title', key: 'title' }
      },
      hoverPos: {
        type: Number
      },
      hasBtn: {
        type: Boolean,
        default: true
      },
      btnClick: {
        type: Function,
        default: () => {}
      },
      spinning: {
        type: Boolean,
        default: false
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

    .list_item {
      position: relative;
      font-size: 14px;
      color: rgba(0,0,0,.65);

      .edit_btn {
        position: absolute;
        right: 0;
        top: 0;
        bottom: 0;
      }
    }

  }
</style>
