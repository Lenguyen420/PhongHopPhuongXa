import { useRef, useState } from 'react'
import { Download, File, FileImage, FileSpreadsheet, FileText, FileVideo, FolderPlus, GitCompareArrows, Presentation, RotateCcw, Upload, X } from 'lucide-react'
import { documentCategories, documentTypes } from '@/datas/meetingDocuments'

const versionHistory = [
  { version: 'v2.0', uploader: 'Nguyễn Văn A', date: '15/07/2026', note: 'Cập nhật nội dung' },
  { version: 'v1.0', uploader: 'Trần Văn B', date: '10/07/2026', note: 'Tạo mới' },
]

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

function DocumentModal({ categories = documentCategories, document, mode, onClose, onCreateFolder, onUploadDocument }) {
  if (!mode) {
    return null
  }

  const title = mode === 'upload' ? 'Upload tài liệu' : mode === 'folder' ? 'Tạo thư mục mới' : mode === 'history' ? 'Lịch sử phiên bản' : 'Xem tài liệu'
  const modalWidth = mode === 'detail' ? 'max-w-6xl' : 'max-w-3xl'

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/45 p-3 backdrop-blur-sm sm:p-6">
      <div className={`max-h-[92vh] w-full overflow-hidden rounded-2xl border border-gray-300 bg-white shadow-2xl ${modalWidth}`}>
        <div className="flex items-center justify-between gap-3 border-b border-gray-300 px-4 py-3 sm:px-5">
          <div className="min-w-0">
            <h2 className="truncate text-lg font-bold text-slate-950 sm:text-xl">{title}</h2>
            <p className="mt-1 text-sm font-medium text-slate-500">Họp giao ban UBND xã tháng 07/2026</p>
          </div>
          <button className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-950" onClick={onClose} type="button">
            <X size={20} />
          </button>
        </div>

        <div className="max-h-[calc(92vh-74px)] overflow-y-auto p-4 sm:p-5">
          {mode === 'upload' && <UploadForm categories={categories} onClose={onClose} onUploadDocument={onUploadDocument} />}
          {mode === 'folder' && <FolderForm categories={categories} onClose={onClose} onCreateFolder={onCreateFolder} />}
          {mode === 'detail' && document && <DetailView document={document} />}
          {mode === 'history' && <HistoryView />}
        </div>
      </div>
    </div>
  )
}

function FolderForm({ categories, onClose, onCreateFolder }) {
  const [folderName, setFolderName] = useState('')
  const [description, setDescription] = useState('')
  const normalizedFolderName = folderName.trim()
  const isDuplicate = categories.some((category) => category.toLowerCase() === normalizedFolderName.toLowerCase())
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
            <p className="mt-1 text-sm font-medium leading-6 text-slate-600">Thư mục mới sẽ xuất hiện ngay ở sidebar và có thể dùng để phân loại tài liệu khi tích hợp backend.</p>
          </div>
        </div>
      </div>

      <Field label="Tên thư mục">
        <input className={`${inputClass} ${hasError ? 'border-red-300 focus:border-red-500 focus:ring-red-100' : ''}`} onChange={(event) => setFolderName(event.target.value)} placeholder="Ví dụ: Tờ trình" value={folderName} />
        {hasError && <span className="text-xs font-bold text-red-600">Thư mục này đã tồn tại.</span>}
      </Field>

      <Field label="Mô tả">
        <textarea className={`${inputClass} min-h-24 resize-y py-3`} onChange={(event) => setDescription(event.target.value)} placeholder="Ghi chú ngắn về mục đích sử dụng thư mục" value={description} />
      </Field>

      <div className="flex flex-col-reverse gap-2 border-t border-gray-300 pt-4 sm:flex-row sm:justify-end">
        <button className="inline-flex h-11 items-center justify-center rounded-2xl border border-gray-300 bg-white px-5 text-sm font-bold text-slate-700 transition hover:bg-slate-50" onClick={onClose} type="button">Hủy</button>
        <button className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-[#2563EB] px-5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300" disabled={!normalizedFolderName || hasError} type="submit">
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
  const [previewData, setPreviewData] = useState(null)
  const [isReadingFile, setIsReadingFile] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    category: categories.find((category) => category !== 'Tất cả') || 'Agenda',
    type: 'PDF',
    description: '',
    version: 'v1.0',
    note: '',
  })

  const handleSelectedFile = async (file) => {
    if (!file) {
      return
    }

    const extension = file.name.split('.').pop()?.toLowerCase() || ''
    const detectedType = extensionTypeMap[extension] || 'PDF'

    setSelectedFile(file)
    setIsReadingFile(true)
    setFormData((currentData) => ({
      ...currentData,
      name: file.name,
      type: detectedType,
    }))

    try {
      const filePreviewData = await buildFilePreviewData(file, detectedType)
      setPreviewData(filePreviewData)
    } finally {
      setIsReadingFile(false)
    }
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

    if (!selectedFile || !formData.name.trim() || isReadingFile) {
      return
    }

    const currentDate = new Date().toLocaleDateString('vi-VN')

    onUploadDocument({
      ...formData,
      name: formData.name.trim(),
      size: formatFileSize(selectedFile.size),
      uploader: 'Người dùng hiện tại',
      uploadDate: currentDate,
      updatedAt: currentDate,
      description: formData.description || 'Tài liệu được upload từ máy tính cục bộ.',
      note: formData.note || 'Tệp lưu local trong trình duyệt, sẵn sàng đồng bộ khi có backend.',
      isLocal: true,
      localFileName: selectedFile.name,
      localFileType: selectedFile.type,
      localFileSize: selectedFile.size,
      localDataUrl: previewData?.dataUrl || '',
      localTextContent: previewData?.textContent || '',
      localTableRows: previewData?.tableRows || [],
    })
  }

  const PreviewIcon = typeIconMap[formData.type] || File

  return (
    <form className="grid gap-4" onSubmit={handleSubmit}>
      <button className="grid cursor-pointer place-items-center rounded-2xl border border-dashed border-gray-300 bg-slate-50 px-4 py-10 text-center transition hover:border-blue-300 hover:bg-blue-50" onClick={() => fileInputRef.current?.click()} onDragOver={(event) => event.preventDefault()} onDrop={handleDrop} type="button">
        <Upload className="text-[#2563EB]" size={34} />
        <span className="mt-3 text-sm font-bold text-slate-800">Kéo thả file vào đây</span>
        <span className="mt-1 text-xs font-medium text-slate-500">Hoặc bấm Chọn tệp để thêm tài liệu</span>
        <span className="mt-4 inline-flex h-10 items-center justify-center rounded-2xl bg-white px-4 text-sm font-bold text-[#2563EB] shadow-sm ring-1 ring-blue-100">Chọn tệp</span>
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
              <p className="mt-1 text-sm font-medium text-slate-500">{formatFileSize(selectedFile.size)} - Tự nhận dạng: {formData.type}</p>
              <div className="mt-3 grid gap-2 text-sm sm:grid-cols-3">
                <span className="rounded-2xl bg-slate-50 px-3 py-2 font-semibold text-slate-600 ring-1 ring-gray-300">Tên gốc: {selectedFile.name}</span>
                <span className="rounded-2xl bg-slate-50 px-3 py-2 font-semibold text-slate-600 ring-1 ring-gray-300">MIME: {selectedFile.type || 'Không xác định'}</span>
                <span className="rounded-2xl bg-emerald-50 px-3 py-2 font-bold text-emerald-700 ring-1 ring-emerald-100">{isReadingFile ? 'Đang đọc file' : 'Sẵn sàng xem'}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Tên tài liệu">
          <input className={inputClass} onChange={(event) => handleChange('name', event.target.value)} placeholder="Nhập tên tài liệu" value={formData.name} />
        </Field>
        <Field label="Loại tài liệu">
          <select className={inputClass} onChange={(event) => handleChange('type', event.target.value)} value={formData.type}>
            {documentTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Thư mục">
          <select className={inputClass} onChange={(event) => handleChange('category', event.target.value)} value={formData.category}>
            {categories.filter((category) => category !== 'Tất cả').map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Phiên bản">
          <input className={inputClass} onChange={(event) => handleChange('version', event.target.value)} value={formData.version} />
        </Field>
        <Field className="md:col-span-2" label="Mô tả">
          <textarea className={`${inputClass} min-h-24 resize-y py-3`} onChange={(event) => handleChange('description', event.target.value)} placeholder="Nhập mô tả tài liệu" value={formData.description} />
        </Field>
        <Field className="md:col-span-2" label="Ghi chú">
          <textarea className={`${inputClass} min-h-24 resize-y py-3`} onChange={(event) => handleChange('note', event.target.value)} placeholder="Nhập ghi chú nội bộ" value={formData.note} />
        </Field>
      </div>

      <div className="flex flex-col-reverse gap-2 border-t border-gray-300 pt-4 sm:flex-row sm:justify-end">
        <button className="inline-flex h-11 items-center justify-center rounded-2xl border border-gray-300 bg-white px-5 text-sm font-bold text-slate-700 transition hover:bg-slate-50" onClick={onClose} type="button">Hủy</button>
        <button className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-[#2563EB] px-5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300" disabled={!selectedFile || !formData.name.trim() || isReadingFile} type="submit">
          <Upload size={17} />
          Upload
        </button>
      </div>
    </form>
  )
}

async function buildFilePreviewData(file, type) {
  const dataUrl = await readFileAsDataUrl(file)
  const result = { dataUrl, textContent: '', tableRows: [] }

  if (file.type.startsWith('text/')) {
    result.textContent = await file.text()
  }

  if (type === 'DOCX') {
    result.textContent = await extractDocxText(file)
  }

  if (type === 'PPTX') {
    result.textContent = await extractPptxText(file)
  }

  if (type === 'XLSX') {
    result.tableRows = await extractXlsxRows(file)
  }

  return result
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

async function extractDocxText(file) {
  try {
    const { default: JSZip } = await import('jszip')
    const zip = await JSZip.loadAsync(await file.arrayBuffer())
    const documentXml = await zip.file('word/document.xml')?.async('string')

    return xmlToReadableText(documentXml || '')
  } catch {
    return ''
  }
}

async function extractPptxText(file) {
  try {
    const { default: JSZip } = await import('jszip')
    const zip = await JSZip.loadAsync(await file.arrayBuffer())
    const slideFiles = Object.keys(zip.files).filter((fileName) => /^ppt\/slides\/slide\d+\.xml$/.test(fileName)).sort()
    const slideTexts = await Promise.all(slideFiles.map(async (fileName, index) => {
      const xml = await zip.file(fileName)?.async('string')
      const text = xmlToReadableText(xml || '')

      return text ? `Slide ${index + 1}\n${text}` : ''
    }))

    return slideTexts.filter(Boolean).join('\n\n')
  } catch {
    return ''
  }
}

async function extractXlsxRows(file) {
  try {
    const XLSX = await import('xlsx')
    const workbook = XLSX.read(await file.arrayBuffer(), { type: 'array' })
    const firstSheetName = workbook.SheetNames[0]

    if (!firstSheetName) {
      return []
    }

    return XLSX.utils.sheet_to_json(workbook.Sheets[firstSheetName], { header: 1, blankrows: false }).slice(0, 40)
  } catch {
    return []
  }
}

function xmlToReadableText(xml) {
  return xml
    .replace(/<w:tab\/>/g, '\t')
    .replace(/<\/w:p>/g, '\n')
    .replace(/<\/a:p>/g, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

function formatFileSize(size) {
  if (size < 1024 * 1024) {
    return `${Math.max(size / 1024, 1).toFixed(1)} KB`
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`
}

function DetailView({ document }) {
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
          <div className="grid gap-1 border-b border-gray-300 px-4 py-3 last:border-b-0 sm:grid-cols-[180px_minmax(0,1fr)] sm:gap-4" key={label}>
            <span className="text-xs font-bold uppercase tracking-wide text-slate-400">{label}</span>
            <span className="text-sm font-semibold leading-6 text-slate-700">{value}</span>
          </div>
        ))}
      </div>
      <div className="flex justify-end">
        <a className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-[#2563EB] px-5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700" download={document.name} href={document.localDataUrl || '#'}>
          <Download size={17} />
          Download
        </a>
      </div>
    </div>
  )
}

function DocumentPreview({ document }) {
  const PreviewIcon = typeIconMap[document.type] || File

  if (!document.isLocal || !document.localDataUrl) {
    return (
      <div className="grid min-h-72 place-items-center rounded-2xl border border-gray-300 bg-slate-50 p-6 text-center">
        <div className="max-w-md">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-white text-[#2563EB] shadow-sm ring-1 ring-gray-300">
            <PreviewIcon size={26} />
          </span>
          <h3 className="mt-4 text-lg font-bold text-slate-950">Chưa có nội dung file để xem trước</h3>
          <p className="mt-2 text-sm font-medium leading-6 text-slate-500">Tài liệu mẫu hiện chỉ có metadata. Với tài liệu vừa upload, hệ thống sẽ hiển thị nội dung file ngay tại đây.</p>
        </div>
      </div>
    )
  }

  if (['JPG', 'PNG'].includes(document.type)) {
    return <img alt={document.name} className="max-h-[60vh] w-full rounded-2xl border border-gray-300 bg-slate-50 object-contain" src={document.localDataUrl} />
  }

  if (document.type === 'MP4') {
    return (
      <video className="max-h-[60vh] w-full rounded-2xl border border-gray-300 bg-black" controls src={document.localDataUrl}>
        <track kind="captions" />
      </video>
    )
  }

  if (document.type === 'PDF') {
    return <iframe className="h-[70vh] w-full rounded-2xl border border-gray-300 bg-white" src={document.localDataUrl} title={document.name} />
  }

  if (document.type === 'XLSX' && document.localTableRows?.length > 0) {
    return (
      <div className="max-h-[60vh] overflow-auto rounded-2xl border border-gray-300 bg-white">
        <table className="min-w-full border-separate border-spacing-0 text-left text-sm">
          <tbody>
            {document.localTableRows.map((row, rowIndex) => (
              <tr className={rowIndex === 0 ? 'bg-slate-100 font-bold text-slate-800' : 'text-slate-700'} key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td className="max-w-64 border-b border-r border-gray-300 px-3 py-2 last:border-r-0" key={`${rowIndex}-${cellIndex}`}>{cell || ''}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  if (document.localTextContent) {
    return <pre className="max-h-[60vh] overflow-auto whitespace-pre-wrap rounded-2xl border border-gray-300 bg-slate-950 p-4 text-sm font-medium leading-7 text-slate-100">{document.localTextContent}</pre>
  }

  return (
    <div className="grid min-h-72 place-items-center rounded-2xl border border-gray-300 bg-slate-50 p-6 text-center">
      <div className="max-w-md">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-white text-[#2563EB] shadow-sm ring-1 ring-gray-300">
          <PreviewIcon size={26} />
        </span>
        <h3 className="mt-4 text-lg font-bold text-slate-950">Không thể render trực tiếp định dạng này</h3>
        <p className="mt-2 text-sm font-medium leading-6 text-slate-500">File đã được lưu local và có thể tải xuống. Một số định dạng văn phòng cần backend hoặc dịch vụ chuyển đổi để xem đầy đủ như bản gốc.</p>
      </div>
    </div>
  )
}

function HistoryView() {
  return (
    <div className="grid gap-4">
      {versionHistory.map((item, index) => (
        <div className="relative rounded-2xl border border-gray-300 bg-white p-4 shadow-sm" key={item.version}>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-blue-50 text-sm font-bold text-[#2563EB]">{item.version}</span>
              <div>
                <h3 className="text-base font-bold text-slate-950">{item.version}</h3>
                <p className="mt-1 text-sm font-semibold text-slate-700">{item.uploader}</p>
                <p className="text-sm font-medium text-slate-500">{item.date}</p>
                <p className="mt-2 text-sm font-medium text-slate-600">{item.note}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 sm:flex">
              <HistoryButton icon={Download} label="Download" />
              <HistoryButton icon={RotateCcw} label="Khôi phục" />
              <HistoryButton icon={GitCompareArrows} label="So sánh" />
            </div>
          </div>
          {index < versionHistory.length - 1 && <span className="absolute left-9 top-[68px] hidden h-8 w-px bg-gray-300 sm:block" />}
        </div>
      ))}
    </div>
  )
}

function HistoryButton({ icon: Icon, label }) {
  return (
    <button className="inline-flex h-10 items-center justify-center gap-1.5 rounded-2xl border border-gray-300 bg-white px-3 text-xs font-bold text-slate-700 transition hover:bg-blue-50 hover:text-[#2563EB]" type="button">
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

const inputClass = 'w-full rounded-2xl border border-gray-300 bg-white px-4 text-sm font-semibold text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#2563EB] focus:ring-4 focus:ring-blue-100 h-11'

export default DocumentModal
