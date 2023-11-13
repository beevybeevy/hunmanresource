<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <!-- 接收消息的按钮 -->

      <el-popover
        ref="customPopover"
        placement="top-start"
        title=""
        width="400"
        trigger="click"
      >

        <el-tabs>
          <el-tab-pane :label="`未读${unread.length}条`" name="first">
            <el-card v-for="(item) in unread" :key="item.id" class="card">
              <div class="card-content">
                <el-row type="flex" justify="space-between" align="middle" class="row-item">
                  <div>
                    <span v-if="item.type===1" class="el-tag--success">通知</span>
                    <span v-else-if="item.type===2" class="el-tag--info">提示</span>
                    <span v-else-if="item.type===3" class="el-tag--warning">重要</span>
                    <span v-else class="el-tag--danger">紧急</span>
                    <span>{{ item.content }}</span>
                  </div>
                  <!-- 删除按钮 -->
                  <i class="el-icon-close" @click="closePopover(item.id)" />
                </el-row>
                <!-- 标为已读按钮 -->
                <div class="content">
                  <i class="el-icon-document-checked" @click="handleRead(item.id)" />
                  <p>{{ item.update_time }}</p>
                </div>
              </div>
            </el-card>
          </el-tab-pane>
          <el-tab-pane :label="`已读${read.length}条`" name="second">
            <el-card v-for="(item) in read" :key="item.id" class="card">
              <div class="card-content">
                <el-row type="flex" justify="space-between" align="middle" class="row-item">
                  <div>
                    <span v-if="item.type===1" class="el-tag--success">通知</span>
                    <span v-else-if="item.type===2" class="el-tag--info">提示</span>
                    <span v-else-if="item.type===3" class="el-tag--warning">重要</span>
                    <span v-else class="el-tag--danger">紧急</span>
                    <span>{{ item.content }}</span>
                  </div>
                  <i class="el-icon-close" @click="closePopover(item.id)" />
                </el-row>
                <p style="text-align: right;">{{ item.update_time }}</p>
              </div></el-card>
          </el-tab-pane>
        </el-tabs>

      </el-popover>
      <el-badge v-popover:customPopover :value="unread.length" class="item" :hidden="unread.length<1">
        <!-- <i v-if="unread.length>0" slot="reference" class="el-icon-message-solid" @click="receiveMessage" /> -->
        <i class="el-icon-bell" @click="receiveMessage" />
      </el-badge>
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">

          <!-- 头像 -->
          <img v-if="avatar" :src="avatar" class="user-avatar">
          <span v-else class="username">{{ name ? name[0] : '管' }}</span>
          <!-- 用户名称 -->
          <span class="name">{{ name }}</span>
          <!-- 图标 -->
          <i class="el-icon-setting" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item>
              首页
            </el-dropdown-item>
          </router-link>
          <a target="_blank" href="https://gitee.com/beevy/who-cares.git">
            <el-dropdown-item>项目地址</el-dropdown-item>
          </a>
          <!-- prevent: 阻止默认事件 -->
          <!-- native: 绑定原生事件 -->
          <el-dropdown-item @click.native="updatePassword">
            <span style="display:block;">修改密码</span>
          </el-dropdown-item>
          <el-dropdown-item>
            <span style="display:block;" @click="dialogVisible=true">更新头像</span>
          </el-dropdown-item>
          <el-dropdown-item divided @click.native="logout">
            <span type="text" style="display:block;">登出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <!-- 修改密码弹框 -->
    <el-dialog width="500px" title="修改密码" :visible.sync="showDialog" @close="btnCancel">
      <el-form ref="passForm" label-width="120px" :model="passForm" :rules="rules">
        <el-form-item label="旧密码" prop="oldPassword">
          <el-input v-model="passForm.oldPassword" show-password size="small" />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="passForm.newPassword" show-password size="small" />
        </el-form-item>
        <el-form-item label="重复密码" prop="confirmPassword">
          <el-input v-model="passForm.confirmPassword" show-password size="small" />
        </el-form-item>
        <el-form-item>
          <el-button size="mini" type="primary" @click="btnOK">确认修改</el-button>
          <el-button size="mini" @click="btnCancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--修改头像 弹框-->
    <el-dialog
      title="更新头像"
      :visible.sync="dialogVisible"
      width="50%"
      center
      @update="update(re)"
    >
      <Navbarli />
    </el-dialog>
  </div>
</template>

<script>

import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import { updatePassword } from '@/api/user'
import { receiveInfo, deletMessage, read } from '@/api/message'

import Navbarli from './Navbarli.vue'// 引入更新头像组件
export default {
  components: {
    Breadcrumb,
    Hamburger,
    Navbarli//

  },
  data() {
    return {
      showDialog: false,
      dialogVisible: false,

      passForm: {
        oldPassword: '', // 旧密码
        newPassword: '', // 新密码
        confirmPassword: '' // 确认密码字段
      },
      rules: {
        oldPassword: [{ required: true, message: '旧密码不能为空', trigger: 'blur' }], // 旧密码
        newPassword: [{ required: true, message: '新密码不能为空', trigger: 'blur' }, {
          trigger: 'blur',
          min: 6,
          max: 16,
          message: '新密码的长度为6-16位之间'
        }], // 新密码
        confirmPassword: [{ required: true, message: '重复密码不能为空', trigger: 'blur' }, {
          trigger: 'blur',
          validator: (rule, value, callback) => {
            // value
            if (this.passForm.newPassword === value) {
              callback()
            } else {
              callback(new Error('重复密码和新密码输入不一致'))
            }
          }
        }] // 确认密码字段
      },
      unread: [],
      read: [],
      activeName: 'first'
    }
  },
  computed: {
    // 引入头像和用户名称
    ...mapGetters([
      'sidebar',
      'avatar', // 映射头像
      'name'
    ])
  },
  created() {
    this.timer = setInterval(this.receiveMessage, 2000)
  },

  destroyed() {
    clearInterval(this.timer)
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      // 执行登出 action
      this.$confirm('确认退出登录吗').then(async() => {
        await this.$store.dispatch('user/logout')
        // 跳转到登录页
        this.$router.push(`/login`)
      }).catch()
    },
    updatePassword() {
      this.showDialog = true
    },
    btnOK() {
      this.$refs.passForm.validate(async isOK => {
        if (isOK) {
          // 调用接口
          await updatePassword(this.passForm)
          this.$message.success('修改密码成功')
          this.btnCancel()
        }
      })
    },
    btnCancel() {
      this.$refs.passForm.resetFields() // 重置表单
      // 关闭弹层
      this.showDialog = false
    },
    async receiveMessage() {
      const res = await receiveInfo()
      this.unread = res.unread
      this.read = res.read
      // console.log(this.read)
    },
    async closePopover(id) {
      await deletMessage(id)
      if (this.unread.length === 0 || this.read.length === 0) {
        this.$refs.customPopover.doClose()
      }
    },
    async handleRead(id) {
      await read(id)
    }
  }
}

</script>

<style lang="scss" scoped>

.card{
  border: 5px #5a5e66;
  width:380px;
  height:120px;
  border-radius: 10px;
}
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;
        display: flex;
        align-items: center;
        .name {
          //  用户名称距离右侧距离
          margin-right: 10px;
          font-size: 16px;
        }
        .el-icon-setting {
          font-size: 20px;
        }
        .user-avatar {
          cursor: pointer;
          width: 30px;
          height: 30px;
          border-radius: 50%;
        }

        .username {
          width: 30px;
          height: 30px;
          text-align: center;
          line-height: 30px;
          border-radius: 50%;
          background: #04c9be;
          color: #fff;
          margin-right: 4px;
        }
      }
    }
  }
}

.el-icon-message{
  font-size: 23px;
  margin-bottom: 15px;
}
el-button{
  display: inline-block;
}
.el-tag--success{
  background-color: #f0f9eb;
    border-color: #e1f3d8;
    color: #67c23a;
    height: 20px;
    padding: 0 5px;
    line-height: 19px;
    font-size: 12px;
    border-width: 1px;
    border-style: solid;
    border-radius: 4px;
    box-sizing: border-box;
    white-space: nowrap;
}

.el-tag--info{
  background-color: #f4f4f5;
    border-color: #e9e9eb;
    color: #909399;
    height: 20px;
    padding: 0 5px;
    line-height: 19px;
    font-size: 12px;
    border-width: 1px;
    border-style: solid;
    border-radius: 4px;
    box-sizing: border-box;
    white-space: nowrap;
}

.el-tag--warning{
  background-color: #fdf6ec;
    border-color: #faecd8;
    color: #e6a23c;
    height: 20px;
    padding: 0 5px;
    line-height: 19px;
    font-size: 12px;
    border-width: 1px;
    border-style: solid;
    border-radius: 4px;
    box-sizing: border-box;
    white-space: nowrap;
}

.el-tag--danger{
  background-color: #fef0f0;
    border-color: #fde2e2;
    color: #f56c6c;
    height: 20px;
    padding: 0 5px;
    line-height: 19px;
    font-size: 12px;
    border-width: 1px;
    border-style: solid;
    border-radius: 4px;
    box-sizing: border-box;
    white-space: nowrap;
}
.row-item {
  padding-right:10px;
}
p{
  margin-top:30px
}
.el-icon-document-checked{
  margin-top: 10px;
  font-size: 16px;
}
.content{
  display: flex;
  justify-content: space-between;
}
.card-content{
  margin-bottom: 10px;
}
.el-icon-bell{
  font-size: 25px;
  margin-bottom: 10px;
}
.item{
  margin-right: 15px;
}
</style>
