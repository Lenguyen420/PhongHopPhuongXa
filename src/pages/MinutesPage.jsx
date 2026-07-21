import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { getApiErrorMessage } from '@/services/apiError'
import ExportModal from '@/components/MeetingMinutes/ExportModal'
import MinutesContent from '@/components/MeetingMinutes/MinutesContent'
import MinutesHeader from '@/components/MeetingMinutes/MinutesHeader'
import MinutesSidebar from '@/components/MeetingMinutes/MinutesSidebar'
import { useMeetingsQuery, useMinutesQuery, useSaveMinutesMutation } from '@/services/meetingApi'

const sidebarItems = [
  { id: 'info', label: 'Thông tin cuộc họp', description: 'Thông tin chung' },
  { id: 'contents', label: 'Nội dung cuộc họp', description: 'Diễn biến chính' },
  { id: 'opinions', label: 'Ý kiến', description: 'Phát biểu đại biểu' },
  { id: 'conclusions', label: 'Kết luận', description: 'Chỉ đạo sau họp' },
  { id: 'tasks', label: 'Nhiệm vụ', description: 'Theo dõi thực hiện' },
]
const taskStatusCodes = {
  'Chưa bắt đầu': 'TODO',
  'Đang thực hiện': 'IN_PROGRESS',
  'Hoàn thành': 'COMPLETED',
  'Đã hủy': 'CANCELLED',
}
const taskStatusLabels = Object.fromEntries(
  Object.entries(taskStatusCodes).map(([label, code]) => [code, label]),
)
const now = () => new Date().toLocaleTimeString('vi-VN', { hour12: false })
const nextId = (items) => Math.max(0, ...items.map((item) => Number(item.id) || 0)) + 1
const persistedId = (id) =>
  typeof id === 'string' && /^[0-9a-f]{8}-[0-9a-f-]{27}$/i.test(id) ? { id } : {}

function MinutesPage() {
  const { meetingId } = useParams()
  const { data: meetingList, isLoading: isLoadingList } = useMeetingsQuery(
    { page: 0, size: 100 },
    { skip: Boolean(meetingId) },
  )
  const { data, isLoading, isError, refetch } = useMinutesQuery(meetingId, { skip: !meetingId })
  const [saveMinutes] = useSaveMinutesMutation()
  const [contents, setContents] = useState([])
  const [opinions, setOpinions] = useState([])
  const [conclusions, setConclusions] = useState([])
  const [tasks, setTasks] = useState([])
  const [version, setVersion] = useState(0)
  const [activeSection, setActiveSection] = useState('info')
  const [exportMode, setExportMode] = useState(null)
  const [autoSaveStatus, setAutoSaveStatus] = useState({ isSaving: false, savedAt: now() })
  const saveTimerRef = useRef(null)
  const draftRef = useRef({ contents, opinions, conclusions, tasks, version })
  draftRef.current = { contents, opinions, conclusions, tasks, version }
  const sectionRefs = {
    info: useRef(null),
    contents: useRef(null),
    opinions: useRef(null),
    conclusions: useRef(null),
    tasks: useRef(null),
  }

  useEffect(() => {
    if (!data) return
    setContents(data.contents ?? [])
    setOpinions(data.opinions ?? [])
    setConclusions(data.conclusions ?? [])
    setTasks(
      (data.tasks ?? []).map((task) => ({
        ...task,
        assignee: task.assignee ?? '',
        unit: task.department ?? '',
        status: taskStatusLabels[task.status] ?? task.status,
      })),
    )
    setVersion(data.version ?? 0)
    setAutoSaveStatus({
      isSaving: false,
      savedAt: data.updatedAt ? new Date(data.updatedAt).toLocaleTimeString('vi-VN') : now(),
    })
  }, [data])

  if (!meetingId) {
    if (isLoadingList) return <State text="Đang tải danh sách cuộc họp..." />
    return (
      <div className="mx-auto grid max-w-4xl gap-4">
        <h1 className="text-2xl font-bold text-slate-950">Chọn cuộc họp để lập biên bản</h1>
        {(meetingList?.data ?? []).map((meeting) => (
          <Link
            className="rounded-2xl bg-white p-4 font-semibold text-slate-800 shadow-sm ring-1 ring-slate-200 hover:ring-blue-300"
            key={meeting.id}
            to={`/bien-ban/${meeting.id}`}
          >
            {meeting.title} — {meeting.date}
          </Link>
        ))}
        {!meetingList?.data?.length && <State text="Chưa có cuộc họp." />}
      </div>
    )
  }

  const persist = async () => {
    setAutoSaveStatus((current) => ({ ...current, isSaving: true }))
    const draft = draftRef.current
    try {
      const saved = await saveMinutes({
        meetingId,
        body: {
          version: draft.version,
          contents: draft.contents.map((item, index) => ({
            ...persistedId(item.id),
            title: item.title,
            content: item.content,
            order: index + 1,
          })),
          opinions: draft.opinions.map((item, index) => ({
            ...persistedId(item.id),
            speaker: item.speaker,
            position: item.position || undefined,
            content: item.content,
            order: index + 1,
          })),
          conclusions: draft.conclusions.map((item, index) => ({
            ...persistedId(item.id),
            content: item.content,
            order: index + 1,
          })),
          tasks: draft.tasks.map((item, index) => ({
            ...persistedId(item.id),
            content: item.content,
            assigneeId: item.assigneeId || undefined,
            departmentId: item.departmentId || undefined,
            dueDate: item.dueDate || undefined,
            status: taskStatusCodes[item.status] ?? item.status ?? 'TODO',
            order: index + 1,
          })),
        },
      }).unwrap()
      const reconcileIds = (items, persisted) =>
        items.map((item, index) => ({ ...item, id: persisted[index]?.id ?? item.id }))
      setContents((items) => reconcileIds(items, saved.contents ?? []))
      setOpinions((items) => reconcileIds(items, saved.opinions ?? []))
      setConclusions((items) => reconcileIds(items, saved.conclusions ?? []))
      setTasks((items) => reconcileIds(items, saved.tasks ?? []))
      setVersion(saved.version)
      setAutoSaveStatus({ isSaving: false, savedAt: now() })
    } catch (error) {
      setAutoSaveStatus((current) => ({ ...current, isSaving: false }))
      if (error?.data?.error === 'MINUTES_VERSION_CONFLICT') {
        toast.error('Biên bản đã được cập nhật ở phiên khác')
        refetch()
      } else toast.error(getApiErrorMessage(error, 'Không thể lưu biên bản'))
    }
  }
  const scheduleSave = () => {
    setAutoSaveStatus((current) => ({ ...current, isSaving: true }))
    if (saveTimerRef.current) window.clearTimeout(saveTimerRef.current)
    saveTimerRef.current = window.setTimeout(persist, 1200)
  }
  const update = (setter, id, field, value) => {
    setter((items) => items.map((item) => (item.id === id ? { ...item, [field]: value } : item)))
    scheduleSave()
  }
  const remove = (setter, id) => {
    setter((items) => items.filter((item) => item.id !== id))
    scheduleSave()
  }
  const meeting = data?.meeting
    ? {
        ...data.meeting,
        time: `${new Date(data.meeting.startAt).toLocaleString('vi-VN')} - ${new Date(data.meeting.endAt).toLocaleTimeString('vi-VN')}`,
      }
    : {}

  if (isLoading) return <State text="Đang tải biên bản..." />
  if (isError) return <State action={refetch} text="Không thể tải biên bản" />
  return (
    <div className="mx-auto grid max-w-[1600px] gap-4 sm:gap-6">
      <MinutesHeader
        autoSaveStatus={autoSaveStatus}
        meeting={meeting}
        onExport={setExportMode}
        onSave={() => {
          if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
          persist()
        }}
      />
      <section className="grid min-w-0 gap-4 xl:grid-cols-[280px_minmax(0,1fr)]">
        <MinutesSidebar
          activeSection={activeSection}
          items={sidebarItems}
          onSelect={(id) => {
            setActiveSection(id)
            sectionRefs[id].current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }}
        />
        <MinutesContent
          conclusions={conclusions}
          contents={contents}
          meeting={meeting}
          onAddConclusion={() => {
            setConclusions((items) => [...items, { id: nextId(items), content: '' }])
            scheduleSave()
          }}
          onAddContent={() => {
            setContents((items) => [
              ...items,
              { id: nextId(items), title: 'Nội dung mới', content: '' },
            ])
            scheduleSave()
          }}
          onAddOpinion={() => {
            setOpinions((items) => [
              ...items,
              { id: nextId(items), speaker: '', position: '', content: '' },
            ])
            scheduleSave()
          }}
          onAddTask={() => {
            setTasks((items) => [
              ...items,
              {
                id: nextId(items),
                content: '',
                assignee: '',
                unit: '',
                dueDate: '',
                status: 'Chưa bắt đầu',
              },
            ])
            scheduleSave()
          }}
          onChangeConclusion={(id, value) => update(setConclusions, id, 'content', value)}
          onChangeContent={(id, field, value) => update(setContents, id, field, value)}
          onChangeOpinion={(id, field, value) => update(setOpinions, id, field, value)}
          onChangeTask={(id, field, value) => update(setTasks, id, field, value)}
          onDeleteConclusion={(id) => remove(setConclusions, id)}
          onDeleteContent={(id) => remove(setContents, id)}
          onDeleteOpinion={(id) => remove(setOpinions, id)}
          onDeleteTask={(id) => remove(setTasks, id)}
          opinions={opinions}
          sectionRefs={sectionRefs}
          tasks={tasks}
        />
      </section>
      <ExportModal mode={exportMode} onClose={() => setExportMode(null)} />
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
export default MinutesPage
