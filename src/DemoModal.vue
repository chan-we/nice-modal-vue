<template>
  <NiceModal.NiceModalCreator>
    <Modal
      title="demo modal"
      :open="modal.visible"
      @ok="
        () => {
          modal.hide()
        }
      "
      @cancel="
        () => {
          modal.hide()
        }
      "
    ></Modal>
    {{ 'modal' }}
  </NiceModal.NiceModalCreator>
</template>

<script setup lang="ts">
  import { Modal } from 'ant-design-vue'
  import NiceModal, { useModal } from '../lib'

  const modal = useModal()
  console.log('DemoModal', modal)
</script>
