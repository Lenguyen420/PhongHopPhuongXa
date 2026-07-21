import { useRef, useState } from 'react'
import {
  Download,
  File,
  FileImage,
  FileSpreadsheet,
  FileText,
  FileVideo,
  FolderPlus,
  GitCompareArrows,
  Presentation,
  RotateCcw,
  Upload,
  X,
} from 'lucide-react'
import AppSelect from '@/components/ui/AppSelect'
const documentTypes = ['PDF', 'DOCX', 'PPTX', 'XLSX', 'DOC', 'XLS']

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

const extensionTypeMap = {
  pdf: 'PDF',
  doc: 'DOCX',
  docx: 'DOCX',
  xls: 'XLSX',
  xlsx: 'XLSX',
  ppt: 'PPTX',
  pptx: 'PPTX',
  mp4: 'MP4',
  jpg: 'JPG',
  jpeg: 'JPG',
  png: 'PNG',
  zip: 'ZIP',
}

function DocumentModal({
  categories = [],
  document,
  history = [],
  mode,
  onClose,
  onCreateFolder,
  onDownload,
  onUploadDocument,
}) {
  if (!mode) {
    return null
  }

  const title =
    mode === 'upload'
      ? 'Upload tài liệu'
      : mode === 'folder'
        ? 'Tạo thư mục mới'
        : mode === 'history'
          ? 'Lịch sử phiên bản'
          : 'Xem tài liệu'
  const modalWidth = mode === 'detail' ? 'max-w-6xl' : 'max-w-3xl'

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/45 p-3 backdrop-blur-sm sm:p-6">
      <div
        className={`max-h-[92vh] w-full overflow-hidden rounded-2xl border border-gray-300 bg-white shadow-2xl ${modalWidth}`}
      >
        <div className="flex items-center justify-between gap-3 border-b border-gray-300 px-4 py-3 sm:px-5">
          <div className="min-w-0">
            <h2 className="truncate text-lg font-bold text-slate-950 sm:text-xl">{title}</h2>
            <p className="mt-1 text-sm font-medium text-slate-500">
              Họp giao ban UBND xã tháng 07/2026
            </p>
          </div>
          <button
            className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-950"
            onClick={onClose}
            type="button"
          >
            <X size={20} />
          </button>
        </div>

        <div className="max-h-[calc(92vh-74px)] overflow-y-auto p-4 sm:p-5">
          {mode === 'upload' && (
            <UploadForm
              categories={categories}
              onClose={onClose}
              onUploadDocument={onUploadDocument}
            />
          )}
          {mode === 'folder' && (
            <FolderForm categories={categories} onClose={onClose} onCreateFolder={onCreateFolder} />
          )}
          {mode === 'detail' && document && (
            <DetailView document={document} onDownload={onDownload} />
          )}
          {mode === 'history' && <HistoryView history={history} />}
        </div>
      </div>
    </div>
  )
}

function FolderForm({ categories, onClose, onCreateFolder }) {
  const [folderName, setFolderName] = useState('')
  const [description, setDescription] = useState('')
  const normalizedFolderName = folderName.trim()
  const isDuplicate = categories.some(
    (category) => category.toLowerCase() === normalizedFolderName.toLowerCase(),
  )
  const hasError = normalizedFolderName.length > 0 && isDuplicate

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!normalizedFolderName || hasError) {
      return
    }

    onCreateFolder(normalizedFolderName, description)
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit}>
      <div className="rounded-2xl border border-gray-300 bg-blue-50 p-4">
        <div className="flex items-start gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white text-[#2563EB]">
            <FolderPlus size={22} />
          </span>
          <div>
            <h3 className="text-base font-bold text-slate-950">Thêm thư mục vào kho tài liệu</h3>
            <p className="mt-1 text-sm font-medium leading-6 text-slate-600">
              Thư mục mới sẽ xuất hiện ngay ở sidebar và có thể dùng để phân loại tài liệu khi tích
              hợp backend.
            </p>
          </div>
        </div>
      </div>

      <Field label="Tên thư mục">
        <input
          className={`${inputClass} ${hasError ? 'border-red-300 focus:border-red-500 focus:ring-red-100' : ''}`}
          onChange={(event) => setFolderName(event.target.value)}
          placeholder="Ví dụ: Tờ trình"
          value={folderName}
        />
        {hasError && (
          <span className="text-xs font-bold text-red-600">Thư mục này đã tồn tại.</span>
        )}
      </Field>

      <Field label="Mô tả">
        <textarea
          className={`${inputClass} min-h-24 resize-y py-3`}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Ghi chú ngắn về mục đích sử dụng thư mục"
          value={description}
        />
      </Field>

      <div className="flex flex-col-reverse gap-2 border-t border-gray-300 pt-4 sm:flex-row sm:justify-end">
        <button
          className="inline-flex h-11 items-center justify-center rounded-2xl border border-gray-300 bg-white px-5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
          onClick={onClose}
          type="button"
        >
          Hủy
        </button>
        <button
          className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-[#2563EB] px-5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          disabled={!normalizedFolderName || hasError}
          type="submit"
        >
          <FolderPlus size={17} />
          Tạo thư mục
        </button>
      </div>
    </form>
  )
}

function UploadForm({ categories, onClose, onUploadDocument }) {
  const fileInputRef = useRef(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    category: categories.find((category) => category !== 'Tất cả') || 'Agenda',
    type: 'PDF',
    description: '',
    version: 'v1.0',
    note: '',
  })

  const handleSelectedFile = (file) => {
    if (!file) {
      return
    }

    const extension = file.name.split('.').pop()?.toLowerCase() || ''
    const detectedType = extensionTypeMap[extension] || 'PDF'

    setSelectedFile(file)
    setFormData((currentData) => ({
      ...currentData,
      name: file.name,
      type: detectedType,
    }))
  }

  const handleFileChange = (event) => {
    handleSelectedFile(event.target.files?.[0])
  }

  const handleDrop = (event) => {
    event.preventDefault()
    handleSelectedFile(event.dataTransfer.files?.[0])
  }

  const handleChange = (name, value) => {
    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!selectedFile || !formData.name.trim()) {
      return
    }

    onUploadDocument({
      ...formData,
      name: formData.name.trim(),
      file: selectedFile,
    })
  }

  const PreviewIcon = typeIconMap[formData.type] || File

  return (
    <form className="grid gap-4" onSubmit={handleSubmit}>
      <button
        className="grid cursor-pointer place-items-center rounded-2xl border border-dashed border-gray-300 bg-slate-50 px-4 py-10 text-center transition hover:border-blue-300 hover:bg-blue-50"
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(event) => event.preventDefault()}
        onDrop={handleDrop}
        type="button"
      >
        <Upload className="text-[#2563EB]" size={34} />
        <span className="mt-3 text-sm font-bold text-slate-800">Kéo thả file vào đây</span>
        <span className="mt-1 text-xs font-medium text-slate-500">
          Hoặc bấm Chọn tệp để thêm tài liệu
        </span>
        <span className="mt-4 inline-flex h-10 items-center justify-center rounded-2xl bg-white px-4 text-sm font-bold text-[#2563EB] shadow-sm ring-1 ring-blue-100">
          Chọn tệp
        </span>
      </button>
      <input className="sr-only" onChange={handleFileChange} ref={fileInputRef} type="file" />

      {selectedFile && (
        <div className="rounded-2xl border border-gray-300 bg-white p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-blue-50 text-[#2563EB]">
              <PreviewIcon size={24} />
            </span>
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-base font-bold text-slate-950">{selectedFile.name}</h3>
              <p className="mt-1 text-sm font-medium text-slate-500">
                {formatFileSize(selectedFile.size)} - Tự nhận dạng: {formData.type}
              </p>
              <div className="mt-3 grid gap-2 text-sm sm:grid-cols-3">
                <span className="rounded-2xl bg-slate-50 px-3 py-2 font-semibold text-slate-600 ring-1 ring-gray-300">
                  Tên gốc: {selectedFile.name}
                </span>
                <span className="rounded-2xl bg-slate-50 px-3 py-2 font-semibold text-slate-600 ring-1 ring-gray-300">
                  MIME: {selectedFile.type || 'Không xác định'}
                </span>
                <span className="rounded-2xl bg-emerald-50 px-3 py-2 font-bold text-emerald-700 ring-1 ring-emerald-100">
                  Sẵn sàng tải lên
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Tên tài liệu">
          <input
            className={inputClass}
            onChange={(event) => handleChange('name', event.target.value)}
            placeholder="Nhập tên tài liệu"
            value={formData.name}
          />
        </Field>
        <Field label="Loại tài liệu">
          <AppSelect
            className="h-11"
            onChange={(event) => handleChange('type', event.target.value)}
            options={documentTypes}
            value={formData.type}
          />
        </Field>
        <Field label="Thư mục">
          <AppSelect
            className="h-11"
            onChange={(event) => handleChange('category', event.target.value)}
            options={categories.filter((category) => category !== 'Tất cả')}
            value={formData.category}
          />
        </Field>
        <Field label="Phiên bản">
          <input
            className={inputClass}
            onChange={(event) => handleChange('version', event.target.value)}
            value={formData.version}
          />
        </Field>
        <Field className="md:col-span-2" label="Mô tả">
          <textarea
            className={`${inputClass} min-h-24 resize-y py-3`}
            onChange={(event) => handleChange('description', event.target.value)}
            placeholder="Nhập mô tả tài liệu"
            value={formData.description}
          />
        </Field>
        <Field className="md:col-span-2" label="Ghi chú">
          <textarea
            className={`${inputClass} min-h-24 resize-y py-3`}
            onChange={(event) => handleChange('note', event.target.value)}
            placeholder="Nhập ghi chú nội bộ"
            value={formData.note}
          />
        </Field>
      </div>

      <div className="flex flex-col-reverse gap-2 border-t border-gray-300 pt-4 sm:flex-row sm:justify-end">
        <button
          className="inline-flex h-11 items-center justify-center rounded-2xl border border-gray-300 bg-white px-5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
          onClick={onClose}
          type="button"
        >
          Hủy
        </button>
        <button
          className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-[#2563EB] px-5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          disabled={!selectedFile || !formData.name.trim() || isReadingFile}
          type="submit"
        >
          <Upload size={17} />
          Upload
        </button>
      </div>
    </form>
  )
}

function formatFileSize(size) {
  if (size < 1024 * 1024) {
    return `${Math.max(size / 1024, 1).toFixed(1)} KB`
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`
}

function DetailView({ document, onDownload }) {
  const rows = [
    ['Tên file', document.name],
    ['Loại', document.type],
    ['Dung lượng', document.size],
    ['Người tải lên', document.uploader],
    ['Ngày tạo', document.uploadDate],
    ['Ngày cập nhật', document.updatedAt],
    ['Phiên bản', document.version],
    ['Mô tả', document.description],
    ['Ghi chú', document.note],
  ]

  return (
    <div className="grid gap-4">
      <DocumentPreview document={document} />
      <div className="overflow-hidden rounded-2xl border border-gray-300">
        {rows.map(([label, value]) => (
          <div
            className="grid gap-1 border-b border-gray-300 px-4 py-3 last:border-b-0 sm:grid-cols-[180px_minmax(0,1fr)] sm:gap-4"
            key={label}
          >
            <span className="text-xs font-bold uppercase tracking-wide text-slate-400">
              {label}
            </span>
            <span className="text-sm font-semibold leading-6 text-slate-700">{value}</span>
          </div>
        ))}
      </div>
      <div className="flex justify-end">
        <button
          className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-[#2563EB] px-5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700"
          onClick={() => onDownload?.(document)}
          type="button"
        >
          <Download size={17} />
          Download
        </button>
      </div>
    </div>
  )
}

function DocumentPreview({ document }) {
  const PreviewIcon = typeIconMap[document.type] || File
  return (
    <div className="grid min-h-72 place-items-center rounded-2xl border border-gray-300 bg-slate-50 p-6 text-center">
      <div className="max-w-md">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-white text-[#2563EB] shadow-sm ring-1 ring-gray-300">
          <PreviewIcon size={26} />
        </span>
        <h3 className="mt-4 text-lg font-bold text-slate-950">Tệp được lưu an toàn trên máy chủ</h3>
        <p className="mt-2 text-sm font-medium leading-6 text-slate-500">
          Dùng nút Download để mở bản gốc. Nội dung tệp không còn được lưu base64 trong trình duyệt.
        </p>
      </div>
    </div>
  )
}

function HistoryView({ history }) {
  return (
    <div className="grid gap-4">
      {history.length === 0 && (
        <p className="rounded-2xl bg-slate-50 p-6 text-center font-semibold text-slate-500">
          Chưa có lịch sử tài liệu.
        </p>
      )}
      {history.map((item, index) => (
        <div
          className="relative rounded-2xl border border-gray-300 bg-white p-4 shadow-sm"
          key={item.id}
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-blue-50 text-sm font-bold text-[#2563EB]">
                {item.action}
              </span>
              <div>
                <h3 className="text-base font-bold text-slate-950">{item.action}</h3>
                <p className="mt-1 text-sm font-semibold text-slate-700">
                  {item.actor?.name ?? item.actor?.username}
                </p>
                <p className="text-sm font-medium text-slate-500">
                  {new Date(item.createdAt).toLocaleString('vi-VN')}
                </p>
                <p className="mt-2 text-sm font-medium text-slate-600">{item.detail}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 sm:flex">
              <HistoryButton icon={Download} label="Download" />
              <HistoryButton icon={RotateCcw} label="Khôi phục" />
              <HistoryButton icon={GitCompareArrows} label="So sánh" />
            </div>
          </div>
          {index < history.length - 1 && (
            <span className="absolute left-9 top-[68px] hidden h-8 w-px bg-gray-300 sm:block" />
          )}
        </div>
      ))}
    </div>
  )
}

function HistoryButton({ icon: Icon, label }) {
  return (
    <button
      className="inline-flex h-10 items-center justify-center gap-1.5 rounded-2xl border border-gray-300 bg-white px-3 text-xs font-bold text-slate-700 transition hover:bg-blue-50 hover:text-[#2563EB]"
      type="button"
    >
      <Icon size={15} />
      {label}
    </button>
  )
}

function Field({ children, className = '', label }) {
  return (
    <label className={`grid gap-1.5 ${className}`}>
      <span className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</span>
      {children}
    </label>
  )
}

const inputClass =
  'w-full rounded-2xl border border-gray-300 bg-white px-4 text-sm font-semibold text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#2563EB] focus:ring-4 focus:ring-blue-100 h-11'

export default DocumentModal
