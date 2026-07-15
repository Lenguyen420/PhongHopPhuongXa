import MeetingFooter from '@/components/Meetings/MeetingFooter'
import MeetingForm from '@/components/Meetings/MeetingForm'
import MeetingHeader from '@/components/Meetings/MeetingHeader'
import MeetingOptions from '@/components/Meetings/MeetingOptions'
import {
  departments,
  meetingHosts,
  meetingRooms,
  meetingTypes,
  sampleFiles,
} from '@/datas/meetingData'

function MeetingsPage() {
  return (
    <div className="mx-auto grid max-w-[1600px] gap-4 sm:gap-6">
      <MeetingHeader />

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_340px] xl:grid-cols-[minmax(0,1fr)_380px]">
        <MeetingForm
          departments={departments}
          hosts={meetingHosts}
          rooms={meetingRooms}
          sampleFiles={sampleFiles}
          types={meetingTypes}
        />
        <MeetingOptions />
      </section>

      <MeetingFooter />
    </div>
  )
}

export default MeetingsPage
