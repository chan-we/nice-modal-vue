import { App, defineComponent, Fragment, h, inject, provide, reactive, Reactive, Ref, ref, watch } from 'vue'
import useReducer from './hooks/useReducer'
import { showModal, setModalFlags } from './action'
import {
  NiceModalCallbacks,
  NiceModalStore,
  NiceModalHocProps,
  NiceModalAction,
} from './types'

type IComponent = ReturnType<typeof defineComponent>

const NiceModalIdContext = Symbol('NiceModalIdContext')
const NiceModalContext = Symbol('NiceModalContext')
const symModalId = Symbol('NiceModalId')

const initialState: NiceModalStore = {}
let uidSeed = 0
let dispatch: any = () => {
  throw new Error(
    'No dispatch method detected, did you embed your app with NiceModalProvider?'
  )
}
const getUid = () => `_nice_modal_${uidSeed++}`

// Modal reducer used in useReducer hook.
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
export function useModal(modal?: any, args?: any): any {
  const modals = inject<Reactive<NiceModalStore>>(NiceModalContext) || {}
  const contextModalId = inject<Ref<string>>(NiceModalIdContext)
  let modalId: string | null = null
  const isUseComponent = modal && typeof modal !== 'string'

  if (!modal) {
    modalId = contextModalId?.value || null
  } else {
    modalId = getModalId(modal)
  }

  if (!modalId) {
    throw new Error('No modal id found in NiceModal.useModal.')
  }

  const mid = modalId as string

  watch([isUseComponent, mid, modal, args], () => {
    if (isUseComponent && !MODAL_REGISTRY[mid]) {
      register(mid, modal as IComponent, args)
    }
  })

  const modalInfo = modals[mid];

  const showCallback = (args?: Record<string, unknown>) => show(mid, args)
  // const hideCallback = () => hide(mid)
  // const removeCallback = () => remove(mid)
  const resolveCallback = (args?: unknown) => {
    modalCallbacks[mid]?.resolve(args)
    delete modalCallbacks[mid]
  }
  const rejectCallback = (args?: unknown) => {
    modalCallbacks[mid]?.reject(args)
    delete modalCallbacks[mid]
  }
  // const resolveHide = (args?: unknown) => {
  //   hideModalCallbacks[mid]?.resolve(args)
  //   delete hideModalCallbacks[mid]
  // }

  return {
    id: mid,
    args: modalInfo?.args,
    visible: !!modalInfo?.visible,
    keepMounted: !!modalInfo?.keepMounted,
    show: showCallback,
    // hide: hideCallback,
    // remove: removeCallback,
    resolve: resolveCallback,
    reject: rejectCallback,
    // resolveHide,
  }
}

export const NiceModalCreator = defineComponent({
  name: 'NiceModalCreator',
  props: {
    defaultVisible: Boolean,
    keepMounted: Boolean,
    id: String,
  },
  setup(props, { slots }) {
    if (!props.id) {
      throw new Error('id is required')
    }

    const { args, show } = useModal(props.id)

    const modals = inject<Reactive<NiceModalStore>>(NiceModalContext) || {}

    const shouldMount = !!modals[props.id]

    watch([() => props.id, show, () => props.defaultVisible], () => {
      if (props.defaultVisible) {
        show()
      }

      ALREADY_MOUNTED[props.id as string] = true
    })

    watch([props.id, props.keepMounted], () => {
      if (props.keepMounted) {
        setFlags(props.id as string, { keepMounted: true })
      }
    })

    if (!shouldMount) return null

    provide(NiceModalIdContext, ref(props.id))

    return () => {
      return h(Fragment, [slots.default?.()])
    }
  },
})

const NiceModalPlaceholder = () => {
  const modals = inject<Reactive<NiceModalStore>>(NiceModalContext) || {}
  const visibleModalIds = Object.keys(modals).filter((id) => !!modals[id])
  visibleModalIds.forEach((id) => {
    if (!MODAL_REGISTRY[id] && !ALREADY_MOUNTED[id]) {
      console.warn(
        `No modal found for id: ${id}. Please check the id or if it is registered or declared via JSX.`
      )
      return
    }
  })

  const toRender = visibleModalIds
    .filter((id) => MODAL_REGISTRY[id])
    .map((id) => ({
      id,
      ...MODAL_REGISTRY[id],
    }))

  return (
    <>
      {toRender.map((t) => (
        <t.comp key={t.id} id={t.id} {...t.props} />
      ))}
    </>
  )
}

const getModalId = (modal: string | IComponent): string => {
  if (typeof modal === 'string') {
    return modal as string
  }
  if (!modal[symModalId]) {
    modal[symModalId] = getUid()
  }
  return modal[symModalId]
}

// export function show<T extends any>(
//   modal: string,
//   args?: Record<string, unknown>
// ): Promise<T>
// export function show<T extends any, P extends any>(
//   modal: string,
//   args: P
// ): Promise<T>
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

const NiceModalProvider = defineComponent({
  compatConfig: { MODE: 3 },
  name: 'NiceModalProvider',
  inheritAttrs: false,
  setup(_, { slots }) {
    return () => {
      const arr = useReducer(reducer, initialState)

      const modals = arr[0]
      dispatch = arr[1]

      provide(NiceModalContext, reactive(modals))

      return (
        <>
          {slots.default?.()}
          <NiceModalPlaceholder />
        </>
      )
    }
  },
})

NiceModalProvider.install = (app: App) => {
  app.component(NiceModalProvider.name as string, NiceModalProvider)
}

const NiceModal = {
  register,
  unregister,
  NiceModalProvider,
  show,
}

export default NiceModal
