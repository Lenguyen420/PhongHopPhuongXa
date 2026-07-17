import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CalendarDayView from '@/components/MeetingSchedulePage/CalendarDayView'
import CalendarEventModal from '@/components/MeetingSchedulePage/CalendarEventModal'
import CalendarHeader from '@/components/MeetingSchedulePage/CalendarHeader'
import CalendarMonthView from '@/components/MeetingSchedulePage/CalendarMonthView'
import CalendarToolbar from '@/components/MeetingSchedulePage/CalendarToolbar'
import CalendarWeekView from '@/components/MeetingSchedulePage/CalendarWeekView'
import { getCalendarRange } from '@/components/MeetingSchedulePage/calendarRange'
import {
  useCalendarQuery,
  useFormOptionsQuery,
  useLazyMeetingQuery,
  useUpdateMeetingStatusMutation,
} from '@/services/meetingApi'

const initialFilters = {
  host: '',
  room: '',
  status: '',
  type: '',
}

function MeetingSchedulePage() {
  const [currentDate, setCurrentDate] = useState(() => new Date())
  const [viewMode, setViewMode] = useState('month')
  const [filters, setFilters] = useState(initialFilters)
  const [searchValue, setSearchValue] = useState('')
  const [selectedMeeting, setSelectedMeeting] = useState(null)
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const navigate = useNavigate()
  const [loadMeeting] = useLazyMeetingQuery()
  const [cancelMeeting] = useUpdateMeetingStatusMutation()
  const { data: options } = useFormOptionsQuery()

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchValue.trim()), 300)
    return () => clearTimeout(timer)
  }, [searchValue])

  const range = useMemo(() => getCalendarRange(currentDate, viewMode), [currentDate, viewMode])
  const query = {
    ...range,
    keyword: debouncedSearch || undefined,
    roomId: filters.room || undefined,
    hostId: filters.host || undefined,
    typeId: filters.type || undefined,
    status: filters.status || undefined,
  }
  const { data: calendarMeetings = [], isLoading, isError, refetch } = useCalendarQuery(query)

  const filteredMeetings = calendarMeetings

  const handleFilterChange = (name, value) => {
    setFilters((currentFilters) => ({
      ...currentFilters,
      [name]: value,
    }))
  }

  const handleToday = () => {
    setCurrentDate(new Date())
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

  const lastScrollTime = useRef(0)

  const handleWheel = (e) => {
    const now = Date.now()
    if (now - lastScrollTime.current < 600) return

    const threshold = 40
    const dx = e.deltaX
    const dy = e.deltaY

    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > threshold) {
      if (dx > 0) {
        handleNext()
      } else {
        handlePrev()
      }
      lastScrollTime.current = now
      return
    }

    if (Math.abs(dy) > threshold) {
      if (viewMode === 'month') {
        if (dy > 0) {
          handleNext()
        } else {
          handlePrev()
        }
        lastScrollTime.current = now
      } else {
        let isAtBoundary = true
        let current = e.target

        while (current && current !== e.currentTarget) {
          const style = window.getComputedStyle(current)
          const overflowY = style.overflowY

          if (overflowY === 'auto' || overflowY === 'scroll') {
            const isScrollable = current.scrollHeight > current.clientHeight
            if (isScrollable) {
              const atTop = current.scrollTop <= 2 && dy < 0
              const atBottom = current.scrollTop + current.clientHeight >= current.scrollHeight - 2 && dy > 0
              if (!atTop && !atBottom) {
                isAtBoundary = false
              }
            }
            break
          }
          current = current.parentElement
        }

        if (isAtBoundary) {
          if (dy > 0) {
            handleNext()
          } else {
            handlePrev()
          }
          lastScrollTime.current = now
        }
      }
    }
  }

  return (
    <div className="mx-auto w-full lg:h-[calc(100svh-48px)] lg:max-h-[calc(100svh-48px)] lg:flex lg:flex-col gap-4 sm:gap-6 lg:overflow-hidden max-w-[1600px]">
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
        rooms={(options?.rooms ?? []).map((item) => ({ id: item.id, label: item.name }))}
        hosts={(options?.hosts ?? []).map((item) => ({ id: item.id, label: item.username }))}
        types={(options?.types ?? []).map((item) => ({ id: item.id, label: item.name }))}
        statuses={[
          { id: 'SCHEDULED', label: 'Chưa bắt đầu' },
          { id: 'IN_PROGRESS', label: 'Đang diễn ra' },
          { id: 'COMPLETED', label: 'Đã kết thúc' },
          { id: 'CANCELLED', label: 'Đã huỷ' },
        ]}
      />

      <div className="transition-all duration-300 flex-1 min-h-0 lg:overflow-hidden" onWheel={handleWheel}>
        {isLoading && (
          <p className="rounded-[20px] bg-white p-6 text-center font-semibold text-slate-500">
            Đang tải lịch họp...
          </p>
        )}
        {isError && (
          <p className="rounded-[20px] bg-red-50 p-6 text-center font-semibold text-red-600">
            Không thể tải lịch. <button onClick={refetch}>Thử lại</button>
          </p>
        )}
        {viewMode === 'month' && (
          <CalendarMonthView
            currentDate={currentDate}
            meetings={filteredMeetings}
            onEventClick={async (meeting) =>
              setSelectedMeeting(await loadMeeting(meeting.id).unwrap())
            }
          />
        )}
        {viewMode === 'week' && (
          <CalendarWeekView
            currentDate={currentDate}
            meetings={filteredMeetings}
            onEventClick={async (meeting) =>
              setSelectedMeeting(await loadMeeting(meeting.id).unwrap())
            }
          />
        )}
        {viewMode === 'day' && (
          <CalendarDayView
            currentDate={currentDate}
            meetings={filteredMeetings}
            onEventClick={async (meeting) =>
              setSelectedMeeting(await loadMeeting(meeting.id).unwrap())
            }
          />
        )}
      </div>

      <CalendarEventModal
        meeting={selectedMeeting}
        onClose={() => setSelectedMeeting(null)}
        onEdit={(meeting) => navigate(`/cuoc-hop?id=${meeting.id}`)}
        onCancel={async (meeting) => {
          const reason = window.prompt('Lý do huỷ cuộc họp?')
          if (!reason) return
          await cancelMeeting({ id: meeting.id, status: 'CANCELLED', reason }).unwrap()
          setSelectedMeeting(null)
        }}
      />
    </div>
  )
}

export default MeetingSchedulePage
