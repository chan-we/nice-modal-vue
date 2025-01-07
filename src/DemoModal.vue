<template>
  <NiceModal.NiceModalCreator>
    <Modal
      title="demo modal"
      :open="visible"
      @ok="
        () => {
          hide()
          // modal.hide()
        }
      "
      @cancel="
        () => {
          hide()
          // modal.hide()
        }
      "
    ></Modal>
    {{ 'modal' }}
  </NiceModal.NiceModalCreator>
</template>

<script setup lang="ts">
  import { Modal } from 'ant-design-vue'
  import { isRef, watch } from 'vue'
  import NiceModal, { useModal } from '../lib'

  const { visible, hide } = useModal()
  watch(
    visible,
    () => {
      console.log(isRef(visible))

      // console.log('DemoModal', modal)
    },
    { deep: true }
  )
</script>
