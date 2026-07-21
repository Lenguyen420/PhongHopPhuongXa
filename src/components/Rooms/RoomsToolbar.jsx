import { Grid3X3, List, Search } from 'lucide-react'
import AppSelect from '@/components/ui/AppSelect'

function RoomsToolbar({
  capacityOptions,
  filters,
  onFilterChange,
  onSearchChange,
  onViewModeChange,
  statusOptions,
  viewMode,
}) {
  return (
    <section className="grid gap-4 rounded-[20px] bg-white p-4 shadow-sm ring-1 ring-slate-200/70 sm:p-5 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-end">
      <div className="grid gap-3 md:grid-cols-3">
        <label className="grid gap-1.5 md:col-span-1">
          <span className="text-xs font-bold text-slate-500">Tìm kiếm theo tên phòng</span>
          <span className="flex h-11 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 transition focus-within:border-[#2563EB] focus-within:ring-4 focus-within:ring-blue-100">
            <Search size={18} className="shrink-0 text-slate-400" />
            <input
              className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-slate-700 outline-none placeholder:text-slate-400"
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Nhập tên phòng..."
              value={filters.search}
            />
          </span>
        </label>

        <div className="grid gap-1.5">
          <span className="text-xs font-bold text-slate-500">Trạng thái</span>
          <AppSelect
            aria-label="Trạng thái phòng"
            onChange={(event) => onFilterChange('status', event.target.value)}
            options={statusOptions}
            value={filters.status}
          />
        </div>

        <div className="grid gap-1.5">
          <span className="text-xs font-bold text-slate-500">Sức chứa</span>
          <AppSelect
            aria-label="Sức chứa phòng"
            onChange={(event) => onFilterChange('capacity', event.target.value)}
            options={capacityOptions}
            value={filters.capacity}
          />
        </div>
      </div>

      <div className="flex rounded-2xl bg-slate-100 p-1">
        {[
          { label: 'Grid', value: 'grid', icon: Grid3X3 },
          { label: 'Table', value: 'table', icon: List },
        ].map(({ icon: Icon, label, value }) => (
          <button
            className={`inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-xl px-4 text-sm font-bold transition sm:flex-none ${
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
    </section>
  )
}

export default RoomsToolbar
