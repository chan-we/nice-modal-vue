import { NiceModalAction } from './types'

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
