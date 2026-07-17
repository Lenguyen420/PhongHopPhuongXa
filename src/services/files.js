import axios from 'axios'
import { getSession, saveSession } from '@/app/session'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5175'
export const http = axios.create({ baseURL: apiBaseUrl })
let refreshing

http.interceptors.request.use((config) => {
  const token = getSession()?.accessToken
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

http.interceptors.response.use(undefined, async (error) => {
  const original = error.config
  const session = getSession()
  if (error.response?.status !== 401 || original._retried || !session?.refreshToken) throw error
  original._retried = true
  refreshing ??= axios
    .post(`${apiBaseUrl}/auth/refresh`, { refreshToken: session.refreshToken })
    .finally(() => {
      refreshing = null
    })
  try {
    const response = await refreshing
    saveSession(response.data.data)
    original.headers.Authorization = `Bearer ${response.data.data.accessToken}`
    return http(original)
  } catch (refreshError) {
    saveSession(null)
    window.location.assign('/dang-nhap')
    throw refreshError
  }
})

export async function uploadAttachment(file, tableName, valueId) {
  const body = new FormData()
  body.append('file', file)
  body.append('tableName', tableName)
  body.append('valueId', valueId)
  return http.post('/attachments/upload', body).then((response) => response.data.data)
}

export async function deleteAttachment(id) {
  return http.delete(`/attachments/${id}`)
}

export async function downloadAttachment(document) {
  const response = await http.get(`/attachments/${document.id}/download`, { responseType: 'blob' })
  const url = URL.createObjectURL(response.data)
  const link = window.document.createElement('a')
  link.href = url
  link.download = document.fileName || 'tai-lieu'
  link.click()
  URL.revokeObjectURL(url)
}
