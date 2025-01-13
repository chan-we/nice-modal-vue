import { NiceModalHandler } from './types'

export const antdModal = (
  modal: NiceModalHandler
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
  }
}

/**
 * 适用于ant-design-vue@4 Modal组件
 * @see https://antdv.com/components/modal
 */
export const antdModalV4 = (modal: NiceModalHandler) => {
  const { onOk, onCancel, afterClose } = antdModal(modal)
  return {
    open: modal.visible,
    onOk,
    onCancel,
    afterClose,
    ...modal.args,
  }
}

export const antdDrawerV4 = (modal: NiceModalHandler) => {
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
  }
}

export const elementDialog = (modal: NiceModalHandler) => {
  return {
    modelValue: modal.visible,
    onClosed: () => {
      modal.resolveHide()
      setTimeout(() => {
        if (!modal.keepMounted) modal.remove()
      }, 0)
    },
  }
}

export const elementDrawer = (modal: NiceModalHandler) => elementDialog(modal)
