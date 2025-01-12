import {
  defineComponent,
  Fragment,
  h,
  inject,
  provide,
  reactive,
  Reactive,
  ref,
  watch,
  getCurrentInstance,
  toRefs,
  unref,
  computed,
} from 'vue'
import useReducer from './hooks/useReducer'
import { showModal, setModalFlags, hideModal, removeModal } from './action'
import { NiceModalCallbacks, NiceModalStore, NiceModalAction } from './types'
export * from './help-fn'

type IComponent = ReturnType<typeof defineComponent>

const NiceModalIdContext = Symbol('NiceModalIdContext')
const NiceModalContext = Symbol('NiceModalContext')
const symModalId = Symbol('NiceModalId')

const initialState: NiceModalStore = {}
const hideModalCallbacks: NiceModalCallbacks = {}

let uidSeed = 0
let dispatch: any = () => {
  throw new Error('错误。请用NiceModalProvider包裹应用')
}
const getUid = () => `_nice_modal_${uidSeed++}`

export const reducer = (
  state: NiceModalStore = initialState,
  action: NiceModalAction
): NiceModalStore => {
  switch (action.type) {
    case 'nice-modal/show': {
      const { modalId, args } = action.payload
      return {
        ...state,
        [modalId]: {
          ...state[modalId],
          id: modalId,
          args,
          // If modal is not mounted, mount it first then make it visible.
          // There is logic inside HOC wrapper to make it visible after its first mount.
          // This mechanism ensures the entering transition.
          visible: !!ALREADY_MOUNTED[modalId],
          delayVisible: !ALREADY_MOUNTED[modalId],
        },
      }
    }
    case 'nice-modal/hide': {
      const { modalId } = action.payload
      if (!state[modalId]) return state
      return {
        ...state,
        [modalId]: {
          ...state[modalId],
          visible: false,
        },
      }
    }
    case 'nice-modal/remove': {
      const { modalId } = action.payload
      const newState = { ...state }
      delete newState[modalId]
      return newState
    }
    case 'nice-modal/set-flags': {
      const { modalId, flags } = action.payload
      return {
        ...state,
        [modalId]: {
          ...state[modalId],
          ...flags,
        },
      }
    }
    default:
      return state
  }
}

const MODAL_REGISTRY: {
  [id: string]: {
    comp: IComponent
    props?: Record<string, unknown>
  }
} = {}
const ALREADY_MOUNTED: Record<string, any> = {}
const modalCallbacks: NiceModalCallbacks = {}

export const register = <T extends IComponent>(
  id: string,
  comp: T,
  props?: Record<string, unknown>
): void => {
  if (!MODAL_REGISTRY[id]) {
    MODAL_REGISTRY[id] = { comp, props }
  } else {
    MODAL_REGISTRY[id].props = props
  }
}

export const unregister = (id: string): void => {
  delete MODAL_REGISTRY[id]
}

const setFlags = (modalId: string, flags: Record<string, unknown>): void => {
  dispatch(setModalFlags(modalId, flags))
}

export const remove = (modal: string | IComponent): void => {
  const modalId = getModalId(modal)
  dispatch(removeModal(modalId))
  delete modalCallbacks[modalId]
  delete hideModalCallbacks[modalId]
}

export function useModal(modal?: any, args?: any): any {
  const api = reactive<any>({})
  const modals = inject<Reactive<NiceModalStore>>(NiceModalContext) || {}

  let modalId = ref<string | null>(null)
  const isUseComponent = modal && typeof modal !== 'string'

  if (!modal) {
    const ctx = getCurrentInstance()

    modalId.value = (ctx?.attrs?.id as string) || null
  } else {
    modalId.value = getModalId(modal)
  }

  if (!unref(modalId)) {
    throw new Error('useModal未获取到modal.id')
  }

  watch([modalId], () => {
    if (isUseComponent && !MODAL_REGISTRY[unref(modalId) as string]) {
      register(unref(modalId) as string, modal as IComponent, args)
    }
  })

  const showCallback = (args?: Record<string, unknown>) => {
    return show(unref(modalId), args)
  }
  const hideCallback = () => hide(unref(modalId))
  const removeCallback = () => {
    remove(unref(modalId))
  }

  const resolveCallback = (args?: unknown) => {
    modalCallbacks[unref(modalId) as string]?.resolve(args)
    delete modalCallbacks[unref(modalId) as string]
  }
  const rejectCallback = (args?: unknown) => {
    modalCallbacks[unref(modalId) as string]?.reject(args)
    delete modalCallbacks[unref(modalId) as string]
  }

  const resolveHide = (args: unknown) => {
    hideModalCallbacks[unref(modalId) as string]?.resolve(args)
    delete hideModalCallbacks[unref(modalId) as string]
  }

  Object.assign(api, {
    show: showCallback,
    hide: hideCallback,
    remove: removeCallback,
    resolve: resolveCallback,
    reject: rejectCallback,
    resolveHide,
  })

  watch(
    modals,
    () => {
      const modal = modals[unref(modalId) as string]

      Object.assign(api, {
        visible: !!modal?.visible,
        args: modal?.args,
        keepMounted: !!modal?.keepMounted,
      })
    },
    { deep: true, immediate: true }
  )

  return api
}

export const NiceModalCreator = defineComponent({
  name: 'NiceModalCreator',
  props: {
    defaultVisible: Boolean,
    keepMounted: Boolean,
    id: String,
  },
  setup(props, { slots }) {
    const { defaultVisible, keepMounted, id, ...rest } = toRefs(props)

    if (!unref(id)) {
      throw new Error('缺少id字段')
    }

    const { args, show } = useModal(unref(id))

    const modals = inject<Reactive<NiceModalStore>>(NiceModalContext) || {}

    const shouldMount = !!modals[unref(id) as string]

    watch(
      [id, defaultVisible],
      () => {
        if (unref(defaultVisible)) {
          show()
        }
        ALREADY_MOUNTED[unref(id) as string] = true
      },
      { deep: true, immediate: true }
    )

    watch([id, keepMounted], () => {
      if (keepMounted) {
        setFlags(unref(id) as string, { keepMounted: true })
      }
    })

    watch(
      [() => modals[unref(id) as string]?.delayVisible, args],
      ([delayVisible]) => {
        if (delayVisible) {
          show(args)
        }
      },
      { immediate: true }
    )

    if (!shouldMount) return null

    provide(NiceModalIdContext, ref(id))

    return () => {
      return h(Fragment, [slots.default?.({ ...rest, ...args })])
    }
  },
})

export const NiceModalPlaceholder = defineComponent({
  name: 'NiceModalPlaceholder',
  setup() {
    const modals = reactive<Record<string, any>>({})
    Object.assign(modals, inject<Reactive<NiceModalStore>>(NiceModalContext))
    const remoteModals =
      inject<Reactive<NiceModalStore>>(NiceModalContext) || reactive({})

    watch(
      remoteModals,
      (v) => {
        Object.assign(modals, v)
      },
      { deep: true, immediate: true }
    )

    const renderList = computed(() => {
      const visibleModalIds = Object.keys(modals).filter((id) => !!modals[id])
      visibleModalIds.forEach((id) => {
        if (!MODAL_REGISTRY[id] && !ALREADY_MOUNTED[id]) {
          console.warn(`找不到id为 ${id} 的弹窗，请检查是否已注册弹窗。`)
          return
        }
      })

      const toRender = visibleModalIds
        .filter((id) => MODAL_REGISTRY[id])
        .map((id) => ({
          id,
          ...MODAL_REGISTRY[id],
        }))

      return toRender.map((t) =>
        h(t.comp, {
          key: t.id,
          id: t.id,
          ...(t.props || {}),
        })
      )
    })

    return () => h(Fragment, [...unref(renderList)])
  },
})

const getModalId = (modal: string | IComponent): string => {
  if (typeof modal === 'string') {
    return modal as string
  }
  if (!modal[symModalId]) {
    modal[symModalId] = getUid()
  }
  return modal[symModalId]
}

export function show(modal: IComponent, args?: Record<string, unknown>) {
  const modalId = getModalId(modal)
  if (typeof modal !== 'string' && !MODAL_REGISTRY[modalId]) {
    register(modalId, modal)
  }
  dispatch(showModal(modalId, args))
  if (!modalCallbacks[modalId]) {
    // `!` tell ts that theResolve will be written before it is used
    let theResolve!: (args?: unknown) => void
    // `!` tell ts that theResolve will be written before it is used
    let theReject!: (args?: unknown) => void
    const promise = new Promise((resolve, reject) => {
      theResolve = resolve
      theReject = reject
    })
    modalCallbacks[modalId] = {
      resolve: theResolve,
      reject: theReject,
      promise,
    }
  }
  return modalCallbacks[modalId].promise
}

export function hide(modal: string | IComponent) {
  const modalId = getModalId(modal)
  dispatch(hideModal(modalId))
  delete modalCallbacks[modalId]
  if (!hideModalCallbacks[modalId]) {
    let theResolve!: (args?: unknown) => void
    let theReject!: (args?: unknown) => void
    const promise = new Promise((resolve, reject) => {
      theResolve = resolve
      theReject = reject
    })
    hideModalCallbacks[modalId] = {
      resolve: theResolve,
      reject: theReject,
      promise,
    }
  }
  return hideModalCallbacks[modalId].promise
}

export const NiceModalProvider = defineComponent({
  // compatConfig: { MODE: 3 },
  name: 'NiceModalProvider',
  inheritAttrs: false,
  setup(_, { slots }) {
    const arr = useReducer(reducer, initialState)

    const modals = reactive(arr[0])
    dispatch = arr[1]

    provide(NiceModalContext, modals)
    return () => h(Fragment, [slots.default?.(), h(NiceModalPlaceholder)])
  },
})
