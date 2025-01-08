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

// action creator to hide a modal
export function hideModal(modalId: string): NiceModalAction {
  return {
    type: 'nice-modal/hide',
    payload: {
      modalId,
    },
  };
}

export function removeModal(modalId: string): NiceModalAction {
  return {
    type: 'nice-modal/remove',
    payload: {
      modalId,
    },
  };
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
