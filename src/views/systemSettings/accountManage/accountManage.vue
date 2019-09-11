<template>
  <div>
    <Card shadow style="padding:16px 30px 0 30px;">
      <Row type="flex" align="middle" justify="center">
        <Col :md="24" :lg="24">
        <Row type="flex" align="middle" justify="start" style="margin-top:20px;">
          <div>
            <span>启用状态：</span>
            <RadioGroup v-model="button1" type="button" size="large">
              <Radio v-for="item in couponType" :label="item.value" :key="item.value">{{item.label}}</Radio>
            </RadioGroup>
          </div>
        </Row>
        <Row type="flex" align="middle" justify="start" style="margin-top:20px;">
          <div>
            <span>类型查找：</span>
            <Select clearable v-model="keywordType" style="width:100px;margin-right:10px;">
              <Option v-for="item in keywordTypeList" :value="item.value" :key="item.value">{{item.label}}</Option>
            </Select>
            <Input v-model="keywords" placeholder="请输入用户名称、联系人、手机、邮箱搜索" style="width: 350px"></Input>
          </div>
        </Row>
        <Row type="flex" align="middle" justify="end" style="margin-top:20px;">
          <Button type="primary" style="margin-right:40px;" icon="ios-search-strong" @click="searchList">搜索</Button>
          <Button type="warning" icon="ios-plus-outline" @click="showModal">新增</Button>
        </Row>
        </Col>
      </Row>
    </Card>
    <Card shadow style="margin-top:10px;">
      <Row type="flex" align="middle" justify="center">
        <Col :md="24" :lg="24">
        <Card shadow>
          <Row type="flex">
            <Col :md="24" :lg="24">
            <div>
              <Table border ref="selection" :columns="columns4" :data="data1" style="margin-bottom:30px;"></Table>
              <div style="float: right;margin-right: 60px;">
                <Page :total="total" show-total show-sizer :page-size-opts="[10,20]" @on-page-size-change='changeSize' @on-change="changePage">
                </Page>
              </div>
            </div>
            </Col>
          </Row>
        </Card>
        </Col>
      </Row>
    </Card>
    <!-- 增加用户模态框 -->
    <Modal :mask-closable="false" v-model="modal1" width=700 @on-cancel="cancel('formValidate')">
      <p slot="header" style="text-align:left">
        <span>用户管理 </span>
      </p>
      <div style="text-align:center">
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
          <Row :gutter="16">
            <Col span="12">
              <FormItem label="用户名：" prop="username">
                <Input placeholder="请输入用户名称" v-model="formValidate.username"></Input>
              </FormItem>
            </Col>
            <Col span="12"> 
              <FormItem label="手机：" prop="mobile">
                <Input placeholder="请输入手机号码，例如13800138000" v-model="formValidate.mobile"></Input>
              </FormItem>
            </Col>
          </Row>
          <Row :gutter="16">
            <Col span="12">
              <FormItem label="密码：" prop="password">
                <Input type="password" placeholder="请输入密码" v-model="formValidate.password"></Input>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="重复密码：" prop="repassword">
            <Input type="password" placeholder="请输入密码" v-model="formValidate.repassword"></Input>
          </FormItem></Col>
          </Row>
          <Row :gutter="16">
            <Col span="12">
              <FormItem label="联系人：" prop="contacts">
                <Input placeholder="请输入联系人姓名" v-model.trim="formValidate.contacts"></Input>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="邮箱：" prop="email">
                <Input placeholder="请输入邮箱,例如a@starbucks.com.cn" v-model="formValidate.email"></Input>
              </FormItem>
            </Col>
          </Row>
          <Row :gutter="16">
            <Col span="12">
              <FormItem label="选择角色：" prop="roleId" style="text-align:left;">
                <Select clearable v-model="formValidate.roleId">
                  <Option v-for="item in roleidList" :value="String(item.id)" :key="item.value">{{item.roleName }}</Option>
                </Select>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </div>
      <div slot="footer">
        <Button v-if="Reset" type="primary" @click="handleSubmit('formValidate')">确认</Button>
        <Button v-if="Reset" type="primary" @click="handleReset('formValidate')">重置</Button>
        <Button v-if="save" type="primary" @click="saveEdit('formValidate')">保存</Button>
      </div>
    </Modal>
    <!-- 删除模态框 -->
    <Modal :mask-closable="false" v-model="modal2" @on-ok="delUser" width="360">
      <p slot="header" style="text-align:center">
        <span>提示</span>
      </p>
      <div style="text-align:center;color:#f60;">
        <Icon type="information-circled"></Icon>
        <span>确定删除？</span>
      </div>
    </Modal>
    <!-- 启用、禁用模态框 -->
    <Modal :mask-closable="false" v-model="modal3" @on-ok="manageUserStatus" width="360">
      <p slot="header" style="text-align:center">
        <span>提示</span>
      </p>
      <div style="text-align:center;color:#f60;">
        <Icon type="information-circled"></Icon>
        <span v-if="status==1">启用后，用户可用。</span>
        <span v-if="status==0">禁用后，用户不可用。</span>
      </div>
    </Modal>
  </div>
</template>
<script>
import {
  userList, //用户列表
  roleListAll, //角色列表
  userAdd, // 新增用户
  userEdit, //编辑用户
  userDetail, //用户详情
  userDel, //删除用户
  manageUser //管理状态
} from "@/api/systemManage.js";

export default {
  data() {
    const validatePassword = (rule, value, callback) => {
      let myreg = /[\u4e00-\u9fa5]/;
      if (value === "") {
        callback(new Error("必填"));
      } else {
        if (myreg.test(value)) {
          // 验证格式
          callback(new Error("密码必须由字母、数字、特殊符号线组成"));
        }
        if (value.length < 6) {
          callback(new Error("密码长度至少6位"));
        }
        callback();
      }
    };
    const validateMobile = (rule, value, callback) => {
      let myreg = /^[\d-]*$/;
      if (value === "") {
        callback(new Error("必填"));
      } else {
        if (!myreg.test(value)) {
          // 验证格式
          callback(new Error("请输入正确格式的号码"));
        }
        callback();
      }
    };
    const validateName = (rule, value, callback) => {
      let myreg = /[\u4e00-\u9fa5]/;
      let regEn = /[`~!@#$%^&*()+<>?:"{},\/;'[\]]/im,regCn=/[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im;
      let space =/\s+/
      if (value === "") {
        callback(new Error("必填"));
      } else {
        if (myreg.test(value)) {
          // 验证格式
          callback(new Error("名称只能为英文和数字."));
        }else if (regEn.test(value)||regCn.test(value)) {
          callback(new Error("名称不能包含特殊字符."));
        }else if(space.test(value)){
          callback(new Error("名称不能包含空格."));
        }  
        
        callback();
      }
    };
    const validatePassCheck = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入确认密码"));
      } else if (value !== this.formValidate.password) {
        callback(new Error("两次密码不一致"));
      } else {
        callback();
      }
    };
    return {
      formValidate: {
        username: "",
        roleId: "",
        password: "",
        repassword: "",
        mobile: "",
        email: ""
      },
      roleidList: [],
      departmentidList: [],
      ruleValidate: {
        username: [
          {
            required: true,
            message: "必填",
            trigger: "blur"
          },
          {
            validator: validateName,
            trigger: "blur"
          }
        ],
        roleId: [
          {
            required: true,
            message: "必填",
            trigger: "change"
          }
        ],
        password: [
          {
            required: true,
            message: "必填",
            trigger: "blur"
          },
          {
            validator: validatePassword,
            trigger: "blur"
          }
        ],
        repassword: [
          {
            required: true,
            message: "必填",
            trigger: "blur"
          },
          {
            validator: validatePassCheck,
            trigger: "blur"
          }
        ],
        mobile: [
          {
            required: true,
            message: "必填",
            trigger: "blur"
          },
          {
            validator: validateMobile,
            trigger: "blur"
          }
        ],
        departmentId: [
          {
            required: true,
            message: "必填",
            trigger: "change"
          }
        ],
        contacts: [
          {
            required: true,
            message: "必填",
            trigger: "blur"
          }
        ],
        email: [
          {
            required: true,
            message: "必填",
            trigger: "blur"
          },
          {
            type: "email",
            message: "请填写正确格式邮箱",
            trigger: "blur"
          }
        ]
      },
      Reset: true,
      save: false,
      modal1: false,
      modal2: false,
      modal3: false,
      status: "",
      keywordType: "",
      keywordTypeList: [
        {
          value: 1,
          label: "用户名称"
        },
        {
          value: 2,
          label: "联系人"
        },
        {
          value: 3,
          label: "手机"
        },
        {
          value: 4,
          label: "邮箱"
        }
      ],
      keywords: "",
      couponType: [
        {
          value: "",
          label: "请选择"
        },
        {
          value: 1,
          label: "启用"
        },
        {
          value: 0,
          label: "禁用"
        }
      ],
      button1: "",
      total: 0,
      columns4: [
        {
          type: "index",
          title: "序号",
          align: "center",
          width: 70,
          key: "id"
        },
        {
          title: "用户名称",
          align: "center",
          key: "username",
          minWidth: 250
        },
        {
          title: "联系人",
          align: "center",
          key: "contacts",
          minWidth: 150
        },
        {
          title: "手机",
          align: "center",
          key: "mobile",
          minWidth: 200
        },
        {
          title: "邮箱",
          align: "center",
          key: "email",
          minWidth: 200
        },
        {
          title: "状态",
          align: "center",
          minWidth: 200,
          render: (h, params) => {
            const status = params.row.status;
            let text = status === 1 ? "启用" : status === 0 ? "禁用" : "";
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "text",
                    size: "small"
                  }
                },
                text
              )
            ]);
          }
        },
        {
          title: "操作",
          align: "center",
          minWidth: 300,
          render: (h, params) => {
            return h("div", [
              h("Button", {
                props: {
                  size: "small",
                  icon: "iconfont iconfont icon-qiyong"
                },
                attrs: {
                  title: "启用"
                },
                style: {
                  marginRight: "10px"
                },
                on: {
                  click: () => {
                    this.Enabled(params.index);
                  }
                }
              }),
              h("Button", {
                props: {
                  size: "small",
                  icon: "iconfont iconfont icon-jinyong"
                },
                attrs: {
                  title: "禁用"
                },
                style: {
                  marginRight: "10px"
                },
                on: {
                  click: () => {
                    this.Forbidden(params.index);
                  }
                }
              }),
              h("Button", {
                props: {
                  size: "small",
                  icon: "iconfont iconfont icon-bianji"
                },
                attrs: {
                  title: "编辑"
                },
                style: {
                  marginRight: "10px"
                },
                on: {
                  click: () => {
                    this.Edit(params.index);
                  }
                }
              }),
              h("Button", {
                props: {
                  size: "small",
                  icon: "iconfont iconfont icon-shanchu"
                },
                attrs: {
                  title: "删除"
                },
                style: {
                  marginRight: "10px"
                },
                on: {
                  click: () => {
                    this.Del(params.index);
                  }
                }
              })
            ]);
          }
        }
      ],
      data1: [],
      pageNum: 1,
      pageSize: 10,
      id: ""
    };
  },
  computed: {
    //用户参数
    userParams() {
      let obj = {
        ver: 1,
        status: this.button1,
        keywordType: this.keywordType,
        keyword: this.keywords,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      };
      return obj;
    },
    
    // 角色参数
    roleParams() {
      let obj = {
        ver: 1
      };
      return obj;
    },
    //新增参数
    addParams() {
      let obj = {
        ver: 1,
        username: this.formValidate.username,
        password: this.formValidate.password,
        contacts: this.formValidate.contacts,
        mobile: this.formValidate.mobile,
        email: this.formValidate.email,
        roleId: this.formValidate.roleId
      };
      return obj;
    },
    //详情参数
    detailParams() {
      let obj = {
        ver: 1,
        id: this.id
      };
      return obj;
    },
    editQuery() {
      let obj = {
        ver: 1,
        id: this.id,
        username: this.formValidate.userName,
        password: this.formValidate.password,
        contacts: this.formValidate.contacts,
        mobile: this.formValidate.mobile,
        email: this.formValidate.email,
        roleId: this.formValidate.roleId
      };
      return obj;
    },
    //删除参数
    delQuery() {
      let obj = {
        ver: 1,
        id: this.id
      };
      return obj;
    },
    //启用/禁用参数
    manageQuery() {
      let obj = {
        ver: 1,
        id: this.id,
        status: this.status
      };
      return obj;
    }
  },
  mounted() {},
  created() {
    this.getUserList(this.userParams);
  },
  methods: {
    //用户列表
    getUserList(params) {
      userList(params)
        .then(res => {
          let data = res.data;
          if (data.code == 200) {
            this.total = data.total;
            this.data1 = data.result;
          } else {
            this.$Message.error(data.message);
          }
        })
        .catch(err => {});
    },
    showModal() {
      this.getRoleList(this.roleParams);
    },
    //角色列表
    getRoleList(params) {
      roleListAll(params)
        .then(res => {
          let data = res.data;
          if (data.code == 200) {
            this.roleidList = data.result;
            this.modal1 = true;
          } else {
            this.$Message.error(data.message);
          }
        })
        .catch(err => {});
    },
    //提交表单
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.addUser(this.addParams);
        } else {
          this.$Message.error("请填写准确信息!");
        }
      });
    },
    //重置
    handleReset(name) {
      this.$refs[name].resetFields();
    },
    // 新增用户
    addUser(params) {
      this.Reset = true;
      userAdd(params)
        .then(res => {
          if (res.data.code == 200) {
            this.$Message.success("添加成功!");
            this.modal1 = false;
            this.getUserList(this.userParams);
            this.$refs['formValidate'].resetFields();
          } else {
            this.$Message.error(res.data.message);
          }
        })
        .catch(error => {});
    },
    cancel(name) {
      this.Reset = true;
      this.save = false;
      this.handleReset(name);
    },
    //详情
    detail(params) {
      userDetail(params)
        .then(res => {
          let data = res.data;
          if (data.code == 200) {
            this.formValidate = data.result;
            this.formValidate.roleId = String(data.result.roleId);
            this.formValidate.departmentId = String(data.result.departmentId);
            this.formValidate.repassword = data.result.password;
            this.departmentName = data.result.departmentName;
          } else {
          }
        })
        .catch(err => {});
    },
    //编辑
    Edit(index) {
      this.getRoleList(this.roleParams);
      this.id = this.data1[index].id;
      this.detail(this.detailParams);
      //this.modal1 = true;
      this.Reset = false;
      this.save = true;
    },
    saveEdit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.selectName();
          userEdit(this.editQuery)
            .then(res => {
              if (res.data.code == 200) {
                this.modal1 = false;
                this.$Message.success("修改成功!");
                this.getUserList(this.userParams);
                this.handleReset(name);
              } else {
                this.$Message.error(res.data.message);
              }
            })
            .catch(err => {});
        } else {
          this.$Message.error("请填写准确信息!");
        }
      });
    },
    // 删除
    Del(index) {
      this.modal2 = true;
      this.id = this.data1[index].id;
    },
    delUser() {
      userDel(this.delQuery)
        .then(res => {
          if (res.data.code == 200) {
            this.$Message.success("删除成功!");
            this.getUserList(this.userParams);
          } else {
            this.$Message.error(res.data.message);
          }
        })
        .catch(err => {});
    },
    //启用
    Enabled(index) {
      this.status = 1;
      this.modal3 = true;
      this.id = this.data1[index].id;
    },
    //禁用
    Forbidden(index) {
      this.status = 0;
      this.modal3 = true;
      this.id = this.data1[index].id;
    },
    manageUserStatus() {
      manageUser(this.manageQuery)
        .then(res => {
          if (res.data.code == 200) {
            this.$Message.success("成功!");
            this.getUserList(this.userParams);
          } else {
            this.$Message.error(res.data.message);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //搜索
    searchList() {
      if (this.keywordType == "" && this.keywords != "") {
        this.$Message.warning("请选择查找条件");
        return;
      }
      this.pageNum = 1;
      this.getUserList(this.userParams);
    },
    changePage(index) {
      this.pageNum = index;
      this.getUserList(this.userParams);
    },
    changeSize(index) {
      this.pageSize = index;
      this.getUserList(this.userParams);
    }
  }
};
</script>
<style scoped>
.ivu-radio-group-button .ivu-radio-wrapper:first-child {
  border: 0;
}

.ivu-radio-group-button .ivu-radio-wrapper {
  display: inline-block;
  margin: 0 20px 0 0;
  padding: 0 16px;
  color: #495060;
  transition: all 0.2s ease-in-out;
  cursor: pointer;
  border-radius: 4px;
  border: 0;
  border-left: 0;
  background: #fff;
}

.ivu-radio-group-button .ivu-radio-wrapper-checked {
  background: #18b660;
  border-color: #18b660;
  color: #fff;
  box-shadow: -1px 0 0 0 #18b660;
}

.ivu-radio-group-button .ivu-radio-wrapper-checked:active {
  border-color: #18b660;
  background-color: #18b660;
  box-shadow: -1px 0 0 0 #18b660;
  color: #fff;
}

.ivu-radio-group-button .ivu-radio-wrapper-checked:hover {
  border-color: #18b660;
  box-shadow: -1px 0 0 0 #18b660;
  color: #fff;
}

.ivu-btn-ghost {
  color: #18b660;
  background-color: transparent;
  border-color: #18b660;
}

.ivu-btn-primary {
  padding: 6px 24px;
}

.ivu-btn-warning {
  padding: 6px 24px;
}
</style>