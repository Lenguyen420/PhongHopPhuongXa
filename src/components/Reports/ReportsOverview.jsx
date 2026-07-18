import { ArrowDownRight, ArrowUpRight, CalendarCheck, Clock3, DoorOpen, ListChecks, Percent, Users } from 'lucide-react'

const statIcons = {
  meetings: CalendarCheck,
  attendance: Percent,
  duration: Clock3,
  rooms: DoorOpen,
  participants: Users,
  tasks: ListChecks,
}

function ReportsOverview({ stats }) {
  return (
    <section className="grid min-w-0 gap-3 min-[520px]:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
      {stats.map((item) => {
        const Icon = statIcons[item.id] || CalendarCheck
        const TrendIcon = item.trend === 'up' ? ArrowUpRight : ArrowDownRight
        const trendClass = item.trend === 'up' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'

        return (
          <article className="min-w-0 rounded-2xl border border-gray-300 bg-white p-4 shadow-sm" key={item.id}>
            <div className="flex items-start justify-between gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-blue-50 text-[#2563EB]">
                <Icon size={21} />
              </span>
              <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${trendClass}`}>
                <TrendIcon size={14} />
                {item.change}%
              </span>
            </div>
            <p className="mt-4 text-3xl font-bold tracking-tight text-slate-950">{item.value}</p>
            {item.suffix && <p className="mt-1 text-sm font-bold text-slate-500">{item.suffix}</p>}
            <h3 className="mt-3 break-words text-sm font-bold uppercase tracking-wide text-slate-500">{item.title}</h3>
          </article>
        )
      })}
    </section>
  )
}

export default ReportsOverview
