<template>
  <div>
    <list-panel-wrapper>
      <list-panel :btnClick="handleBtnClick" :spinning="spinning.family" :type="{ title:'family', key: 'family' }" :name-list="formatData(data)" :clickCallback="handleFamilyListClick" :hoverPos="pos[0]" />
      <list-panel :btnClick="handleBtnClick" :spinning="spinning.model" :type="{ title:'model', key: 'model' }" :name-list="formatData(modelData)" :clickCallback="handleModelListClick" :hoverPos="pos[1]" />
      <list-panel :btnClick="handleBtnClick" :spinning="spinning.partNo" :type="{ title:'part No', key: 'partNo' }" :name-list="formatData(partNoData)" :hoverPos="pos[2]" :clickCallback="handlePartNoListClick" />
    </list-panel-wrapper>
    <a-modal
      :title="modelTitle"
      :visible="visible"
      @ok="handleOk"
      :confirmLoading="confirmLoading"
      @cancel="handleCancel"
    >
      <p>
        {{ "名称" }}<a-input v-model="inputValue"/>
      </p>
    </a-modal>
  </div>
</template>

<script lang="ts">
  import searchPane from '@/components/searchPane'
  import listPanelWrapper from '@/components/listPanelWrapper'
  import listPanel from '@/components/listPanel'
  import { searchData } from '@/util/testData' //TODO 接口完成之后删除
  import { fetchDataIn } from '@/util/helper'
  import { mapState } from 'vuex'
  import Vue from 'vue'

  const FAMILY_POS = 0;
  const MODEL_POS = 1;
  const PART_NO_POS = 2;

  const btnEventMap = {
    family: {
      async add(pos) {
        console.log(arguments)
        await this.$store.dispatch('family/createData', { name: this.inputValue })
      },
      async delete(pos) {
        console.log(arguments)
        await this.$store.dispatch('family/deleteData', { index: this.pos[FAMILY_POS] })
      },
      async update() {
        await this.$store.dispatch('family/updateData', { index: this.pos[FAMILY_POS], data: { name: this.inputValue  }})
      }
    },
    model: {
      async add() {
        const familyId = this.data[this.pos[FAMILY_POS]].id
        await this.$store.dispatch('model/createData', { name: this.inputValue, familyId })
      },
      async delete(pos) {
        console.log(arguments)
        await this.$store.dispatch('model/deleteData', { index: this.pos[MODEL_POS] })
      },
      async update() {
        await this.$store.dispatch('model/updateData', { index: this.pos[MODEL_POS], data: { name: this.inputValue  } })
      }
    },
    partNo: {
      async add() {
        const modelId = this.data[this.pos[MODEL_POS]].id
        await this.$store.dispatch('partNo/createData', { name: this.inputValue, modelId: modelId })
      },
      async delete(pos) {
        console.log(arguments)
        await this.$store.dispatch('partNo/deleteData', { index: this.pos[PART_NO_POS] })
      },
      async update() {
        await this.$store.dispatch('partNo/updateData', { index: this.pos[PART_NO_POS], data: { name: this.inputValue  }})
      }
    }
  }

  export default {
    components: {
      searchPane,
      listPanel,
      listPanelWrapper,
    },
    data() {
      return {
        pos: [-1, -1, -1],
        spinning: {
          family: true,
          model: false,
          partNo: false
        },
        modelTitle: 'Family',
        modelKey: 'family',
        visible: false,
        callback: null,
        confirmLoading: false,
        callbackArgs: [],
        inputValue: ''
      }
    },
    methods: {
      async handleFamilyListClick(pos) {
        if (pos !== this.pos[FAMILY_POS]) {
          this.pos.splice(MODEL_POS, 2, -1, -1)
        }
        Vue.set(this.pos, FAMILY_POS, pos)
        this.changeSpinningStatus('model')
        await this.$store.dispatch('model/fetchData', {
          variables: {
            familyId: this.data[pos].id
          }
        })
        this.changeSpinningStatus('model')
      },
      async handleModelListClick(pos) {
        if (pos !== this.pos[MODEL_POS]) {
          this.pos.splice(PART_NO_POS, 1, -1)
        }
        Vue.set(this.pos, MODEL_POS, pos)
        this.changeSpinningStatus('partNo')
        await this.$store.dispatch('partNo/fetchData', {
          variables: {
            modelId: this.modelData[pos].id
          }
        })
        this.changeSpinningStatus('partNo')
      },
      handlePartNoListClick(pos) {
        Vue.set(this.pos, PART_NO_POS, pos)
        this.partNoCallback(this.data[this.pos[FAMILY_POS]], this.modelData[this.pos[MODEL_POS]], this.partNoData[pos])
       },
      formatData(fetchedData) {
        return fetchedData.map(data => data.name)
      },
      changeSpinningStatus(type) {
        this.spinning[type] = !this.spinning[type]
      },
      handleBtnClick(dataType, functionType, ...args) {
        this.modelTitle = dataType.title
        this.modelKey = dataType.key
        this.visible = true
        this.callback = btnEventMap[dataType.key][functionType].bind(this)
        this.callbackArgs = args
      },
      async handleOk() {
        this.confirmLoading = true
        await this.callback(...this.callbackArgs, this.inputValue)

        // TODO bug
        await this.fetchData(this.modelKey)

        this.inputValue = ''
        this.confirmLoading = false
        this.visible = false
      },
      handleCancel(e) {
        this.visible = false
      },
      async fetchData(name) {
        let ret
        switch(name) {
          case 'family':
            ret = await this.$store.dispatch(`family/fetchData`)
            break
          case 'model':
            ret = await this.$store.dispatch('model/fetchData', {
              variables: {
                familyId: this.data[this.pos[FAMILY_POS]].id
              }
            })
            break
          case 'partNo':
            ret = await this.$store.dispatch('partNo/fetchData', {
              variables: {
                modelId: this.data[this.pos[MODEL_POS]].id
              }
            })
            break
          default:
            console.error('error')
        }
        return ret
      }
    },
    computed: {
      ...mapState('family', ['data']),
      ...mapState('model', {
        modelData: 'data'
      }),
      ...mapState('partNo', {
        partNoData: 'data'
      })
    },
    props: {
      partNoCallback: {
        type: Function,
        default: () => {}
      }
    },
    mounted() {
      const fetchDataFor = fetchDataIn(this)
      fetchDataFor('family').then(() => {
        this.changeSpinningStatus('family')
      })
    }
  }
</script>

<style scoped>

</style>
