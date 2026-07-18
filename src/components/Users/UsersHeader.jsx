import { Download, FileSpreadsheet, Plus, RefreshCw, Search, ShieldCheck, UserCheck, UserX, Users } from 'lucide-react'

const statIcons = {
  totalUsers: Users,
  activeUsers: UserCheck,
  lockedUsers: UserX,
  departments: ShieldCheck,
}

function UsersHeader({ departments, filters, onAddUser, onFilterChange, onRefresh, roles, searchValue, setSearchValue, stats, statuses }) {
  const statCards = [
    { key: 'totalUsers', label: 'Tổng số người dùng', value: stats.totalUsers, color: 'bg-blue-50 text-[#2563EB]' },
    { key: 'activeUsers', label: 'Người đang hoạt động', value: stats.activeUsers, color: 'bg-emerald-50 text-emerald-700' },
    { key: 'lockedUsers', label: 'Tài khoản bị khóa', value: stats.lockedUsers, color: 'bg-red-50 text-red-600' },
    { key: 'departments', label: 'Tổng số phòng ban', value: stats.departments, color: 'bg-violet-50 text-violet-700' },
  ]

  return (
    <header className="grid min-w-0 gap-4">
      <div className="flex min-w-0 flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#2563EB] sm:text-sm">Quản trị hệ thống</p>
          <h1 className="mt-2 break-words text-2xl font-bold tracking-tight text-slate-950 min-[420px]:text-3xl sm:text-4xl">Quản lý người dùng</h1>
          <div className="mt-4 grid min-w-0 gap-3 min-[520px]:grid-cols-2 xl:grid-cols-4">
            {statCards.map(({ key, label, value, color }) => {
              const Icon = statIcons[key]

              return (
                <article className="flex min-w-0 items-center gap-3 rounded-2xl border border-gray-300 bg-white p-4 shadow-sm" key={key}>
                  <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl ${color}`}>
                    <Icon size={21} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-2xl font-bold text-slate-950">{value}</p>
                    <p className="truncate text-xs font-bold uppercase tracking-wide text-slate-500">{label}</p>
                  </div>
                </article>
              )
            })}
          </div>
        </div>

        <div className="grid w-full min-w-0 grid-cols-1 gap-2 min-[420px]:grid-cols-3 xl:w-auto">
          <button className="inline-flex h-11 min-w-0 items-center justify-center gap-2 rounded-2xl bg-[#2563EB] px-4 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700" onClick={onAddUser} type="button">
            <Plus className="shrink-0" size={17} />
            <span className="truncate">Thêm người dùng</span>
          </button>
          <button className="inline-flex h-11 min-w-0 items-center justify-center gap-2 rounded-2xl border border-gray-300 bg-white px-4 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50" type="button">
            <FileSpreadsheet className="shrink-0" size={17} />
            <span className="truncate">Nhập từ Excel</span>
          </button>
          <button className="inline-flex h-11 min-w-0 items-center justify-center gap-2 rounded-2xl border border-gray-300 bg-white px-4 text-sm font-bold text-[#2563EB] shadow-sm transition hover:bg-blue-50" type="button">
            <Download className="shrink-0" size={17} />
            <span className="truncate">Xuất danh sách</span>
          </button>
        </div>
      </div>

      <section className="grid min-w-0 gap-3 rounded-2xl border border-gray-300 bg-white p-4 shadow-sm sm:p-5 xl:grid-cols-[minmax(240px,1.4fr)_repeat(3,minmax(160px,1fr))_auto]">
        <label className="grid min-w-0 gap-1.5">
          <span className="text-xs font-bold uppercase tracking-wide text-slate-500">Tìm kiếm</span>
          <span className="flex h-11 min-w-0 items-center gap-2 rounded-2xl border border-gray-300 bg-white px-3 transition focus-within:border-[#2563EB] focus-within:ring-4 focus-within:ring-blue-100">
            <Search className="shrink-0 text-slate-400" size={18} />
            <input className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-slate-700 outline-none placeholder:text-slate-400" onChange={(event) => setSearchValue(event.target.value)} placeholder="Tìm theo tên hoặc email..." value={searchValue} />
          </span>
        </label>

        <FilterSelect label="Phòng ban" name="department" onChange={onFilterChange} options={departments} value={filters.department} />
        <FilterSelect label="Vai trò" name="role" onChange={onFilterChange} options={roles.filter((role) => role !== 'Tất cả người dùng')} value={filters.role} />
        <FilterSelect label="Trạng thái" name="status" onChange={onFilterChange} options={statuses} value={filters.status} />

        <div className="grid content-end">
          <button className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-gray-300 bg-slate-50 px-4 text-sm font-bold text-slate-700 transition hover:bg-white hover:text-[#2563EB]" onClick={onRefresh} type="button">
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
      <select className="h-11 min-w-0 rounded-2xl border border-gray-300 bg-white px-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-[#2563EB] focus:ring-4 focus:ring-blue-100" onChange={(event) => onChange(name, event.target.value)} value={value}>
        <option value="">Tất cả</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  )
}

export default UsersHeader
