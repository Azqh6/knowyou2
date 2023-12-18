<template>
  <div class="messageBox">
    <div class="nav">
      <router-link to="/" class="a-link">首页</router-link>
      <span class="iconfont icon-right"></span>
      <span>消息中心</span>
    </div>
    <div class="content">
      <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
        <el-tab-pane name="reply">
          <template #label>
            <div class="tab-item">
              <div>回复我的</div>
              <div class="messgaeCount" v-if="messageCount.reply > 0">{{ messageCount.reply > 99 ? '99+' : messageCount.reply }}
              </div>
            </div>
          </template>
        </el-tab-pane>
        <el-tab-pane name="likePost">
          <template #label>
            <div class="tab-item">
              <div>赞了我的文章</div>
              <div class="messgaeCount" v-if="messageCount.likePost > 0">
                {{ messageCount.likePost > 99 ? '99+' : messageCount.likePost }}</div>
            </div>
          </template>
        </el-tab-pane>
        <el-tab-pane name="downloadAttachment">
          <template #label>
            <div class="tab-item">
              <div>下载了我的附件</div>
              <div class="messgaeCount" v-if="messageCount.downloadAttachment > 0">
                {{ messageCount.downloadAttachment > 99 ? '99+' : messageCount.downloadAttachment }}</div>
            </div>
          </template>
        </el-tab-pane>
        <el-tab-pane name="likeComment">
          <template #label>
            <div class="tab-item">
              <div>赞了我的评论</div>
              <div class="messgaeCount" v-if="messageCount.likeComment > 0">
                {{ messageCount.likeComment > 99 ? '99+' : messageCount.likeComment }}</div>
            </div>
          </template>
        </el-tab-pane>
        <el-tab-pane name="sys">
          <template #label>
            <div class="tab-item">
              <div>系统消息</div>
              <div class="messgaeCount" v-if="messageCount.sys > 0">{{ messageCount.sys > 99 ? '99+' : messageCount.sys }}</div>
            </div>
          </template>
        </el-tab-pane>
      </el-tabs>
      <div class="userCenter a-link" @click="goUserCenter">&lt;&lt;个人中心</div>
      <div class="messageList">
        <DataList :dataSource="messageInfo" @loadData="getMessageList">
          <template #default="{ data }">
            <div class="reply" v-show="activeName == 'reply'">
              <Avatar :userId="data.sendUserId"></Avatar>
              <div style="padding: 10px 0px;margin-left: 5px;">
                <div>
                  <span><a class="a-link" :href="'/userCenter/' + data.sendUserId">@{{ data.sendNickName
                  }}</a></span>对我的文章【<a class="a-link" :href="'/post/' + data.articleId">{{ data.articleTitle }}</a>】发表了评论
                  <span style="color: #9ba7b9;margin-left: 10px;">{{ data.createTime }}</span>
                </div>
                <div style="margin-top: 5px;">
                  <div class="replyContent">{{ data.messageContent }}</div>
                </div>
              </div>
            </div>
            <div class="reply" v-show="activeName == 'likePost'">
              <Avatar :userId="data.sendUserId"></Avatar>
              <div style="padding: 10px 0px;margin-left: 5px;">
                <div style="margin-top: 13px;">
                  <span><a class="a-link" :href="'/userCenter/' + data.sendUserId">@{{ data.sendNickName
                  }}</a></span>赞了我的文章【<a class="a-link" :href="'/post/' + data.articleId">{{ data.articleTitle }}</a>】
                  <span style="color: #9ba7b9;margin-left: 10px;">{{ data.createTime }}</span>
                </div>
              </div>
            </div>
            <div class="reply" v-show="activeName == 'downloadAttachment'">
              <Avatar :userId="data.sendUserId" :width="50"></Avatar>
              <div style="padding: 10px 0px;margin-left: 5px;">
                <div style="margin-top: 13px;">
                  <span><a class="a-link" :href="'/userCenter/' + data.sendUserId">@{{ data.sendNickName }}</a></span>在文章【<a
                    class="a-link" :href="'/post/' + data.articleId">{{ data.articleTitle }}</a>】下载了附件
                  <span style="color: #9ba7b9;margin-left: 10px;">{{ data.createTime }}</span>
                </div>
              </div>
            </div>
            <div class="reply" v-show="activeName == 'likeComment'">
              <Avatar :userId="data.sendUserId"></Avatar>
              <div style="padding: 10px 0px;margin-left: 5px;">
                <div>
                  <span><a class="a-link" :href="'/userCenter/' + data.sendUserId">@{{ data.sendNickName }}</a></span>在文章【<a
                    class="a-link" :href="'/post/' + data.articleId">{{ data.articleTitle }}</a>】赞了我的评论
                  <span style="color: #9ba7b9;margin-left: 10px;">{{ data.createTime }}</span>
                </div>
                <div style="margin-top: 5px;">
                  <div class="replyContent">{{ data.messageContent }}</div>
                </div>
              </div>
            </div>
            <div class="reply" v-show="activeName == 'sys'">
              <div class="replyContent">{{ data.messageContent }}<span
                  style="margin-left: 15px;color:#9ba7b9 ;">{{ data.createTime }}</span></div>
            </div>
          </template>
        </DataList>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, nextTick, watch, onMounted } from "vue"
import { useStore } from 'vuex'
import { useRouter, useRoute } from "vue-router";
const { proxy } = getCurrentInstance();
const store = useStore()
const route = useRoute()
const router = useRouter()
const api = {
  loadMessageList: '/ucenter/loadMessageList'
}
onMounted(() => {
  getMessageList()
})
const userId = ref(null)
watch(() => store.state.loginUserInfo, (newVal, oldVal) => {
  if (newVal) {
    userId.value = newVal.userId
  }

}, { immediate: true, deep: true });
const goUserCenter = () => {
  router.push('/userCenter/' + userId.value)
}
//tab栏
const activeName = ref('reply')
const handleClick = (e) => {
  activeName.value = e.props.name
  store.commit('readMessage', e.props.name)
  getMessageList()
}
//获取消息列表
const messageInfo = ref({})
const messageCount = ref(store.state.messageCount)
const getMessageList = async () => {
  let res = await proxy.Request({
    url: api.loadMessageList,
    params: {
      code: activeName.value,
      pageNo: messageInfo.value.pageNo
    }
  })
  if (!res) {
    return
  }
  messageInfo.value = res.data
}
</script>

<style lang="scss" scoped>
.messageBox {
  position: relative;
  width: 1300px;
  min-height: 500px;
  margin: 0 auto;

  .nav {
    padding-top: 5px;
    height: 40px;

    .iconfont {
      padding: 0 10px;
    }
  }

  .content {
    position: relative;
    box-sizing: border-box;
    margin-top: 10px;
    padding: 10px;
    background-color: #fff;

    .tab-item {
      position: relative;
      padding: 0 10px;

      .messgaeCount {
        color: #fff;
        position: absolute;
        top: -10px;
        right: -10px;
        height: 15px;
        line-height: 15px;
        min-width: 20px;
        display: inline-block;
        background: #f56c6c;
        border-radius: 10px;
        font-size: 13px;
        text-align: center;
        margin-left: 10px;
      }
    }

    :deep(.el-tabs--top .el-tabs__item.is-top:nth-child(2)) {
      padding-left: 20px;
    }

    .userCenter {
      position: absolute;
      font-size: 14px;
      right: 20px;
      top: 20px;
      z-index: 999;
      cursor: pointer;
    }

    .messageList {
      .reply {
        display: flex;
        font-size: 14px;

        .replyContent {
          padding-left: 5px;
          border-left: 2px solid var(--hoverColor);
        }
      }
    }
  }
}</style>
