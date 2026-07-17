import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import DocumentsContent from '@/components/Documents/DocumentsContent'
import DocumentsHeader from '@/components/Documents/DocumentsHeader'
import DocumentsSidebar from '@/components/Documents/DocumentsSidebar'
import DocumentModal from '@/components/Documents/DocumentModal'
import { documentCategories, documentTypes, meetingDocuments } from '@/datas/meetingDocuments'

const localDocumentsKey = 'meetingDocuments.localUploads'

const initialFilters = {
  type: '',
  uploader: '',
}

const getStoredDocuments = () => {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const storedDocuments = window.localStorage.getItem(localDocumentsKey)

    return storedDocuments ? JSON.parse(storedDocuments) : []
  } catch {
    return []
  }
}

function DocumentsPage() {
  const [documents, setDocuments] = useState(() => [...meetingDocuments, ...getStoredDocuments()])
  const [categories, setCategories] = useState(() => {
    const storedCategories = getStoredDocuments().map((document) => document.category)

    return [...new Set([...documentCategories, ...storedCategories])]
  })
  const [selectedCategory, setSelectedCategory] = useState('Tất cả')
  const [searchValue, setSearchValue] = useState('')
  const [filters, setFilters] = useState(initialFilters)
  const [modalState, setModalState] = useState({ mode: null, document: null })

  const uploaders = useMemo(() => [...new Set(documents.map((document) => document.uploader))], [documents])

  const categoryCounts = useMemo(() => {
    const counts = documents.reduce(
      (result, document) => ({
        ...result,
        [document.category]: (result[document.category] || 0) + 1,
      }),
      { 'Tất cả': documents.length },
    )

    return counts
  }, [documents])

  const filteredDocuments = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLowerCase()

    return documents.filter((document) => {
      const matchesSearch = normalizedSearch.length === 0 || document.name.toLowerCase().includes(normalizedSearch)
      const matchesCategory = selectedCategory === 'Tất cả' || document.category === selectedCategory
      const matchesType = !filters.type || document.type === filters.type
      const matchesUploader = !filters.uploader || document.uploader === filters.uploader

      return matchesSearch && matchesCategory && matchesType && matchesUploader
    })
  }, [documents, filters, searchValue, selectedCategory])

  const handleFilterChange = (name, value) => {
    setFilters((currentFilters) => ({
      ...currentFilters,
      [name]: value,
    }))
  }

  const handleRefresh = () => {
    setSearchValue('')
    setFilters(initialFilters)
    setSelectedCategory('Tất cả')
  }

  const openModal = (mode, document = null) => {
    setModalState({ mode, document })
  }

  const closeModal = () => {
    setModalState({ mode: null, document: null })
  }

  const handleCreateFolder = (folderName) => {
    const normalizedFolderName = folderName.trim()
    const isDuplicate = categories.some((category) => category.toLowerCase() === normalizedFolderName.toLowerCase())

    if (!normalizedFolderName || isDuplicate) {
      return false
    }

    setCategories((currentCategories) => [...currentCategories, normalizedFolderName])
    setSelectedCategory(normalizedFolderName)
    closeModal()
    toast.success(`Đã tạo thư mục "${normalizedFolderName}"`)

    return true
  }

  const handleUploadDocument = (documentData) => {
    const uploadedDocument = {
      ...documentData,
      id: Date.now(),
    }

    setDocuments((currentDocuments) => {
      const nextDocuments = [uploadedDocument, ...currentDocuments]
      const localDocuments = nextDocuments.filter((document) => document.isLocal)

      try {
        window.localStorage.setItem(localDocumentsKey, JSON.stringify(localDocuments))
      } catch {
        toast.error('Tệp hơi lớn nên chỉ lưu trong phiên hiện tại')
      }

      return nextDocuments
    })

    if (!categories.includes(uploadedDocument.category)) {
      setCategories((currentCategories) => [...currentCategories, uploadedDocument.category])
    }

    setSelectedCategory(uploadedDocument.category)
    closeModal()
    toast.success(`Đã upload "${uploadedDocument.name}"`)
  }

  return (
    <div className="mx-auto grid max-w-[1600px] gap-4 sm:gap-6">
      <DocumentsHeader filters={filters} onCreateFolder={() => openModal('folder')} onFilterChange={handleFilterChange} onRefresh={handleRefresh} onUpload={() => openModal('upload')} searchValue={searchValue} setSearchValue={setSearchValue} types={documentTypes} uploaders={uploaders} />

      <section className="grid gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
        <DocumentsSidebar categories={categories} categoryCounts={categoryCounts} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
        <DocumentsContent documents={filteredDocuments} onOpenDetail={(document) => openModal('detail', document)} onOpenHistory={(document) => openModal('history', document)} onUpload={() => openModal('upload')} />
      </section>

      <DocumentModal categories={categories} document={modalState.document} mode={modalState.mode} onClose={closeModal} onCreateFolder={handleCreateFolder} onUploadDocument={handleUploadDocument} />
    </div>
  )
}

export default DocumentsPage
