import DashboardHeader from '@/components/Dashboard/DashboardHeader'
import DashboardMeetingTable from '@/components/Dashboard/DashboardMeetingTable'
import DashboardNotification from '@/components/Dashboard/DashboardNotification'
import DashboardRoomGrid from '@/components/Dashboard/DashboardRoomGrid'
import DashboardRunningMeeting from '@/components/Dashboard/DashboardRunningMeeting'
import DashboardStats from '@/components/Dashboard/DashboardStats'
import { useDashboardQuery } from '@/services/meetingApi'
import { toDateKey } from '@/components/MeetingSchedulePage/calendarUtils'

const statusLabels = {
  DRAFT: 'Nháp',
  SCHEDULED: 'Sắp diễn ra',
  IN_PROGRESS: 'Đang diễn ra',
  COMPLETED: 'Đã kết thúc',
  CANCELLED: 'Đã huỷ',
}
const roomStatusLabels = { AVAILABLE: 'Trống', IN_USE: 'Đang sử dụng', MAINTENANCE: 'Bảo trì' }

function DashboardPage() {
  const { data, isLoading, isError, refetch } = useDashboardQuery(toDateKey(new Date()))
  if (isLoading) return <StateCard text="Đang tải tổng quan..." />
  if (isError) return <StateCard action={refetch} text="Không thể tải dữ liệu tổng quan." />
  const summary = data?.summary ?? {}
  const dashboardStats = [
    {
      title: 'Cuộc họp hôm nay',
      value: String(summary.todayTotal ?? 0),
      icon: 'Calendar',
      color: 'blue',
    },
    {
      title: 'Đang diễn ra',
      value: String(summary.running ?? 0),
      icon: 'PlayCircle',
      color: 'green',
    },
    {
      title: 'Đã kết thúc',
      value: String(summary.completed ?? 0),
      icon: 'CheckCircle',
      color: 'gray',
    },
    { title: 'Sắp diễn ra', value: String(summary.upcoming ?? 0), icon: 'Clock3', color: 'orange' },
    {
      title: 'Phòng họp sử dụng',
      value: `${summary.roomsInUse ?? 0} / ${summary.totalRooms ?? 0}`,
      icon: 'Building2',
      color: 'blue',
    },
    {
      title: 'Đại biểu tham dự',
      value: String(summary.participantCount ?? 0),
      icon: 'Users',
      color: 'green',
    },
  ]
  const todayMeetings = (data?.todayMeetings ?? []).map((item) => ({
    id: item.id,
    time: item.startTime,
    name: item.title,
    room: item.room || 'Trực tuyến',
    host: item.host,
    status: statusLabels[item.status] || item.status,
  }))
  const meetingRooms = (data?.rooms ?? []).map((room) => ({
    ...room,
    status: roomStatusLabels[room.status] || room.status,
  }))
  const runningMeetings = (data?.runningMeetings ?? []).map((item) => ({
    id: item.id,
    name: item.title,
    time: `${item.startTime} - ${item.endTime}`,
    room: item.room || 'Trực tuyến',
    host: item.host,
    participants: item.participants?.length ?? 0,
  }))
  const notifications = data?.notifications ?? []
  return (
    <div className="mx-auto grid max-w-[1600px] gap-6">
      <DashboardHeader />
      <DashboardStats stats={dashboardStats} />

      <section className="grid gap-6 xl:grid-cols-[minmax(0,3fr)_minmax(280px,1fr)]">
        <div className="grid gap-6">
          <DashboardMeetingTable meetings={todayMeetings} />
          <DashboardRoomGrid rooms={meetingRooms} />
        </div>

        <aside className="grid content-start gap-6">
          <DashboardRunningMeeting meetings={runningMeetings} />
          <DashboardNotification notifications={notifications} />
        </aside>
      </section>
    </div>
  )
}

function StateCard({ action, text }) {
  return (
    <div className="rounded-[20px] bg-white p-8 text-center font-semibold text-slate-600 shadow-sm">
      {text}
      {action && (
        <button className="ml-3 rounded-xl bg-blue-600 px-4 py-2 text-white" onClick={action}>
          Thử lại
        </button>
      )}
    </div>
  )
}

export default DashboardPage
