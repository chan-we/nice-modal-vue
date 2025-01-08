<template>
  <div>hello world</div>
  <Button @click="showModal">show modal</Button>
  <Button @click="localOpen = true">show modal2</Button>
  <Modal title="demo modal2" v-model:open="localOpen"></Modal>
</template>

<script setup lang="ts">
  import { Button, Modal } from 'ant-design-vue'
  import NiceModal from '../lib'
  import DemoModal from './DemoModal.vue'
  import { ref } from 'vue'

  NiceModal.register('demo-modal', DemoModal)
  const localOpen = ref(false)

  const showModal = () => {
    NiceModal.show('demo-modal', {
      title: 'custom title modal',
      okText: '确定'
    })
  }
</script>
