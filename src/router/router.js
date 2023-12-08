import { createRouter,createWebHistory } from "vue-router";
const router=createRouter({
    history:createWebHistory(),
    routes:[
        {
            path:'/',
            name:'首页',
            component:()=>import('../views/layout.vue'),
            children:[
                {
                    path:'/',
                    name:'全部文章',
                    component:()=>import('@/views/article/ArticleList.vue')
                },
                {
                    path:'/forum/:pBoard',
                    name:"一级板块",
                    component:()=>import('@/views/article/ArticleList.vue')
                },
                {
                    path:'/forum/:pBoard/:board',
                    name:"二级板块",
                    component:()=>import('@/views/article/ArticleList.vue')
                }
            ]
        }
    ]
})
export default router