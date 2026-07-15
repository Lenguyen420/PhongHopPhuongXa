import CalendarEvent from './CalendarEvent'
import {
  formatDayMonth,
  getMeetingsByDate,
  getWeekDays,
  toDateKey,
  weekdays,
} from './calendarUtils'

const hours = Array.from({ length: 10 }, (_, index) => `${String(index + 7).padStart(2, '0')}:00`)

function CalendarWeekView({ currentDate, meetings, onEventClick }) {
  const weekDays = getWeekDays(currentDate)
  const todayKey = toDateKey(new Date())

  return (
    <section className="overflow-hidden rounded-[20px] bg-white shadow-sm ring-1 ring-slate-200/70">
      <div className="hidden overflow-x-auto lg:block">
        <div className="min-w-[980px]">
          <div className="grid grid-cols-[80px_repeat(7,minmax(120px,1fr))] border-b border-slate-200 bg-slate-50">
            <div className="px-3 py-4 text-xs font-bold uppercase text-slate-500">Giờ</div>
            {weekDays.map((day, index) => {
              const isToday = toDateKey(day) === todayKey

              return (
                <div className="px-3 py-3 text-center" key={toDateKey(day)}>
                  <p className="text-xs font-bold uppercase text-slate-500">{weekdays[index]}</p>
                  <p
                    className={`mx-auto mt-1 grid h-8 w-12 place-items-center rounded-full text-sm font-bold ${
                      isToday ? 'bg-[#2563EB] text-white' : 'text-slate-800'
                    }`}
                  >
                    {formatDayMonth(day)}
                  </p>
                </div>
              )
            })}
          </div>

          {hours.map((hour) => (
            <div className="grid min-h-24 grid-cols-[80px_repeat(7,minmax(120px,1fr))]" key={hour}>
              <div className="border-b border-r border-slate-200 px-3 py-3 text-xs font-bold text-slate-500">
                {hour}
              </div>
              {weekDays.map((day) => {
                const dayMeetings = getMeetingsByDate(meetings, day).filter((meeting) =>
                  meeting.startTime.startsWith(hour.slice(0, 2)),
                )

                return (
                  <div
                    className="border-b border-r border-slate-200 p-2"
                    key={`${toDateKey(day)}-${hour}`}
                  >
                    <div className="grid gap-1.5">
                      {dayMeetings.map((meeting) => (
                        <CalendarEvent key={meeting.id} meeting={meeting} onClick={onEventClick} />
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-3 p-4 lg:hidden">
        {weekDays.map((day) => {
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

export default CalendarWeekView
