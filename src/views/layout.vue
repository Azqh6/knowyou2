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
    <div class="footer" v-if="showFooter">
            <div class="footer-content"  :style="{ width: proxy.globalInfo.bodyWidth + 'px' }">
                <el-row>
                    <el-col :span="6" class="item">
                        <div class="logo">
                            <div class="logo-letter">
                                <span v-for="(item,index) in logo" :style="{color:item.color}">{{ item.name }}</span>
                            </div>
                            <div class="info">
                                一个懂你的社区
                            </div>
                        </div>
                    </el-col>
                    <el-col :span="6" class="item">
                        <div class="title">网站相关</div>
                        <div class="title-item">常见问题</div>
                        <div class="title-item">规章制度</div>
                        <div class="title-item">免责声明</div>
                    </el-col>
                    <el-col :span="6" class="item">
                        <div class="title">友情链接</div>
                        <div class="title-item">友情链接</div>
                    </el-col>
                    <el-col :span="6" class="item">
                        <div class="title">关注站长</div>
                        <div><img src="@/assets/erweima.png" style="width: 80px; height: 80px;"></div></el-col>
                </el-row>
            </div>
    </div>
    <loginAndRegister ref="loginAndRegisterRef"></loginAndRegister>
    <!-- 回到顶部 -->
    <div id="backTopBox">
        <div class="backTop" id="backTop" @click="backTop">
            <div class="top"></div>
        </div>
    </div>
</template>

<script setup>
import loginAndRegister from './loginAndRegister/index.vue'
import {useRouter,useRoute} from 'vue-router'
import {useStore} from 'vuex'
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
        name:'K',
        color:'rgb(50, 133, 255)'
    },
    {
        name:'n',
        color:'rgb(251, 54, 36)'
    },
    {
        name:'o',
        color:'rgb(255, 186, 2)'
    },
    {
        name:'w',
        color:'rgb(50, 133, 255)'
    },
    {
        name:'y',
        color:'rgb(37, 178, 78)'
    },
    {
        name:'o',
        color:'rgb(251, 54, 36)'
    },
    {
        name:'u',
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
    //登录信息存入store，便于其他组件联动
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
    //刷新当前页面，以实现退出当前页面状态
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
    //将板块存入store,以实现顶部tab和气泡弹窗的标题高亮    
    store.commit('setBoardList',res.data)

}
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
//点击一级板块-跳转
const handlerPboard=(board)=>{
    router.push('/forum/'+board.boardId)
}
//点击二级板块-跳转
const handlerBoard=(board)=>{
    router.push('/forum/'+board.pBoardId+'/'+board.boardId)
}
//滚动隐藏导航栏
const Yoffset=ref(0)
document.addEventListener('scroll',()=>{
    let scrollTop=document.documentElement.scrollTop || document.body.scrollTop
    //通过scroll值的正负，来判断滚动方向 >0向下
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
//watch监听 监听store中userInfo,来判断登录模块是否显示与隐藏
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
//发帖-跳转
const search=()=>{
    router.push('/search')
}
//通过监听路由变化，来控制页面底部的显示（发帖和编辑帖子不显示）
const showFooter=ref(true)
watch(() => route.path,(newVal, oldVal) => {
    if(newVal.indexOf("newPost") != -1 && newVal.indexOf("editPost") != -1){
        showFooter.value=false
    }else{
        showFooter.value=true
    }
}, { immediate: true, deep: true });
//回到顶部按钮
const backTop=()=>{
    let timer=setInterval(()=>{
        let scrollTop=document.documentElement.scrollTop || document.body.scrollTop
        let speed=Math.floor(-scrollTop/5)
        document.documentElement.scrollTop=scrollTop+speed
        if(scrollTop==0){
            clearInterval(timer)
        }
    },20)
}
document.addEventListener('scroll',()=>{
    let backTop=document.getElementById('backTopBox')
    let scrollTop=document.documentElement.scrollTop || document.body.scrollTop
    if(scrollTop>200){
        backTop.style.opacity=1
    }else{
        backTop.style.opacity=0
    }
})
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
.footer{
    background: #e9e9e9;
    height: 140px;
    margin-top: 10px;

    .footer-content{
        margin: 0px auto;
        padding-top: 10px;
        .item{
            text-align: left;
            .title{
                font-size: 18px;
                margin-bottom: 10px;
            }
            .title-item{
                    font-size: 14px;
                    color: #61666d;
                    margin-bottom: 5px;
                    cursor: pointer;
                }
            a{
                font-size: 14px;
                text-decoration: none;
                color:var(--linkColor);
                line-height: 25px;
            }
        }
        .logo{
            .logo-letter{
                font-size: 30px;
            }
            .info{
                margin-top: 10px;
                color: rgb(93, 92, 91);

            }
        }
    }
}
#backTopBox{
    opacity: 0;
    transition: all .2s ease-in-out;
    .backTop{
    position: fixed;
    right: 100px;
    bottom: 100px;
    width: 40px;
    height: 40px;
    background-color: #fff;
    border-radius:20px;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0px 0px 6px rgba(0,0,0,.12);
    .top{
        width: 0px;
        height: 0px;
        border-left: 6.5px solid transparent;
        border-right: 6.5px solid transparent;
        border-bottom: 7.5px solid #409eff;

    }
    &:hover{
        background-color: #f2f6fc;
    }
}
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
            border: 1px solid #ccc8c8;
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
