<template>
    <div class="header">
        <div class="header-nav">
            <div class="header-left">
                <div class="logo"><span v-for="(item,index) in logo" :style="{color:item.color}">{{ item.name }}</span></div>
                <div class="header-tab">
                    <router-link to="/" :class="['tabs',store.state.articlePboard==undefined?'avtice':'']">首页</router-link>
                    <div v-for="(item,index) in boardList">
                        <el-popover
                        placement="bottom-start"
                        :width="300"
                        trigger="hover"
                        v-if="item.children.length>0"
                    >   
                        <div class="sub-board-list" >
                            <div v-for="(items,index) in item.children" :class="['sub-board',store.state.articleBoard==items.boardId?'active':'']" @click="handlerBoard(items)">{{ items.boardName }}</div>
                        </div>
                        <template #reference>
                            <div :class="['tabs',store.state.articlePboard==item.boardId?'avtice':'']" @click="handlerPboard(item)">{{item.boardName}}</div>
                        </template>
                        </el-popover>
                        <div v-else :class="['tabs',store.state.articlePboard==item.boardId?'avtice':'']" @click="handlerPboard(item)">{{item.boardName}}</div>
                    </div>
                </div>
            </div>
            <div class="header-right">
                <el-button type="primary" style="margin-right: 5px;" @click="addForum">发帖<span class="iconfont icon-add"></span></el-button>
                <el-button type="primary" style="margin-right: 5px;" @click="search">搜索<span class="iconfont icon-search"></span></el-button>
                <el-button-group v-if="store.state.loginUserInfo==null">
                    <el-button id="login" type="primary" plain @click="login(1)">登录</el-button>
                    <el-button id="register" type="primary" plain @click="login(0)">注册</el-button>
                </el-button-group>
                <div class="userInfo" v-if="store.state.loginUserInfo !== null">
                    <div class="message">
                        <el-dropdown placement="bottom">
                            <span class="el-dropdown-link">  
                                <el-badge :value="messageCount.total>99?'99+':messageCount.total" :hidden="messageCount.total==null || messageCount.total==0" class="item">
                                    <span class="iconfont icon-message" ></span>
                                </el-badge>
                            </span>
                            <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item @click="goMessage('reply')">
                                    回复我的
                                    <div class="messageItem" v-if="messageCount.reply>0">{{messageCount.reply>99?'99+':messageCount.reply}}</div>
                                </el-dropdown-item>
                                <el-dropdown-item @click="goMessage('likePost')">
                                    赞了我的文章
                                    <div class="messageItem" v-if="messageCount.likePost>0">{{messageCount.likePost>99?'99+':messageCount.likePost}}</div>
                                </el-dropdown-item>
                                <el-dropdown-item @click="goMessage('downloadAttachment')">
                                    下载了我的附件
                                    <div class="messageItem" v-if="messageCount.downloadAttachment>0">{{messageCount.downloadAttachment>99?'99+':messageCount.downloadAttachment}}</div>
                                </el-dropdown-item>
                                <el-dropdown-item @click="goMessage('likeComment')">
                                    赞了我的评论
                                    <div class="messageItem" v-if="messageCount.likeComment>0">{{messageCount.likeComment>99?'99+':messageCount.likeComment}}</div>
                                </el-dropdown-item>
                                <el-dropdown-item @click="goMessage('sys')">
                                    系统消息
                                    <div class="messageItem" v-if="messageCount.sys>0">{{messageCount.sys>99?'99+':messageCount.sys}}</div>
                                </el-dropdown-item>
                            </el-dropdown-menu>
                            </template>
                        </el-dropdown>
                    </div>
                    <div class="headPhoto">
                    <el-dropdown placement="bottom">
                        <span class="el-dropdown-link">  
                              <Avatar :userId="userInfo.userId" :width="50" :height="50"></Avatar>
                        </span>
                        <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item><router-link  style="text-decoration: none;color: #606266;" :to="'/userCenter/'+store.state.loginUserInfo.userId">个人中心</router-link></el-dropdown-item>
                            <el-dropdown-item @click="logout">退出</el-dropdown-item>
                        </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                    </div>             
                </div>
            </div>
        </div>
    </div>
    <div class="content">
        <router-view></router-view>
    </div>
    <loginAndRegister ref="loginAndRegisterRef"></loginAndRegister>
</template>

<script setup>
import {useStore} from 'vuex'
import loginAndRegister from './loginAndRegister/index.vue'
import {useRouter,useRoute} from 'vue-router'
import { ref, reactive, getCurrentInstance, nextTick,watch,onMounted } from "vue"
const { proxy } = getCurrentInstance();
const store=useStore()
const router=useRouter()
const route=useRoute()
const api={
    getUserInfo:'/getUserInfo',
    logout:'/logout',
    loadBoard:'/board/loadBoard',
    getMessageCount:'/ucenter/getMessageCount'
}
onMounted(()=>{
    getLoginInfo()
    getBoard()
    getMessageCount()
})
//logo
const logo=[
    {
        name:'E',
        color:'rgb(50, 133, 255)'
    },
    {
        name:'a',
        color:'rgb(251, 54, 36)'
    },
    {
        name:'s',
        color:'rgb(255, 186, 2)'
    },
    {
        name:'y',
        color:'rgb(50, 133, 255)'
    },
    {
        name:'B',
        color:'rgb(37, 178, 78)'
    },
    {
        name:'B',
        color:'rgb(251, 54, 36)'
    },
    {
        name:'s',
        color:'rgb(255, 186, 2)'
    },
]
//登录注册
const loginAndRegisterRef=ref()
const login=(type)=>{
    loginAndRegisterRef.value.showPanel(type)
    document.getElementById('login').blur()
    document.getElementById('register').blur()
}
//获取用户登录信息
const getLoginInfo=async()=>{
    let res=await proxy.Request({
        url:'/getUserInfo'
    })
    if(!res){
        return 
    }
    store.commit('updateLoginUserInfo',res.data)
}
//退出登录
const logout= async()=>{
    let res=await proxy.Request({
        url:api.logout
    })
    if(!res){
        return 
    }
    proxy.Message.success('退出成功')
    store.commit('updateLoginUserInfo',null)
    location.reload()

}

//获取所有板块
const boardList=ref([])
const getBoard=async()=>{
    let res=await proxy.Request({
        url:api.loadBoard
    })
    if(!res){
        return
    }
    boardList.value=res.data    
    store.commit('setBoardList',res.data)

}
getBoard()
//获取消息
const messageCount=ref(store.state.messageCount)
const getMessageCount=async ()=>{
    let res =await proxy.Request({
        url:api.getMessageCount
    })
    if(!res){
        return
    }
    messageCount.value=res.data
    store.commit('updateMessageCount',res.data)
}
//点击一级板块
const handlerPboard=(board)=>{
    router.push('/forum/'+board.boardId)
}
//点击二级板块
const handlerBoard=(board)=>{
    router.push('/forum/'+board.pBoardId+'/'+board.boardId)
}
//滚动隐藏导航栏
const Yoffset=ref(0)
document.addEventListener('scroll',()=>{
    let scrollTop=document.documentElement.scrollTop || document.body.scrollTop
    let scroll=scrollTop-Yoffset.value
    Yoffset.value=scrollTop
    if(scroll>0){
        if(scrollTop>100){
            document.querySelector('.header').style.display='none'
        }
    }else if(scroll<0){
            document.querySelector('.header').style.display='block'
    }
})
//发帖
const addForum=()=>{
    if(store.state.loginUserInfo==null){
        store.commit('showLogin',true)
        return
    }
    router.push('/newPost')
}
//消息跳转
const goMessage=(type)=>{
    router.push('/message/'+type)
}

const userInfo=ref({})
watch(() =>store.state.loginUserInfo, (newVal, oldVal) => {
    getMessageCount()
    if(newVal !== undefined && newVal !== null){
        userInfo.value=newVal
        store.commit('showLogin',false)
    }else{
        store.commit('showLogin',true)
    }
}, { immediate: true, deep: true });
//发帖
const search=()=>{
    router.push('/search')
}
</script>

<style lang="scss" scoped>
.header{
    position: fixed;
    top: 0;
    width: 100%;
    height: 60px;
    box-shadow:0 5px 5px #ddd ;
    background-color: #fff;
    z-index: 999;
    .header-nav{
        width: 1300px;
        height: 100%;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
        .header-left{
            font-size: 30px;
            line-height: 60px;
            display: flex;
            .logo{
                margin-right: 5px;
            }
            .header-tab{
                font-size: 16px;
                display: flex;

                .tabs{
                    padding: 0 10px;
                    color: #61666d;
                    cursor: pointer;
                    text-decoration: none;
                }
                .avtice{
                    color: var(--hoverColor);
                }
                .tabs:hover{
                    color: var(--hoverColor);
                }
            }
        }
        .header-right{
            display: flex;
            align-items: center;
            .userInfo{
                width: 128px;
                height: 50px;
                display: flex;
                justify-content: space-between;
                :deep(.el-badge__content.is-fixed){
                    top: 5px;
                }
                .iconfont{
                    font-size: 25px;
                    line-height: 50px;
                    color: #8a919f;
                }
                .headPhoto{
                    width: 50px;
                    height: 50px;
                    margin-right: 30px;
                }
                .user{
                    div{
                        cursor: pointer;
                        margin: 20px;
                    }
                }
            }
        }
        :deep(.el-button+.el-button){
            margin: 0;
        }
    }
}
.content{
    // width: 1300px;
    min-height: calc(100vh - 210px);
    // height: 1200px;
    // margin: 0 auto;
    margin-top: 60px;
}
</style>
<style lang="scss" >
    .sub-board-list{
        display: flex;
        .sub-board{
            padding: 0px 10px;
            border-radius: 20px;
            margin-right: 10px;
            background:rgb(239,239,239);
            border: 1px solid #ddd;
            color:rgb(119, 118, 118);
            margin-top: 10px;
            cursor: pointer;
        }
        .active{
            color: var(--hoverColor);
        }
        .sub-board:hover{
            color: var(--hoverColor);
        }
    }
    .messageItem{
        position: absolute;
        right: 5px;
        width: 18px;
        height: 18px;
        background-color: #f56c6c;
        border-radius: 10px;
        text-align: center;
        line-height: 18px;
        font-size: 12px;
        font-weight: 500;
        color: #fff;
    }
    .el-dropdown-menu{
            width: 150px;
        }
</style>
