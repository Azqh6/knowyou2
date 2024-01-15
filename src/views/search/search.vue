<template>
  <div :class="['searchBox',starSearch?'search-active': '']">
    <div class='search-panel'>
      <el-form :model="formData" :rules="rules" ref="formDataRef" lebel-width="80px" @submit.native.prevent>
        <el-form-item label="" prop="">
          <el-input size="large" clearable placeholder="输入你想要查找的关键词" v-model="formData.keyword" @keyup.enter="search"
            @focus="startSearchHandler" @change="changeInput">
            <template #suffix>
              <span class="iconfont icon-search" @click="search" @blur="formData.keyword = $event.target.value.trim()">
              </span>
            </template>
          </el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="article-list">
      <DataList :loading="loading" :dataSource="articleListInfo" @loadData="search">
        <template #default="{ data }">
          <ArticleItem :data="data" :htmlTitle="true"></ArticleItem>
        </template>
      </DataList>
    </div>
  </div>
</template>
  
<script setup>
import ArticleItem from "../article/ArticleItem.vue";
import { ref, reactive, getCurrentInstance, nextTick, watch } from "vue"
import { useStore } from 'vuex'
const store = useStore()
const { proxy } = getCurrentInstance();
const formData = ref({});
const formDataRef = ref();
const rules = {
  keyword: [
    { required: true, message: "请输入关键字" },
    { min: 3, message: '关键字太少，至少三个字' }
  ]
};
const api = {
  search: '/forum/search'
}
//搜索前，搜索框的位置
const starSearch = ref(false)
const startSearchHandler = () => {
  starSearch.value = true
}
//等待骨架是否显示
const loading = ref(false)
const articleListInfo = ref({})
//搜索方法
const search = async () => {
  loading.value = true
  let params = {
    pageNo: articleListInfo.value.pageNo,
    keyword: formData.value.keyword
  }
  let res = await proxy.Request({
    url: api.search,
    params: params,
    showLoading: false
  })
  loading.value = false
  if (!res) {
    return
  }
  let list = res.data.list
  //搜索关键字高亮
  list.forEach((element) => {
    element.title = element.title.replace(
      params.keyword,
      "<span style='color:red'>" + params.keyword + "</span>"
    )
  })
  articleListInfo.value = res.data
}
const changeInput = () => {
  if (formData.value.keyword == '') {
    articleListInfo.value = {}
  }
}
</script>
  
<style lang="scss" >
.searchBox {
  width: 1300px;
  margin: 0 auto;
  padding-top: 200px;
  transition: all 0.5s;
  .search-body {
    background: #fff;
    padding: 10px;
    min-height: calc(100vh - 210px);

    .search-panel {
      display: flex;
      justify-content: center;
      padding-top: 200px;
      .el-input {
        width: 700px;
        .iconfont {
          cursor: pointer;
        }
      }
    }

  }
}
    .search-active{
      padding-top: 20px;
    }
</style>
  