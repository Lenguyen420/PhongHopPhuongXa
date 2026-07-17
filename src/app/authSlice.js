import { createSlice } from '@reduxjs/toolkit'
import { getSession, saveSession } from './session'

const authSlice = createSlice({
  name: 'auth',
  initialState: getSession(),
  reducers: {
    setCredentials: (_state, action) => {
      saveSession(action.payload)
      return action.payload
    },
    logout: () => {
      saveSession(null)
      return null
    },
  },
})

export const { logout, setCredentials } = authSlice.actions
export default authSlice.reducer
