import { BarChart3, ClipboardList, FileQuestion, FileText, FolderOpen, NotebookText, Scale, Video } from 'lucide-react'

const categoryIcons = {
  'Tất cả': FolderOpen,
  Agenda: ClipboardList,
  'Quyết định': Scale,
  'Báo cáo': BarChart3,
  PowerPoint: FileText,
  'Biên bản': NotebookText,
  Video,
  Khác: FileQuestion,
}

function DocumentsSidebar({ categories, categoryCounts, selectedCategory, setSelectedCategory }) {
  return (
    <aside className="rounded-2xl border border-gray-300 bg-white p-3 shadow-sm sm:p-4">
      <div className="mb-3 flex items-center justify-between px-1">
        <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">Thư mục</h2>
        <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-[#2563EB]">{categoryCounts['Tất cả'] || 0}</span>
      </div>

      <div className="grid gap-2">
        {categories.map((category) => {
          const Icon = categoryIcons[category] || FileQuestion
          const isSelected = selectedCategory === category

          return (
            <button className={`flex items-center justify-between gap-3 rounded-2xl border px-3 py-3 text-left transition ${isSelected ? 'border-blue-200 bg-blue-50 text-[#2563EB] shadow-sm' : 'border-transparent text-slate-700 hover:border-gray-300 hover:bg-slate-50'}`} key={category} onClick={() => setSelectedCategory(category)} type="button">
              <span className="flex min-w-0 items-center gap-3">
                <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-2xl ${isSelected ? 'bg-white text-[#2563EB]' : 'bg-slate-100 text-slate-500'}`}>
                  <Icon size={19} />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-bold">{category}</span>
                  <span className="text-xs font-semibold text-slate-400">{categoryCounts[category] || 0} tài liệu</span>
                </span>
              </span>
              <span className={`rounded-full px-2 py-1 text-xs font-bold ${isSelected ? 'bg-[#2563EB] text-white' : 'bg-slate-100 text-slate-500'}`}>{categoryCounts[category] || 0}</span>
            </button>
          )
        })}
      </div>
    </aside>
  )
}

export default DocumentsSidebar
