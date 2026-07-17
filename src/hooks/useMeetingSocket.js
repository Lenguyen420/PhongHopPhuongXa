import { useEffect, useRef } from 'react'
import { io } from 'socket.io-client'
import { getSession } from '@/app/session'

export function useMeetingSocket(meetingId, { onMessage, onPresence }) {
  const socketRef = useRef(null)
  useEffect(() => {
    if (!meetingId) return undefined
    const socket = io(`${import.meta.env.VITE_SOCKET_URL || 'http://localhost:5175'}/meetings`, {
      auth: { token: getSession()?.accessToken },
    })
    socketRef.current = socket
    socket.on('connect', () => socket.emit('join-meeting', { meetingId }))
    socket.on('message-created', onMessage)
    socket.on('participant-presence-updated', onPresence)
    return () => {
      socket.emit('leave-meeting')
      socket.disconnect()
      socketRef.current = null
    }
  }, [meetingId, onMessage, onPresence])
  return socketRef
}
