<template>
    <div class="articleBox">
        <div class="childrenBoards" v-if="boardLists && boardLists.length > 0">
            <div><router-link :class="['itemBoard', store.state.articleBoard == null ? 'active' : '']"
                    :to="'/forum/' + pBoard">全部</router-link></div>
            <div v-for="(item, index) in boardLists"><router-link
                    :class="['itemBoard', item.boardId == store.state.articleBoard ? 'active' : '']"
                    :to="'/forum/' + item.pBoardId + '/' + item.boardId">{{ item.boardName }}</router-link></div>
        </div>
        <div class="articleContent">
            <div class="top-tab">
                <div :class="{ active: orderType == 0 ? 'active' : '' }" @click="changeOrderType(0)">热榜</div>
                <el-divider direction="vertical"></el-divider>
                <div :class="{ active: orderType == 1 ? 'active' : '' }" @click="changeOrderType(1)">发布时间</div>
                <el-divider direction="vertical"></el-divider>
                <div :class="{ active: orderType == 2 ? 'active' : '' }" @click="changeOrderType(2)">最新</div>
            </div>
            <DataList :dataSource="articleList">
                <template v-slot="data" @loadData="getArticleList">
                    <ArticleItem :data="data.data"></ArticleItem>
                </template>
            </DataList>
        </div>
    </div>
</template>

<script setup>
import ArticleItem from "./ArticleItem.vue";
import { ref, reactive, getCurrentInstance, nextTick, onMounted, watch } from "vue"
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
const route = useRoute()
const router = useRouter()
const store = useStore()
const { proxy } = getCurrentInstance();
const api = {
    getArticleList: '/forum/loadArticle',
}
onMounted(() => {
    getArticleList(route.params)
})
//板块信息
const boardLists = ref([])
//通过点击顶部一级tab,遍历出二级tab
const selectBoard = (id) => {
    store.state.boardList.forEach(item => {
        if (item.boardId == id && item.children) {
            boardLists.value = item.children
            return
        }
    })
}
//获取全部文章
const articleList = ref({})
const pBoardId = ref()
const boardId = ref()
const orderType = ref(0)
const getArticleList = async () => {
    let params = {
        pBoardId: pBoardId.value,
        boardId: boardId.value,
        orderType: orderType.value
    }
    let res = await proxy.Request({
        url: api.getArticleList,
        params: params
    })
    if (!res) {
        return
    }
    articleList.value = res.data
}
//热榜0 发布时间1 最新2
const changeOrderType = (type) => {
    orderType.value = type
    getArticleList()
}
//1级板块
const pBoard = ref(0)
//监听路由变化，通过动态路由获取对应板块id,实现①tab父子级高亮②对应板块文章
watch(() => route.params, (newVal, oldVal) => {
    orderType.value = 0
    pBoard.value = newVal.pBoard
    if (newVal.pBoard) {
        selectBoard(newVal.pBoard)
    } else {
        boardLists.value = []
    }
    pBoardId.value = newVal.pBoard
    boardId.value = newVal.board
    getArticleList()
    store.commit('setArticleBoard', newVal.board)
    store.commit('setArticlePboard', newVal.pBoard)
}, { immediate: true, deep: true });
</script>

<style lang="scss" scoped>
.articleBox {
    width: 1300px;
    margin: 0 auto;

    .childrenBoards {
        height: 23px;
        box-sizing: content-box;
        padding: 10px 0px;
        display: flex;

        .itemBoard {
            background-color: #fff;
            font-size: 14px;
            margin-right: 10px;
            color: #909090;
            cursor: pointer;
            border-radius: 15px;
            padding: 2px 10px;
            text-decoration: none;
        }

        .active {
            background-color: var(--hoverColor);
            color: #fff;
        }
    }

    .articleContent {
        background-color: #fff;

        .top-tab {
            display: flex;
            font-size: 15px;
            padding: 10px 15px;
            align-items: center;
            cursor: pointer;
            border-bottom: 1px solid #ddd;
        }

        .active {
            color: var(--hoverColor);
        }
    }
}</style>
