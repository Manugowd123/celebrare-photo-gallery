function favouritesReducer(state, action) {
  switch (action.type) {
    case 'ADD_FAVOURITE':
      if (state.includes(action.id)) return state
      return [...state, action.id]
    case 'REMOVE_FAVOURITE':
      return state.filter((id) => id !== action.id)
    default:
      return state
  }
}

export default favouritesReducer
