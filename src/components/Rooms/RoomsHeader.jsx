import { Plus, RefreshCw } from 'lucide-react'

function RoomsHeader({ onCreateRoom, onRefresh }) {
  return (
    <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#2563EB] sm:text-sm">
          Quản trị tài nguyên
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 min-[420px]:text-3xl sm:text-4xl">
          Quản lý phòng họp
        </h1>
        <p className="mt-2 text-sm font-medium text-slate-500 sm:text-base">
          Quản lý thông tin, thiết bị và trạng thái sử dụng các phòng họp.
        </p>
      </div>

      <div className="grid gap-2 min-[420px]:grid-cols-2 lg:flex">
        <button
          className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-[#2563EB] px-4 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700"
          onClick={onCreateRoom}
          type="button"
        >
          <Plus size={17} />
          Thêm phòng
        </button>
        <button
          className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-white px-4 text-sm font-bold text-slate-700 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50"
          onClick={onRefresh}
          type="button"
        >
          <RefreshCw size={17} />
          Làm mới
        </button>
      </div>
    </header>
  )
}

export default RoomsHeader
