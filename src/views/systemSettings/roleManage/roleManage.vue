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
                            <span style="margin-left:13px;">关键词：</span>
                            <!-- <Select v-model="seekCondition" style="width:130px;margin-right:10px;">
                                <Option v-for="item in seekConditionList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select> -->
                            <Input v-model.trim="keywords" placeholder="请输入角色名称搜索" style="width: 220px"></Input>
                        </div>
                    </Row>
                    <Row type="flex" align="middle" justify="end" style="margin-top:20px;">
                        <Button type="primary" style="margin-right:40px;" icon="ios-search-strong" @click="searchList">筛选</Button>
                        <Button type="warning" icon="ios-plus-outline" @click="add()">新增</Button>
                    </Row>
                </Col>
            </Row>
        </Card>
        <Card shadow style="margin-top:10px;">
            <Row type="flex" align="middle" justify="center">
                <Col :md="24" :lg="24">
                <!-- <Card shadow> -->
                    <Row type="flex">
                        <Col :md="24" :lg="24">
                        <div>
                            <Table border ref="selection" :columns="columns4" :data="data1" style="margin-bottom:30px;"></Table>
                            <div style="float: right;margin-right: 60px;">
                                <Page :total="total" show-total  show-sizer :page-size-opts="[10,20]" @on-page-size-change='change' @on-change="changePage">
                                </Page>
                            </div>
                        </div>
                        </Col>
                    </Row>
                <!-- </Card> -->
                </Col>
            </Row>
        </Card>
    <!-- 启用、禁用模态框 -->
    <Modal :mask-closable="false" v-model="modal3" @on-ok="manageRoleStatus" width="360">
      <p slot="header" style="text-align:center">
        <span>提示</span>
      </p>
      <div style="text-align:center;color:#f60;">
        <Icon type="information-circled"></Icon>
        <span v-if="status==1">启用后，角色可用。</span>
        <span v-if="status==0">禁用后，角色不可用。</span>
      </div>
    </Modal>
    <!-- 删除模态框 -->
    <Modal :mask-closable="false" v-model="modal2" @on-ok="delRole" width="360">
      <p slot="header" style="text-align:center">
        <span>提示</span>
      </p>
      <div style="text-align:center;color:#f60;">
        <Icon type="information-circled"></Icon>
        <span>确定删除？</span>
      </div>
    </Modal>
    </div>
</template>
<script>
import {
  roleList, //角色列表
  roleDetail, //角色详情
  roleDel, //删除角色
  manageRole, //管理状态
  authorityList //权限列表
} from "@/api/systemManage.js";
export default {
  data() {
    return {
      seekCondition: "",
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
      modal: false,
      modal2: false,
      modal3: false,
      status: "",
      columns4: [
        // {
        //   type: "selection",
        //   width: 60,
        //   align: "center"
        // },
        {
          type: "index",
          title: "序号",
          align: "center",
          width: 70,
          key: "id"
        },
        {
          title: "角色名称",
          align: "center",
          width: 150,
          key: "roleName"
        },
        {
          title: "权限描述",
          align: "center",
          minWidth:400,
          render: (h, params) => {
            let authorities_describe = [];
            let has_authorities = "";
            let authority = "";
            let show_authorities = [];
            params.row.authorities.map(value => {
              has_authorities = "【" + value.authorityName + "：";
              authority = "";
               value.authorities.map(value => {
                // 拥有的权限
                authority += value.authorityName + "，";
              });
              authority = authority.substring(0, authority.length - 1);
              has_authorities += authority + "】";
              authorities_describe.push(has_authorities);
            });
            // authorities_describe 权限描述 页面显示
            authorities_describe.map(value => {
              //console.log(value);
              show_authorities.push(
                h(
                  "div",
                  { style: { margin: " 10px 0", "text-align": "left" } },
                  value
                )
              );
            });
            // console.log(show_authorities)
            return h("div", show_authorities);
          }
        },
        {
          title: "状态",
          align: "center",
          width: 100,
          render: (h, params) => {
            const status = params.row.status;
            let text = status === 1 ? "启用" : status === 0 ? "禁用" : "";
            return h("div", [
              h(
                "div",
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
          width: 300,
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
      pageNum: 1,
      pageSize: 10,
      data1: [],
      id: ""
    };
  },
  computed: {
    // 角色参数
    roleParams() {
      let obj = {
        ver: 1,
        status: this.button1,
        keyword: this.keywords,
        pageNum: this.pageNum,
        pageSize: this.pageSize
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
    //管理参数
    manageQuery() {
      let obj = {
        ver: 1,
        status: this.status,
        id: this.id
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
    //查询参数
    getParams() {
      let obj = {
        ver: 1,
        id: this.id
      };
      return obj;
    }
  },
  mounted() {},
  created() {
    this.getRoleList(this.roleParams);
  },
  methods: {
    //角色列表
    getRoleList(params) {
      roleList(params)
        .then(res => {
          // console.log(res.data);
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
    //搜索
    searchList() {
      this.pageNum = 1;
      this.getRoleList(this.roleParams);
    },
    //分页
    changePage(index) {
      this.pageNum = index;
      this.getRoleList(this.roleParams);
    },
    change(index) {
      this.pageSize = index;
      this.getRoleList(this.roleParams);
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
    manageRoleStatus() {
      manageRole(this.manageQuery)
        .then(res => {
          if (res.data.code == 200) {
            this.$Message.success("成功!");
            this.getRoleList(this.roleParams);
          } else {
            this.$Message.error(res.data.message);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //详情
    getRoleDetail(params) {
      roleDetail(params)
        .then(res => {
          let data = res.data;
          if (data.code == 200) {
            this.$router.push({
              name: "addRole",
              params: {
                goTo: "addRole",
                id: this.id
              }
            });
          } else {
            this.$Message.error(data.message);
          }
        })
        .catch(err => {});
    },
    //编辑
    Edit(index) {
      this.id = this.data1[index].id;
      this.getRoleDetail(this.detailParams);
    },
    Del(index) {
      this.modal2 = true;
      this.id = this.data1[index].id;
    },
    delRole() {
      roleDel(this.delQuery)
        .then(res => {
          if (res.data.code == 200) {
            this.$Message.success("删除成功!");
            this.getRoleList(this.roleParams);
            this.id="";
          } else {
            this.$Message.error(res.data.message);
          }
        })
        .catch(err => {});
    },
    //权限列表
    getAuthority(params) {
      authorityList(params)
        .then(res => {
          let data = res.data;
          if (data.code == 200) {
            //this.authority = data.result;
            this.$router.replace("/addRole");
          } else {
            this.$Message.error(data.message);
          }
        })
        .catch(err => {});
    },
    add() {
      //
      this.getAuthority(this.getParams);
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