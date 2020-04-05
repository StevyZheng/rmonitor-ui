<template>
  <div>
    <el-row :gutter="10" justify=center>
      <el-col :span="5">
        <div class="dataBaseTree">
          <div style="text-align:center;border:1px solid #f3f0f0;height:20px"><font color="blue" size="1">提示：二级菜单为群组，三级为主机。</font></div>
          <div><font font color="black" size="1">集群详情：</font></div>
          <el-tree
            ref="treeData"
            :data="treeData"
            :default-expanded-keys="x"
            show-checkbox
            :props="defaultProps"
            highlight-current
            node-key="id"
            render-after-expand
            @node-click="handleNodeClick"
            @node-contextmenu="rightClick"
          />
          <div v-show="tmDisplay" id="perTreeMenu" @mouseleave="tmDisplay=!tmDisplay">
            <el-card class="box-card">
              <div class="text item">
                <el-link icon="el-icon-circle-plus-outline" :underline="false" @click="treeAdd">添加</el-link>
              </div>
              <div class="text item">
                <el-link icon="el-icon-remove-outline" :underline="false" @click="treeDel">删除</el-link>
              </div>
            </el-card>
          </div>
        </div>
      </el-col>
      <el-col :span="19">
        <host-details></host-details>
      </el-col>
    </el-row>
    <el-dialog
      title="添加群组"
      width="40%"
      :visible.sync="dialogAddHostGroupVisible"
      :close-on-click-modal="false"
      @close="handleAddDialogClose"
    >
      <el-form
        ref="hostGroupDataForm"
        :model="hostGroupDataForm"
        :rules="hostGroupRules"
        label-width="80px"
        size="small"
        label-position="right"
      >
        <el-form-item label="群组名" prop="name">
          <el-input v-model="hostGroupDataForm.name" auto-complete="off" />
        </el-form-item>
        <el-form-item label="群组描述" prop="explain">
          <el-input v-model="hostGroupDataForm.explain" auto-complete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click.native="dialogAddHostGroupVisible = false">取消</el-button>
        <el-button size="small" type="primary" :loading="editLoading" @click.native="addHostGroupSubmitForm">提交</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="添加主机"
      width="40%"
      :visible.sync="dialogAddHostVisible"
      :close-on-click-modal="false"
      @close="handleAddDialogClose"
    >
      <el-form
        ref="hostDataForm"
        :model="hostDataForm"
        :rules="hostRules"
        label-width="140px"
        size="small"
        label-position="right"
      >
        <el-form-item label="自定义名称：" prop="customName">
          <el-input v-model="hostDataForm.customName" auto-complete="off" />
        </el-form-item>
        <el-form-item label="IPMI IP：" prop="bmcIp">
          <el-input v-model="hostDataForm.bmcIp" auto-complete="off" />
        </el-form-item>
        <el-form-item label="IPMI用户名：" prop="bmcUser">
          <el-input v-model="hostDataForm.bmcUser" auto-complete="off" />
        </el-form-item>
        <el-form-item label="IPMI密码：" prop="bmcPwd">
          <el-input v-model="hostDataForm.bmcPwd" auto-complete="off" />
        </el-form-item>
        <el-form-item label="系统管理IP：" prop="sysManageIp">
          <el-input v-model="hostDataForm.sysManageIp" auto-complete="off" />
        </el-form-item>
        <el-form-item label="所属群组：" prop="">
          <a>{{ hostDataForm.groupName }}</a>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click.native="dialogAddHostVisible = false">取消</el-button>
        <el-button size="small" type="primary" :loading="editLoading" @click.native="addHostSubmitForm">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { apiHostGroups, apiGetHostNamesFromHostGroupName, apiAddHostGroup } from '@/api/host'
import HostDetails from '@/layout/components/HostDetails'
import { apiAddHost, apiDelHost } from '../../api/host'

export default {
  components: {
    HostDetails
  },
  data() {
    return {
      x: [1],
      treeData: [{
        id: 1,
        label: '总集群',
        children: [{
          id: '2',
          label: '保留群组',
          disabled: true,
          children: []
        }]
      }],
      defaultProps: {
        id: 'id',
        children: 'children',
        label: 'label'
      },
      treeMaxId: 2,
      tmDisplay: false,
      clickNodeData: {},
      dialogAddHostGroupVisible: false,
      dialogAddHostVisible: false,
      hostGroupDataForm: {
        name: '',
        createUser: '',
        explain: ''
      },
      hostGroupRules: {
        name: [{ required: true, type: 'string', message: '群组名不能为空', trigger: 'blur' }],
        explain: [{ required: true, message: '必填项', trigger: 'blur' }]
      },
      hostDataForm: {
        customName: '',
        hostName: '',
        isOobActive: false,
        bmcIp: '',
        bmcMac: '',
        bmcPwd: '',
        bmcUser: '',
        groupName: '',
        picPath: '',
        sysManageIp: ''
      },
      hostRules: {
        customName: [{ required: true, type: 'string', message: '主机自定义名称不能为空', trigger: 'blur' }],
        bmcIp: [{ required: true, message: '必填项', trigger: 'blur' }],
        bmcPwd: [{ required: true, message: '必填项', trigger: 'blur' }],
        bmcUser: [{ required: true, message: '必填项', trigger: 'blur' }],
        sysManageIp: [{ required: true, message: '必填项', trigger: 'blur' }]
      },
      editLoading: false
    }
  },
  created: function() {
    this.fetchData()
  },
  methods: {
    insertHostFromGroupLabel(label, host) {
      this.treeMaxId = this.treeMaxId + 1
      this.treeData[0].children.forEach(v => {
        if (label === v.label) {
          const tmp = {
            id: this.treeMaxId,
            label: host.customName
          }
          v.children.push(tmp)
          return
        }
      })
    },
    deleteHostFromGroupLabel(label) {
      for (let i = 0; i < this.treeData[0].children.length; i++) {
        for (let j = 0; j < this.treeData[0].children[i].children.length; j++) {
          if (this.treeData[0].children[i].children[j].label === label) {
            this.treeData[0].children[i].children.splice(j, 1)
          }
        }
      }
    },
    subFetchData(param) {
      const hostsData = []
      let hostDataLen = 0
      apiGetHostNamesFromHostGroupName(param).then(res => {
        const hostData = res.data
        if (hostData === null) {
          return
        }
        hostDataLen = hostData.length
        for (let j = 0; j < hostData.length; j++) {
          this.treeMaxId = this.treeMaxId + 1
          const tmpHost = { id: this.treeMaxId, label: hostData[j]['customName'] }
          hostsData.push(tmpHost)
        }
      })
      return {
        hostsData: hostsData,
        hostDataLen: hostDataLen
      }
    },
    fetchData() {
      apiHostGroups({}).then(response => {
        const groupData = response.data
        for (let i = 1; i <= groupData.length; i++) {
          this.treeMaxId = this.treeMaxId + 1
          const retList = this.subFetchData({ 'name': groupData[i - 1].name })
          const tmpGroup = { id: this.treeMaxId - retList.hostDataLen, label: groupData[i - 1].name, children: retList.hostsData }
          this.treeData[0].children.push(tmpGroup)
        }
      })
    },
    rightClick(MouseEvent, object, Node, element) {
      this.clickNodeData = Node
      this.tmDisplay = true
      const menu = document.querySelector('#perTreeMenu')
      menu.style.cssText = 'position: fixed; left: ' + MouseEvent.clientX + 'px' + '; top: ' + (MouseEvent.clientY) + 'px; z-index.vue: 999; cursor:pointer;'
    },
    treeAdd() {
      if (this.clickNodeData.level === 1) {
        this.dialogAddHostGroupVisible = true
        this.$store.state.user.name
        this.hostGroupDataForm = { name: '', createUser: this.$store.state.user.name, explain: '' }
      } else if (this.clickNodeData.level === 2) {
        this.dialogAddHostVisible = true
        this.hostDataForm.groupName = this.clickNodeData.label
      } else {
        this.$message({
          type: 'warning',
          message: '不可对主机执行添加操作！'
        })
      }
    },
    treeDel() {
      if (this.clickNodeData.level === 1) {
        this.$message({
          type: 'warning',
          message: '不可删除总集群！'
        })
      } else if (this.clickNodeData.level === 2) {
        if (this.clickNodeData.label === '保留群组') {
          this.$message({
            type: 'warning',
            message: '不可删除保留群组！'
          })
        } else {
          this.$confirm('群组删除之后无法恢复，群组内所有主机全部转移到默认的 “保留群组” 内。确认删除吗？', '提示', {}).then(() => {})
        }
      } else {
        this.$confirm('主机删除之后无法恢复。确认删除吗？', '提示', {}).then(() => {
          apiDelHost({ 'customName': this.clickNodeData.data.label }).then(res => {
            this.deleteHostFromGroupLabel(this.clickNodeData.data.label)
            if (res.code === 204) {
              this.$message({ message: '删除成功', type: 'success' })
              this.reload()
            }
          })
        })
      }
    },
    handleNodeClick(data) {
      console.log(data)
    },
    handleAddDialogClose() {
      this.editLoading = false
    },
    addHostGroupSubmitForm() {
      this.$refs.hostGroupDataForm.validate(valid => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.editLoading = true
            const params = Object.assign({}, this.hostGroupDataForm)
            apiAddHostGroup(params).then(res => {
              this.editLoading = false
              if (res.code === 204) {
                this.$message({ message: '操作成功', type: 'success' })
                this.treeMaxId = this.treeMaxId + 1
                this.treeData[0].children.push({ id: this.treeMaxId, label: this.hostGroupDataForm.name, children: [] })
                this.dialogAddHostGroupVisible = false
                this.$refs['hostGroupDataForm'].resetFields()
                this.reload()
              } else {
                this.$message({ message: '操作失败, ' + res.msg, type: 'error' })
              }
            })
          })
        }
      })
    },
    addHostSubmitForm() {
      this.$refs.hostDataForm.validate(valid => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.editLoading = true
            const params = Object.assign({}, this.hostDataForm)
            apiAddHost(params).then(res => {
              this.editLoading = false
              if (res.code === 204) {
                this.$message({ message: '操作成功', type: 'success' })
                this.insertHostFromGroupLabel(this.clickNodeData.data.label, params)
                this.dialogAddHostVisible = false
                this.$refs['hostDataForm'].resetFields()
                this.reload()
              } else {
                this.$message({ message: '操作失败, ' + res.msg, type: 'error' })
              }
            })
          })
        }
      })
    }
  }
}
</script>

<style>
.dataBaseTree{
  /* width:230px; */
  height:1000px;
  margin-top: 0;
  border:1px solid #f3f0f0;
}
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 10px;
}

.box-card {
  width: 100px;
}
</style>
