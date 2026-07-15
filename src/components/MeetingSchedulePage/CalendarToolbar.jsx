import { CalendarDays, CalendarRange, CalendarSearch, Search } from 'lucide-react'
import { meetingHosts, meetingRooms, meetingStatuses, meetingTypes } from '@/datas/calendarData'
import CalendarFilter from './CalendarFilter'
import CalendarLegend from './CalendarLegend'

const viewOptions = [
  { value: 'month', label: 'Theo tháng', icon: CalendarDays },
  { value: 'week', label: 'Theo tuần', icon: CalendarRange },
  { value: 'day', label: 'Theo ngày', icon: CalendarSearch },
]

function CalendarToolbar({
  filters,
  onFilterChange,
  onSearchChange,
  searchValue,
  viewMode,
  onViewModeChange,
}) {
  return (
    <section className="grid gap-4 rounded-[20px] bg-white p-4 shadow-sm ring-1 ring-slate-200/70 sm:p-5">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div className="grid flex-1 gap-3 md:grid-cols-2 xl:grid-cols-[minmax(220px,1.2fr)_repeat(4,minmax(150px,1fr))]">
          <label className="grid gap-1.5">
            <span className="text-xs font-bold text-slate-500">Tìm kiếm cuộc họp</span>
            <span className="flex h-11 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 transition focus-within:border-[#2563EB] focus-within:ring-4 focus-within:ring-blue-100">
              <Search size={18} className="shrink-0 text-slate-400" />
              <input
                className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-slate-700 outline-none placeholder:text-slate-400"
                onChange={(event) => onSearchChange(event.target.value)}
                placeholder="Nhập tên cuộc họp..."
                value={searchValue}
              />
            </span>
          </label>

          <CalendarFilter
            label="Phòng họp"
            name="room"
            onChange={onFilterChange}
            options={meetingRooms}
            value={filters.room}
          />
          <CalendarFilter
            label="Người chủ trì"
            name="host"
            onChange={onFilterChange}
            options={meetingHosts}
            value={filters.host}
          />
          <CalendarFilter
            label="Loại cuộc họp"
            name="type"
            onChange={onFilterChange}
            options={meetingTypes}
            value={filters.type}
          />
          <CalendarFilter
            label="Trạng thái"
            name="status"
            onChange={onFilterChange}
            options={meetingStatuses}
            value={filters.status}
          />
        </div>

        <div className="flex rounded-2xl bg-slate-100 p-1">
          {viewOptions.map(({ value, label, icon: Icon }) => (
            <button
              className={`inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-xl px-3 text-xs font-bold transition sm:flex-none sm:text-sm ${
                viewMode === value
                  ? 'bg-[#2563EB] text-white shadow-sm'
                  : 'text-slate-600 hover:bg-white hover:text-slate-950'
              }`}
              key={value}
              onClick={() => onViewModeChange(value)}
              type="button"
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>
      </div>

      <CalendarLegend />
    </section>
  )
}

export default CalendarToolbar
