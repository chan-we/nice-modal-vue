<template>
  <NiceModal.NiceModalCreator>
    <Modal :open="true" title="demo modal"></Modal>
    {{ 'modal' }}
  </NiceModal.NiceModalCreator>
</template>

<script setup lang="ts">
  import { inject } from 'vue'
  import { Modal } from 'ant-design-vue'
  import NiceModal, { useModal } from '../lib'

  const modal = useModal()
  console.log(modal)
</script>
