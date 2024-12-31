import { App, defineComponent, inject, provide, VNode, watch } from 'vue'

type IComponent = ReturnType<typeof defineComponent>

export interface NiceModalState {
  id: string
  args?: Record<string, unknown>
  visible?: boolean
  delayVisible?: boolean
  keepMounted?: boolean
}

export interface NiceModalStore {
  [key: string]: NiceModalState
}

export interface NiceModalHocProps {
  id: string
  defaultVisible?: boolean
  keepMounted?: boolean
}

const NiceModalIdContext = Symbol('NiceModalIdContext')
const NiceModalContext = Symbol('NiceModalContext')

const MODAL_REGISTRY: {
  [id: string]: {
    comp: IComponent
    props?: Record<string, unknown>
  }
} = {}
const ALREADY_MOUNTED: Record<string, any> = {}

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

export function useModal(modal?: any, args?: any): any {}

export const create = <P extends {}>(Comp: IComponent) => {
  return ({
    defaultVisible,
    keepMounted,
    id,
    ...props
  }: NiceModalHocProps & P) => {
    const { args, show } = useModal(id)
    const modals = inject<NiceModalStore>(NiceModalContext) || {}
    const shouldMount = !!modals[id]

    watch([id, show, defaultVisible], () => {
      if (defaultVisible) {
        show()
      }

      ALREADY_MOUNTED[id] = true
    })

    // TODO

    if (!shouldMount) return null

    provide(NiceModalIdContext, id)
    return <Comp {...(props as any)} {...args} />
  }
}

const NiceModalPlaceholder = () => {
  const modals = inject<NiceModalStore>(NiceModalContext) || {}
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

const NiceModalProvider = defineComponent({
  compatConfig: { MODE: 3 },
  name: 'NiceModalProvider',
  inheritAttrs: false,
  setup(_, { slots }) {
    return () => {
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
}

export default NiceModal
