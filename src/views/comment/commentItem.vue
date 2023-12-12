<template>
    <div class="commentLists">
        <div class="comments">
            <Avatar :width="50" :height="50" :userId="commentData.userId"></Avatar>
            <div class="userInfo">
                <div class="name">
                    {{ commentData.nickName }}
                </div>
                <div class="commentContent">{{ commentData.content }}</div>
                <div class="commentImage" v-if="commentData.imgPath">
                    <el-image style="width: 100px; height: 100px" :src="proxy.globalInfo.imageUrl + commentData.imgPath"
                        :zoom-rate="1.2" :max-scale="7" :min-scale="0.2"
                        :preview-src-list="[proxy.globalInfo.imageUrl + commentData.imgPath]" :initial-index="4"
                        fit="cover" />
                </div>
                <div class="commentTime">
                    {{ commentData.postTime }} · {{ commentData.userIpAddress }}
                    <span :class="['iconfont icon-good',commentData.likeType==1?'like':'']" @click="dolike(commentData.commentId)">&nbsp;{{ commentData.goodCount }}</span>
                    <span class="iconfont icon-comment"
                        @click="replyComment(commentData.userId, commentData.commentId)">&nbsp;回复</span>
                </div>

            </div>

        </div>
        <div class="replyUser" v-if="commentData.children !== null" v-for="(item,index) in commentData.children">
            <Avatar :height="30" :width="30" :userId="item.userId"></Avatar>
            <div class="user">
                <div class="top">
                    <span style="color: #61666d;margin-right: 10px;">{{item.nickName}}</span>回复&nbsp;<span style="color: var(--hoverColor);">@{{item.replyNickName}}</span>：<span style="font-size: 16px;">{{item.content}}</span>
                </div>
                <div class="bottom">
                    <span style="color: #61666d;margin-right: 10px;">{{item.postTime}}&nbsp;&nbsp;·  {{ item.userIpAddress }}</span>
                    <span :class="['iconfont icon-good',item.likeType==1?'like':'']" @click="dolike(item.commentId)">&nbsp;{{ item.goodCount }}</span>
                    <span class="iconfont icon-comment"  @click="replyComment(item.userId, item.pCommentId)" >&nbsp;回复</span>
                </div>
                
            </div>
        </div>
        <div class="replyComment" v-if="showReply">
            <postComment :width="700" :showImage="false" :replyUserId="replyUserId" :pCommentId="commentId"
                :articleId="commentData.articleId" @postedComment="getPostComment" ></postComment>
        </div>
    </div>
</template>

<script setup>
import postComment from "./postComment.vue";
import { ref, reactive, getCurrentInstance, nextTick } from "vue"
const { proxy } = getCurrentInstance();
const api={
    doLike:'/comment/doLike'
}
const props = defineProps({
    commentData: {}
})
const commentData = ref(props.commentData.data)
//回复评论
const replyUserId = ref()
const commentId = ref()
const showReply = ref(false)
const replyComment = (id, pId) => {
    showReply.value = true
    replyUserId.value = id
    commentId.value = pId
}
const emit=defineEmits(['commentChildren','commentDoLike'])
const getPostComment=(res)=>{
    emit('commentChildren',res)
}
//评论点赞
let haveLike=ref(true)
const dolike=async(id)=>{
    let res= await proxy.Request({
        url:api.doLike,
        params:{
            commentId:id
        }
    }) 
    if(!res){
            return
        }
    emit('commentDoLike',res.data)
    haveLike.value = !haveLike.value
}
</script>

<style lang="scss" scoped>

.commentLists {
    margin-bottom: 50px;
    border-bottom: 1px solid #ddd;
    padding-bottom: 20px;

    .comments {
        display: flex;

        .userInfo {
            margin-left: 15px;

            .name {
                font-size: 14px;
                color: #61666d;
            }

            .commentContent {
                margin-top: 10px;
                font-size: 16px;
            }

            .commentImage {
                width: 100px;
                height: 100px;

                img {
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                }
            }

            .commentTime {
                margin-top: 5px;
                font-size: 14px;
                color: #61666d;
                .like{
                color: var(--hoverColor);
            }

                .iconfont {
                    cursor: pointer;
                    margin-left: 20px;
                }
            }
        }

    }
    .replyUser{
        margin-top: 10px;
        height: 50px;
        padding-left:50px;
        display: flex;
        .user{
            margin-left: 15px;
            font-size: 14px;
        }
        .top{
            margin-bottom: 5px;
        }
        .bottom{
            .iconfont{
                color: #61666d;
                margin-right: 20px;
                font-size: 15px;
                cursor: pointer;
            }
            .like{
                color: var(--hoverColor);
            }
        }
    }
    .replyComment {
        margin-top: 20px;
        padding-left: 80px;
    }

}</style>
