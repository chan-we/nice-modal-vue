<template>
  <div>hello world</div>
  <Button @click="showModal">show modal</Button>
</template>

<script setup lang="ts">
  import { Button } from 'ant-design-vue'
  import NiceModal from '../lib'
  import DemoModal from './DemoModal.vue'

  NiceModal.register('demo-modal', DemoModal)

  const showModal = () => {
    NiceModal.show('demo-modal')
  }
</script>
