import { Download, FileText, RefreshCw } from 'lucide-react'

function ReportsHeader({ lastUpdatedAt, onExportExcel, onExportPdf, onRefresh }) {
  return (
    <header className="flex min-w-0 flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#2563EB] sm:text-sm">Dashboard điều hành</p>
        <h1 className="mt-2 break-words text-2xl font-bold tracking-tight text-slate-950 min-[420px]:text-3xl sm:text-4xl">Báo cáo & Thống kê</h1>
        <p className="mt-2 max-w-4xl text-sm font-medium leading-6 text-slate-500 sm:text-base">Theo dõi tình hình tổ chức cuộc họp, tỷ lệ tham gia, hiệu suất sử dụng phòng họp và thống kê theo thời gian.</p>
        <p className="mt-2 text-xs font-bold uppercase tracking-wide text-slate-400">Cập nhật lần cuối: {lastUpdatedAt}</p>
      </div>

      <div className="grid w-full min-w-0 grid-cols-1 gap-2 min-[420px]:grid-cols-3 xl:w-auto">
        <button className="inline-flex h-11 min-w-0 items-center justify-center gap-2 rounded-2xl border border-gray-300 bg-white px-4 text-sm font-bold text-[#2563EB] shadow-sm transition hover:bg-blue-50" onClick={onExportExcel} type="button">
          <Download className="shrink-0" size={17} />
          <span className="truncate">Xuất Excel</span>
        </button>
        <button className="inline-flex h-11 min-w-0 items-center justify-center gap-2 rounded-2xl border border-gray-300 bg-white px-4 text-sm font-bold text-red-600 shadow-sm transition hover:bg-red-50" onClick={onExportPdf} type="button">
          <FileText className="shrink-0" size={17} />
          <span className="truncate">Xuất PDF</span>
        </button>
        <button className="inline-flex h-11 min-w-0 items-center justify-center gap-2 rounded-2xl bg-[#2563EB] px-4 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700" onClick={onRefresh} type="button">
          <RefreshCw className="shrink-0" size={17} />
          <span className="truncate">Làm mới dữ liệu</span>
        </button>
      </div>
    </header>
  )
}

export default ReportsHeader
