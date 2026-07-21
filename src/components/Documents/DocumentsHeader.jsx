import { Download, FolderPlus, RefreshCw, Search, Upload } from 'lucide-react'
import AppSelect from '@/components/ui/AppSelect'

function DocumentsHeader({
  filters,
  onCreateFolder,
  onFilterChange,
  onRefresh,
  onUpload,
  searchValue,
  setSearchValue,
  types,
  uploaders,
}) {
  return (
    <header className="grid gap-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#2563EB] sm:text-sm">
            Tài liệu cuộc họp
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 min-[420px]:text-3xl sm:text-4xl">
            Quản lý tài liệu cuộc họp
          </h1>
          <p className="mt-2 text-sm font-medium text-slate-500 sm:text-base">
            Cuộc họp: Họp giao ban UBND xã tháng 07/2026
          </p>
        </div>

        <div className="grid grid-cols-1 gap-2 min-[420px]:grid-cols-3 lg:flex">
          <button
            className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-[#2563EB] px-4 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700"
            onClick={onUpload}
            type="button"
          >
            <Upload size={17} />
            Upload tài liệu
          </button>
          <button
            className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-gray-300 bg-white px-4 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50"
            onClick={onCreateFolder}
            type="button"
          >
            <FolderPlus size={17} />
            Tạo thư mục
          </button>
          <button
            className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-gray-300 bg-white px-4 text-sm font-bold text-[#2563EB] shadow-sm transition hover:bg-blue-50"
            type="button"
          >
            <Download size={17} />
            Download tất cả
          </button>
        </div>
      </div>

      <section className="grid gap-3 rounded-2xl border border-gray-300 bg-white p-4 shadow-sm sm:p-5 xl:grid-cols-[minmax(240px,1.4fr)_repeat(3,minmax(170px,1fr))]">
        <label className="grid gap-1.5">
          <span className="text-xs font-bold uppercase tracking-wide text-slate-500">Tìm kiếm</span>
          <span className="flex h-11 items-center gap-2 rounded-2xl border border-gray-300 bg-white px-3 transition focus-within:border-[#2563EB] focus-within:ring-4 focus-within:ring-blue-100">
            <Search size={18} className="shrink-0 text-slate-400" />
            <input
              className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-slate-700 outline-none placeholder:text-slate-400"
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder="Tìm theo tên tài liệu..."
              value={searchValue}
            />
          </span>
        </label>

        <FilterSelect
          label="Loại tài liệu"
          name="type"
          onChange={onFilterChange}
          options={types}
          value={filters.type}
        />
        <FilterSelect
          label="Người tải lên"
          name="uploader"
          onChange={onFilterChange}
          options={uploaders}
          value={filters.uploader}
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
    <label className="grid gap-1.5">
      <span className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</span>
      <AppSelect
        onChange={(event) => onChange(name, event.target.value)}
        options={[{ label: 'Tất cả', value: '' }, ...options]}
        value={value}
      />
    </label>
  )
}

export default DocumentsHeader
