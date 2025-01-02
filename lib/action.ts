import { NiceModalAction } from './types'

// action creator to show a modal
export function showModal(
  modalId: string,
  args?: Record<string, unknown>
): NiceModalAction {
  return {
    type: 'nice-modal/show',
    payload: {
      modalId,
      args,
    },
  }
}

// action creator to set flags of a modal
export function setModalFlags(
  modalId: string,
  flags: Record<string, unknown>
): NiceModalAction {
  return {
    type: 'nice-modal/set-flags',
    payload: {
      modalId,
      flags,
    },
  }
}
