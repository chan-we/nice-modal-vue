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

export interface NiceModalAction {
  type: string
  payload: {
    modalId: string
    args?: Record<string, unknown>
    flags?: Record<string, unknown>
  }
}

export interface NiceModalCallbacks {
  [modalId: string]: {
    resolve: (args: unknown) => void
    reject: (args: unknown) => void
    promise: Promise<unknown>
  }
}
