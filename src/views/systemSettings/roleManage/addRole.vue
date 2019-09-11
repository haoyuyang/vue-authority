<template>
    <div>
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
            <Card shadow style="padding:0 30px 0 30px;">
                <Row type="flex" align="middle" justify="center">
                    <Col :md="24" :lg="24">
                    <Row type="flex" align="middle" justify="start" class="code-row-bg">
                        <p style="color:#333;font-size:18px;font-weight:bolder;">角色名称</p>
                    </Row>
                    <Row type="flex" align="middle" justify="start" style="margin-top:16px;">
                        <div style="border:1px solid #EBEBEB;width:100%"></div>
                    </Row>
                    <Row type="flex" align="middle" justify="start" style="margin-top:10px">
                        <FormItem label="角色名称" prop="desc" style="position:relative;width:550px;height:34px;border-radius: 4px ;">
                            <div style="position:relative;display:flex;align-item:center;">
                                <!-- <span style="margin-top:8px;">角色名称</span> -->
                                <Input :maxlength="30" v-model.trim="formValidate.desc" placeholder="请输入您创建的角色名称，如“运营”" @input="descInput" />
                                <span style="position:absolute;right:-20px;top:5%;">{{remnant}}/30</span>
                            </div>
                        </FormItem>
                    </Row>
                    </Col>
                </Row>
            </Card>
            <Card shadow style="margin-top:10px;padding:0 30px 0 30px;" v-for="(item,index) in authority" :key="index">
                <Row type="flex" align="middle" justify="center">
                    <Col :md="24" :lg="24">
                    <Row type="flex" align="middle" justify="start" class="code-row-bg">
                        <p style="color:#333;font-size:18px;font-weight:bolder;">{{item.authorityName}}</p>
                    </Row>
                    <Row type="flex" align="middle" justify="start" style="margin-top:16px;">
                        <div style="border:1px solid #EBEBEB;width:100%"></div>
                    </Row>
                    <Row type="flex" align="middle" justify="start" style="margin-top:20px;">
                        <!-- <span>{{item.authorityName}}</span> -->
                        <CheckboxGroup v-model="checkAllGroup" v-for="(value,index) in item.authorities" :key="index">
                            <!-- <span>{{value.id}}</span> -->
                            <Checkbox :label="value.id">{{value.authorityName}}</Checkbox>
                            <!-- <span>{{value.isHas}}</span> -->
                        </CheckboxGroup>
                    </Row>
                    </Col>
                </Row>
            </Card>
        </Form>
        <Row type="flex" align="middle" justify="end" style="margin-top:20px;">
            <Button type="primary" style="padding:6px 44px;" @click="handleSubmit('formValidate')">保存</Button>
        </Row>
    </div>
</template>
<script>
import {
  roleAdd, // 新增角色
  roleDetail, //角色详情
  roleEdit, //编辑角色
  authorityList //权限列表
} from "@/api/systemManage.js";
export default {
  data() {
    const validateFormat = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("必填"));
      } else {
        let regEn = /[`~!@#$%^&*()+<>?:"{},.\/;'[\]]/im,regCn=/[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im;
        if (regEn.test(value)||regCn.test(value)) {
          callback(new Error("名称不能包含特殊字符."));
        }  
        callback();
      }
    };
    return {
      formValidate: {
        desc: ""
      },
      ruleValidate: {
        desc: [
          {
            required: true,
            message: "请输入角色名称",
            trigger: "blur"
          },
          {
            validator: validateFormat,
            trigger: "blur"
          }
        ]
      },
      remnant: 0,
      checkAllGroup: [],
      authority: [],
      id: ""
    };
  },
  computed: {
    //查询参数
    getParams() {
      let obj = {
        ver: 1,
        id: this.id
      };
      return obj;
    },
    //新增角色
    addParams() {
      let obj = {
        ver: 1,
        roleName: this.formValidate.desc,
        authorityIds: this.checkAllGroup
      };
      return obj;
    },
    //详情参数
    detailParams() {
      let obj = {
        ver: 1,
        id: this.$route.params.id
      };
      return obj;
    },
    //编辑参数
    editParams() {
      let obj = {
        ver: 1,
        id: this.$route.params.id,
        roleName: this.formValidate.desc,
        authorityIds: this.checkAllGroup
      };
      return obj;
    }
  },
  mounted() {},
  created() {
    this.getAuthority(this.getParams);
    if (this.$route.params.id) {
      this.getRoleDetail(this.detailParams);
    }
  },
  methods: {
    descInput() {
      var txtVal = this.formValidate.desc.length;
      this.remnant = 0 + txtVal;
    },
    //权限列表
    getAuthority(params) {
      authorityList(params)
        .then(res => {
          let data = res.data;
          if (data.code == 200) {
            this.authority = data.result;
          }
        })
        .catch(err => {});
    },
    handleSubmit(name) {
      if (this.checkAllGroup.length == 0) {
        this.$Message.error("请勾选角色权限!");
      } else {
        this.$refs[name].validate(valid => {
          if (valid) {
            if (this.$route.params.id) {
              roleEdit(this.editParams)
                .then(res => {
                  if (res.data.code == 200) {
                    this.$Message.success("编辑成功!");
                    this.$router.push({
                      name: "roleManage"
                    });
                  } else {
                    this.$Message.error(res.data.message);
                  }
                })
                .catch(err => {});
            } else {
              roleAdd(this.addParams)
                .then(res => {
                  //console.log(res.data);
                  let data = res.data;
                  if (data.code == 200) {
                    this.$Message.success("添加成功!");
                    this.$router.push({
                      name: "roleManage"
                    });
                  } else {
                    this.$Message.error(data.message);
                  }
                })
                .catch(err => {});
            }
          } else {
            this.$Message.error("请填写准确信息!");
          }
        });
      }
    },
    //详情
    getRoleDetail(params) {
      roleDetail(params)
        .then(res => {
          let data = res.data;
          if (data.code == 200) {
            this.formValidate.desc = data.result.roleName;
            this.descInput();
            let temp = [];
            data.result.authorities.map(value => {
              value.authorities.map(authority => {
                temp.push(authority.id);
              });
            });
            this.checkAllGroup = temp;
          } else {
            this.$Message.warning(data.message);
          }
        })
        .catch(err => {});
    }
  }
};
</script>
<style scoped>
div span:nth-of-type(1) {
  width: 84px;
  text-align: right;
  margin-right: 40px;
}

.ivu-checkbox-wrapper {
  margin-right: 30px;
}
</style>