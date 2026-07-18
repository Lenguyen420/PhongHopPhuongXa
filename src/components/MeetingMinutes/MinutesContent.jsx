import { AlignCenter, AlignLeft, AlignRight, Bold, Image, Italic, Link, List, ListOrdered, Plus, Table, Underline, X } from 'lucide-react'

const toolbarItems = [
  { label: 'Bold', icon: Bold },
  { label: 'Italic', icon: Italic },
  { label: 'Underline', icon: Underline },
  { label: 'Bullet List', icon: List },
  { label: 'Number List', icon: ListOrdered },
  { label: 'Align Left', icon: AlignLeft },
  { label: 'Align Center', icon: AlignCenter },
  { label: 'Align Right', icon: AlignRight },
  { label: 'Insert Table', icon: Table },
  { label: 'Insert Image', icon: Image },
  { label: 'Insert Link', icon: Link },
]

function MinutesContent({ conclusions, contents, meeting, onAddConclusion, onAddContent, onAddOpinion, onAddTask, onChangeConclusion, onChangeContent, onChangeOpinion, onChangeTask, onDeleteConclusion, onDeleteContent, onDeleteOpinion, onDeleteTask, opinions, sectionRefs, tasks }) {
  return (
    <main className="min-w-0 overflow-hidden rounded-2xl border border-gray-300 bg-slate-100 p-1 shadow-sm min-[420px]:p-2 sm:p-4">
      <div className="mx-auto grid min-w-0 w-full max-w-5xl gap-4 rounded-2xl border border-gray-300 bg-white p-3 shadow-sm min-[420px]:p-4 sm:p-6 xl:p-8">
        <EditorToolbar />

        <section className="min-w-0 scroll-mt-6 rounded-2xl border border-gray-300 bg-white p-3 min-[420px]:p-4 sm:p-5" ref={sectionRefs.info}>
          <DocumentSectionHeader eyebrow="Thông tin cuộc họp" title={meeting.title} />
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <InfoField label="Thời gian" value={meeting.time} />
            <InfoField label="Phòng họp" value={meeting.room} />
            <InfoField label="Chủ trì" value={meeting.chairperson} />
            <InfoField label="Thư ký" value={meeting.secretary} />
          </div>
        </section>

        <section className="min-w-0 scroll-mt-6 rounded-2xl border border-gray-300 bg-white p-3 min-[420px]:p-4 sm:p-5" ref={sectionRefs.contents}>
          <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <DocumentSectionHeader eyebrow="Nội dung cuộc họp" title="Diễn biến và nội dung thảo luận" />
            <AddButton label="Thêm nội dung" onClick={onAddContent} />
          </div>
          <div className="mt-4 grid gap-4">
            {contents.map((item, index) => (
              <article className="relative min-w-0 rounded-2xl border border-gray-300 bg-slate-50 p-3 pt-12 min-[420px]:p-4 min-[420px]:pt-12" key={item.id}>
                <DeleteButton label={`Xóa nội dung ${index + 1}`} onClick={() => onDeleteContent(item.id)} />
                <label className="grid gap-1.5">
                  <span className="text-xs font-bold uppercase tracking-wide text-slate-500">Tiêu đề {index + 1}</span>
                  <input className="h-11 w-full min-w-0 rounded-2xl border border-gray-300 bg-white px-3 text-sm font-bold text-slate-800 outline-none transition focus:border-[#2563EB] focus:ring-4 focus:ring-blue-100" onChange={(event) => onChangeContent(item.id, 'title', event.target.value)} value={item.title} />
                </label>
                <label className="mt-3 grid gap-1.5">
                  <span className="text-xs font-bold uppercase tracking-wide text-slate-500">Nội dung</span>
                  <textarea className="min-h-28 w-full min-w-0 rounded-2xl border border-gray-300 bg-white px-3 py-3 text-sm font-medium leading-6 text-slate-700 outline-none transition focus:border-[#2563EB] focus:ring-4 focus:ring-blue-100" onChange={(event) => onChangeContent(item.id, 'content', event.target.value)} value={item.content} />
                </label>
              </article>
            ))}
          </div>
        </section>

        <section className="min-w-0 scroll-mt-6 rounded-2xl border border-gray-300 bg-white p-3 min-[420px]:p-4 sm:p-5" ref={sectionRefs.opinions}>
          <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <DocumentSectionHeader eyebrow="Ý kiến" title="Ý kiến của đại biểu" />
            <AddButton label="Thêm ý kiến" onClick={onAddOpinion} />
          </div>
          <div className="mt-4 grid gap-4 xl:grid-cols-2">
            {opinions.map((opinion) => (
              <article className="relative min-w-0 rounded-2xl border border-gray-300 bg-slate-50 p-3 pt-12 min-[420px]:p-4 min-[420px]:pt-12" key={opinion.id}>
                <DeleteButton label="Xóa ý kiến" onClick={() => onDeleteOpinion(opinion.id)} />
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="grid gap-1.5">
                    <span className="text-xs font-bold uppercase tracking-wide text-slate-500">Người phát biểu</span>
                    <input className="h-11 w-full min-w-0 rounded-2xl border border-gray-300 bg-white px-3 text-sm font-bold text-slate-800 outline-none transition focus:border-[#2563EB] focus:ring-4 focus:ring-blue-100" onChange={(event) => onChangeOpinion(opinion.id, 'speaker', event.target.value)} value={opinion.speaker} />
                  </label>
                  <label className="grid gap-1.5">
                    <span className="text-xs font-bold uppercase tracking-wide text-slate-500">Chức vụ</span>
                    <input className="h-11 w-full min-w-0 rounded-2xl border border-gray-300 bg-white px-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-[#2563EB] focus:ring-4 focus:ring-blue-100" onChange={(event) => onChangeOpinion(opinion.id, 'position', event.target.value)} value={opinion.position} />
                  </label>
                </div>
                <label className="mt-3 grid gap-1.5">
                  <span className="text-xs font-bold uppercase tracking-wide text-slate-500">Nội dung ý kiến</span>
                  <textarea className="min-h-24 w-full min-w-0 rounded-2xl border border-gray-300 bg-white px-3 py-3 text-sm font-medium leading-6 text-slate-700 outline-none transition focus:border-[#2563EB] focus:ring-4 focus:ring-blue-100" onChange={(event) => onChangeOpinion(opinion.id, 'content', event.target.value)} value={opinion.content} />
                </label>
              </article>
            ))}
          </div>
        </section>

        <section className="min-w-0 scroll-mt-6 rounded-2xl border border-gray-300 bg-white p-3 min-[420px]:p-4 sm:p-5" ref={sectionRefs.conclusions}>
          <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <DocumentSectionHeader eyebrow="Kết luận" title="Kết luận của chủ trì" />
            <AddButton label="Thêm kết luận" onClick={onAddConclusion} />
          </div>
          <div className="mt-4 grid gap-3">
            {conclusions.map((conclusion, index) => (
              <div className="relative grid grid-cols-[40px_minmax(0,1fr)] items-start gap-3 rounded-2xl border border-gray-300 bg-slate-50 p-3 pr-12" key={conclusion.id}>
                <span className="grid h-10 w-10 place-items-center rounded-2xl bg-blue-50 text-sm font-bold text-[#2563EB]">{index + 1}</span>
                <textarea className="min-h-20 w-full min-w-0 rounded-2xl border border-gray-300 bg-white px-3 py-3 text-sm font-medium leading-6 text-slate-700 outline-none transition focus:border-[#2563EB] focus:ring-4 focus:ring-blue-100" onChange={(event) => onChangeConclusion(conclusion.id, event.target.value)} value={conclusion.content} />
                <DeleteButton label={`Xóa kết luận ${index + 1}`} onClick={() => onDeleteConclusion(conclusion.id)} />
              </div>
            ))}
          </div>
        </section>

        <section className="min-w-0 scroll-mt-6 rounded-2xl border border-gray-300 bg-white p-3 min-[420px]:p-4 sm:p-5" ref={sectionRefs.tasks}>
          <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <DocumentSectionHeader eyebrow="Nhiệm vụ" title="Danh sách nhiệm vụ sau cuộc họp" />
            <AddButton label="Thêm nhiệm vụ" onClick={onAddTask} />
          </div>
          <div className="mt-4 overflow-x-auto rounded-2xl border border-gray-300">
            <table className="w-full min-w-[820px] border-collapse bg-white text-left text-sm">
              <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="border-b border-gray-300 px-3 py-3">STT</th>
                  <th className="border-b border-gray-300 px-3 py-3">Nội dung nhiệm vụ</th>
                  <th className="border-b border-gray-300 px-3 py-3">Người phụ trách</th>
                  <th className="border-b border-gray-300 px-3 py-3">Đơn vị</th>
                  <th className="border-b border-gray-300 px-3 py-3">Hạn hoàn thành</th>
                  <th className="border-b border-gray-300 px-3 py-3">Trạng thái</th>
                  <th className="border-b border-gray-300 px-3 py-3 text-center">Xóa</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task, index) => (
                  <tr className="align-top" key={task.id}>
                    <td className="border-b border-gray-300 px-3 py-3 font-bold text-slate-500">{index + 1}</td>
                    <TaskCell field="content" id={task.id} onChange={onChangeTask} value={task.content} wide />
                    <TaskCell field="assignee" id={task.id} onChange={onChangeTask} value={task.assignee} />
                    <TaskCell field="unit" id={task.id} onChange={onChangeTask} value={task.unit} />
                    <TaskCell field="dueDate" id={task.id} onChange={onChangeTask} value={task.dueDate} />
                    <TaskCell field="status" id={task.id} onChange={onChangeTask} value={task.status} />
                    <td className="border-b border-gray-300 px-3 py-3">
                      <DeleteButton label={`Xóa nhiệm vụ ${index + 1}`} onClick={() => onDeleteTask(task.id)} table />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  )
}

function EditorToolbar() {
  return (
    <div className="sticky top-0 z-10 flex min-w-0 flex-nowrap items-center gap-1 overflow-x-auto rounded-2xl border border-gray-300 bg-white/95 p-2 shadow-sm backdrop-blur sm:flex-wrap">
      {toolbarItems.map(({ label, icon: Icon }) => (
        <button aria-label={label} className="grid h-9 w-9 shrink-0 place-items-center rounded-2xl text-slate-600 transition hover:bg-blue-50 hover:text-[#2563EB] sm:h-10 sm:w-10" key={label} title={label} type="button">
          <Icon size={18} />
        </button>
      ))}
    </div>
  )
}

function DocumentSectionHeader({ eyebrow, title }) {
  return (
    <div className="min-w-0">
      <p className="text-xs font-bold uppercase tracking-wide text-[#2563EB]">{eyebrow}</p>
      <h2 className="mt-1 break-words text-lg font-bold tracking-tight text-slate-950 sm:text-xl">{title}</h2>
    </div>
  )
}

function InfoField({ label, value }) {
  return (
    <div className="rounded-2xl border border-gray-300 bg-slate-50 px-4 py-3">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 break-words text-sm font-bold text-slate-800">{value}</p>
    </div>
  )
}

function AddButton({ label, onClick }) {
  return (
    <button className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl border border-gray-300 bg-white px-4 text-sm font-bold text-[#2563EB] shadow-sm transition hover:bg-blue-50 min-[420px]:w-auto" onClick={onClick} type="button">
      <Plus size={17} />
      {label}
    </button>
  )
}

function DeleteButton({ label, onClick, table = false }) {
  return (
    <button aria-label={label} className={`${table ? 'mx-auto' : 'absolute right-3 top-3'} grid h-9 w-9 place-items-center rounded-2xl border border-gray-300 bg-white text-slate-500 shadow-sm transition hover:border-red-200 hover:bg-red-50 hover:text-red-600`} onClick={onClick} title={label} type="button">
      <X size={18} />
    </button>
  )
}

function TaskCell({ field, id, onChange, value, wide = false }) {
  return (
    <td className={`border-b border-gray-300 px-3 py-3 ${wide ? 'min-w-[220px]' : 'min-w-[130px]'}`}>
      <textarea aria-label={field} className="min-h-12 w-full min-w-0 resize-y rounded-2xl border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 outline-none transition focus:border-[#2563EB] focus:ring-4 focus:ring-blue-100" onChange={(event) => onChange(id, field, event.target.value)} value={value} />
    </td>
  )
}

export default MinutesContent
