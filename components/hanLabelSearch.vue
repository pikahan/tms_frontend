<template>
  <a-select
    mode="multiple"
    label-in-value
    :placeholder="searchDatum.placeholder"
    :value="hanValue"
    :default-active-first-option="false"
    :show-arrow="false"
    :filter-option="false"
    :not-found-content="null"
    @search="(value) => { handleSearch(value, searchDatum.handleSearch) }"
    @change="value => { handleChange(value, searchDatum.handleSearch) }"
  >
    <a-select-option v-for="d in data" :key="d.value">
      {{ d.text }}
    </a-select-option>
  </a-select>
</template>

<script>
  export default {
    name: 'hanSearch',
    props: {
      searchDatum: Object,
      value: Array,
      advancedSearch: Function
    },
    data() {
      return {
        data: [],
        hanValue: undefined
      }
    },
    methods: {
      handleSearch(value, fn) {
        fetch(value, fn, this,  data => {
          console.log(data)
          this.data = data
        })
      },
      handleChange(value, fn) {
        this.hanValue = value
        fetch(value, fn, this,  data => {this.data = data;
        this.$emit('change', this.hanValue )})
      }
    },
    watch: {
      value(val) {
        this.hanValue = val
      }
    }
  }

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
          if (currentValue === value) {
            const result = d.result;
            // if (result.length === 0) {
            //   return
            // }
            const data = [];
            result.forEach(r => {

              if (typeof r.text !== 'undefined') {
                console.log('ehe')
                data.push({
                  value: r.value,
                  text: r.text
                })
              } else {
                data.push({
                  value: r,
                  text: r,
                });
              }
            });
            console.log('fake')
            console.log(data)
            callback(data);
          }
        });
    }

    timeout = setTimeout(fake, 300);
  }
</script>

<style scoped>

</style>
