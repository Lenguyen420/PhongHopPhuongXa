import { Clock3, MapPin, UserRound, Users, Video } from 'lucide-react'

function DashboardRunningMeeting({ meetings }) {
  return (
    <section className="rounded-[20px] bg-white p-4 shadow-sm ring-1 ring-slate-200/70 sm:p-5">
      <h2 className="text-base font-bold text-slate-950 sm:text-lg">Cuộc họp đang diễn ra</h2>

      <div className="mt-4 grid gap-4 sm:mt-5 md:grid-cols-2 xl:grid-cols-1">
        {meetings.map((meeting) => (
          <article
            className="rounded-[20px] border border-slate-200 bg-slate-50/70 p-4 transition hover:-translate-y-1 hover:bg-white hover:shadow-md"
            key={meeting.name}
          >
            <h3 className="text-base font-bold text-slate-950">{meeting.name}</h3>
            <div className="mt-4 grid gap-2 text-sm font-medium text-slate-500">
              <span className="flex items-center gap-2">
                <Clock3 size={16} className="shrink-0 text-[#2563EB]" />
                {meeting.time}
              </span>
              <span className="flex items-center gap-2">
                <MapPin size={16} className="shrink-0 text-[#F59E0B]" />
                {meeting.room}
              </span>
              <span className="flex items-center gap-2">
                <UserRound size={16} className="shrink-0 text-slate-500" />
                {meeting.host}
              </span>
              <span className="flex items-center gap-2">
                <Users size={16} className="shrink-0 text-[#10B981]" />
                {meeting.participants} người tham gia
              </span>
            </div>

            <button
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#2563EB] px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200"
              type="button"
            >
              <Video size={17} />
              Tham gia
            </button>
          </article>
        ))}
      </div>
    </section>
  )
}

export default DashboardRunningMeeting
