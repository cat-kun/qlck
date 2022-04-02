<template>
  <el-main>
    <el-row :span="24">
      <el-col :span="24">
        <el-card shadow="always">
          <el-tabs v-model="activeName" class="demo-tabs">
            <el-tab-pane label="查询cookie是否在线" name="first">
              <el-form
                ref="ruleFormRef"
                :model="ruleForm"
                :rules="rules"
                :size="formSize"
                label-width="120px"
              >
                <el-row class="demo-autocomplete">
                  <el-col :span="24">
                    <el-form-item label="昵称" prop="name">
                      <el-input v-model="ruleForm.name" class="w-260" placeholder="输入京东昵称">
                        <template #prefix>
                          <el-icon class="el-input__icon">
                            <search />
                          </el-icon>
                        </template>
                      </el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row class="demo-autocomplete">
                  <el-col :span="24">
                    <span class="elabel">服务器</span>
                  </el-col>
                </el-row>
                <el-row class="demo-autocomplete">
                  <el-col :span="24">
                    <el-select v-model="serverValue" class="m-2" placeholder="Select" size="large">
                      <el-option
                        v-for="item in server"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-button type="primary" @click="submitForm(ruleFormRef)">查询</el-button>
                  </el-col>
                </el-row>
              </el-form>
            </el-tab-pane>
            <el-tab-pane label="填写cookie登录" name="second" disabled>Config</el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
  </el-main>
</template>

<script setup>

import { reactive, ref } from 'vue'
import { getToken, search } from '@/api/index'
// import { FormInstance } from 'element-plus'

const formSize = ref('default')
const ruleFormRef = ref()
const activeName = ref('first')
const server = reactive([
  {
    value: 1,
    label: '腾讯云',
  }
])
const serverValue = ref(server[0].label)


const ruleForm = reactive({
  name: '',
})

const rules = reactive({
  name: [
    { required: true, message: '请输入京东昵称', trigger: 'blur' },
  ],
})

const expiration = localStorage.getItem('expiration')

const submitForm = async (formEl) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log('submit!')
      search({
        searchValue: ruleForm.name,
        t: expiration
      }).then(res => {
        console.log(2, res)
      })
    } else {
      console.log('error submit!', fields)
    }
  })
}

// 获取当前系统时间戳
const getSystemTime = () => {
  return new Date().getTime()
}
// 获取token，有效期30天
const fetchToken = () => {
  getToken({
    client_id: 'u-x6KXZdFELH',
    client_secret: 'EAffB5xK9Ogium-lcSG9Qbhs',
  }).then(res => {
    console.log('1', res)
    // 存储过期时间，过期了才重新请求接口
    localStorage.setItem('expiration', res.expiration * 1000)
  });
}

if (!expiration || expiration < getSystemTime()) {
  fetchToken()
}

</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.demo-autocomplete {
  margin-bottom: 10px;
}
.w-260 {
  max-width: 260px;
}
</style>
