import { useState } from 'react'
import {
  Download,
  Edit3,
  Eye,
  File,
  FileImage,
  FileSpreadsheet,
  FileText,
  FileVideo,
  History,
  MoreVertical,
  Presentation,
  Share2,
  Trash2,
  Upload,
} from 'lucide-react'

const typeIconMap = {
  PDF: FileText,
  DOCX: FileText,
  XLSX: FileSpreadsheet,
  PPTX: Presentation,
  MP4: FileVideo,
  JPG: FileImage,
  PNG: FileImage,
  ZIP: File,
}

const typeColorMap = {
  PDF: 'bg-red-50 text-red-600',
  DOCX: 'bg-blue-50 text-blue-600',
  XLSX: 'bg-emerald-50 text-emerald-600',
  PPTX: 'bg-orange-50 text-orange-600',
  MP4: 'bg-violet-50 text-violet-600',
  JPG: 'bg-sky-50 text-sky-600',
  PNG: 'bg-sky-50 text-sky-600',
  ZIP: 'bg-slate-100 text-slate-600',
}

const menuActions = [
  { label: 'Xem', icon: Eye, action: 'detail' },
  { label: 'Download', icon: Download, action: 'download' },
  { label: 'Upload phiên bản mới', icon: Upload, action: 'version' },
  { label: 'Đổi tên', icon: Edit3, action: 'rename' },
  { label: 'Lịch sử phiên bản', icon: History, action: 'history' },
  { label: 'Chia sẻ', icon: Share2, action: 'share' },
  { label: 'Xóa', icon: Trash2, action: 'delete', danger: true },
]

function DocumentsContent({ documents, onAction, onOpenDetail, onOpenHistory, onUpload }) {
  const [openMenuId, setOpenMenuId] = useState(null)

  const handleAction = (action, document) => {
    setOpenMenuId(null)

    if (action === 'detail') {
      onOpenDetail(document)
    }

    if (action === 'history') {
      onOpenHistory(document)
    }

    if (!['detail', 'history'].includes(action)) onAction(action, document)
  }

  if (documents.length === 0) {
    return (
      <section className="grid min-h-[420px] place-items-center rounded-2xl border border-gray-300 bg-white p-6 text-center shadow-sm">
        <div className="max-w-md">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-blue-50 text-[#2563EB]">
            <Upload size={28} />
          </span>
          <h2 className="mt-4 text-xl font-bold text-slate-950">Chưa có tài liệu phù hợp</h2>
          <p className="mt-2 text-sm font-medium leading-6 text-slate-500">
            Thử đổi bộ lọc hoặc tải tài liệu mới cho cuộc họp để mọi người cùng theo dõi.
          </p>
          <button
            className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-[#2563EB] px-5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700"
            onClick={onUpload}
            type="button"
          >
            <Upload size={17} />
            Upload tài liệu
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className="grid gap-4">
      <div className="flex flex-col gap-2 rounded-2xl border border-gray-300 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-950">Kho tài liệu cuộc họp</h2>
          <p className="text-sm font-medium text-slate-500">
            Hiển thị {documents.length} tài liệu từ hệ thống
          </p>
        </div>
        <span className="inline-flex w-fit items-center rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
          Dữ liệu đồng bộ API
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {documents.map((document) => {
          const Icon = typeIconMap[document.type] || File
          const colorClass = typeColorMap[document.type] || 'bg-slate-100 text-slate-600'

          return (
            <article
              className="relative rounded-2xl border border-gray-300 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              key={document.id}
            >
              <div className="flex items-start justify-between gap-3">
                <span
                  className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${colorClass}`}
                >
                  <Icon size={24} />
                </span>
                <div className="relative">
                  <button
                    className="grid h-9 w-9 place-items-center rounded-2xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-950"
                    onClick={() => setOpenMenuId(openMenuId === document.id ? null : document.id)}
                    type="button"
                  >
                    <MoreVertical size={18} />
                  </button>
                  {openMenuId === document.id && (
                    <div className="absolute right-0 top-10 z-20 w-56 overflow-hidden rounded-2xl border border-gray-300 bg-white py-2 shadow-xl">
                      {menuActions.map(({ label, icon: ActionIcon, action, danger }) => (
                        <button
                          className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm font-semibold transition ${danger ? 'text-red-600 hover:bg-red-50' : 'text-slate-700 hover:bg-slate-50 hover:text-[#2563EB]'}`}
                          key={label}
                          onClick={() => handleAction(action, document)}
                          type="button"
                        >
                          <ActionIcon size={16} />
                          {label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <button
                className="mt-4 block w-full text-left"
                onClick={() => onOpenDetail(document)}
                type="button"
              >
                <h3 className="line-clamp-2 min-h-11 text-base font-bold leading-snug text-slate-950">
                  {document.name}
                </h3>
                <p className="mt-1 text-xs font-bold uppercase tracking-wide text-[#2563EB]">
                  {document.category}
                </p>
              </button>

              <div className="mt-4 grid gap-2 text-sm">
                <Meta label="Dung lượng" value={document.size} />
                <Meta label="Người tải lên" value={document.uploader} />
                <Meta label="Cập nhật" value={document.updatedAt} />
              </div>

              <div className="mt-4 flex items-center justify-between gap-3 border-t border-gray-300 pt-3">
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                  {document.type}
                </span>
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-[#2563EB]">
                  {document.version}
                </span>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}

function Meta({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-xs font-bold uppercase tracking-wide text-slate-400">{label}</span>
      <span className="min-w-0 truncate text-right font-semibold text-slate-700">{value}</span>
    </div>
  )
}

export default DocumentsContent
