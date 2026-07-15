import CalendarEvent from './CalendarEvent'
import { formatFullDate, getMeetingsByDate } from './calendarUtils'

const hours = Array.from({ length: 11 }, (_, index) => `${String(index + 7).padStart(2, '0')}:00`)

function CalendarDayView({ currentDate, meetings, onEventClick }) {
  const dayMeetings = getMeetingsByDate(meetings, currentDate)

  return (
    <section className="overflow-hidden rounded-[20px] bg-white shadow-sm ring-1 ring-slate-200/70">
      <div className="border-b border-slate-200 bg-slate-50 px-4 py-4 sm:px-6">
        <h2 className="text-base font-bold text-slate-950 sm:text-lg">
          {formatFullDate(currentDate)}
        </h2>
        <p className="mt-1 text-sm font-medium text-slate-500">
          {dayMeetings.length} cuộc họp trong ngày
        </p>
      </div>

      <div className="hidden md:block">
        {hours.map((hour) => {
          const hourMeetings = dayMeetings.filter((meeting) =>
            meeting.startTime.startsWith(hour.slice(0, 2)),
          )

          return (
            <div className="grid min-h-24 grid-cols-[90px_minmax(0,1fr)]" key={hour}>
              <div className="border-b border-r border-slate-200 px-4 py-4 text-sm font-bold text-slate-500">
                {hour}
              </div>
              <div className="border-b border-slate-200 p-3">
                <div className="grid gap-2 md:max-w-xl">
                  {hourMeetings.map((meeting) => (
                    <CalendarEvent key={meeting.id} meeting={meeting} onClick={onEventClick} />
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid gap-3 p-4 md:hidden">
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
