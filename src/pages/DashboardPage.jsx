import DashboardHeader from '@/components/Dashboard/DashboardHeader'
import DashboardMeetingTable from '@/components/Dashboard/DashboardMeetingTable'
import DashboardNotification from '@/components/Dashboard/DashboardNotification'
import DashboardRoomGrid from '@/components/Dashboard/DashboardRoomGrid'
import DashboardRunningMeeting from '@/components/Dashboard/DashboardRunningMeeting'
import DashboardStats from '@/components/Dashboard/DashboardStats'
import {
  dashboardStats,
  meetingRooms,
  notifications,
  runningMeetings,
  todayMeetings,
} from '@/datas/dashboardData'

function DashboardPage() {
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

export default DashboardPage
