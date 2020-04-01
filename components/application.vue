<template>
  <div>
    <a-steps :current="current">
      <a-step v-for="stepName in steps" :key="stepName" :title="stepName" />
    </a-steps>
    <div class="steps-content">
      <a-form-model
        :form="form"
        @submit="handleSubmit"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        >
        <slot name="first" v-if="0 === current">
        </slot>
        <slot name="second" v-if="1 === current">
        </slot>
        <slot name="third" v-if="2 === current">
        </slot>
        <a-result
          v-if="current === steps.length - 1"
          status="success"
          title="成功!"
          subTitle="Order number: 2017182818828182881 Cloud server configuration takes 1-5 minutes, please wait."
        >
          <template v-slot:extra>
            <slot name="ok">
            </slot>
          </template>
        </a-result>
        <a-form-model-item :wrapperCol="24">
          <div class="steps-action">
            <a-row>
              <a-col :span="20" :offset="4">
                <a-button v-if="current < steps.length - 2" type="primary" @click="next">
                  下一步
                </a-button>
                <a-button
                  v-if="current == steps.length - 2"
                  type="primary"
                  html-type="submit"
                  @click="$message.success('Processing complete!')"
                >
                  提交
                </a-button>
                <a-button v-if="current>0" style="margin-left: 8px" @click="prev">
                  上一步
                </a-button>
              </a-col>
            </a-row>
          </div>
        </a-form-model-item>
      </a-form-model>
    </div>
  </div>
</template>
<script>
  //TODO 这个页面之后可能要重构, 先这么写了
  import AFormItem from 'ant-design-vue/es/form/FormItem'
  import ACol from 'ant-design-vue/es/grid/Col'
  export default {
    components: {ACol, AFormItem},
    beforeCreate() {
      this.form = this.$form.createForm(this, { name: 'repair' });
    },
    data() {
      return {
        current: 0,
      };
    },
    methods: {
      next() {
        this.current++;
      },
      prev() {
        this.current--;
      },
      handleSubmit(e) {
        e.preventDefault();
        this.form.validateFields((err, values) => {
          if (!err) {
            console.log('Received values of form: ', values);
            this.current++
          }

        });
      },
    },
    props: {
      formData: {
        type: Array,
      },
      labelCol: {
        type: Object,
        default: { span: 4 }
      },
      wrapperCol: {
        type: Object,
        default: { span: 20 }
      }

    },
    computed: {
      steps() { // 二维数组转一位数组, 并取title为数组中的元素
        return this.formData.reduce((arr, curr) => arr.concat(curr.map(step => step.title)), [])
      }
    }
  };
</script>
<style scoped>
  .steps-content {
    position: relative;
    max-width: 600px;
    left: 50%;
    transform: translateX(-50%);
    padding: 20px 40px 0;
    margin-top: 40px;
    min-height: 200px;
  }

  .steps-action {
    margin-top: 24px;
  }

</style>
