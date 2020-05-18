<template>
  <div id="components-form-demo-advanced-search">
    <a-form class="ant-advanced-search-form" :form="form" @submit="handleSearch">
      <a-row>
        <a-col :span="24">
          <a-row :gutter="24">
            <a-col
              v-for="(searchDatum, i) in searchData"
              :key="searchDatum.name"
              :span="12"
              :style="{ display: i < count ? 'block' : 'none' }"
            >
              <a-form-item :label="searchDatum.label" :labelCol="{span: 6}" >
                <a-input
                  v-if="searchDatum.type === 'input'"
                  v-decorator="[
                    searchDatum.name,
                    searchDatum.option,
                  ]"
                  :placeholder="searchDatum.placeholder"
                />
                <a-range-picker
                  v-else="searchData.type === 'range'"
                  v-decorator="[
                    searchDatum.name,
                    searchDatum.option,
                  ]"
                  :placeholder="searchDatum.placeholder"
                />
                <a-select
                  v-else="searchData.type === 'select'"
                  v-decorator="[
                    searchDatum.name,
                    searchDatum.option,
                  ]"
                >
                  <a-select-option v-for="option in searchData.selectOption" :value="option.value">
                    {{ option.content }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
        </a-col>
        <a-col :span="24" :style="{ textAlign: 'right', marginTop: '4px', marginBottom: '10px'}">
          <a-button type="primary" html-type="submit">
            搜索
          </a-button>
          <a-button :style="{ marginLeft: '8px' }" @click="handleReset">
            清空
          </a-button>
          <a :style="{ marginLeft: '8px', fontSize: '12px' }"
             @click="toggle"
             v-if="searchData.length > lengthOfCollapsed"
          >
            展开 <a-icon :type="expand ? 'up' : 'down'" />
          </a>
        </a-col>
      </a-row>
    </a-form>
  </div>
</template>
<script>
  import ACol from 'ant-design-vue/es/grid/Col'
  export default {
    components: {ACol},
    data() {
      return {
        expand: false,
        form: this.$form.createForm(this, { name: 'advanced_search' }),
      };
    },
    props: {
      searchData: {
        type: Array
      },
      lengthOfCollapsed: {
        type: Number,
        default: 7
      },
      handleData: {
        type: Function,
        default: (...data) => (console.log(data))
      }
    },
    computed: {
      count() {
        return this.expand ? this.searchData.length : this.lengthOfCollapsed;
      },
    },
    methods: {
      handleSearch(e) {
        e.preventDefault();
        this.form.validateFields((error, values) => {


          const ret = {}
          const keys = Object.keys(values)
          keys.forEach(key => {
            const value = values[key]
            console.log(values[key])
            if (Array.isArray(value)) {
              const startTime = value[0].toISOString()
              const endTime = value[1].toISOString()
              const dataNames = key.split('\t')
              ret[dataNames[0]] = startTime
              ret[dataNames[1]] = endTime
            } else if (typeof value !== 'undefined') {
              ret[key] = value
            }
          })

          this.handleData(ret)
        });
      },

      handleReset() {
        this.form.resetFields();
      },

      toggle() {
        this.expand = !this.expand;
      },
    },
  };
</script>
<style scoped>
  .ant-advanced-search-form {
    background: rgba(0, 0, 0, .02);
    padding: 24px;
    margin-bottom: 16px;
  }

  .ant-advanced-search-form .ant-form-item {
    display: flex;
  }

  .ant-advanced-search-form .ant-form-item-control-wrapper {
    flex: 1;
  }

  #components-form-demo-advanced-search .ant-form {
    max-width: none;
  }

</style>
