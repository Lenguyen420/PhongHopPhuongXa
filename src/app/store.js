import { configureStore } from '@reduxjs/toolkit'
import { meetingApi } from '@/services/meetingApi'
import authReducer from './authSlice'

export const store = configureStore({
  reducer: { auth: authReducer, [meetingApi.reducerPath]: meetingApi.reducer },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(meetingApi.middleware),
})
