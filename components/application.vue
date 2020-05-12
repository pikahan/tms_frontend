<template>
  <div>
    <a-steps :current="current">
      <a-step v-for="stepName in steps" :key="stepName" :title="stepName" />
    </a-steps>
    <div class="steps-content">
      <a-form-model
        ref="ruleForm"
        :model="form"
        :rules="rules"
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
        <a-form-model-item :wrapperCol="{span: 24}">
          <div class="steps-action">
            <a-row>
              <a-col :span="16" :offset="8">
                <a-button v-if="current < steps.length - 2" type="primary" @click="next">
                  下一步
                </a-button>
                <a-button
                  v-if="current == steps.length - 2"
                  type="primary"
                  @click="submitBtnClick"
                >
                  提交
                </a-button>
                <a-button v-if="current>0" style="margin-left: 8px" @click="prev">
                  上一步
                </a-button>
                <nuxt-link :to="goBackUrl">
                  <a-button v-if="current === steps.length - 1" style="margin-left: 8px">
                    返回
                  </a-button>
                </nuxt-link>
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
    data() {
      return {
        current: 0,
      };
    },
    methods: {
      next() {
        console.log('next click')
        this.validataField(() => { this.current++ })
      },
      prev() {
        this.current--;
      },

      validataField(cb) {
        console.log(this.modelList[this.current])
        let errFlag = false
        this.$refs.ruleForm.validateField(this.modelList[this.current], (err, values) => {
          console.log(arguments)
          if (err) {
            errFlag = true
          }
        });

        if (errFlag === false) {
          cb()
        }
      },

      submitBtnClick() {
        this.$refs.ruleForm.validate(valid => {
          if (valid) {
            this.handleSubmit(this.form, () => {
              this.current++
            })
            console.log('current ++ by handleSubmit')
          } else {
            console.log('error submit!!');
            return false;
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
        default: () => ({ span: 4 })
      },
      wrapperCol: {
        type: Object,
        default: () => ({ span: 20 })
      },
      form: {
        type: Object,
        default: () => ({})
      },
      rules: {
        type: Object,
        default: () => ({})
      },
      handleSubmit: {
        type: Function,
        default: (data, cb) => { console.log(data);cb();}
      },
      goBackUrl: {
        default: '/'
      }

    },
    computed: {
      steps() { // 二维数组转一位数组, 并取title为数组中的元素
        console.log(this.formData.reduce((arr, curr) => arr.concat(curr.title), []))
        return this.formData.reduce((arr, curr) => arr.concat(curr.title), [])
      },
      modelList() {
        const ret = []
        this.formData.forEach(option => {
          if (typeof option.modelItem !== 'undefined') {
            ret.push(option.modelItem)
          }
        })
        return ret
      }
    }
  };
</script>
<style scoped>
  .steps-content {
    position: relative;
    left: 50%;
    transform: translateX(-50%);
    padding: 20px 40px 0;
    margin-top: 40px;
    min-height: 200px;
    max-width: 800px;
  }

  .steps-action {
    margin-top: 24px;

  }

</style>
