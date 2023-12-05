<template>
    <el-dialog 
    class="cust-dialog"
    v-model="dialogTableVisible" 
    title="Shipping address" 
    :width="400"
    :close-on-click-modal="false"
     >
     <div class="dialog-body">

     </div>
    </el-dialog>
  </template>
  
  <script setup>
  import{ref}from 'vue'
  const dialogTableVisible=ref(true)
  </script>
  
  <style lang="scss" scoped>
    .dialog-body{
        width: 100%;
        height: 300px;
    }
  </style>
  