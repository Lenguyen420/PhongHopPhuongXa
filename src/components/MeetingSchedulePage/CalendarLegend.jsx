import { meetingTypes } from '@/datas/calendarData'
import { typeStyles } from './calendarUtils'

function CalendarLegend() {
  return (
    <div className="flex flex-wrap gap-2">
      {meetingTypes.map((type) => (
        <span
          className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-slate-600 ring-1 ring-slate-200"
          key={type.id}
        >
          <span className={`h-2.5 w-2.5 rounded-full ${typeStyles[type.id].dot}`} />
          {type.label}
        </span>
      ))}
    </div>
  )
}

export default CalendarLegend
