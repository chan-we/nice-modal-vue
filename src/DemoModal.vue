<template>
  <NiceModalCreator>
    <Modal :open="true" title="demo modal"></Modal>
  </NiceModalCreator>
</template>

<script setup lang="ts">
  import { Modal } from 'ant-design-vue'
  import NiceModalCreator from '../lib'
  
</script>
