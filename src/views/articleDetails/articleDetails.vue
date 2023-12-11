<template>
    <!-- 文章详情 -->
  <div class="article-box">
    <div class="board-nav">
        <router-link class="nav-active" :to="'/forum/'+articleDetails.pBoardId">{{articleDetails.pBoardName}}</router-link>
        <div class="iconfont icon-right"></div>
        <router-link class="nav-active" v-if="articleDetails.boardName" :to="'/forum/'+articleDetails.pBoardId+'/'+articleDetails.boardId">{{articleDetails.boardName}}</router-link>
        <div v-if="articleDetails.boardName" class="iconfont icon-right"></div>
        <div>{{articleDetails.summary}}</div>
    </div>
    <div class="article-details">
        <div class="summary">
            {{ articleDetails.summary }}
        </div>
        <div class="userInfo">
                <Avatar :width="50" :height="50" :userId="articleDetails.userId"></Avatar>
            <div class="info">
                <div class="userName">{{articleDetails.nickName}}</div>
                <div class="time">
                    {{articleDetails.postTime}}·{{ articleDetails.userIpAddress }}
                   <span class="read"><span class="iconfont icon-eye-solid"></span>{{ articleDetails.readCount }}</span>
                </div>
            </div>
        </div>
        <div class="content" v-html="articleDetails.content"></div>
    </div>
  </div>
  <!-- 附件 -->
  <div class="attachment" id="attachment" v-if="article.attachment !== null">
        <div class="title">附件</div>
        <div class="content">
            <span class="iconfont icon-zip"></span>
            <span style="color: #6ca1f7;">{{attachment.fileName}}</span>
            <span>{{Utils.sizeToStr(attachment.fileSize)}}</span>
            <span>需要<span style="color: red;margin: 0 5px;">{{attachment.integral}}</span>积分</span>
            <span>已下载{{attachment.downloadCount}}次</span>
            <div class="fileDown">下载</div>
        </div>
  </div>
  <div style="height: 2000px;"></div>
  <!-- 快捷栏 -->
  <div class="left">
    <div class="like" @click="doLike"> 
        <el-badge :value="articleDetails.goodCount">
            <span :class="['iconfont icon-good',haveLike?'active':'']" style="font-size: 22px;"></span>
        </el-badge> 
    </div>
    <div class="comment">
        <el-badge :value="articleDetails.commentCount">
            <span class='iconfont icon-comment' style="font-size: 22px;"></span>
        </el-badge> 
    </div>
    <div class="attachment-contral" v-if="article.attachment !== null"  @click="attachmentBtn" >
        <span class="iconfont icon-attachment" style="font-size: 22px;"></span>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, nextTick,watch,onMounted } from "vue"
import {useRouter,useRoute} from 'vue-router'
import { useStore } from "vuex";
const route=useRoute()
const router=useRouter()
const store=useStore()
const { proxy } = getCurrentInstance();
const api={
    getArticleDetail:'/forum/getArticleDetail',
    dolike:'/forum/doLike'
}
onMounted(()=>{
    getArticleDetails()
})
//获取文章详情
const article=ref({})
const articleId=ref()
const articleDetails=ref({})
const attachment=ref({})
const haveLike=ref(false)
const getArticleDetails=async()=>{
    let res= await proxy.Request({
        url:api.getArticleDetail,
        params:{
            articleId:articleId.value
        }
    })
    if(!res){
        return
    }
    article.value=res.data
    articleDetails.value=res.data.forumArticle
    attachment.value=res.data.attachment
    haveLike.value=res.data.haveLike
    console.log(res.data);
    store.commit('setArticlePboard',articleDetails.value.pBoardId)
    console.log(store.state);
    // store.commit('setArticleBoard',articleDetails.value.boardId)
}

//点赞

const doLike=async ()=>{
    if(store.state.loginUserInfo==null){
        store.commit('showLogin',true)
        return
    }
    let res=await proxy.Request({
        url:api.dolike,
        params:{
            articleId:articleId.value
        }
    })
    if(!res){
        return
    }
    haveLike.value=!haveLike.value
    let goodCount=1
    if(!haveLike.value){
    goodCount=-1
  }
    articleDetails.value.goodCount += goodCount
}

//快捷栏附件
const attachmentBtn=()=>{
    let atBtn=document.getElementById('attachment')
    atBtn.scrollIntoView({
        behavior:'smooth',
        block:'start',
        inline:'start'
    })
}

//监听路由变化
watch(() =>route.params, (newVal, oldVal) => {
    articleId.value=newVal.articleId
}, { immediate: true, deep: true });
</script>

<style lang="scss" scoped>
@mixin left-bg{
    width: 50px;
    height: 50px;
    background-color: #fff;
    border-radius: 50%;
    text-align: center;
    line-height: 50px;
    color: #61666d;
    font-size: 22px;
}
.article-box{
    position: relative;
    padding-top: 10px;
    width: 1300px;
    margin: 0 auto;
    .board-nav{
        display: flex;
        align-items: center;
        height: 41px;
        .nav-active{
            color:var(--hoverColor);
            cursor: pointer;
            text-decoration: none;
        }
        .iconfont{
            padding: 0 10px;
        }
    }
    .article-details{
        background-color: #fff;
        min-height: 500px;
        padding: 15px;
        .summary{
            font-size: 16px;
            font-weight: 700;
        }
        .userInfo{
            margin-top: 20px;
            height: 50px;
            display: flex;
            border-bottom: 1px solid #ddd;
            padding-bottom: 10px;
            .info{
                margin-left: 10px;
                color: #4e5969;
                .time{
                    margin-top: 5px;
                    font-size: 13px;
                    .read{
                        display: inline-block;
                        color:#9f9f9f;
                        margin-left: 10px;
                        font-size: 16px;

                    }
                }
            }
        }
    }
}
.attachment{
    background-color: #fff;
    margin-top: 20px;
    padding: 20px;
    .title{
        font-size: 18px;
    }
    .content{
        margin-top: 10px;
        color: #9f9f9f;
        display: flex;
        .iconfont{
            color: #6ca1f7;
            font-size: 20px;
            margin-right: 10px;
        }
        span{
            display: inline-block;
            margin-right: 10px;
        }
        .fileDown{
            background-color: #409eff;
            width: 48px;
            height: 24px;
            font-size: 12px;
            text-align: center;
            line-height: 24px;
            border-radius: 5px;
            color: #fff;
            cursor: pointer;
            &:hover{
                background-color: #a0cfff;
            }
        }

    }
}
.left{
    position: fixed;
    width: 70px;
    height: 400px;
    top: 200px;
    left: 200px;
    :deep(.el-badge__content.is-fixed){
        right: 0px;
        background-color: #61666d
    }
    .like{
        @include left-bg();
        margin-bottom: 30px;
        .active{
            color: red
        }
    }
    .comment{
        @include left-bg();
        margin-bottom: 30px;
    }
    .attachment-contral{
        @include left-bg()
    }

}
</style>
