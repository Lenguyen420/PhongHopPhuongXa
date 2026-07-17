import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import MeetingRoomHeader from '@/components/MeetingRoom/MeetingRoomHeader'
import MeetingRoomSidebar from '@/components/MeetingRoom/MeetingRoomSidebar'
import MeetingRoomToolbar from '@/components/MeetingRoom/MeetingRoomToolbar'
import MeetingRoomVideo from '@/components/MeetingRoom/MeetingRoomVideo'
import { useLiveMeetingQuery } from '@/services/meetingApi'
import { useMeetingSocket } from '@/hooks/useMeetingSocket'

function MeetingRoomPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data, isLoading, isError } = useLiveMeetingQuery(id)
  const [meeting, setMeeting] = useState(null)
  useEffect(() => {
    if (data) setMeeting(data)
  }, [data])
  const onMessage = useCallback(
    (message) =>
      setMeeting((current) =>
        current ? { ...current, messages: [...current.messages, message] } : current,
      ),
    [],
  )
  const onPresence = useCallback(
    ({ userId, active }) =>
      setMeeting((current) =>
        current
          ? {
              ...current,
              participants: current.participants.map((item) =>
                item.id === userId ? { ...item, active } : item,
              ),
            }
          : current,
      ),
    [],
  )
  const socketRef = useMeetingSocket(id, { onMessage, onPresence })
  const sendMessage = (content) =>
    socketRef.current?.emit('send-message', { meetingId: id, content })
  const leave = () => {
    socketRef.current?.emit('leave-meeting')
    if (window.opener) window.close()
    else navigate('/lich-hop')
  }

  if (isError)
    return (
      <div className="grid min-h-svh place-items-center bg-slate-950 font-semibold text-red-300">
        Không thể truy cập phòng họp.
      </div>
    )
  if (isLoading || !meeting)
    return (
      <div className="grid min-h-svh place-items-center bg-slate-950 font-semibold text-white">
        Đang kết nối phòng họp...
      </div>
    )

  return (
    <div className="min-h-svh overflow-hidden bg-slate-950 text-white">
      <div className="flex h-svh flex-col">
        <MeetingRoomHeader meeting={meeting} />

        <main className="grid min-h-0 flex-1 gap-4 overflow-y-auto px-3 py-4 pb-24 sm:px-4 lg:grid-cols-[minmax(0,1fr)_384px] lg:overflow-hidden">
          <MeetingRoomVideo meeting={meeting} />
          <MeetingRoomSidebar meeting={meeting} onSendMessage={sendMessage} />
        </main>

        <MeetingRoomToolbar onLeave={leave} />
      </div>
    </div>
  )
}

export default MeetingRoomPage
