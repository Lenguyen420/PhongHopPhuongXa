import { CalendarDays, CalendarRange, CalendarSearch, Search } from 'lucide-react'
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
  hosts = [],
  rooms = [],
  statuses = [],
  types = [],
}) {
  return (
    <section className="flex flex-col gap-2.5 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-200/70">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 flex-1 min-w-0">
          <span className="flex h-9 items-center gap-2 rounded-xl border border-slate-200 bg-white px-2.5 transition focus-within:border-[#2563EB] focus-within:ring-4 focus-within:ring-blue-50 w-full min-w-[180px] sm:w-auto sm:flex-1 sm:max-w-xs">
            <Search size={14} className="shrink-0 text-slate-400" />
            <input
              className="min-w-0 flex-1 bg-transparent text-xs font-semibold text-slate-700 outline-none placeholder:text-slate-400"
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Tìm kiếm cuộc họp..."
              value={searchValue}
            />
          </span>

          <CalendarFilter
            label="Phòng"
            name="room"
            onChange={onFilterChange}
            options={rooms}
            value={filters.room}
          />
          <CalendarFilter
            label="Chủ trì"
            name="host"
            onChange={onFilterChange}
            options={hosts}
            value={filters.host}
          />
          <CalendarFilter
            label="Loại họp"
            name="type"
            onChange={onFilterChange}
            options={types}
            value={filters.type}
          />
          <CalendarFilter
            label="Trạng thái"
            name="status"
            onChange={onFilterChange}
            options={statuses}
            value={filters.status}
          />
        </div>

        {/* View Mode */}
        <div className="flex rounded-xl bg-slate-100 p-0.5 shrink-0 self-end lg:self-auto">
          {viewOptions.map(({ value, label, icon: Icon }) => (
            <button
              className={`inline-flex h-8 items-center justify-center gap-1.5 rounded-lg px-2.5 text-xs font-bold transition ${
                viewMode === value
                  ? 'bg-[#2563EB] text-white shadow-sm'
                  : 'text-slate-600 hover:bg-white hover:text-slate-950'
              }`}
              key={value}
              onClick={() => onViewModeChange(value)}
              type="button"
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-slate-100 pt-2">
        <CalendarLegend types={types} />
      </div>
    </section>
  )
}

export default CalendarToolbar
