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
            <el-tab-pane label="填写cookie登录" name="second" disabled>
              <el-input v-model="input" placeholder @blur="changeInput" />
              <div v-if="list.length">
                <el-button type="primary" v-for="(item, index) in list" :key="index">第{{item.id}}次</el-button>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
  </el-main>
</template>

<script setup>

import { reactive, ref, getCurrentInstance } from 'vue'
import { getToken, searchUser } from '@/api/index'
import { ElMessage, ElMessageBox } from 'element-plus'
// import { FormInstance } from 'element-plus'
const { proxy } = getCurrentInstance(); 
const formSize = ref('default')
const ruleFormRef = ref()
const activeName = ref('first')
const input = ref('')
const server = reactive([
  {
    value: 1,
    label: '腾讯云',
  }
])
const serverValue = ref(server[0].label)

let list = reactive([])

const ruleForm = reactive({
  name: '',
})

const rules = reactive({
  name: [
    { required: true, message: '请输入京东昵称', trigger: 'blur' },
  ],
})

const expiration = localStorage.getItem('expiration')
const dayjs = proxy.dayjs

const submitForm = async (formEl) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      // console.log('submit!')
      const searchValue = ruleForm.name;
      searchUser({
        searchValue,
        t: expiration
      }).then(res => {
        // console.log(2, res)
        if (res.length) {
          let result = res[0].value.split('pt_pin=')[1];
          result = result.substring(0, result.length - 1)
          if (searchValue === result) {
            console.log('匹配上了')
            // ElMessageBox.alert('This is a message', 'Title', {
            //   confirmButtonText: 'OK',
            // })
            const time = `${dayjs(res[0].timestamp).format('YYYY/MM/DD HH:mm:ss')}`

            ElMessageBox.alert(
              `<div>
                <p class="huanhang">青龙备注：${res[0].remarks}</p>
                <p>登录时间：${time}</p>
                <p>到期时间：30天后</p>
                <p>登录地址：<a href="http://106.53.246.91:5701/">JD登录</a></p>
              </div>`,
              '查询结果',
              {
                dangerouslyUseHTMLString: true,
              }
            )
          } else {
            ElMessage('查询不到此昵称')
          }
          // console.log(result)
        } else {
          ElMessage('查询不到此昵称')
        }


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
    localStorage.setItem('Authorization', `${res.token_type} ${res.token}`)
  });
}

if (!expiration || expiration < getSystemTime()) {
  fetchToken()
}

const changeInput = () => {
  const inputValue = input.value * 1; // 输入框的值 乘1 是为了转数字
  const listLength = list.length; // 按钮数组长度
  const diff = inputValue - listLength; // 差值

  // 判断处理
  if (inputValue > listLength) {
    // 按钮变多了
    console.log('按钮变多了', diff);
    for (let i = listLength; i < (diff + listLength); i++) {
      list.push({
        id: i + 1, // i 默认是0
        isShow: true,
      })
    }
  } else {
    // 按钮变少了
    console.log('按钮变少了', Math.abs(diff))
    list.splice(-Math.abs(diff), Math.abs(diff))
  }

  console.log('list', list)
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

.huanhang {
  word-wrap: break-word;
}
</style>
