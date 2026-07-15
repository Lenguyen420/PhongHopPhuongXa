import { useParams } from 'react-router-dom'
import MeetingRoomHeader from '@/components/MeetingRoom/MeetingRoomHeader'
import MeetingRoomSidebar from '@/components/MeetingRoom/MeetingRoomSidebar'
import MeetingRoomToolbar from '@/components/MeetingRoom/MeetingRoomToolbar'
import MeetingRoomVideo from '@/components/MeetingRoom/MeetingRoomVideo'
import { fallbackMeetingRoom, meetingRooms } from '@/datas/meetingRoomData'

function MeetingRoomPage() {
  const { id } = useParams()
  const meeting = meetingRooms.find((item) => item.id === id) ?? fallbackMeetingRoom

  return (
    <div className="min-h-svh overflow-hidden bg-slate-950 text-white">
      <div className="flex h-svh flex-col">
        <MeetingRoomHeader meeting={meeting} />

        <main className="grid min-h-0 flex-1 gap-4 overflow-y-auto px-3 py-4 pb-24 sm:px-4 lg:grid-cols-[minmax(0,1fr)_384px] lg:overflow-hidden">
          <MeetingRoomVideo meeting={meeting} />
          <MeetingRoomSidebar meeting={meeting} />
        </main>

        <MeetingRoomToolbar />
      </div>
    </div>
  )
}

export default MeetingRoomPage
