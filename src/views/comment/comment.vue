<template>
    <!-- 标题 -->
    <div class="title">
        评论<span style="font-size: 15px; margin-left: 5px;">{{ commentCount }}</span>
        <span style="font-size: 16px;margin-left: 30px;">
            热榜<el-divider direction="vertical" />最新
        </span>
    </div>
    <!-- 发表评论 -->
    <div class="postComment">
        <postComment :articleId="props.articleId" :width="800" @postedComment="getNewComment"></postComment>
    </div>
    <!-- 评论 -->
    <div class="commentList">
        <DataList :dataSource="commentList">
            <template #="data">
                <commentItem :commentData="data" @commentChildren="getCommentChildren" @commentDoLike="getCommentDoLike"></commentItem>
            </template>
        </DataList>
    </div>
</template>

<script setup>
import commentItem from "./commentItem.vue";
import postComment from "./postComment.vue";
import { ref, reactive, getCurrentInstance, nextTick } from "vue"
const { proxy } = getCurrentInstance();
const api={
    loadComment:'/comment/loadComment'
}
const props=defineProps({
    articleId:{
    },
    commentCount:{}
})
//获取请求列表
const commentList=ref('')
const getLoadComment=async ()=>{
    let res= await proxy.Request({
        url:api.loadComment,
        params:{
            articleId:props.articleId
        }
    })
    if(!res){
        return
    }
    commentList.value=res.data
    console.log(commentList.value);
}
getLoadComment()
//获取最新的评论
const getNewComment=(data)=>{
    commentList.value.list.push(data)
}
const getCommentChildren=(res)=>{
    commentList.value.list.forEach(item=>{
        if(item.commentId==res[0].pCommentId){
            item.children=res
        }
    })
}
//获取最新的点赞
const getCommentDoLike=(res)=>{
    if(res.pCommentId==0){
        commentList.value.list.forEach(item=>{
            if(item.commentId==res.commentId){
                item.goodCount=res.goodCount
                return
            }
        })
    }
    if(res.pCommentId){
        commentList.value.list.forEach(item=>{
            if(res.pCommentId==item.commentId){
                item.children.forEach(items=>{
                    if(items.commentId==res.commentId){
                        items.goodCount=res.goodCount
                    }
                   
                })
            }
        })
    }

}
</script>

<style lang="scss" scoped>
.title{
    font-size: 23px;
    font-weight: 500;
    margin-bottom: 20px;
}
.commentList{
    margin-top: 15px;
}
</style>
