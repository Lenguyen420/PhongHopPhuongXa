import { useEffect, useState } from 'react'
import CalendarEvent from './CalendarEvent'
import { formatFullDate, getMeetingsByDate, toDateKey } from './calendarUtils'

const hours = Array.from({ length: 11 }, (_, index) => `${String(index + 7).padStart(2, '0')}:00`)

function CalendarDayView({ currentDate, meetings, onEventClick }) {
  const dayMeetings = getMeetingsByDate(meetings, currentDate)
  const todayKey = toDateKey(new Date())
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60000)
    return () => clearInterval(interval)
  }, [])

  const isToday = toDateKey(currentDate) === todayKey
  const currentHour = String(now.getHours()).padStart(2, '0')
  const currentMinute = now.getMinutes()
  const topPercent = (currentMinute / 60) * 100

  return (
    <section className="lg:h-full lg:flex lg:flex-col overflow-hidden rounded-[20px] bg-white shadow-sm ring-1 ring-slate-200/70">
      <div className="border-b border-slate-200 bg-slate-50 px-4 py-4 sm:px-6 shrink-0">
        <h2 className="text-base font-bold text-slate-950 sm:text-lg">
          {formatFullDate(currentDate)}
        </h2>
        <p className="mt-1 text-sm font-medium text-slate-500">
          {dayMeetings.length} cuộc họp trong ngày
        </p>
      </div>

      <div className="hidden md:block flex-1 min-h-0 overflow-y-auto">
        {hours.map((hour) => {
          const hourMeetings = dayMeetings.filter((meeting) =>
            meeting.startTime.startsWith(hour.slice(0, 2)),
          )
          const isCurrentTimeHour = isToday && hour.slice(0, 2) === currentHour

          return (
            <div className="grid min-h-24 grid-cols-[90px_minmax(0,1fr)]" key={hour}>
              <div className="border-b border-r border-slate-200 px-4 py-4 text-sm font-bold text-slate-500">
                {hour}
              </div>
              <div className="border-b border-slate-200 p-3 relative">
                <div className="grid gap-2 md:max-w-xl">
                  {hourMeetings.map((meeting) => (
                    <CalendarEvent key={meeting.id} meeting={meeting} onClick={onEventClick} />
                  ))}
                </div>
                {isCurrentTimeHour && (
                  <div
                    className="absolute left-0 right-0 z-30 pointer-events-none flex items-center"
                    style={{ top: `${topPercent}%` }}
                  >
                    <div className="h-2.5 w-2.5 rounded-full bg-red-500 shrink-0 -ml-1.5" />
                    <div className="h-[2px] bg-red-500 flex-1" />
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid gap-3 p-4 md:hidden flex-1 min-h-0 overflow-y-auto">
        {dayMeetings.length > 0 ? (
          dayMeetings.map((meeting) => (
            <CalendarEvent key={meeting.id} meeting={meeting} onClick={onEventClick} />
          ))
        ) : (
          <p className="rounded-[20px] bg-slate-50 p-4 text-sm font-medium text-slate-400">
            Không có lịch họp trong ngày này
          </p>
        )}
      </div>
    </section>
  )
}

export default CalendarDayView
