import CalendarEvent from './CalendarEvent'
import {
  formatDayMonth,
  getMeetingsByDate,
  getMonthMatrix,
  toDateKey,
  weekdays,
} from './calendarUtils'

function CalendarMonthView({ currentDate, meetings, onEventClick }) {
  const days = getMonthMatrix(currentDate)
  const todayKey = toDateKey(new Date())
  const currentMonth = currentDate.getMonth()

  return (
    <section className="overflow-hidden rounded-[20px] bg-white shadow-sm ring-1 ring-slate-200/70">
      <div className="hidden grid-cols-7 border-b border-slate-200 bg-slate-50 md:grid">
        {weekdays.map((day) => (
          <div
            className="px-3 py-3 text-center text-xs font-bold uppercase text-slate-500"
            key={day}
          >
            {day}
          </div>
        ))}
      </div>

      <div className="hidden grid-cols-7 md:grid">
        {days.map((day) => {
          const dateKey = toDateKey(day)
          const dayMeetings = getMeetingsByDate(meetings, day)
          const isToday = dateKey === todayKey
          const isOtherMonth = day.getMonth() !== currentMonth

          return (
            <div
              className={`min-h-36 border-b border-r border-slate-200 p-2 ${
                isOtherMonth ? 'bg-slate-50/60 text-slate-400' : 'bg-white'
              }`}
              key={dateKey}
            >
              <div className="mb-2 flex justify-end">
                <span
                  className={`grid h-7 w-7 place-items-center rounded-full text-sm font-bold ${
                    isToday ? 'bg-[#2563EB] text-white' : 'text-slate-700'
                  }`}
                >
                  {day.getDate()}
                </span>
              </div>
              <div className="grid gap-1.5">
                {dayMeetings.slice(0, 3).map((meeting) => (
                  <CalendarEvent
                    compact
                    key={meeting.id}
                    meeting={meeting}
                    onClick={onEventClick}
                  />
                ))}
                {dayMeetings.length > 3 && (
                  <span className="px-2 text-xs font-bold text-slate-500">
                    +{dayMeetings.length - 3} cuộc họp
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid gap-3 p-4 md:hidden">
        {days
          .filter((day) => day.getMonth() === currentMonth)
          .map((day) => {
            const dayMeetings = getMeetingsByDate(meetings, day)

            return (
              <article
                className="rounded-[20px] border border-slate-200 bg-slate-50/70 p-4"
                key={toDateKey(day)}
              >
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-950">{formatDayMonth(day)}</h3>
                  <span className="text-xs font-bold text-slate-500">
                    {dayMeetings.length} cuộc họp
                  </span>
                </div>
                <div className="grid gap-2">
                  {dayMeetings.length > 0 ? (
                    dayMeetings.map((meeting) => (
                      <CalendarEvent key={meeting.id} meeting={meeting} onClick={onEventClick} />
                    ))
                  ) : (
                    <p className="text-sm font-medium text-slate-400">Không có lịch họp</p>
                  )}
                </div>
              </article>
            )
          })}
      </div>
    </section>
  )
}

export default CalendarMonthView
