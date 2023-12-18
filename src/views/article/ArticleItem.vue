<template>
    <div class="articleBox">
        <div class="info">
            <Avatar :userId="data.userId" :height="30" :width="30"></Avatar>
            <router-link :to="'/userCenter/' + data.userId" class="userName">{{ data.nickName }}</router-link>
            <el-divider direction="vertical" />
            <div class="postTime">{{ data.postTime }}</div>
            <div style="margin: 0px 5px;">·</div>
            <div class="address">{{ data.userIpAddress }}</div>
            <el-divider direction="vertical" />
            <router-link class="pboardName" :to="'/forum/' + data.pBoardId">{{ data.pBoardName }}</router-link>
            <div style="margin: 0 5px;" v-if="data.boardName">/</div>
            <router-link class="boardName" :to="'/forum/' + data.pBoardId + '/' + data.boardId"> {{ data.boardName }}</router-link>
        </div>
        <div class="article">
            <router-link class="title" :to="'/post/' + data.articleId">
                <span v-if="data.topType == 1" class="top">置顶</span>
                <span v-if="data.status !== 1" class="validate">待审核</span>
                <span v-if="htmlTitle" v-html="data.title"></span>
                <span v-else>{{ data.title }} </span>

            </router-link>
            <div class="summary">{{ data.summary ? data.summary : '该文章暂无简介' }}</div>
        </div>
        <div class="footer">
            <div>
                <span class="iconfont icon-eye-solid"></span>
                {{ data.readCount }}
            </div>
            <div>
                <span class="iconfont icon-good"></span>
                {{ data.goodCount }}
            </div>
            <div>
                <span class="iconfont icon-comment"></span>
                {{ data.commentCount }}
            </div>
        </div>
        <div class="line"></div>
        <div class="img">
            <img :src="data.cover !== null ? proxy.globalInfo.imageUrl + data.cover : imgUrl">
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, nextTick } from "vue"
const { proxy } = getCurrentInstance();
//通过此方法在img动态属性中，实现静态资源展示
const imgUrl = new URL('../../assets/cxk.jpg', import.meta.url).href
const props = defineProps({
    data: {
        type: Object
    },
    //用于搜索功能，标题高亮
    htmlTitle: {
        type: Boolean,
        default: false
    }
})
</script>

<style lang="scss" scoped>
@mixin text-router {
    cursor: pointer;
    color: #4e5969;
    text-decoration: none;

    &:hover {
        color: var(--hoverColor);
    }
}

.articleBox {
    position: relative;
    height: 120px;
    padding: 15px;

    .info {
        display: flex;
        font-size: 14px;
        align-items: center;
        color: #4e5969;

        .userName {
            margin-left: 5px;
            @include text-router()
        }

        .pboardName {
            @include text-router()
        }

        .boardName {
            @include text-router()
        }
    }

    .article {
        .title {
            font-size: 16px;
            font-weight: 700;
            margin-top: 10px;
            display: block;
            @include text-router();

            .top {
                font-size: 13px;
                border: 1px solid rgb(243, 172, 172);
                color: rgb(243, 172, 172);
                border-radius: 5px;
                margin-right: 5px;
            }

            .validate {
                font-size: 13px;
                border: 1px solid rgb(122, 122, 122);
                color: rgb(122, 122, 122);
                border-radius: 5px;
                margin-right: 5px;
            }
        }

        .summary {
            margin-top: 10px;
            color: #86909c;
            font-size: 14px;
            width: 800px;
            text-overflow: ellipsis;
        }
    }

    .footer {
        display: flex;
        color: #86909c;
        font-size: 14px;
        position: absolute;
        bottom: 10px;

        div {
            margin-right: 25px;
        }
    }

    .line {
        position: absolute;
        width: 100%;
        height: 1px;
        background-color: #ddd;
        bottom: 0px;
    }

    .img {
        position: absolute;
        right: 50px;
        top: 20px;
        width: 100px;
        height: 100px;
        background-color: #ddd;
        border-radius: 5px;
        display: flex;
        align-items: center;

        img {
            max-width: 100%;
            height: 100%;
            object-fit: contain;
        }
    }
}</style>
