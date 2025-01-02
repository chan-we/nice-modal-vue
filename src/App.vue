<template>
  <NiceModal.NiceModalProvider>
    <Test />
  </NiceModal.NiceModalProvider>
</template>

<script setup lang="ts">
  import NiceModal from '../lib'
  import Test from './Test.vue'
</script>
