# Nice Modal Vue

这是个方便管理、调用弹窗、抽屉的 Vue 工具包，适用于 Ant Design Vue、Element Plus 等常用的 Vue 组件库。
代码逻辑~~抄袭~~借鉴自[@ebay/nice-modal-react](https://github.com/eBay/nice-modal-react)。

# 动机

使用 React 开发项目的时候偶然结识了 ebay 开源的工具库[@ebay/nice-modal-react](https://github.com/eBay/nice-modal-react)，感觉非常好用。
因为自己主要的技术栈是 Vue，但是经过搜索 Vue 似乎并没有类似功能的开源工具，于是便打算自己开发一版。

# 用法

## 注册弹窗
首先用`<NiceModalProvider>`包裹项目

```html
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

```html
<!-- DemoModal.vue -->
<template>
  <NiceModalCreator>
    <Modal
      :open="modal.visible"
      @ok="() => {
          modal.hide()
      }"
      @cancel="() => {
          modal.hide()
      }"
    ></Modal>
  </NiceModalCreator>
</template>

<script setup lang="ts">
  import { NiceModalCreator, useModal } from 'nice-modal-vue'
  import { Modal } from 'ant-design-vue'

  const modal = useModal()
  // 或者 const { visible, hide } = toRefs(useModal())
</script>
```

上面这个组件无法在`<template>`中直接使用。

## 唤起弹窗
使用`register`方法注册函数后，就可以使用`show`方法展示弹窗了。

```html
<!-- HelloWorld.vue -->
<template>
  <div>
    <button @click="handleClick">open modal</button>
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

## props传递
`show`方法第二个参数可以传递`props`给弹窗，如果弹窗要读取`props`。需要对组件做调整

```html
<!-- DemoModal.vue -->
<template>
  <NiceModalCreator>
    <!-- 从template中获取`show`函数传递的props -->
    <template #="props">
      <Modal
        v-bind="props"
        :open="modal.visible"
        @ok="() => {
          modal.hide()
        }"
        @cancel="() => {
          modal.hide()
        }"
      ></Modal>
    </template>
  </NiceModalCreator>
</template>

<script setup lang="ts">
  import { NiceModalCreator, useModal } from 'nice-modal-vue'
  import { Modal } from 'ant-design-vue'

  const modal = useModal()
</script>
```

或者使用提供的帮助方法

```html
<!-- DemoModal.vue -->
<template>
  <NiceModalCreator>
    <Modal v-bind="antdModalV4(modal)"></Modal>
  </NiceModalCreator>
</template>

<script setup lang="ts">
  import { NiceModalCreator, useModal, antdModalV4 } from 'nice-modal-vue'
  import { Modal } from 'ant-design-vue'

  const modal = useModal()
</script>
```

