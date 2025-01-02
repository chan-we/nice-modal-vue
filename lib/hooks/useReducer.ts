import { reactive } from 'vue'

export default function useReducer(
  reducer: any,
  initialState: Record<string, any>
) {
  const state = reactive(initialState)

  function dispatch(action: any) {
    const newState = reducer(state, action)
    Object.keys(newState).forEach((key) => {
      state[key] = newState[key]
    })
  }

  return [state, dispatch]
}
