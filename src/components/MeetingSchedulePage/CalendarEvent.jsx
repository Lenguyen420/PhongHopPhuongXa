import { typeStyles } from './calendarUtils'

function CalendarEvent({ meeting, compact = false, onClick }) {
  const styles = typeStyles[meeting.type] ?? typeStyles['giao-ban']

  if (compact) {
    return (
      <button
        className="group flex w-full min-w-0 items-center gap-2 rounded-lg px-2 py-1 text-left text-xs font-semibold text-slate-700 transition hover:bg-slate-100/80 active:scale-[0.98]"
        onClick={() => onClick(meeting)}
        type="button"
      >
        <span className={`h-2 w-2 shrink-0 rounded-full ${styles.dot}`} />
        <span className="min-w-0 truncate">
          <span className="mr-1.5 font-medium text-slate-500">{meeting.startTime}</span>
          <span className="font-bold text-slate-800 group-hover:text-[#2563EB]">{meeting.title}</span>
        </span>
      </button>
    )
  }

  return (
    <button
      className={`group flex w-full min-w-0 items-start gap-3 rounded-2xl px-4 py-3.5 text-left text-sm font-semibold ring-1 transition active:scale-[0.98] ${styles.event}`}
      onClick={() => onClick(meeting)}
      type="button"
    >
      <div className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${styles.dot}`} />
      <span className="min-w-0">
        <span className="block font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{meeting.title}</span>
        <span className="mt-1 block text-xs opacity-75 font-medium">{meeting.startTime}</span>
      </span>
    </button>
  )
}

export default CalendarEvent
