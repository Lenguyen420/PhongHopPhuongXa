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

  // Divide the 42 days into 6 weeks of 7 days
  const weeks = Array.from({ length: 6 }, (_, index) => days.slice(index * 7, (index + 1) * 7))

  // Exclude weeks that consist entirely of days from other months
  const activeWeeks = weeks.filter((week) =>
    week.some((day) => day.getMonth() === currentMonth),
  )
  const activeDays = activeWeeks.flat()

  return (
    <section className="lg:h-full lg:flex lg:flex-col overflow-hidden rounded-[20px] bg-white shadow-sm ring-1 ring-slate-200/70">
      <div className="hidden grid-cols-7 border-b border-slate-200 bg-slate-50 md:grid shrink-0">
        {weekdays.map((day) => (
          <div
            className="px-3 py-2.5 text-center text-xs font-bold uppercase text-slate-500"
            key={day}
          >
            {day}
          </div>
        ))}
      </div>

      <div
        className="hidden grid-cols-7 md:grid flex-1 min-h-0"
        style={{ gridTemplateRows: `repeat(${activeWeeks.length}, minmax(0, 1fr))` }}
      >
        {activeDays.map((day) => {
          const dateKey = toDateKey(day)
          const dayMeetings = getMeetingsByDate(meetings, day)
          const isToday = dateKey === todayKey
          const isOtherMonth = day.getMonth() !== currentMonth

          return isOtherMonth ? (
            <div
              className="border-b border-r border-slate-100 bg-slate-50/30"
              key={dateKey}
            />
          ) : (
            <div
              className="border-b border-r border-slate-200 p-1.5 flex flex-col min-h-0 overflow-hidden bg-white"
              key={dateKey}
            >
              <div className="mb-1 flex justify-end shrink-0">
                <span
                  className={`grid h-6 w-6 place-items-center rounded-full text-xs font-bold ${
                    isToday ? 'bg-[#2563EB] text-white' : 'text-slate-700'
                  }`}
                >
                  {day.getDate()}
                </span>
              </div>
              <div className="flex-1 min-h-0 overflow-y-auto flex flex-col gap-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {dayMeetings.slice(0, 3).map((meeting) => (
                  <CalendarEvent
                    compact
                    key={meeting.id}
                    meeting={meeting}
                    onClick={onEventClick}
                  />
                ))}
                {dayMeetings.length > 3 && (
                  <span className="px-1.5 py-0.5 text-[10px] font-bold text-slate-500">
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
