import { Clock3, ShieldCheck, Users } from 'lucide-react'

function MeetingRoomHeader({ meeting }) {
  return (
    <header className="flex shrink-0 flex-col gap-3 border-b border-white/10 bg-slate-950/90 px-4 py-3 text-white backdrop-blur md:flex-row md:items-center md:justify-between">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-300 ring-1 ring-emerald-400/20">
            {meeting.status}
          </span>
          <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
            <ShieldCheck size={14} />
            Phòng họp trực tuyến Phường/Xã
          </span>
        </div>
        <h1 className="mt-2 truncate text-lg font-bold tracking-tight sm:text-xl">
          {meeting.title}
        </h1>
      </div>

      <div className="flex flex-wrap gap-2 text-sm font-semibold text-slate-300">
        <span className="inline-flex items-center gap-2 rounded-2xl bg-white/10 px-3 py-2">
          <Clock3 size={16} />
          {meeting.time}
        </span>
        <span className="inline-flex items-center gap-2 rounded-2xl bg-white/10 px-3 py-2">
          <Users size={16} />
          {meeting.participants.length} đại biểu
        </span>
      </div>
    </header>
  )
}

export default MeetingRoomHeader
