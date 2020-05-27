<template>
  <div id="components-form-demo-advanced-search">
    <a-form class="ant-advanced-search-form" :form="form" @submit="handleSearch" >
        <div>
          <a-row :gutter="2">
            <a-col
              v-for="(searchDatum, i) in searchData"
              :key="searchDatum.name"
              :md="{span: 12}"
              :xs="{span: 24}"
              :style="{ display: i < count ? 'block' : 'none' }"
            >
              <a-form-item :label="searchDatum.label" :labelCol="{ xs: {span: 5}, md: {span: 5} }"  :wrapperCol="{ xs: {span:24}, md: {span: 16}}" >
                <a-input
                  v-if="searchDatum.type === 'input'"
                  v-decorator="[
                    searchDatum.name,
                    searchDatum.option,
                  ]"
                  :placeholder="searchDatum.placeholder"
                />
                <han-search
                  v-decorator="[
                        searchDatum.name,
                        searchDatum.option,
              ]"
                  v-else-if="searchDatum.type === 'selectInput'" :searchDatum="searchDatum"
                />

                <a-select
                  v-else-if="searchDatum.type === 'select'"
                  v-decorator="[
                    searchDatum.name,
                    searchDatum.option,
                  ]"
                  :placeholder="searchDatum.placeholder"
                >
                  <a-select-option v-for="option in searchDatum.selectOption" :value="option.value">
                    {{ option.content }}
                  </a-select-option>
                </a-select>
                <a-range-picker
                  v-else-if="searchDatum.type === 'range'"
                  v-decorator="[
                    searchDatum.name,
                    searchDatum.option,
                  ]"
                  :placeholder="searchDatum.placeholder"
                  :show-time="{ format: 'HH:mm' }"
                  format="YYYY-MM-DD HH:mm"
                />

                <han-label-search
                  v-decorator="[
                        searchDatum.name,
                        searchDatum.option,
              ]"
                  v-else-if="searchDatum.type === 'selectLabelInput'" :searchDatum="searchDatum"


                />


              </a-form-item>
            </a-col>
          </a-row>
        </div>
        <div :style="{ textAlign: 'right', marginTop: '4px', marginBottom: '10px'}">
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
        </div>
    </a-form>
  </div>
</template>
<script>
  import ACol from 'ant-design-vue/es/grid/Col'
  import hanSearch from './hanSearch'
  import hanLabelSearch from './hanLabelSearch'



  export default {
    components: { hanSearch, ACol, hanLabelSearch },
    name: 'searchPane',
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
      option: {
        type: Object,
        default: {}
      },
      handleData: {
        type: Function,
        default: async (data, storeTarget, ctx) => {

          ctx.$store.dispatch(storeTarget, { variables: data })
        }
      },
      storeTarget: {
        type: String,
        default: ''
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
            let value = values[key]
            if (Array.isArray(value && typeof value[0].toISOString !==  'undefined')) {
              const startTime = value[0].toISOString()
              const endTime = value[1].toISOString()
              const dataNames = key.split('\t')
              ret[dataNames[0]] = startTime
              ret[dataNames[1]] = endTime
            } else if (typeof value !== 'undefined') {

              if (key === 'modelNames' || key === 'partNoNames') {
                console.log(value)
                value = value.map(item => item.key)
              }

              ret[key] = value
            }
          })
          console.log({...ret, ...this.option})
          this.handleData({...ret, ...this.option}, this.storeTarget, this)
        });
      },

      handleReset() {
        this.form.resetFields();
      },

      toggle() {
        this.expand = !this.expand;
      },
      handleRemoteSearch(value, fn) {
        fetch(value, fn, this,  data => (this.data = data))
      },
      handleChange(value, fn) {
        this.value = value
        fetch(value, fn, this,  data => (this.data = data))
      }

    },
  };


  let timeout;
  let currentValue;
  function fetch(value, fetchFn, ctx,  callback) {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    currentValue = value;

    function fake() {
      fetchFn.call(ctx, value)
        .then(d => {
          console.log(d)
          if (currentValue === value) {
            const result = d.result;
            const data = [];
            result.forEach(r => {
              if (typeof r.value === 'undefined') {
                data.push({
                  value: r,
                  text: r,
                });
              } else {
                data.push({
                  value: r.value,
                  text: r.text
                })
              }

            });
            callback(data);
          }
        });
    }

    timeout = setTimeout(fake, 300);
  }
</script>
<style scoped>
  .ant-advanced-search-form {
    background: rgba(0, 0, 0, .02);
    padding: 24px;
    margin-bottom: 16px;
  }

  #components-form-demo-advanced-search .ant-form {
    max-width: none;
  }

</style>
