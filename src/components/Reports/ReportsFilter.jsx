import { CalendarDays, RotateCcw, Search } from 'lucide-react'
import AppSelect from '@/components/ui/AppSelect'

const periodOptions = [
  { label: 'Ngày', value: 'day' },
  { label: 'Tuần', value: 'week' },
  { label: 'Tháng', value: 'month' },
  { label: 'Năm', value: 'year' },
]

function ReportsFilter({ filters, hosts, onApply, onChange, onReset, rooms, units }) {
  return (
    <section className="grid min-w-0 gap-4 rounded-2xl border border-gray-300 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex min-w-0 flex-col gap-3 xl:flex-row xl:items-end">
        <div className="grid min-w-0 gap-1.5 xl:w-56">
          <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-500">
            <CalendarDays size={14} />
            Chọn khoảng thời gian
          </span>
          <AppSelect
            aria-label="Chọn khoảng thời gian"
            onChange={(event) => onChange('period', event.target.value)}
            options={periodOptions}
            value={filters.period}
          />
        </div>

        <FilterSelect
          label="Phòng họp"
          name="room"
          onChange={onChange}
          options={rooms}
          value={filters.room}
        />
        <FilterSelect
          label="Đơn vị"
          name="unit"
          onChange={onChange}
          options={units}
          value={filters.unit}
        />
        <FilterSelect
          label="Người chủ trì"
          name="host"
          onChange={onChange}
          options={hosts}
          value={filters.host}
        />

        <div className="grid grid-cols-1 gap-2 min-[420px]:grid-cols-2 xl:w-auto">
          <button
            className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-[#2563EB] px-5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700"
            onClick={onApply}
            type="button"
          >
            <Search size={17} />
            Áp dụng
          </button>
          <button
            className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-gray-300 bg-slate-50 px-5 text-sm font-bold text-slate-700 transition hover:bg-white hover:text-[#2563EB]"
            onClick={onReset}
            type="button"
          >
            <RotateCcw size={17} />
            Đặt lại
          </button>
        </div>
      </div>
    </section>
  )
}

function FilterSelect({ label, name, onChange, options, value }) {
  return (
    <div className="grid min-w-0 flex-1 gap-1.5">
      <span className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</span>
      <AppSelect
        aria-label={label}
        onChange={(event) => onChange(name, event.target.value)}
        options={options}
        value={value}
      />
    </div>
  )
}

export default ReportsFilter
