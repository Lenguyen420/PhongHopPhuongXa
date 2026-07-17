import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { logout, setCredentials } from '@/app/authSlice'

const rawBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5175',
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth?.accessToken
    if (token) headers.set('authorization', `Bearer ${token}`)
    return headers
  },
})

let refreshPromise
const baseQueryWithRefresh = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions)
  if (result.error?.status !== 401 || !api.getState().auth?.refreshToken) return result
  refreshPromise ??= rawBaseQuery(
    {
      url: '/auth/refresh',
      method: 'POST',
      body: { refreshToken: api.getState().auth.refreshToken },
    },
    api,
    extraOptions,
  ).finally(() => {
    refreshPromise = null
  })
  const refreshed = await refreshPromise
  if (refreshed.data?.data) {
    api.dispatch(setCredentials(refreshed.data.data))
    result = await rawBaseQuery(args, api, extraOptions)
  } else {
    api.dispatch(logout())
  }
  return result
}

const unwrap = (response) => response.data

export const meetingApi = createApi({
  reducerPath: 'meetingApi',
  baseQuery: baseQueryWithRefresh,
  tagTypes: ['Dashboard', 'Meeting', 'Room'],
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (body) => ({ url: '/auth/admin-login', method: 'POST', body }),
      transformResponse: unwrap,
    }),
    dashboard: builder.query({
      query: (date) => `/meeting-dashboard?date=${date}`,
      transformResponse: unwrap,
      providesTags: ['Dashboard'],
    }),
    formOptions: builder.query({ query: () => '/meeting-form-options', transformResponse: unwrap }),
    calendar: builder.query({
      query: (params) => ({ url: '/meetings/calendar', params }),
      transformResponse: unwrap,
      providesTags: ['Meeting'],
    }),
    meeting: builder.query({
      query: (id) => `/meetings/${id}`,
      transformResponse: unwrap,
      providesTags: (_r, _e, id) => [{ type: 'Meeting', id }],
    }),
    liveMeeting: builder.query({
      query: (id) => `/meetings/${id}/live`,
      transformResponse: unwrap,
      providesTags: (_r, _e, id) => [{ type: 'Meeting', id }],
    }),
    createMeeting: builder.mutation({
      query: (body) => ({ url: '/meetings', method: 'POST', body }),
      transformResponse: unwrap,
      invalidatesTags: ['Meeting', 'Dashboard', 'Room'],
    }),
    updateMeeting: builder.mutation({
      query: ({ id, body }) => ({ url: `/meetings/${id}`, method: 'PATCH', body }),
      transformResponse: unwrap,
      invalidatesTags: ['Meeting', 'Dashboard', 'Room'],
    }),
    updateMeetingStatus: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/meetings/${id}/status`, method: 'PATCH', body }),
      transformResponse: unwrap,
      invalidatesTags: ['Meeting', 'Dashboard', 'Room'],
    }),
    rooms: builder.query({
      query: (params) => ({ url: '/meeting-rooms', params }),
      transformResponse: unwrap,
      providesTags: ['Room'],
    }),
    room: builder.query({
      query: (id) => `/meeting-rooms/${id}`,
      transformResponse: unwrap,
      providesTags: (_r, _e, id) => [{ type: 'Room', id }],
    }),
    createRoom: builder.mutation({
      query: (body) => ({ url: '/meeting-rooms', method: 'POST', body }),
      transformResponse: unwrap,
      invalidatesTags: ['Room', 'Dashboard'],
    }),
    updateRoom: builder.mutation({
      query: ({ id, body }) => ({ url: `/meeting-rooms/${id}`, method: 'PATCH', body }),
      transformResponse: unwrap,
      invalidatesTags: ['Room', 'Dashboard'],
    }),
    sendMessage: builder.mutation({
      query: ({ id, content }) => ({
        url: `/meetings/${id}/messages`,
        method: 'POST',
        body: { content },
      }),
      transformResponse: unwrap,
    }),
  }),
})

export const {
  useLoginMutation,
  useDashboardQuery,
  useFormOptionsQuery,
  useCalendarQuery,
  useLazyMeetingQuery,
  useMeetingQuery,
  useLiveMeetingQuery,
  useCreateMeetingMutation,
  useUpdateMeetingMutation,
  useUpdateMeetingStatusMutation,
  useRoomsQuery,
  useLazyRoomQuery,
  useCreateRoomMutation,
  useUpdateRoomMutation,
  useSendMessageMutation,
} = meetingApi
