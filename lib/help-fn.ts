import { NiceModalHandler } from './types'

export const antdModal = (
  modal: NiceModalHandler,
  props?: Record<string, any>
): {
  visible: boolean
  onCancel: () => void
  onOk: () => void
  afterClose: () => void
} => {
  return {
    visible: modal.visible,
    onOk: () => modal.hide(),
    onCancel: () => modal.hide(),
    afterClose: () => {
      modal.resolveHide()
      setTimeout(() => {
        if (!modal.keepMounted) modal.remove()
      }, 0)
    },
    ...modal.args,
    ...props,
  }
}

/**
 * 适用于ant-design-vue@4 Modal组件
 * @see https://antdv.com/components/modal
 */
export const antdModalV4 = (
  modal: NiceModalHandler,
  props?: Record<string, any>
) => {
  const { onOk, onCancel, afterClose } = antdModal(modal)
  return {
    open: modal.visible,
    onOk,
    onCancel,
    afterClose,
    ...modal.args,
    ...props,
  }
}

export const antdDrawerV4 = (
  modal: NiceModalHandler,
  props?: Record<string, any>
) => {
  const { afterClose } = antdModal(modal)
  return {
    open: modal.visible,
    onClose: () => {
      modal.hide()
    },
    afterOpenChange: (open: boolean) => {
      if (!open) {
        afterClose()
      }
    },
    ...modal.args,
    ...props,
  }
}

export const elementDialog = (
  modal: NiceModalHandler,
  props?: Record<string, any>
) => {
  return {
    modelValue: modal.visible,
    onClosed: () => {
      modal.resolveHide()
      setTimeout(() => {
        if (!modal.keepMounted) modal.remove()
      }, 0)
    },
    ...modal.args,
    ...props,
  }
}

export const elementDrawer = (
  modal: NiceModalHandler,
  props?: Record<string, any>
) => elementDialog(modal, props)
