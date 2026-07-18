import { CheckCircle2, Download, FileText, Save, SquareCheckBig } from 'lucide-react'

function MinutesHeader({ autoSaveStatus, meeting, onExport, onSave }) {
  const actions = [
    { label: 'Lưu ngay', icon: Save, className: 'border border-gray-300 bg-white text-slate-700 hover:bg-slate-50', onClick: onSave },
    { label: 'Xuất Word', icon: FileText, className: 'border border-gray-300 bg-white text-[#2563EB] hover:bg-blue-50', onClick: () => onExport('word') },
    { label: 'Xuất PDF', icon: Download, className: 'border border-gray-300 bg-white text-red-600 hover:bg-red-50', onClick: () => onExport('pdf') },
    { label: 'Kết thúc cuộc họp', icon: SquareCheckBig, className: 'bg-[#2563EB] text-white hover:bg-blue-700', onClick: undefined },
  ]

  return (
    <header className="grid min-w-0 gap-4">
      <div className="flex min-w-0 flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#2563EB] sm:text-sm">Biên bản điện tử</p>
          <h1 className="mt-2 break-words text-2xl font-bold tracking-tight text-slate-950 min-[420px]:text-3xl sm:text-4xl">Biên bản cuộc họp</h1>
          <div className="mt-4 grid min-w-0 gap-3 rounded-2xl border border-gray-300 bg-white p-3 shadow-sm min-[520px]:grid-cols-2 sm:p-4 xl:grid-cols-3 2xl:grid-cols-5">
            <MeetingMeta label="Tên cuộc họp" value={meeting.title} wide />
            <MeetingMeta label="Thời gian" value={meeting.time} />
            <MeetingMeta label="Phòng họp" value={meeting.room} />
            <MeetingMeta label="Chủ trì" value={meeting.chairperson} />
            <MeetingMeta label="Thư ký" value={meeting.secretary} />
          </div>
        </div>

        <div className="grid w-full min-w-0 grid-cols-1 gap-2 min-[360px]:grid-cols-2 sm:grid-cols-4 lg:w-auto lg:max-w-[620px]">
          {actions.map(({ label, icon: Icon, className, onClick }) => (
            <button className={`inline-flex h-11 min-w-0 items-center justify-center gap-2 rounded-2xl px-3 text-sm font-bold shadow-sm transition sm:px-4 ${className}`} key={label} onClick={onClick} type="button">
              <Icon className="shrink-0" size={17} />
              <span className="min-w-0 truncate">{label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className={`inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-gray-300 bg-white px-4 py-2 text-sm font-bold shadow-sm sm:w-fit ${autoSaveStatus.isSaving ? 'text-amber-600' : 'text-emerald-700'}`}>
        <CheckCircle2 className="shrink-0" size={17} />
        {autoSaveStatus.isSaving ? 'Đang lưu...' : `Đã tự động lưu lúc ${autoSaveStatus.savedAt}`}
      </div>
    </header>
  )
}

function MeetingMeta({ label, value, wide = false }) {
  return (
    <div className={`min-w-0 ${wide ? 'min-[520px]:col-span-2 xl:col-span-1' : ''}`}>
      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 line-clamp-2 break-words text-sm font-bold leading-5 text-slate-800">{value}</p>
    </div>
  )
}

export default MinutesHeader
