<template>
  <NiceModal.NiceModalCreator>
    <!-- <Modal
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
    ></Modal> -->
    <Modal title="demo modal" v-bind="antdModalV4(modal)"></Modal>
  </NiceModal.NiceModalCreator>
</template>

<script setup lang="ts">
  import { Modal } from 'ant-design-vue'
  import { isRef, watch } from 'vue'
  import NiceModal, { useModal, antdModalV4 } from '../lib'

  const modal = useModal()
  // const { visible, hide } = toRefs(useModal())
</script>
