import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { logout, setCredentials } from '@/app/authSlice'
import { normalizeMeetingTypes } from '@/services/meetingTypes'

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

const unwrapFormOptions = (response) => ({
  ...response.data,
  types: normalizeMeetingTypes(response.data?.types),
})

export const meetingApi = createApi({
  reducerPath: 'meetingApi',
  baseQuery: baseQueryWithRefresh,
  tagTypes: ['Dashboard', 'Meeting', 'Room', 'Device', 'User', 'Document', 'Minutes', 'Report'],
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
    formOptions: builder.query({
      query: () => '/meeting-form-options',
      transformResponse: unwrapFormOptions,
    }),
    calendar: builder.query({
      query: (params) => ({ url: '/meetings/calendar', params }),
      transformResponse: unwrap,
      providesTags: ['Meeting'],
    }),
    meetings: builder.query({
      query: (params) => ({ url: '/meetings', params }),
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
    deviceOptions: builder.query({ query: () => '/device-options', transformResponse: unwrap }),
    devices: builder.query({
      query: (params) => ({ url: '/devices', params }),
      transformResponse: unwrap,
      providesTags: ['Device'],
    }),
    createDevice: builder.mutation({
      query: (body) => ({ url: '/devices', method: 'POST', body }),
      transformResponse: unwrap,
      invalidatesTags: ['Device', 'Room'],
    }),
    updateDevice: builder.mutation({
      query: ({ id, body }) => ({ url: `/devices/${id}`, method: 'PATCH', body }),
      transformResponse: unwrap,
      invalidatesTags: ['Device', 'Room'],
    }),
    updateDeviceStatus: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/devices/${id}/status`, method: 'PATCH', body }),
      transformResponse: unwrap,
      invalidatesTags: ['Device', 'Room'],
    }),
    deleteDevice: builder.mutation({
      query: (id) => ({ url: `/devices/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Device', 'Room'],
    }),
    userOptions: builder.query({ query: () => '/user-options', transformResponse: unwrap }),
    users: builder.query({
      query: (params) => ({ url: '/users', params }),
      transformResponse: unwrap,
      providesTags: ['User'],
    }),
    createUser: builder.mutation({
      query: (body) => ({ url: '/users', method: 'POST', body }),
      transformResponse: unwrap,
      invalidatesTags: ['User'],
    }),
    updateUser: builder.mutation({
      query: ({ id, body }) => ({ url: `/users/${id}`, method: 'PATCH', body }),
      transformResponse: unwrap,
      invalidatesTags: ['User'],
    }),
    updateUserStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/users/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      transformResponse: unwrap,
      invalidatesTags: ['User'],
    }),
    resetUserPassword: builder.mutation({
      query: ({ id, password }) => ({
        url: `/users/${id}/reset-password`,
        method: 'POST',
        body: { password },
      }),
    }),
    setUserPermissions: builder.mutation({
      query: ({ id, permissionIds }) => ({
        url: `/users/${id}/permissions`,
        method: 'PUT',
        body: { permissionIds },
      }),
      transformResponse: unwrap,
      invalidatesTags: ['User'],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({ url: `/users/${id}`, method: 'DELETE' }),
      invalidatesTags: ['User'],
    }),
    documentOptions: builder.query({ query: () => '/document-options', transformResponse: unwrap }),
    documents: builder.query({
      query: (params) => ({ url: '/documents', params }),
      transformResponse: unwrap,
      providesTags: ['Document'],
    }),
    createDocumentCategory: builder.mutation({
      query: (body) => ({ url: '/document-categories', method: 'POST', body }),
      transformResponse: unwrap,
      invalidatesTags: ['Document'],
    }),
    uploadDocument: builder.mutation({
      query: (body) => ({ url: '/documents', method: 'POST', body }),
      transformResponse: unwrap,
      invalidatesTags: ['Document'],
    }),
    uploadDocumentVersion: builder.mutation({
      query: ({ id, body }) => ({ url: `/documents/${id}/versions`, method: 'POST', body }),
      transformResponse: unwrap,
      invalidatesTags: ['Document'],
    }),
    updateDocument: builder.mutation({
      query: ({ id, body }) => ({ url: `/documents/${id}`, method: 'PATCH', body }),
      transformResponse: unwrap,
      invalidatesTags: ['Document'],
    }),
    documentHistory: builder.query({
      query: (id) => `/documents/${id}/history`,
      transformResponse: unwrap,
    }),
    deleteDocument: builder.mutation({
      query: (id) => ({ url: `/documents/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Document'],
    }),
    minutes: builder.query({
      query: (meetingId) => `/meetings/${meetingId}/minutes`,
      transformResponse: unwrap,
      providesTags: (_r, _e, id) => [{ type: 'Minutes', id }],
    }),
    saveMinutes: builder.mutation({
      query: ({ meetingId, body }) => ({
        url: `/meetings/${meetingId}/minutes`,
        method: 'PUT',
        body,
      }),
      transformResponse: unwrap,
      invalidatesTags: (_r, _e, { meetingId }) => [{ type: 'Minutes', id: meetingId }, 'Report'],
    }),
    updateMinutesStatus: builder.mutation({
      query: ({ meetingId, status }) => ({
        url: `/meetings/${meetingId}/minutes/status`,
        method: 'PATCH',
        body: { status },
      }),
      transformResponse: unwrap,
      invalidatesTags: (_r, _e, { meetingId }) => [{ type: 'Minutes', id: meetingId }],
    }),
    meetingReports: builder.query({
      query: (params) => ({ url: '/meeting-reports', params }),
      transformResponse: unwrap,
      providesTags: ['Report'],
    }),
  }),
})

export const {
  useLoginMutation,
  useDashboardQuery,
  useFormOptionsQuery,
  useCalendarQuery,
  useMeetingsQuery,
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
  useDeviceOptionsQuery,
  useDevicesQuery,
  useCreateDeviceMutation,
  useUpdateDeviceMutation,
  useUpdateDeviceStatusMutation,
  useDeleteDeviceMutation,
  useUserOptionsQuery,
  useUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useUpdateUserStatusMutation,
  useResetUserPasswordMutation,
  useSetUserPermissionsMutation,
  useDeleteUserMutation,
  useDocumentOptionsQuery,
  useDocumentsQuery,
  useCreateDocumentCategoryMutation,
  useUploadDocumentMutation,
  useUploadDocumentVersionMutation,
  useUpdateDocumentMutation,
  useDocumentHistoryQuery,
  useLazyDocumentHistoryQuery,
  useDeleteDocumentMutation,
  useMinutesQuery,
  useSaveMinutesMutation,
  useUpdateMinutesStatusMutation,
  useMeetingReportsQuery,
} = meetingApi
