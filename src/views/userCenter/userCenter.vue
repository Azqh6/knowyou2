<template>
    <div class="uCenterBox">
        <div class="nav">
            <span class="a-link">首页</span>
            <span class="iconfont icon-right"></span>
            <span>个人中心</span>
        </div>
        <div class="content">
            <div class="left">
                <div class="left-top">
                    <div class="avatar">
                        <Avatar :height="120" :width="120" :userId="userInfo.userId"></Avatar>
                    </div>
                    <div class="username">
                        {{userInfo.nickName}}
                        <span v-if="userInfo.sex==1" style="color: #05a9f4;font-size: 18px;" class="sex iconfont icon-man"></span>
                        <span v-if="userInfo.sex==0" style="color: pink;font-size: 18px;" class="sex iconfont icon-woman"></span>
                    </div>
                    <div class="personDescription">
                        {{userInfo.personDescription}}
                    </div>
                    <div class="editUserInfo" v-if="store.state.loginUserInfo !== null && store.state.loginUserInfo.userId==userId" @click="showDialog=true">修改资料</div>
                </div>
                <div class="left-bottom">
                    <div class="item">
                        <div>
                            <span class="label iconfont icon-integral"></span>
                            积分
                        </div>
                        {{userInfo.currentIntegral}}
                    </div>
                    <div class="item">
                        <div>
                            <span class="label iconfont icon-like"></span>
                            获赞
                        </div>
                        {{userInfo.likeCount}}
                    </div>
                    <div class="item">
                        <div>
                            <span class="label iconfont icon-post"></span>
                            发帖
                        </div>
                        {{userInfo.postCount}}
                    </div>
                    <div class="item">
                        <div>
                            <span class="label iconfont icon-register"></span>
                            加入
                        </div>
                        {{userInfo.joinTime}}
                    </div>
                    <div class="item">
                        <div>
                            <span class="label iconfont icon-login"></span>
                            最后登录
                        </div>
                        {{userInfo.lastLoginTime}}
                    </div>
                </div>
            </div>
            <div class="right">
                <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
                    <el-tab-pane label="发帖" :name=0></el-tab-pane>
                    <el-tab-pane label="评论" :name=1></el-tab-pane>
                    <el-tab-pane label="点赞" :name=2></el-tab-pane>
                </el-tabs>
                <DataList :dataSource="userArticleInfo">
                    <template #default="{data}">
                        <ArticleItem :data="data"></ArticleItem>
                    </template>
                </DataList>
            </div>
        </div>
        <Dialog :show="showDialog" title="编辑个人资料" :showCancel="false" :buttons="buttons" :width="500" @close="showDialog=false" >
            <el-form :model="formData" :label-width="50">
                <el-form-item label="昵称">
                    {{userInfo.nickName}}
                </el-form-item>
                <el-form-item label="头像" class="avatars">
                    <uploadCover :imageUrlPrefix="userInfo.userid" v-model="formData.avatar"></uploadCover>
                </el-form-item>
                <el-form-item label="性别">
                    <el-radio-group v-model="formData.sex">
                        <el-radio :label=0>女</el-radio>
                        <el-radio :label=1>男</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="简介">
                    <el-input v-model="formData.personDescription" type="textarea" maxlength="100" :rows="5" placeholder="请输入简介" :show-word-limit="true"></el-input>
                </el-form-item>
            </el-form>
        </Dialog>
    </div>
</template>

<script setup>
import ArticleItem from '../article/ArticleItem.vue'
import { ref, reactive, getCurrentInstance, nextTick,watch,onMounted } from "vue"
import {useRoute,useRouter} from 'vue-router'
import {useStore} from 'vuex'
const store=useStore()
const route=useRoute()
const router=useRouter()
const { proxy } = getCurrentInstance();
const api={
    getUserInfo:'/ucenter/getUserInfo',
    loadUserArticle:'/ucenter/loadUserArticle',
    updateUserInfo:'/ucenter/updateUserInfo'
}
 onMounted(() => {
    getUserArticle()
 })
//获取用户信息
const userId=ref(null)
const userInfo=ref({})
const getUserInfo= async()=>{
    const res = await proxy.Request({
        url:api.getUserInfo,
        params:{
            userId:userId.value
        }
    })
    if(!res){
        return
    }
    userInfo.value=res.data
}
watch(()=>route,(newVar,oldVar)=>{
    if(route.path.indexOf('/userCenter') !== -1)
    userId.value=newVar.params.userId
    getUserInfo()
},{immediate:true,deep:true})

//右边用户帖子
const activeName=ref(0)
//获取用户发帖
const type=ref(0)
const handleClick=(e)=>{
   type.value=e.props.name
   getUserArticle()
}
const userArticleInfo=ref({})
const getUserArticle=async()=>{
    let res=await proxy.Request({
        url:api.loadUserArticle,
        params:{
            type:type.value,
            userId:userId.value
        }
    })
    if(!res){
        return
    }
    userArticleInfo.value=res.data
}
//修改个人资料
const showDialog=ref(false)
const formData=ref({})
const localFile=ref(null)
const updateUserInfo=async()=>{
    let params=Object.assign({},formData.value)
    if(localFile.value !== null){
        params.avatar=localFile
    }
    let res= await proxy.Request({
        url:api.updateUserInfo,
        params
    })
    if(!res){
        return
    }
    showDialog.value=false
    location.reload()
}
const buttons=[{
    type:'primary',
    text:"确认",
    click:(e)=>{
        updateUserInfo()
    }
}]
watch(()=>store.state.loginUserInfo,(newVal,oldVal)=>{
    if(newVal){
        router.push('/')
    }
},{deep:true})
</script>

<style lang="scss" scoped>
.uCenterBox{
    width: 1300px;
    min-height: 500px;
    padding-top: 10px;
    margin: 0 auto;
    .nav{
        height: 40px;
        line-height: 40px;
        .iconfont{
            font-size: 14px;
            padding: 0 10px;
        }
    }
    .content{
        display: flex;
        .left{
            position: relative;
            margin-right: 10px;
            .left-top{
                width: 300px;
                height: 188px;
                padding: 10px 0px;
                background-color:#fff;
                .avatar{
                    display: flex;
                    justify-content: center;
                }
                .username{
                    margin-top: 10px;
                    text-align: center;
                }
                .personDescription{
                    font-size:13px;
                    padding: 10px;
                    text-overflow: ellipsis;
                    white-space:nowrap;
                    overflow: hidden; 
                }
                .editUserInfo{
                    position: absolute;
                    color: var(--hoverColor);
                    right: 10px;
                    top:10px;
                    font-size: 13px;
                    cursor: pointer;
                }
            }
            .left-bottom{
                box-sizing: border-box;
                margin-top: 10px;
                background-color: #fff;
                padding: 10px;
                .item{
                    display:flex;
                    justify-content: space-between;
                    font-size: 13px;
                    height: 34px;
                    .iconfont{
                        font-size: 22px;
                        color:#9ba7b9;
                        margin-right: 5px;
                    }
                }
            }
        }
        .right{
            width: 990px;
            min-height: 500px;
            background-color: #fff;
            padding: 0px 10px 10px 10px ;
        }
    }
}
</style>
