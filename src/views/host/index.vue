<template>
  <div style="height:100%">
    <div class="dataBaseTree">
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
            <el-link icon="el-icon-remove-outline" :underline="false">删除</el-link>
          </div>
        </el-card>
      </div>
    </div>
    <el-dialog
      title="添加群组"
      width="40%"
      :visible.sync="dialogAddVisible"
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
        <el-button size="small" @click.native="dialogAddVisible = false">取消</el-button>
        <el-button size="small" type="primary" :loading="editLoading" @click.native="addSubmitForm">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { apiHostGroups, apiGetHostNamesFromHostGroupName, apiAddHostGroup } from '@/api/host'

export default {
  data() {
    return {
      x: [1],
      treeData: [{
        id: 1,
        label: '总集群',
        children: []
      }],
      defaultProps: {
        id: 'id',
        children: 'children',
        label: 'label'
      },
      treeMaxId: 1,
      tmDisplay: false,
      clickNodeData: {},
      dialogAddVisible: false,
      hostGroupDataForm: {
        name: '',
        createUser: '',
        explain: ''
      },
      hostGroupRules: {
        name: [{ required: true, type: 'string', message: '群组名不能为空', trigger: 'blur' }],
        explain: [{ required: true, message: '必填项', trigger: 'blur' }]
      },
      editLoading: false
    }
  },
  created: function() {
    this.fetchData()
  },
  methods: {
    subFetchData(param) {
      const hostsData = []
      let hostDataLen = 0
      apiGetHostNamesFromHostGroupName(param).then(res => {
        const hostData = res.data
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
      menu.style.cssText = 'position: fixed; left: ' + MouseEvent.clientX + 'px' + '; top: ' + (MouseEvent.clientY) + 'px; z-index: 999; cursor:pointer;'
    },
    treeAdd() {
      if (this.clickNodeData.level === 1) {
        this.dialogAddVisible = true
        this.$store.state.user.name
        this.hostGroupDataForm = { name: '', createUser: this.$store.state.user.name, explain: '' }
      }
    },
    handleNodeClick(data) {
      console.log(data)
    },
    handleAddDialogClose() {
      this.editLoading = false
    },
    addSubmitForm() {
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
                this.dialogAddVisible = false
                this.$refs['hostGroupDataForm'].resetFields()
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
  width:230px;
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
