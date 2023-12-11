<template>
  <div v-if="dataSource==[]">
        暂无数据
  </div>
  <template>
        <el-skeleton :rows="5" />
  </template>
  <div v-for="(item,index) in dataSource.list">
    <slot :data="item"></slot>
  </div>
  <div class="pagenation" v-if="dataSource.pageTotal>1">
    <el-pagination 
    background 
    layout="prev, pager, next" 
    v-model:current-page="dataSource.pageNo"
    :total="dataSource.pageTotal"
    @current-change="currentChange"
    :page-size="2"
    />
  </div>
</template>

<script setup>
import {ref} from 'vue'
const props=defineProps({
    dataSource:{
        type:Array
    }
})
const emit=defineEmits(['loadData'])
const currentChange=(pageNo)=>{
    props.dataSource.pageNo=pageNo
    emit("loadData")
}
</script>

<style lang="scss" scoped>
</style>
