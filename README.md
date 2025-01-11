# Nice Modal Vue
这是个方便管理、调用弹窗、抽屉的Vue工具包，适用于Ant Design Vue、Element Plus等常用的Vue组件库。
代码逻辑~~抄袭~~借鉴自[@ebay/nice-modal-react](https://github.com/eBay/nice-modal-react)。

# 动机
使用React开发项目的时候偶然结识了ebay开源的工具库[@ebay/nice-modal-react](https://github.com/eBay/nice-modal-react)，感觉非常好用。
因为自己主要的技术栈是Vue，但是经过搜索Vue似乎并没有类似功能的开源工具，于是便打算自己开发一版。

# 用法
首先用`<NiceModalProvider>`包裹项目
```vue
<!-- App.vue -->
<template>
  <NiceModalProvider>
    <HelloWorld msg="Vite + Vue" />
  </NiceModalProvider>
</template>

<script setup lang="ts">
  import HelloWorld from './components/HelloWorld.vue'
  import { NiceModalProvider } from 'nice-modal-vue'
</script>
```

创建一个弹窗，这个弹窗需要用`<NiceModalCreator>`包裹
```vue
<!-- DemoModal.vue -->
<template>
  <NiceModalCreator>
    <Modal
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
  </NiceModalCreator>
</template>

<script setup lang="ts">
  import { NiceModalCreator, useModal } from 'nice-modal-vue'
  import { Modal } from 'ant-design-vue'

  const modal = useModal()
</script>
```

使用`register`方法注册函数后，就可以使用`show`方法展示弹窗了
```vue
<!-- HelloWorld.vue -->
<template>
  <div>
    <Button @click="handleClick">open modal</Button>
  </div>
</template>

<script setup lang="ts">
  import { Button } from 'ant-design-vue'
  import DemoModal from './DemoModal.vue'
  import { register, show } from 'nice-modal-vue'

  defineProps<{ msg: string }>()

  register('demo-modal', DemoModal)

  const handleClick = () => {
    show('demo-modal')
  }
</script>
```