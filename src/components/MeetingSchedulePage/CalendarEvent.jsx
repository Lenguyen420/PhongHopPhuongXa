import { Calendar } from 'lucide-react'
import { typeStyles } from './calendarUtils'

function CalendarEvent({ meeting, compact = false, onClick }) {
  const styles = typeStyles[meeting.type] ?? typeStyles['giao-ban']

  return (
    <button
      className={`group flex w-full min-w-0 items-start gap-2 rounded-xl px-2.5 py-2 text-left text-xs font-semibold ring-1 transition active:scale-[0.98] ${styles.event}`}
      onClick={() => onClick(meeting)}
      type="button"
    >
      <Calendar className="mt-0.5 shrink-0" size={14} />
      <span className="min-w-0">
        <span className="block truncate">{meeting.title}</span>
        {!compact && <span className="mt-0.5 block font-bold opacity-80">{meeting.startTime}</span>}
      </span>
    </button>
  )
}

export default CalendarEvent
