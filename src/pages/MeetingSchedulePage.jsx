import { useMemo, useState } from 'react'
import CalendarDayView from '@/components/MeetingSchedulePage/CalendarDayView'
import CalendarEventModal from '@/components/MeetingSchedulePage/CalendarEventModal'
import CalendarHeader from '@/components/MeetingSchedulePage/CalendarHeader'
import CalendarMonthView from '@/components/MeetingSchedulePage/CalendarMonthView'
import CalendarToolbar from '@/components/MeetingSchedulePage/CalendarToolbar'
import CalendarWeekView from '@/components/MeetingSchedulePage/CalendarWeekView'
import { calendarMeetings } from '@/datas/calendarData'

const initialFilters = {
  host: '',
  room: '',
  status: '',
  type: '',
}

function MeetingSchedulePage() {
  const [currentDate, setCurrentDate] = useState(() => new Date(2026, 6, 15))
  const [viewMode, setViewMode] = useState('month')
  const [filters, setFilters] = useState(initialFilters)
  const [searchValue, setSearchValue] = useState('')
  const [selectedMeeting, setSelectedMeeting] = useState(null)

  const filteredMeetings = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLowerCase()

    return calendarMeetings.filter((meeting) => {
      const matchesSearch =
        normalizedSearch.length === 0 || meeting.title.toLowerCase().includes(normalizedSearch)
      const matchesRoom = !filters.room || meeting.room === filters.room
      const matchesHost = !filters.host || meeting.host === filters.host
      const matchesType = !filters.type || meeting.type === filters.type
      const matchesStatus = !filters.status || meeting.status === filters.status

      return matchesSearch && matchesRoom && matchesHost && matchesType && matchesStatus
    })
  }, [filters, searchValue])

  const handleFilterChange = (name, value) => {
    setFilters((currentFilters) => ({
      ...currentFilters,
      [name]: value,
    }))
  }

  const handleToday = () => {
    setCurrentDate(new Date(2026, 6, 15))
  }

  const handlePrev = () => {
    setCurrentDate((date) => {
      const nextDate = new Date(date)

      if (viewMode === 'month') {
        nextDate.setMonth(nextDate.getMonth() - 1)
      } else {
        nextDate.setDate(nextDate.getDate() - (viewMode === 'week' ? 7 : 1))
      }

      return nextDate
    })
  }

  const handleNext = () => {
    setCurrentDate((date) => {
      const nextDate = new Date(date)

      if (viewMode === 'month') {
        nextDate.setMonth(nextDate.getMonth() + 1)
      } else {
        nextDate.setDate(nextDate.getDate() + (viewMode === 'week' ? 7 : 1))
      }

      return nextDate
    })
  }

  return (
    <div className="mx-auto grid max-w-[1600px] gap-4 sm:gap-6">
      <CalendarHeader
        currentDate={currentDate}
        onNext={handleNext}
        onPrev={handlePrev}
        onToday={handleToday}
      />

      <CalendarToolbar
        filters={filters}
        onFilterChange={handleFilterChange}
        onSearchChange={setSearchValue}
        onViewModeChange={setViewMode}
        searchValue={searchValue}
        viewMode={viewMode}
      />

      <div className="transition-all duration-300">
        {viewMode === 'month' && (
          <CalendarMonthView
            currentDate={currentDate}
            meetings={filteredMeetings}
            onEventClick={setSelectedMeeting}
          />
        )}
        {viewMode === 'week' && (
          <CalendarWeekView
            currentDate={currentDate}
            meetings={filteredMeetings}
            onEventClick={setSelectedMeeting}
          />
        )}
        {viewMode === 'day' && (
          <CalendarDayView
            currentDate={currentDate}
            meetings={filteredMeetings}
            onEventClick={setSelectedMeeting}
          />
        )}
      </div>

      <CalendarEventModal meeting={selectedMeeting} onClose={() => setSelectedMeeting(null)} />
    </div>
  )
}

export default MeetingSchedulePage
