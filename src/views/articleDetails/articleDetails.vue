<template>
    <!-- 文章详情 -->
    <div class="article-box">
        <div class="board-nav">
            <router-link class="nav-active"
                :to="'/forum/' + articleDetails.pBoardId">{{ articleDetails.pBoardName }}</router-link>
            <div class="iconfont icon-right"></div>
            <router-link class="nav-active" v-if="articleDetails.boardName"
                :to="'/forum/' + articleDetails.pBoardId + '/' + articleDetails.boardId">{{ articleDetails.boardName }}</router-link>
            <div v-if="articleDetails.boardName" class="iconfont icon-right"></div>
            <div>{{ articleDetails.summary }}</div>
        </div>
        <div class="article-details">
            <div class="summary">
                {{ articleDetails.summary }}
            </div>
            <div class="userInfo">
                <Avatar :width="50" :height="50" :userId="articleDetails.userId"></Avatar>
                <div class="info">
                    <div class="userName">{{ articleDetails.nickName }}</div>
                    <div class="time">
                        {{ articleDetails.postTime }}·{{ articleDetails.userIpAddress }}
                        <span class="read"><span class="iconfont icon-eye-solid"></span>{{ articleDetails.readCount
                        }}</span>
                        <span
                            v-if="store.state.loginUserInfo !== null && articleDetails.userId == store.state.loginUserInfo.userId">
                            <router-link class="a-link" :to="'/editPost/' + articleDetails.articleId"><span
                                    class="iconfont icon-edit"
                                    style="font-size: 14px;margin-left: 20px;">&nbsp;编辑</span></router-link>
                        </span>
                    </div>
                </div>
            </div>
            <div class="content" id="content" v-html="articleDetails.content"></div>
        </div>
    </div>
    <!-- 附件 -->
    <div class="attachment" id="attachment" v-if="article.attachment !== null">
        <div class="title">附件</div>
        <div class="content">
            <span class="iconfont icon-zip"></span>
            <span style="color: #6ca1f7;">{{ attachment.fileName }}</span>
            <span>{{ Utils.sizeToStr(attachment.fileSize) }}</span>
            <span>需要<span style="color: red;margin: 0 5px;">{{ attachment.integral }}</span>积分</span>
            <span>已下载{{ attachment.downloadCount }}次</span>
            <div class="fileDown" @click="fileDownLoad(attachment.fileId)">下载</div>
        </div>
    </div>
    <!-- 评论 -->
    <div class="comments" id="comments">
        <comment :articleId="articleId" :commentCount="articleDetails.commentCount" @emitCommentTotal="getCommentTotal">
        </comment>
    </div>
    <!-- 快捷栏 -->
    <div class="left">
        <div class="like" @click="doLike">
            <el-badge :value="articleDetails.goodCount">
                <span :class="['iconfont icon-good', haveLike ? 'active' : '']" style="font-size: 22px;"></span>
            </el-badge>
        </div>
        <div class="comment" @click="attachmentBtn('comments')">
            <el-badge :value="articleDetails.commentCount">
                <span class='iconfont icon-comment' style="font-size: 22px;"></span>
            </el-badge>
        </div>
        <div class="attachment-contral" v-if="article.attachment !== null" @click="attachmentBtn('attachment')">
            <span class="iconfont icon-attachment" style="font-size: 22px;"></span>
        </div>
    </div>
    <!-- 目录 -->
    <div class="directory">
        <div class="header">目录</div>
        <div style="padding: 10px;">
            <div v-if="tocList.length > 0" v-for="(item, index) in tocList" :key="index"
                :class="['title', activeIndex == item.index ? 'active' : '']" :style="{ paddingLeft: 15 * item.level + 'px' }"
                @click="toDirectory(item.index)">{{ item.title }}</div>
            <div v-else class="noDirectory">未解析到目录</div>
        </div>

    </div>
    <ImageViewer ref="imageViewerRef" :imageList="previewImgList"></ImageViewer>
</template>

<script setup>
import comment from '../comment/comment.vue';
import ImageViewer from '@/components/ImageViewer.vue'
import hljs from "highlight.js";
import "highlight.js/styles/atom-one-light.css"
import { ref, getCurrentInstance, nextTick, watch, onMounted } from "vue"
import { useRouter, useRoute } from 'vue-router'
import { useStore } from "vuex";
const route = useRoute()
const store = useStore()
const { proxy } = getCurrentInstance();
const api = {
    getArticleDetail: '/forum/getArticleDetail',
    dolike: '/forum/doLike',
    getUserDownloadInfo: '/forum/getUserDownloadInfo',
    attachmentDownload: '/api/forum/attachmentDownload'
}
onMounted(() => {
    getArticleDetails()
    //首次监听滚动事件，实现目录归位
    window.addEventListener('scroll', scrollDirectory)
})
//获取文章详情
const article = ref({})
const articleId = ref()
const articleDetails = ref({})
const attachment = ref({})
const haveLike = ref(false)
const getArticleDetails = async () => {
    let res = await proxy.Request({
        url: api.getArticleDetail,
        params: {
            articleId: articleId.value
        }
    })
    if (!res) {
        return
    }
    article.value = res.data
    articleDetails.value = res.data.forumArticle
    attachment.value = res.data.attachment
    haveLike.value = res.data.haveLike
    store.commit('setArticlePboard', articleDetails.value.pBoardId)
    imagePreview()
    highlightCode()
    changeDirectory()
}
//点赞
const doLike = async () => {
    if (store.state.loginUserInfo == null) {
        store.commit('showLogin', true)
        return
    }
    let res = await proxy.Request({
        url: api.dolike,
        params: {
            articleId: articleId.value
        }
    })
    if (!res) {
        return
    }
    haveLike.value = !haveLike.value
    let goodCount = 1
    if (!haveLike.value) {
        goodCount = -1
    }
    articleDetails.value.goodCount += goodCount
}
//附件下载
const fileDownLoad = async (id) => {
    //积分为0或作者本人下载
    if (attachment.value.integral == 0 || articleDetails.value.userId == store.state.loginUserInfo.userId) {
        document.location.href = api.attachmentDownload + '?fileId=' + id
        attachment.value.downloadCount += 1
        return
    }
    //未登录状态时，点击下载，弹出登录弹窗
    if (store.state.loginUserInfo == null) {
        store.commit('showLogin', true)
        return
    }
    let res = await proxy.Request({
        url: api.getUserDownloadInfo,
        params: {
            fileId: id
        }
    })
    if (!res) {
        return
    }
    //已经下载过情况
    if (res.data.haveDownload) {
        document.location.href = api.attachmentDownload + '?fileId=' + id
        attachment.value.downloadCount += 1
        return
    }
    //积分不够
    if (res.data.userIntegral < attachment.value.integral) {
        proxy.Message.warning('你的积分不够，无法下载')
        return
    }

}
//快捷栏附件 
//点击快捷栏实现对应位置跳转
const attachmentBtn = (id) => {
    let atBtn = document.getElementById(id)
    atBtn.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'start'
    })
}
//emit 通过子组件获取评论总数
const getCommentTotal = (res) => {
    articleDetails.value.commentCount = res
}
//图片预览 通过二次封装el 
const imageViewerRef = ref(null)
const previewImgList = ref([])
const imagePreview = () => {
    nextTick(() => {
        const imageNodeList = document.querySelector("#content").querySelectorAll("img")
        const imageList = []
        imageNodeList.forEach((item, index) => {
            const src = item.getAttribute("src")
            imageList.push(src)
            item.addEventListener('click', () => {
                imageViewerRef.value.show(index)
            })
        })
        previewImgList.value = imageList
    })
}
//代码高亮
const highlightCode = () => {
    nextTick(() => {
        let blocks = document.querySelectorAll('pre code')
        blocks.forEach((item) => {
            hljs.highlightBlock(item)
        })
    })
}
//监听路由变化 获取文章作者
watch(() => route.params, (newVal, oldVal) => {
    articleId.value = newVal.articleId
}, { immediate: true, deep: true });
//解析目录
const tocList = ref([])
const changeDirectory = () => {
    const directoryList = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6',]
    nextTick(() => {
        const contentToc = document.querySelector('#content')
        //获取文章内容所有子元素
        const childNodes = contentToc.childNodes
        let index = 0
        //遍历出h1-6的标题，并且添加属性（title：标题；level：控制目录缩进；index:用来控制锚点定位）
        childNodes.forEach((item) => {
            if (directoryList.includes(item.tagName)) {
                tocList.value.push({
                    title: item.innerText,
                    level: Number(item.tagName.slice(1)),
                    index: index,
                    offsetTop: item.offsetTop
                })
                //通过index，来给每个标题添加id，来通过锚点定位
                item.setAttribute('id', 'toc' + index)
                index++
            }
        })

    })
}
//目录点击事件
let activeIndex = ref(0)
const toDirectory = (index) => {
    activeIndex.value = index
    let titleId = document.querySelector('#toc' + index)
    titleId.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'start'
    })
}
//获取滚动条的高度
const getScrollTop = () => {
    let scrollTop = document.body.scrollTop || document.documentElement.scrollTop
    return scrollTop
}
//滚动事件 滚动到相应标题高度时，目录标题高亮
const scrollDirectory = () => {
    let scrollTop = getScrollTop()
    tocList.value.some(item => {
        //当不是第一个标题时，在上一个标题和现在标题区间的内容时
        if (item.index > 0 && scrollTop > tocList.value[item.index - 1].offsetTop && scrollTop < tocList.value[item.index].offsetTop) {
            activeIndex.value = item.index
            return true
        } else if (scrollTop < tocList.value[0].offsetTop) {
            activeIndex.value = 0
            return true
        }
    })
}
</script>

<style lang="scss" scoped>
@mixin left-bg {
    width: 50px;
    height: 50px;
    background-color: #fff;
    border-radius: 50%;
    text-align: center;
    line-height: 50px;
    color: #61666d;
    font-size: 22px;
}

.article-box {
    position: relative;
    padding-top: 10px;
    width: 1000px;
    margin-left: 302px;

    .board-nav {
        display: flex;
        align-items: center;
        height: 41px;

        .nav-active {
            color: var(--hoverColor);
            cursor: pointer;
            text-decoration: none;
        }

        .iconfont {
            padding: 0 10px;
        }
    }

    .article-details {
        background-color: #fff;
        min-height: 500px;
        padding: 15px;

        .summary {
            font-size: 16px;
            font-weight: 700;
        }

        .userInfo {
            margin-top: 20px;
            height: 50px;
            display: flex;
            border-bottom: 1px solid #ddd;
            padding-bottom: 10px;

            .info {
                margin-left: 10px;
                color: #4e5969;

                .time {
                    margin-top: 5px;
                    font-size: 13px;

                    .read {
                        display: inline-block;
                        color: #9f9f9f;
                        margin-left: 10px;
                        font-size: 16px;

                    }
                }
            }
        }

        #content {
            letter-spacing: 1px;
            line-height: 22px;
            width: 1000px;

        }
    }
}

.attachment {
    width: 1000px;
    box-sizing: border-box;
    background-color: #fff;
    margin-left: 302px;
    margin-top: 20px;
    padding: 20px;

    .title {
        font-size: 18px;
    }

    .content {
        margin-top: 10px;
        color: #9f9f9f;
        display: flex;

        .iconfont {
            color: #6ca1f7;
            font-size: 20px;
            margin-right: 10px;
        }

        span {
            display: inline-block;
            margin-right: 10px;
        }

        .fileDown {
            background-color: #409eff;
            width: 48px;
            height: 24px;
            font-size: 12px;
            text-align: center;
            line-height: 24px;
            border-radius: 5px;
            color: #fff;
            cursor: pointer;

            &:hover {
                background-color: #a0cfff;
            }
        }

    }
}

.comments {
    box-sizing: border-box;
    background-color: #fff;
    width: 1000px;
    padding: 20px;
    margin-left: 302px;
    margin-top: 20px;
    min-height: 300px;
}

.left {
    position: fixed;
    width: 70px;
    height: 400px;
    top: 200px;
    left: 200px;

    :deep(.el-badge__content.is-fixed) {
        right: 0px;
        background-color: #61666d
    }

    .like {
        @include left-bg();
        margin-bottom: 30px;

        .active {
            color: red
        }
    }

    .comment {
        @include left-bg();
        margin-bottom: 30px;
    }

    .attachment-contral {
        @include left-bg()
    }

}

.directory {
    position: fixed;
    left: 1317px;
    top: 110px;
    width: 285px;
    max-height: 500px;
    min-height: 150px;
    background-color: #fff;
    overflow: auto;

    .header {
        box-sizing: border-box;
        padding: 10px;
        height: 40px;
        border-bottom: 1px solid #ddd;
    }

    .title {
        height: 30px;
        font-size: 14px;
        line-height: 30px;
        color: #555666;
        cursor: pointer;

        &:hover {
            background-color: #ddd;
        }
    }

    .active {
        background-color: #ddd;
        border-left: 2px solid var(--hoverColor);
    }

    .noDirectory {
        font-size: 14px;
        text-align: center;
        color: #949292;
        line-height: 150px;
    }
}</style>
<style>#content {
    img {
        max-width: 90%;
    }
}</style>