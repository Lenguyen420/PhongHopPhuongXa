import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { getApiErrorMessage } from '@/services/apiError'
import DocumentsContent from '@/components/Documents/DocumentsContent'
import DocumentsHeader from '@/components/Documents/DocumentsHeader'
import DocumentsSidebar from '@/components/Documents/DocumentsSidebar'
import DocumentModal from '@/components/Documents/DocumentModal'
import { http } from '@/services/files'
import {
  useCreateDocumentCategoryMutation,
  useDeleteDocumentMutation,
  useDocumentOptionsQuery,
  useDocumentsQuery,
  useLazyDocumentHistoryQuery,
  useUpdateDocumentMutation,
  useUploadDocumentMutation,
  useUploadDocumentVersionMutation,
} from '@/services/meetingApi'

const initialFilters = { type: '', uploader: '' }
const formatSize = (size) =>
  size >= 1024 * 1024
    ? `${(size / 1024 / 1024).toFixed(1)} MB`
    : `${Math.max(1, size / 1024).toFixed(1)} KB`

function DocumentsPage() {
  const { data: response, isLoading, isError, refetch } = useDocumentsQuery({ page: 0, size: 200 })
  const { data: options } = useDocumentOptionsQuery()
  const [createCategory] = useCreateDocumentCategoryMutation()
  const [uploadDocument] = useUploadDocumentMutation()
  const [uploadDocumentVersion] = useUploadDocumentVersionMutation()
  const [updateDocument] = useUpdateDocumentMutation()
  const [deleteDocument] = useDeleteDocumentMutation()
  const [loadHistory] = useLazyDocumentHistoryQuery()
  const [history, setHistory] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('Tất cả')
  const [searchValue, setSearchValue] = useState('')
  const [filters, setFilters] = useState(initialFilters)
  const [modalState, setModalState] = useState({ mode: null, document: null })

  const categories = useMemo(
    () => ['Tất cả', ...(options?.categories ?? []).map((item) => item.name)],
    [options],
  )
  const documents = useMemo(
    () =>
      (response?.data ?? []).map((document) => ({
        ...document,
        categoryId: document.category?.id,
        category: document.category?.name ?? 'Chưa phân loại',
        uploader: document.uploader?.name ?? 'Không xác định',
        size: formatSize(document.size),
        uploadDate: document.uploadedAt
          ? new Date(document.uploadedAt).toLocaleDateString('vi-VN')
          : '',
        updatedAt: document.updatedAt
          ? new Date(document.updatedAt).toLocaleDateString('vi-VN')
          : '',
        version: `v${document.version}.0`,
      })),
    [response],
  )
  const uploaders = (options?.uploaders ?? []).map((item) => item.name)
  const categoryCounts = useMemo(
    () =>
      documents.reduce(
        (result, document) => ({
          ...result,
          [document.category]: (result[document.category] || 0) + 1,
        }),
        { 'Tất cả': documents.length },
      ),
    [documents],
  )
  const filteredDocuments = useMemo(() => {
    const keyword = searchValue.trim().toLowerCase()
    return documents.filter(
      (document) =>
        (!keyword || document.name.toLowerCase().includes(keyword)) &&
        (selectedCategory === 'Tất cả' || document.category === selectedCategory) &&
        (!filters.type || document.type === filters.type) &&
        (!filters.uploader || document.uploader === filters.uploader),
    )
  }, [documents, filters, searchValue, selectedCategory])
  const closeModal = () => setModalState({ mode: null, document: null })
  const openHistory = async (document) => {
    setModalState({ mode: 'history', document })
    try {
      setHistory(await loadHistory(document.id).unwrap())
    } catch {
      setHistory([])
      toast.error('Không thể tải lịch sử tài liệu')
    }
  }
  const createFolder = async (name, description) => {
    try {
      await createCategory({ name, description }).unwrap()
      toast.success(`Đã tạo thư mục "${name}"`)
      closeModal()
      return true
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Không thể tạo thư mục'))
      return false
    }
  }
  const upload = async (data) => {
    const categoryId = options?.categories?.find((item) => item.name === data.category)?.id
    const body = new FormData()
    body.append('file', data.file)
    body.append('categoryId', categoryId)
    if (data.description) body.append('description', data.description)
    if (data.note) body.append('note', data.note)
    try {
      await uploadDocument(body).unwrap()
      toast.success(`Đã upload "${data.name}"`)
      closeModal()
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Không thể upload tài liệu'))
    }
  }
  const download = async (document) => {
    try {
      const response = await http.get(document.downloadUrl, { responseType: 'blob' })
      const url = URL.createObjectURL(response.data)
      const link = window.document.createElement('a')
      link.href = url
      link.download = document.name
      link.click()
      URL.revokeObjectURL(url)
    } catch {
      toast.error('Không thể tải tài liệu')
    }
  }
  const chooseVersionFile = (document) => {
    const input = window.document.createElement('input')
    input.type = 'file'
    input.accept = '.pdf,.doc,.docx,.xls,.xlsx,.pptx'
    input.onchange = async () => {
      const file = input.files?.[0]
      if (!file) return
      const body = new FormData()
      body.append('file', file)
      try {
        await uploadDocumentVersion({ id: document.id, body }).unwrap()
        toast.success(`Đã tạo phiên bản mới cho "${document.name}"`)
      } catch (error) {
        toast.error(getApiErrorMessage(error, 'Không thể upload phiên bản mới'))
      }
    }
    input.click()
  }
  const handleDocumentAction = async (action, document) => {
    if (action === 'download') return download(document)
    if (action === 'version') return chooseVersionFile(document)
    if (action === 'share') {
      await navigator.clipboard.writeText(`${window.location.origin}${document.downloadUrl}`)
      toast.success('Đã sao chép liên kết tài liệu')
      return
    }
    if (action === 'rename') {
      const name = window.prompt('Tên tài liệu mới', document.name)?.trim()
      if (!name || name === document.name) return
      try {
        await updateDocument({ id: document.id, body: { name } }).unwrap()
        toast.success('Đã đổi tên tài liệu')
      } catch (error) {
        toast.error(getApiErrorMessage(error, 'Không thể đổi tên tài liệu'))
      }
      return
    }
    if (action === 'delete' && window.confirm(`Xóa tài liệu "${document.name}"?`)) {
      try {
        await deleteDocument(document.id).unwrap()
        toast.success('Đã xóa tài liệu')
      } catch (error) {
        toast.error(getApiErrorMessage(error, 'Không thể xóa tài liệu'))
      }
    }
  }

  if (isLoading) return <State text="Đang tải tài liệu..." />
  if (isError) return <State action={refetch} text="Không thể tải tài liệu" />
  return (
    <div className="mx-auto grid max-w-[1600px] gap-4 sm:gap-6">
      <DocumentsHeader
        filters={filters}
        onCreateFolder={() => setModalState({ mode: 'folder', document: null })}
        onFilterChange={(name, value) => setFilters((current) => ({ ...current, [name]: value }))}
        onRefresh={() => {
          setSearchValue('')
          setFilters(initialFilters)
          setSelectedCategory('Tất cả')
          refetch()
        }}
        onUpload={() => setModalState({ mode: 'upload', document: null })}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        types={options?.types ?? []}
        uploaders={uploaders}
      />
      <section className="grid gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
        <DocumentsSidebar
          categories={categories}
          categoryCounts={categoryCounts}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
        <DocumentsContent
          documents={filteredDocuments}
          onAction={handleDocumentAction}
          onOpenDetail={(document) => setModalState({ mode: 'detail', document })}
          onOpenHistory={openHistory}
          onUpload={() => setModalState({ mode: 'upload', document: null })}
        />
      </section>
      <DocumentModal
        categories={categories}
        document={modalState.document}
        history={history}
        mode={modalState.mode}
        onClose={closeModal}
        onCreateFolder={createFolder}
        onDownload={download}
        onUploadDocument={upload}
      />
    </div>
  )
}

function State({ action, text }) {
  return (
    <div className="rounded-2xl bg-white p-8 text-center font-semibold text-slate-600 ring-1 ring-slate-200">
      {text}
      {action && (
        <button className="ml-3 text-blue-600" onClick={action} type="button">
          Thử lại
        </button>
      )}
    </div>
  )
}
export default DocumentsPage
