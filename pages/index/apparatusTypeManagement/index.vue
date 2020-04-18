<template>
  <div>
    <list-panel-wrapper>
      <list-panel title="family" :name-list="formatData(data)" :clickCallback="handleFamilyListClick" :hoverPos="pos[0]" :addBtnClick="testFn" />
      <list-panel title="model" :name-list="formatData(modelData)" :clickCallback="handleModelListClick" :hoverPos="pos[1]" />
      <list-panel title="part No" :name-list="formatData(partNoData)" :hoverPos="pos[2]" :clickCallback="handlePartNoListClick" />
    </list-panel-wrapper>
  </div>
</template>

<script>
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

  export default {
    components: {
      searchPane,
      listPanel,
      listPanelWrapper,
    },
    data() {
      return {
        pos: [-1, -1, -1]
      }
    },
    methods: {
      async handleFamilyListClick(pos) {
        if (pos !== this.pos[FAMILY_POS]) {
          this.pos.splice(MODEL_POS, 2, -1, -1)
        }
        Vue.set(this.pos, FAMILY_POS, pos)
        await this.$store.dispatch('model/fetchData', { familyId: this.data[pos].id })
      },
      async handleModelListClick(pos) {
        if (pos !== this.pos[MODEL_POS]) {
          this.pos.splice(PART_NO_POS, 1, -1)
        }
        Vue.set(this.pos, MODEL_POS, pos)
        await this.$store.dispatch('partNo/fetchData', { modelId: this.modelData[pos].id })
      },
      handlePartNoListClick(pos) {
        Vue.set(this.pos, PART_NO_POS, pos)
      },
      formatData(fetchedData) {
        return fetchedData.map(data => data.name)
      },
      testFn(pos) {
        console.log(pos)
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
    async fetch() {
      const fetchDataFor = fetchDataIn(this)
      await fetchDataFor('family')
    }
  }
</script>

<style scoped>

</style>
