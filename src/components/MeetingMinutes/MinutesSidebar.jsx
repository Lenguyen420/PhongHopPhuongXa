import { CheckSquare, ClipboardList, FileText, Info, ListChecks, MessageSquareText } from 'lucide-react'

const itemIcons = {
  info: Info,
  contents: FileText,
  opinions: MessageSquareText,
  conclusions: ClipboardList,
  tasks: CheckSquare,
}

function MinutesSidebar({ activeSection, items, onSelect }) {
  return (
    <aside className="min-w-0 overflow-hidden rounded-2xl border border-gray-300 bg-white p-3 shadow-sm sm:p-4 xl:sticky xl:top-4">
      <div className="mb-3 flex items-center justify-between px-1">
        <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">Mục lục</h2>
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-blue-50 text-[#2563EB]">
          <ListChecks size={18} />
        </span>
      </div>

      <nav className="flex min-w-0 gap-2 overflow-x-auto pb-1 xl:grid xl:overflow-visible xl:pb-0">
        {items.map((item) => {
          const Icon = itemIcons[item.id] || FileText
          const isActive = activeSection === item.id

          return (
            <button className={`flex w-[220px] shrink-0 items-center gap-3 rounded-2xl border px-3 py-3 text-left transition xl:w-full ${isActive ? 'border-blue-200 bg-blue-50 text-[#2563EB] shadow-sm' : 'border-transparent text-slate-700 hover:border-gray-300 hover:bg-slate-50'}`} key={item.id} onClick={() => onSelect(item.id)} type="button">
              <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-2xl ${isActive ? 'bg-white text-[#2563EB]' : 'bg-slate-100 text-slate-500'}`}>
                <Icon size={19} />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-bold">{item.label}</span>
                <span className="block truncate text-xs font-semibold text-slate-400">{item.description}</span>
              </span>
            </button>
          )
        })}
      </nav>
    </aside>
  )
}

export default MinutesSidebar
