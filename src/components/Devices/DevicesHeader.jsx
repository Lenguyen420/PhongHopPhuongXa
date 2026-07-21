import {
  Download,
  FileSpreadsheet,
  Plus,
  RefreshCw,
  Search,
  Wrench,
  XCircle,
  Activity,
  Package,
} from 'lucide-react'
import AppSelect from '@/components/ui/AppSelect'

const statIcons = {
  total: Package,
  active: Activity,
  maintenance: Wrench,
  broken: XCircle,
}

function DevicesHeader({
  categories,
  filters,
  onAddDevice,
  onFilterChange,
  onRefresh,
  searchValue,
  setSearchValue,
  stats,
  statuses,
}) {
  const statCards = [
    {
      key: 'total',
      label: 'Tổng số thiết bị',
      value: stats.total,
      color: 'bg-blue-50 text-[#2563EB]',
    },
    {
      key: 'active',
      label: 'Thiết bị đang hoạt động',
      value: stats.active,
      color: 'bg-emerald-50 text-emerald-700',
    },
    {
      key: 'maintenance',
      label: 'Thiết bị đang bảo trì',
      value: stats.maintenance,
      color: 'bg-amber-50 text-amber-700',
    },
    { key: 'broken', label: 'Thiết bị hỏng', value: stats.broken, color: 'bg-red-50 text-red-600' },
  ]

  return (
    <header className="grid min-w-0 gap-4">
      <div className="flex min-w-0 flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#2563EB] sm:text-sm">
            Danh mục dùng chung
          </p>
          <h1 className="mt-2 break-words text-2xl font-bold tracking-tight text-slate-950 min-[420px]:text-3xl sm:text-4xl">
            Quản lý thiết bị phòng họp
          </h1>
          <div className="mt-4 grid min-w-0 gap-3 min-[520px]:grid-cols-2 xl:grid-cols-4">
            {statCards.map(({ key, label, value, color }) => {
              const Icon = statIcons[key]
              return (
                <article
                  className="flex min-w-0 items-center gap-3 rounded-2xl border border-gray-300 bg-white p-4 shadow-sm"
                  key={key}
                >
                  <span
                    className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl ${color}`}
                  >
                    <Icon size={21} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-2xl font-bold text-slate-950">{value}</p>
                    <p className="truncate text-xs font-bold uppercase tracking-wide text-slate-500">
                      {label}
                    </p>
                  </div>
                </article>
              )
            })}
          </div>
        </div>

        <div className="grid w-full min-w-0 grid-cols-1 gap-2 min-[420px]:grid-cols-3 xl:w-auto">
          <button
            className="inline-flex h-11 min-w-0 items-center justify-center gap-2 rounded-2xl bg-[#2563EB] px-4 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700"
            onClick={onAddDevice}
            type="button"
          >
            <Plus className="shrink-0" size={17} />
            <span className="truncate">Thêm thiết bị</span>
          </button>
          <button
            className="inline-flex h-11 min-w-0 items-center justify-center gap-2 rounded-2xl border border-gray-300 bg-white px-4 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50"
            type="button"
          >
            <FileSpreadsheet className="shrink-0" size={17} />
            <span className="truncate">Import Excel</span>
          </button>
          <button
            className="inline-flex h-11 min-w-0 items-center justify-center gap-2 rounded-2xl border border-gray-300 bg-white px-4 text-sm font-bold text-[#2563EB] shadow-sm transition hover:bg-blue-50"
            type="button"
          >
            <Download className="shrink-0" size={17} />
            <span className="truncate">Export Excel</span>
          </button>
        </div>
      </div>

      <section className="grid min-w-0 gap-3 rounded-2xl border border-gray-300 bg-white p-4 shadow-sm sm:p-5 xl:grid-cols-[minmax(240px,1.4fr)_minmax(170px,1fr)_minmax(170px,1fr)_auto]">
        <label className="grid min-w-0 gap-1.5">
          <span className="text-xs font-bold uppercase tracking-wide text-slate-500">Tìm kiếm</span>
          <span className="flex h-11 min-w-0 items-center gap-2 rounded-2xl border border-gray-300 bg-white px-3 transition focus-within:border-[#2563EB] focus-within:ring-4 focus-within:ring-blue-100">
            <Search className="shrink-0 text-slate-400" size={18} />
            <input
              className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-slate-700 outline-none placeholder:text-slate-400"
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder="Tìm theo tên thiết bị..."
              value={searchValue}
            />
          </span>
        </label>
        <FilterSelect
          label="Loại thiết bị"
          name="category"
          onChange={onFilterChange}
          options={categories}
          value={filters.category}
        />
        <FilterSelect
          label="Trạng thái"
          name="status"
          onChange={onFilterChange}
          options={statuses}
          value={filters.status}
        />
        <div className="grid content-end">
          <button
            className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-gray-300 bg-slate-50 px-4 text-sm font-bold text-slate-700 transition hover:bg-white hover:text-[#2563EB]"
            onClick={onRefresh}
            type="button"
          >
            <RefreshCw size={17} />
            Làm mới
          </button>
        </div>
      </section>
    </header>
  )
}

function FilterSelect({ label, name, onChange, options, value }) {
  return (
    <label className="grid min-w-0 gap-1.5">
      <span className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</span>
      <AppSelect
        onChange={(event) => onChange(name, event.target.value)}
        options={[{ label: 'Tất cả', value: '' }, ...options]}
        value={value}
      />
    </label>
  )
}

export default DevicesHeader
