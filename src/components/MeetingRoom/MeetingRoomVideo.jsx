import { Mic, MonitorUp, UserRound, Video } from 'lucide-react'

function MeetingRoomVideo({ meeting }) {
  const primaryParticipant = meeting.participants[0]
  const visibleParticipants = meeting.participants.slice(1, 5)

  return (
    <section className="flex min-h-0 flex-1 flex-col gap-4">
      <div className="relative grid min-h-[320px] flex-1 place-items-center overflow-hidden rounded-[28px] bg-gradient-to-br from-slate-800 via-slate-900 to-black shadow-2xl ring-1 ring-white/10">
        <div className="absolute left-4 top-4 rounded-2xl bg-black/35 px-3 py-2 text-sm font-bold text-white backdrop-blur">
          {meeting.room}
        </div>
        <button
          className="absolute right-4 top-4 inline-flex items-center gap-2 rounded-2xl bg-white/10 px-3 py-2 text-sm font-bold text-white backdrop-blur transition hover:bg-white/20"
          type="button"
        >
          <MonitorUp size={17} />
          Trình chiếu
        </button>

        <div className="grid place-items-center text-center">
          <div className="grid h-28 w-28 place-items-center rounded-full bg-[#2563EB] text-4xl font-bold text-white shadow-2xl shadow-blue-950/40 sm:h-36 sm:w-36 sm:text-5xl">
            {primaryParticipant.name.charAt(0)}
          </div>
          <h2 className="mt-5 text-2xl font-bold text-white">{primaryParticipant.name}</h2>
          <p className="mt-1 text-sm font-semibold text-slate-400">{primaryParticipant.role}</p>
        </div>

        <div className="absolute bottom-4 left-4 flex gap-2">
          <span className="inline-flex items-center gap-2 rounded-2xl bg-black/35 px-3 py-2 text-xs font-bold text-white backdrop-blur">
            <Mic size={15} />
            Mic đang bật
          </span>
          <span className="inline-flex items-center gap-2 rounded-2xl bg-black/35 px-3 py-2 text-xs font-bold text-white backdrop-blur">
            <Video size={15} />
            Camera đang bật
          </span>
        </div>
      </div>

      <div className="grid shrink-0 grid-cols-2 gap-3 md:grid-cols-4">
        {visibleParticipants.map((participant) => (
          <article
            className="relative min-h-28 overflow-hidden rounded-[20px] bg-slate-800 p-3 ring-1 ring-white/10"
            key={participant.id}
          >
            <div className="grid h-full place-items-center">
              <div className="grid h-12 w-12 place-items-center rounded-full bg-slate-700 text-lg font-bold text-white">
                {participant.name.charAt(0)}
              </div>
            </div>
            <div className="absolute inset-x-0 bottom-0 flex items-center gap-2 bg-black/35 px-3 py-2 text-xs font-bold text-white backdrop-blur">
              <UserRound size={14} />
              <span className="truncate">{participant.name}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default MeetingRoomVideo
