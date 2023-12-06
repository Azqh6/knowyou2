<template>
    <Dialog :show="loginShow" :title="title" :showCancel="false" width="400px" @close="loginShow=false">
        <el-form :model="dataForm" :rules="rules" ref="dataFormRef">
            <!-- 邮箱 -->
            <el-form-item prop="email">
                <el-input v-model="dataForm.email" type="text" placeholder="请输入邮箱">
                    <template #prefix>
                        <span class="iconfont icon-account"></span>
                    </template>
                </el-input>
            </el-form-item>
            <!-- 邮箱验证码 -->
            <el-form-item style="margin: 0;" v-if="loginType != 1">
                <el-input v-model="dataForm.emailCode" placeholder="请输入邮箱验证码" style="width: 255px;margin-right: 5px;"></el-input>
                <el-button type="primary" size="large" @click="emailCheck">获取验证码</el-button>
                <el-popover
                placement="left"
                width="500"
                trigger="click">
                <div>
                    <p>1、在垃圾箱中查找邮箱验证码</p>
                    <p>2、在邮箱中->设置->反馈->反垃圾->白名单->设置邮件地址白名单</p>
                    <p>3、将邮箱【1846508601@qq.com】添加到白名单</p>
                </div>
                 <template #reference>
                    <span class="a-link" style="font-size: 12px;">未收到邮箱验证码？</span>
                 </template>
                </el-popover>
            </el-form-item>
            <!-- 请输入名称 -->
            <el-form-item v-if="loginType==0" prop="nickName">
                <el-input v-model="dataForm.nickName" type="text" placeholder="请输入名称">
                    <template #prefix>
                        <span class="iconfont icon-account"></span>
                    </template>
                </el-input>
            </el-form-item>
            <!-- 输入密码 -->
            <el-form-item v-if="loginType==1" prop="password">
                <el-input v-model="dataForm.password" :type="psdType" placeholder="请输入密码">
                    <template #prefix>
                        <span class="iconfont icon-password"></span>
                    </template>
                    <template #suffix>
                        <span class="iconfont icon-close-eye" v-show="psdType=='password'" style="cursor: pointer;" @click="changePsdType(true)"></span>
                        <span class="iconfont icon-eye" v-show="psdType=='text'" style="cursor: pointer;" @click="changePsdType(false)"></span>
                    </template>
                </el-input>
            </el-form-item>
            <!-- 注册密码 -->
            <el-form-item v-if="loginType != 1" prop="registerPassword">
                <el-input v-model="dataForm.registerPassword" :type="psdType" placeholder="请输入密码">
                    <template #prefix>
                        <span class="iconfont icon-password"></span>
                    </template>
                    <template #suffix>
                        <span class="iconfont icon-close-eye" v-show="psdType=='password'" style="cursor: pointer;" @click="changePsdType(true)"></span>
                        <span class="iconfont icon-eye" v-show="psdType=='text'" style="cursor: pointer;" @click="changePsdType(false)"></span>
                    </template>
                </el-input>
            </el-form-item>
            <!-- 再次输入密码 -->
            <el-form-item v-if="loginType != 1" prop="reRegisterPassword">
                <el-input v-model="dataForm.reRegisterPassword" :type="psdType" placeholder="请再次输入密码">
                    <template #prefix>
                        <span class="iconfont icon-password"></span>
                    </template>
                    <template #suffix>
                        <span class="iconfont icon-close-eye" v-show="psdType=='password'" style="cursor: pointer;" @click="changePsdType(true)"></span>
                        <span class="iconfont icon-eye" v-show="psdType=='text'" style="cursor: pointer;" @click="changePsdType(false)"></span>
                    </template>
                </el-input>
            </el-form-item>
            <!-- 输入验证码 -->
            <el-form-item>
                <el-input  v-model="dataForm.checkCode" placeholder="请输入验证码" style="width: 235px;margin-right: 5px;">
                    <template #prefix>
                        <span class="iconfont icon-checkcode"></span>
                    </template>
                </el-input>
                <div class="checkCode">
                    <img :src="checkCodeUrl" class="check-code" @click="changeCheckCode(0)" >
                </div>
            </el-form-item>
            <!-- 记住我 -->
            <el-form-item style="margin: 0;">
                <el-checkbox v-model="dataForm.checkMe" label="记住我"></el-checkbox>
            </el-form-item>
            <!-- 没有密码？忘记账号？ -->
            <el-form-item v-if="loginType==1">
                <div class="footer">
                    <span class="a-link" @click="checkLogin(2)">忘记密码？</span>
                    <span class="a-link" @click="checkLogin(0)">没有账号？</span>
                </div>
            </el-form-item>
            <!-- 去登陆？ -->
            <el-form-item v-if="loginType==2">
                <span class="a-link" @click="checkLogin(1)">去登陆？</span>
            </el-form-item>
            <el-form-item v-if="loginType==0">
                <span class="a-link" @click="checkLogin(1)">已有账号？</span>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" style="width: 100%;" @click="doSubmit">{{title}}</el-button>
            </el-form-item>
        </el-form>
    </Dialog>
    <Dialog :show="emailCheckShow" title="发送邮箱验证码" width="500px" :buttons="buttons" :showCancel="false" @close="emailCheckShow=false"> 
        <el-form
            :model="sendEmailCodeForm"
            ref="sendEmailCodeFormRef"
            label-width="80px"
        >
        <el-form-item label="邮箱">{{dataForm.email}}</el-form-item>
        <el-form-item label="验证码">
            <el-input  v-model="sendEmailCodeForm.checkCode" placeholder="请输入验证码" style="width: 235px;margin-right: 5px;">
                    <template #prefix>
                        <span class="iconfont icon-checkcode"></span>
                    </template>
            </el-input>
                <div class="checkCode">
                    <img :src="checkCodeUrl4MailCode" class="check-code" @click="changeCheckCode(1)" >
                </div>
        </el-form-item>
        </el-form>
    </Dialog>
</template>

<script setup>
import Dialog from '@/components/Dialog.vue'
import md5 from 'js-md5'
import{getCurrentInstance, ref,nextTick}from 'vue'
const {proxy}=getCurrentInstance()
const api={
    checkCode:'/api/checkCode',
    sendEmail:'/sendEmailCode',
    register:'/register',
    login:'/login',
    resetPwd:'/resetPwd'
}
const dataForm=ref({})
const dataFormRef=ref()
const loginShow=ref(false)
const showPanel=(type)=>{
    loginShow.value=true
    checkLogin(type)
}
defineExpose({showPanel})
// 0注册 1登录 2重置密码
const loginType=ref(0)
const title=ref('登录')
const checkLogin=(type)=>{
    resetForm()
    switch(type){
        case 0:
            loginType.value=0;
            title.value='注册'
            break;
        case 1:
            loginType.value=1;
            title.value='登录'
            break;
        case 2:
            loginType.value=2;
            title.value='重置密码'
            break;
    }
}
//表单校验规则
const rePasswordValidate=(rule,value,callback)=>{
    if(!value){
        return
    }else{
        if(value==dataForm.value.registerPassword){
            callback()
        }else{
            callback(rule.message)
        }
    }
}
const rules={
    email:[
        {required:true,message:'请输入邮箱',trigger:'blur'},
        {min:3,max:150,message:'输入的邮箱过短或过长',trigger:'blur'},
        {validator:proxy.Verify.email,message:'请输入正确的邮箱'}
    ],
    password:[
        {required:true,message:'请输入密码',trigger:'blur'}
    ],
    nickName:[
        {required:true,message:'请输入昵称'}
    ],
    registerPassword:[
        {required:true,message:'请输入密码',trigger:'blur'},
        {validator:proxy.Verify.password,message:'请输入带有字母和数字且位数在8-16位的密码'}
    ],
    reRegisterPassword:[
        {required:true,message:'请再次输入密码'},
        {validator:rePasswordValidate,message:'两次输入的密码不一样'}
    ]
}
//表单清空
const resetForm=()=>{
    dataForm.value={}
    changeCheckCode(0)
}
//验证码图片
const checkCodeUrl=ref(api.checkCode)
const checkCodeUrl4MailCode=ref(api.checkCode)
const changeCheckCode=(type)=>{
    if(type==0){
        checkCodeUrl.value=api.checkCode+'?type='+type+'&time='+new Date().getTime()
    }else{
        checkCodeUrl4MailCode.value=api.checkCode+'?type='+type+'&time='+new Date().getTime()
    }
   
}
//发送邮箱验证码
const emailCheckShow=ref(false)
const buttons=[
    {
        type:'primary',
        text:'发送验证码',
        click:()=>{
            sendEmailCode()
        }
    }
]
const sendEmailCodeForm=ref({
    email:'',
    checkCode:''
})
const sendEmailCodeFormRef=ref()
const emailCheck=()=>{
        dataFormRef.value.validateField('email',(valid)=>{
        if(!valid){
            return
        }
        sendEmailCodeForm.value.email=dataForm.value.email
        emailCheckShow.value=true
    })
}
//发送邮件
const sendEmailCode=()=>{
    sendEmailCodeFormRef.value.validate(async(valid)=>{
        if(!valid){
            return
        }
        const params=Object.assign({},sendEmailCodeForm.value)
        params.type=loginType==0?0:1
        let res=await proxy.Request({
            url:api.sendEmail,
            params:params,
            errorCallback:()=>{
                changeCheckCode(1)
                sendEmailCodeForm.value.checkCode=''
            }
        })
        if(!res){
            return
        }
        proxy.Message.success('发送邮件成功')
        emailCheckShow.value=false
    })
}
//注册
const doSubmit=()=>{
    dataFormRef.value.validate(async (valid)=>{
        if(!valid){
            return 
        }
        const params=Object.assign({},dataForm.value)
        const url=ref()
        switch(loginType.value){
            case 0:
                params.password=dataForm.value.registerPassword;
                url.value=api.register;
                break;
            case 1:
                url.value=api.login;
                params.password=md5(params.password)
                break;
            case 2:
                url.value=api.resetPwd;
                params.password=dataForm.value.reRegisterPassword
                break;
        }
        let res= await proxy.Request({
            url:url.value,
            params:params,
            errorCallback:()=>{
                changeCheckCode(0)
            }
        })
        if(!res){
            return
        }
        if(loginType.value==0){
            proxy.Message.success('注册成功，赶快去登录吧！')
            showPanel(1)
        }

    })
}
//密码框切换
const psdType=ref('password')
const changePsdType=(type)=>{
    if(type){
        psdType.value='text'
    }else{
        psdType.value='password'
    }
}
</script>

<style lang="scss" scoped>
:deep(.el-input){
    height: 40px;
}
.checkCode{
    width: 130px;
    height: 38px;
    background-color: red;
}
.footer{
    width: 100%;
    display: flex;
    justify-content: space-between;
    span{
        display: inline-block;
    }
}
.btn{
    width:100%;
    height: 30px;
    background-color: #409eff;
    text-align: center;
    line-height: 30px;
    color: #fff;
    border-radius: 5px;
    cursor: pointer;
}
</style>
