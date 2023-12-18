<template>
    <!-- 标题 -->
    <div class="title">
        评论<span style="font-size: 15px; margin-left: 5px;">{{ commentList.totalCount }}</span>
        <span style="font-size: 16px;margin-left: 30px;">
            <span :class="{ active: orderType == 0 }" @click="changeType(0)">热榜</span><el-divider direction="vertical" /><span
                :class="{ active: orderType == 1 }" @click="changeType(1)">最新</span>
        </span>
    </div>
    <!-- 发表评论 -->
    <div class="postComment">
        <postComment :articleId="props.articleId" :width="800" @postedComment="getNewComment"></postComment>
    </div>
    <!-- 评论 -->
    <div class="commentList">
        <DataList :dataSource="commentList">
            <template #default="{ data }">
                <commentItem :commentData="data" @commentChildren="getCommentChildren" @commentDoLike="getCommentDoLike">
                </commentItem>
            </template>
        </DataList>
    </div>
</template>

<script setup>
import commentItem from "./commentItem.vue";
import postComment from "./postComment.vue";
import { ref, reactive, getCurrentInstance, nextTick, onMounted } from "vue"
const { proxy } = getCurrentInstance();
const api = {
    loadComment: '/comment/loadComment'
}
onMounted(() => {
    getLoadComment()
})
const props = defineProps({
    articleId: {
    },
    commentCount: {},
})
//获取评论
const commentList = ref({})
const getLoadComment = async () => {
    let res = await proxy.Request({
        url: api.loadComment,
        params: {
            pageNo: commentList.value.pageNo,
            articleId: props.articleId,
            orderType: orderType.value
        }
    })
    if (!res) {
        return
    }
    commentList.value = res.data
}
//改变评论状态 0热榜 1最新
const orderType = ref(0)
const changeType = (type) => {
    orderType.value = type
    getLoadComment()
}
//获取最新的评论
const emit = defineEmits(['emitCommentTotal'])
const getNewComment = (data) => {
    commentList.value.list.unshift(data)
    commentList.value.totalCount++
    //导出最新评论总数，更新父组件快捷栏评论数量
    emit('emitCommentTotal', commentList.value.totalCount)

}
//获取子评论
const getCommentChildren = (res) => {
    commentList.value.list.forEach(item => {
        if (item.commentId == res[0].pCommentId) {
            item.children = res
        }
    })
}
//获取最新的点赞数量
const getCommentDoLike = (res) => {
    //一级评论
    if (res.pCommentId == 0) {
        commentList.value.list.forEach(item => {
            if (item.commentId == res.commentId) {
                item.goodCount = res.goodCount
                return
            }
        })
    }
    //二级评论
    if (res.pCommentId) {
        commentList.value.list.forEach(item => {
            if (res.pCommentId == item.commentId) {
                item.children.forEach(items => {
                    if (items.commentId == res.commentId) {
                        items.goodCount = res.goodCount
                        return
                    }

                })
            }
        })
    }

}
</script>

<style lang="scss" scoped>
.active {
    color: var(--hoverColor);
}

.title {
    font-size: 23px;
    font-weight: 500;
    margin-bottom: 20px;

    span {
        cursor: pointer;
    }
}

.commentList {
    margin-top: 15px;
}</style>
