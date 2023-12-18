<template>
    <div class="postForumBox">
        <el-form :model="formData" :rules="rules" ref="formDataRef" class="post-form" label-width="60px">
            <div class="post-editor">
                <el-card class="box-card">
                    <template #header>
                        <!-- 切换编辑器 -->
                        <div class="header">
                            <div style="font-size: 16px;">正文</div>
                            <div class="check" @click="checkEdit">切换为<span v-show="editorType === 1">富文本</span><span
                                    v-show="editorType === 0">markdown</span>编辑器</div>
                        </div>
                    </template>
                    <el-form-item prop="content">
                        <!-- markdown编辑器 -->
                        <EditorMarkdown :height="800" v-if="editorType === 1" v-model="formData.markdownContent"
                            @htmlContent="setHtmlContent"></EditorMarkdown>
                        <!-- wangeditor富文本编辑器 -->
                        <EditorHtml v-if="editorType === 0" v-model="formData.content"></EditorHtml>
                    </el-form-item>
                </el-card>
            </div>
            <div class="post-setting">
                <el-card class="box-card">
                    <!-- 右边文章设置 -->
                    <template #header>
                        设置
                    </template>
                    <el-form-item label="标题" prop="title" class="title">
                        <el-input type="text" placeholder="请输入标题" v-model="formData.title"></el-input>
                    </el-form-item>
                    <el-form-item label="板块" prop="boardIds">
                        <el-cascader placeholder="请选择板块" :options="boardList" :props="boardProps"
                            v-model="formData.boardIds" clearable style="width: 100%;" />
                    </el-form-item>
                    <el-form-item label="封面" prop="cover">
                        <uploadCover v-model:modelValue="formData.cover"></uploadCover>
                    </el-form-item>
                    <el-form-item label="摘要" prop="summary">
                        <el-input type="textarea" :rows="5" maxlength="150" :show-word-limit="true"
                            v-model="formData.summary"></el-input>
                    </el-form-item>
                    <el-form-item label="附件" prop="attachment">
                        <attachment v-model="formData.attachment"></attachment>
                    </el-form-item>
                    <el-form-item label="积分" prop="integral">
                        <el-input placeholder="附件下载积分，0表示无需积分下载" v-model="formData.integral"></el-input>
                    </el-form-item>
                    <div class="confrim" @click="confirm">保存</div>
                </el-card>
            </div>
        </el-form>
    </div>
</template>
<script setup>
import attachment from '../../components/attachment.vue'
import uploadCover from "../../components/uploadCover.vue";
import { useRouter, useRoute } from 'vue-router'
import { ref, reactive, getCurrentInstance, nextTick, onMounted, watch } from "vue"
const { proxy } = getCurrentInstance();
const router = useRouter()
const route = useRoute()
onMounted(() => {
    loadBoard4Post()
})
const api = {
    loadBoard4Post: '/forum/loadBoard4Post',
    postArticle: '/forum/postArticle',
    articleDetail4Update: '/forum/articleDetail4Update',
    updateArticle: '/forum/updateArticle'
}
const formData = ref({})
const formDataRef = ref()
//表单验证
const rules = {
    title: [
        { required: true, message: '请输入标题', trigger: 'blur' }
    ],
    boardIds: [
        { required: true, message: '选择板块' }
    ],
    content: [
        { required: true, message: '请输入内容' }
    ],
    integral: [
        // {required:true,message:'请输入下载所需的积分'},
        { validator: proxy.Verify.number, message: '积分只能是数字' }
    ]

}
//获取所有板块
const boardList = ref()
//联级选择器配置
const boardProps = {
    multiple: false,
    checkStrictly: true,
    label: 'boardName',
    value: 'boardId',
}
//获取所有板块
const loadBoard4Post = async () => {
    let res = await proxy.Request({
        url: api.loadBoard4Post
    })
    if (!res) {
        return
    }
    boardList.value = res.data
}
//编辑文章  获取文章内容 进行回显
const articleId = ref(null)
const editForum = () => {
    if (articleId.value) {
        nextTick(async () => {
            let res = await proxy.Request({
                url: api.articleDetail4Update,
                params: {
                    articleId: articleId.value
                },
                showError: false,
            })
            if (!res) {
                return
            }
            let articleInfo = res.data.forumArticle
            //板块
            articleInfo.boardIds = []
            articleInfo.boardIds.push(articleInfo.pBoardId)
            if (articleInfo.boardId !== null && articleInfo.boardId !== 0) {
                articleInfo.boardIds.push(articleInfo.boardId)
            }
            //封面
            if (articleInfo.cover) {
                articleInfo.cover = { imageUrl: articleInfo.cover }
            }
            //附件
            if (res.data.attachment) {
                articleInfo.attachment = {
                    name: res.data.attachment.fileName
                }
                articleInfo.integral = res.data.attachment.integral
            }
            //编辑器
            editorType.value = articleInfo.editorType
            formData.value = articleInfo
        })
    } else {
        formData.value = {}
        editorType.value = proxy.VueCookies.get('editorType') || 0
    }


}
//监听路由变化，是否为编辑文章
watch(() => route, (newVal, oldVal) => {
    if (newVal.path.indexOf("/editPost") != -1) {
        articleId.value = newVal.params.articleId
        editForum()
    }

}, { immediate: true, deep: true });
//markdown编辑器内容
const setHtmlContent = (htmlContent) => {
    formData.value.content = htmlContent
}
//保存
const confirm = () => {
    console.log(formData.value);
    formDataRef.value.validate(async (valid) => {
        if (!valid) {
            return
        }
        let params = Object.assign({}, formData.value)
        //当板块有二级时
        if (params.boardIds.length == 2) {
            params.pBoardId = params.boardIds[0]
            params.boardId = params.boardIds[1]
            //当板块无二级时
        } else if (params.boardIds.length == 1) {
            params.pBoardId = params.boardIds[0]
        }
        params.editorType = editorType.value
        if (params.editorType == 1) {
        }
        // const contentText=params.content.replace(/<(?!img).*?>/g,"")
        delete params.boardIds
        let res = await proxy.Request({
            url: params.articleId ? api.updateArticle : api.postArticle,
            params
        })
        if (!res) {
            return
        }
        proxy.Message.success('发送文章成功')
        router.push('/post/' + res.data)
    })
}
//切换编辑器 1为markdown编辑器 0为富文本编辑器
const editorType = ref(0)
const type = ref(true)
const checkEdit = () => {
    type.value = !type.value
    if (type.value == true) {
        editorType.value = 0
    } else {
        editorType.value = 1
    }
    formData.value.content = ''
    formData.value.markdownContent = ''
    //保留编辑器状态
    proxy.VueCookies.set("editorType", editorType.value, -1)
}
</script>

<style lang="scss" scoped>
.postForumBox {
    :deep(.el-card__header) {
        padding: 10px;
    }

    :deep(.el-card__body) {
        padding: 5px;
    }

    .post-form {
        display: flex;
        justify-content: space-between;

        .post-editor {
            width: 75%;

            .header {
                display: flex;
                justify-content: space-between;
                font-size: 14px;
                cursor: pointer;

                .check {
                    cursor: pointer;
                }
            }

        }

        .post-setting {
            width: 450px;
            margin-left: 10px;

            .title {
                :deep(.el-input__inner) {
                    height: 38px;
                }
            }

            .confrim {
                height: 32px;
                width: 370px;
                background-color: #409eff;
                text-align: center;
                line-height: 32px;
                color: #fff;
                border-radius: 5px;
                margin: 0 auto;
                font-size: 14px;
                margin-bottom: 20px;
            }
        }
    }
}</style>
