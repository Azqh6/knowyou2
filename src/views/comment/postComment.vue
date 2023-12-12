<template>
  <div class="comment">
    <Avatar :width="50" :height="50" :userId="store.state.loginUserInfo==null?'':store.state.loginUserInfo.userId" ></Avatar>
    <el-form :model="formData" :rules="rules" style="margin-left: 20px;" ref="formDataRef">
        <el-form-item prop="content">
            <el-input
                clearable
                :style="{width:props.width + 'px'}"
                :rows="2"
                v-model="formData.content"
                type="textarea"
                :maxlength="800"
                placeholder="请文明发言"
                :width="800"
                show-word-limit
                
            />
            <div class="img" v-if="commentImg !== null " @click="removeImg">
                <span class="iconfont icon-remove"></span>
                <img :src="commentImg">
            </div>
            <el-upload
                v-else
                v-model:file-list="fileList"
                :show-file-list="false"
                accept=".png,.PNG,.jpg,.JPG,.gif,.GIF"
                multiple
                :limit="3"
                :http-request="selectImg"
            >
                <div v-if="props.showImage" class="iconfont icon-image" ></div>
            </el-upload>    
        </el-form-item>
    </el-form>
    <div class="sendComment" @click="postComment">发表</div>
  </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, nextTick } from "vue"
import {useStore} from 'vuex'
const { proxy } = getCurrentInstance();
const store=useStore()
const formData=ref({})
const api={
    postComment:'/comment/postComment'
}
const props=defineProps({
    articleId:{
    },
    width:{
        type:Number
    },
    showImage:{
        type:Boolean,
        default:true
    },
    replyUserId:{

    },
    pCommentId:{

    }
})
//评论校验
const rules={
    content:[
        {required:true,min:5,message:'最少输入五个字符',trigger:'blur'}
    ]
}
//发送评论
const formDataRef=ref()
const emit=defineEmits(['postedComment'])
const postComment=()=>{
    formDataRef.value.validate(async(valid)=>{
        if(!valid){
            return
        }
        let params = Object.assign({}, formData.value)
        params.articleId=props.articleId
        params.pCommentId=0
        if(props.replyUserId && props.pCommentId){
            params.replyUserId=props.replyUserId
            params.pCommentId=props.pCommentId
        }
        let res=await proxy.Request({
            url:api.postComment,
            params
        })
        if(!res){
            return
        }
        proxy.Message.success('发送评论成功')
        formData.value.content=''
        commentImg.value=null
        emit('postedComment',res.data)
    })
   
}
//选择图片
const commentImg=ref(null)
const selectImg = (file) => {
    file=file.file
    let img=new FileReader()
    img.readAsDataURL(file)
    img.onload=(({target})=>{
        let imageData=target.result
        commentImg.value=imageData
        formData.value.image=file
    })
 }
 //删除图片
 const removeImg=()=>{
    commentImg.value=null
 }
</script>

<style lang="scss" scoped>
:deep(.el-form-item__error){
    left:200px
}
.comment{
    display: flex ;
    :deep(.el-textarea__inner){
        height: 60px;
    }
    .img{
        position: relative;
        margin-top: 15px;
        width: 80px;
        height: 80px;
        background-color: #ddd;
        cursor: pointer;
        .iconfont{
                position: absolute;
                left: 70px;
                top: -15px;
            }
        img{
            width: 100%;
            height: 100%;
            object-fit: contain;
        }
    }
    .iconfont{
        position: absolute;
        left: 0;
        color: #494949;
        cursor: pointer;
        font-size: 20px;
        bottom: -30px;
    }
    .sendComment{
        width: 60px;
        height: 60px;
        cursor: pointer;
        background-color: rgb(22,142,240);
        color: #fff;
        text-align: center;
        line-height: 60px;
        border-radius: 5px;
        margin-left: 10px;
    }
}
</style>
