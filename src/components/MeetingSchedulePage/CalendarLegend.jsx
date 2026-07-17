import { typeStyles } from './calendarUtils'

function CalendarLegend({ types = [] }) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 py-0.5">
      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Chú giải:</span>
      {types.map((type) => (
        <span
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600"
          key={type.id}
        >
          <span
            className={`h-2.5 w-2.5 rounded-full ${(typeStyles[type.id] ?? typeStyles['giao-ban']).dot}`}
          />
          {type.label}
        </span>
      ))}
    </div>
  )
}

export default CalendarLegend
