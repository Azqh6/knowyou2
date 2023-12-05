<template>
    <div class="header">
        <div class="header-nav">
            <div class="header-left">
                <div class="logo"><span v-for="(item,index) in logo" :style="{color:item.color}">{{ item.name }}</span></div>
                <div class="header-tab">
                    <div class="tabs" v-for="(item,index) in tabs">{{item}}</div>
                </div>
            </div>
            <div class="header-right">
                <el-button type="primary" style="margin-right: 5px;">发帖<span class="iconfont icon-add"></span></el-button>
                <el-button type="primary" style="margin-right: 5px;">搜索<span class="iconfont icon-search"></span></el-button>
                <el-button-group>
                    <el-button type="primary" plain>登录</el-button>
                    <el-button type="primary" plain>注册</el-button>
                </el-button-group>
            </div>
        </div>
    </div>
    <div class="content">
    </div>
    <loginAndRegister></loginAndRegister>
</template>

<script setup>
import loginAndRegister from './loginAndRegister/index.vue'
//logo
const logo=[
    {
        name:'E',
        color:'rgb(50, 133, 255)'
    },
    {
        name:'a',
        color:'rgb(251, 54, 36)'
    },
    {
        name:'s',
        color:'rgb(255, 186, 2)'
    },
    {
        name:'y',
        color:'rgb(50, 133, 255)'
    },
    {
        name:'B',
        color:'rgb(37, 178, 78)'
    },
    {
        name:'B',
        color:'rgb(251, 54, 36)'
    },
    {
        name:'s',
        color:'rgb(255, 186, 2)'
    },
]
const tabs=['首页','EasyBBs开发','程序员','前端','后端','社区管理']
</script>

<style lang="scss" scoped>
.header{
    width: 100%;
    height: 60px;
    box-shadow:0 5px 5px #ddd ;
    .header-nav{
        width: 1300px;
        height: 100%;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
        .header-left{
            font-size: 30px;
            line-height: 60px;
            display: flex;
            .logo{
                margin-right: 5px;
            }
            .header-tab{
                font-size: 16px;
                display: flex;
                .tabs{
                    padding: 0 10px;
                    color: #61666d;
                    cursor: pointer;
                }
                .tabs:hover{
                    color: var(--hoverColor);
                }
            }
        }
        .header-right{
            display: flex;
            align-items: center;
        }
        :deep(.el-button+.el-button){
            margin: 0;
        }
    }
}
.content{
    width: 1300px;
    min-height: calc(100vh - 210px);
    margin: 0 auto;
    margin-top: 10px;
    background-color: #fff;
}
</style>
