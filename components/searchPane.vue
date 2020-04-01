<template>
  <div id="components-form-demo-advanced-search">
    <a-form class="ant-advanced-search-form" :form="form" @submit="handleSearch">
      <a-row :gutter="24">
        <a-col
          v-for="(searchDatum, i) in searchData"
          :key="searchDatum.name"
          :span="8"
          :style="{ display: i < count ? 'block' : 'none' }"
        >
          <a-form-item :label="searchDatum.name">
            <a-input
              v-decorator="[
                searchDatum.name,
                searchDatum.option,
              ]"
              :placeholder="searchDatum.placeholder"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="24" :style="{ textAlign: 'right' }">
          <a-button type="primary" html-type="submit">
            Search
          </a-button>
          <a-button :style="{ marginLeft: '8px' }" @click="handleReset">
            Clear
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
  export default {
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
          console.log('error', error);
          console.log('Received values of form: ', values);
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
    padding: 24px;
    background: #fbfbfb;
    border: 1px solid #d9d9d9;
    border-radius: 6px;
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
  /*#components-form-demo-advanced-search .search-result-list {*/
    /*margin-top: 16px;*/
    /*border: 1px dashed #e9e9e9;*/
    /*border-radius: 6px;*/
    /*background-color: #fafafa;*/
    /*min-height: 200px;*/
    /*text-align: center;*/
    /*padding-top: 80px;*/
  /*}*/
</style>
