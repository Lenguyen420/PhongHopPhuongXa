import { Check, Download, FileText, X } from 'lucide-react'

const exportOptions = [
  'Bao gồm danh sách đại biểu',
  'Bao gồm nhiệm vụ',
  'Bao gồm phụ lục',
  'Bao gồm chữ ký',
]

function ExportModal({ mode, onClose }) {
  if (!mode) {
    return null
  }

  const cards = [
    { type: 'word', title: 'Xuất Word', fileName: 'Biên bản cuộc họp.docx', button: 'Xuất Word', icon: FileText, color: 'text-[#2563EB] bg-blue-50' },
    { type: 'pdf', title: 'Xuất PDF', fileName: 'Biên bản cuộc họp.pdf', button: 'Xuất PDF', icon: Download, color: 'text-red-600 bg-red-50' },
  ]

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/45 p-3 backdrop-blur-sm sm:p-4">
      <section className="max-h-[calc(100vh-24px)] w-full max-w-3xl overflow-y-auto rounded-2xl border border-gray-300 bg-white shadow-2xl sm:max-h-[calc(100vh-32px)]">
        <div className="flex min-w-0 items-start justify-between gap-3 border-b border-gray-300 px-4 py-4 sm:px-5">
          <div className="min-w-0">
            <h2 className="break-words text-lg font-bold text-slate-950">Xuất biên bản cuộc họp</h2>
            <p className="mt-1 break-words text-sm font-medium text-slate-500">Chọn định dạng và thành phần cần đưa vào file xuất.</p>
          </div>
          <button aria-label="Đóng" className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-950" onClick={onClose} type="button">
            <X size={20} />
          </button>
        </div>

        <div className="grid gap-4 p-4 md:grid-cols-2 sm:p-5">
          {cards.map(({ type, title, fileName, button, icon: Icon, color }) => (
            <article className={`min-w-0 rounded-2xl border p-4 transition ${mode === type ? 'border-blue-200 bg-blue-50/40 shadow-sm' : 'border-gray-300 bg-white'}`} key={type}>
              <span className={`grid h-12 w-12 place-items-center rounded-2xl ${color}`}>
                <Icon size={24} />
              </span>
              <h3 className="mt-4 text-base font-bold text-slate-950">{title}</h3>
              <p className="mt-1 break-words rounded-2xl border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-slate-600">{fileName}</p>
              <button className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-[#2563EB] px-4 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700" onClick={onClose} type="button">
                <Icon className="shrink-0" size={17} />
                {button}
              </button>
            </article>
          ))}
        </div>

        <div className="border-t border-gray-300 bg-slate-50 px-4 py-4 sm:px-5">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Tùy chọn xuất file</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {exportOptions.map((option) => (
              <label className="flex min-w-0 items-center gap-3 rounded-2xl border border-gray-300 bg-white px-3 py-3 text-sm font-bold text-slate-700" key={option}>
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-md bg-[#2563EB] text-white">
                  <Check size={14} />
                </span>
                <input className="sr-only" defaultChecked type="checkbox" />
                <span className="min-w-0 break-words">{option}</span>
              </label>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default ExportModal
