<template>
    <div class="articleBox">
        <div class="info">
            <Avatar :userId="data.userId" :height="30" :width="30"></Avatar>
            <router-link to="/ucenter" class="userName">{{data.nickName}}</router-link>
            <el-divider direction="vertical" />
            <div class="postTime">{{data.postTime}}</div>
            <div style="margin: 0px 5px;">·</div>
            <div class="address">{{data.userIpAddress}}</div>
            <el-divider direction="vertical" />
            <router-link  class="pboardName" :to="'/forum/'+data.pBoardId">{{data.pBoardName}}</router-link>
            <div style="margin: 0 5px;" v-if="data.boardName">/</div>
            <router-link class="boardName" :to="'/forum/'+data.pBoardId+'/'+data.boardId"> {{data.boardName}}</router-link>
        </div>
        <div class="article">
            <router-link  class="title" :to="'/post/'+data.articleId">{{data.title}}</router-link>
            <div class="summary">{{data.summary?data.summary:'该文章暂无简介'}}</div>
        </div>
        <div class="footer">
            <div>
                <span class="iconfont icon-eye-solid"></span>
                {{data.readCount}}
            </div>
            <div>
                <span class="iconfont icon-good"></span>
                {{data.goodCount}}
            </div>
            <div>
                <span class="iconfont icon-comment"></span>
                {{data.commentCount}}
            </div>
        </div>
        <div class="line"></div>
        <div class="img">
            <img :src="data.cover!==null?proxy.globalInfo.imageUrl+data.cover:imgUrl">
        </div>
    </div>

</template>

<script setup>
import { ref, reactive, getCurrentInstance, nextTick} from "vue"
const { proxy } = getCurrentInstance();
const imgUrl=new URL('../../assets/cxk.jpg',import.meta.url).href
const props=defineProps({
    data:{
        type:Object
    }
})
</script>

<style lang="scss" scoped>
@mixin text-router{
    cursor: pointer;
    color:#4e5969;
    text-decoration: none;
    &:hover{
        color: var(--hoverColor);
    }    
}
.articleBox{
    position: relative;
    height: 120px;
    padding: 15px;
    .info{
    display: flex;
    font-size: 14px;
    align-items: center;
    color: #4e5969;
    .userName{
        margin-left: 5px;
        @include text-router()
    }
    .pboardName{
        @include text-router()
    }
    .boardName{
        @include text-router()
    }
}
    .article{
        .title{
            font-size: 16px;
            font-weight: 700;
            margin-top: 10px;
            display: block;
            @include text-router()
        }
        .summary{
            margin-top: 10px;
            color:#86909c ;
            font-size: 14px;
        }
    }
    .footer{
        display:flex;
        color:#86909c;
        font-size: 14px;
        position: absolute;
        bottom: 10px;
        div{
            margin-right: 25px;
        }
    }
    .line{
        position: absolute;
        width: 100%;
        height: 1px;
        background-color: #ddd;
        bottom: 0px;
    }
    .img{
        position: absolute;
        right: 0px;
        top: 20px;
        width: 100px;
        height: 100px;
        background-color: #ddd;
        border-radius: 5px;
        display: flex;
        align-items: center;
        img{
            max-width: 100%;
            height: 100%;
            object-fit: contain;
        }
    }
}

</style>
