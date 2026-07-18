import { useRef, useState } from 'react'
import ExportModal from '@/components/MeetingMinutes/ExportModal'
import MinutesContent from '@/components/MeetingMinutes/MinutesContent'
import MinutesHeader from '@/components/MeetingMinutes/MinutesHeader'
import MinutesSidebar from '@/components/MeetingMinutes/MinutesSidebar'
import { meetingMinutesData } from '@/datas/meetingMinutes'

const sidebarItems = [
  { id: 'info', label: 'Thông tin cuộc họp', description: 'Thông tin chung' },
  { id: 'contents', label: 'Nội dung cuộc họp', description: 'Diễn biến chính' },
  { id: 'opinions', label: 'Ý kiến', description: 'Phát biểu đại biểu' },
  { id: 'conclusions', label: 'Kết luận', description: 'Chỉ đạo sau họp' },
  { id: 'tasks', label: 'Nhiệm vụ', description: 'Theo dõi thực hiện' },
]

const formatCurrentTime = () => new Date().toLocaleTimeString('vi-VN', { hour12: false })

const getNextId = (items) => Math.max(0, ...items.map((item) => item.id)) + 1

function MinutesPage() {
  const [contents, setContents] = useState(meetingMinutesData.contents)
  const [opinions, setOpinions] = useState(meetingMinutesData.opinions)
  const [conclusions, setConclusions] = useState(() => meetingMinutesData.conclusions.map((content, index) => ({ id: index + 1, content })))
  const [tasks, setTasks] = useState(meetingMinutesData.tasks)
  const [activeSection, setActiveSection] = useState('info')
  const [exportMode, setExportMode] = useState(null)
  const [autoSaveStatus, setAutoSaveStatus] = useState({ isSaving: false, savedAt: formatCurrentTime() })
  const saveTimerRef = useRef(null)
  const infoRef = useRef(null)
  const contentsRef = useRef(null)
  const opinionsRef = useRef(null)
  const conclusionsRef = useRef(null)
  const tasksRef = useRef(null)
  const sectionRefs = {
    info: infoRef,
    contents: contentsRef,
    opinions: opinionsRef,
    conclusions: conclusionsRef,
    tasks: tasksRef,
  }

  const triggerAutoSave = () => {
    setAutoSaveStatus((currentStatus) => ({ ...currentStatus, isSaving: true }))

    if (saveTimerRef.current) {
      window.clearTimeout(saveTimerRef.current)
    }

    saveTimerRef.current = window.setTimeout(() => {
      setAutoSaveStatus({ isSaving: false, savedAt: formatCurrentTime() })
    }, 2400)
  }

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId)
    sectionRefs[sectionId].current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const updateCollectionItem = (setter, id, field, value) => {
    setter((items) => items.map((item) => (item.id === id ? { ...item, [field]: value } : item)))
    triggerAutoSave()
  }

  const deleteCollectionItem = (setter, id) => {
    setter((items) => items.filter((item) => item.id !== id))
    triggerAutoSave()
  }

  const handleSaveNow = () => {
    if (saveTimerRef.current) {
      window.clearTimeout(saveTimerRef.current)
    }

    setAutoSaveStatus({ isSaving: false, savedAt: formatCurrentTime() })
  }

  const addContent = () => {
    setContents((items) => [...items, { id: getNextId(items), title: 'Nội dung mới', content: '' }])
    triggerAutoSave()
  }

  const addOpinion = () => {
    setOpinions((items) => [...items, { id: getNextId(items), speaker: '', position: '', content: '' }])
    triggerAutoSave()
  }

  const addConclusion = () => {
    setConclusions((items) => [...items, { id: getNextId(items), content: '' }])
    triggerAutoSave()
  }

  const addTask = () => {
    setTasks((items) => [...items, { id: getNextId(items), content: '', assignee: '', unit: '', dueDate: '', status: 'Chưa bắt đầu' }])
    triggerAutoSave()
  }

  return (
    <div className="mx-auto grid max-w-[1600px] gap-4 sm:gap-6">
      <MinutesHeader autoSaveStatus={autoSaveStatus} meeting={meetingMinutesData.meeting} onExport={setExportMode} onSave={handleSaveNow} />

      <section className="grid min-w-0 gap-4 xl:grid-cols-[280px_minmax(0,1fr)]">
        <MinutesSidebar activeSection={activeSection} items={sidebarItems} onSelect={scrollToSection} />
        <MinutesContent conclusions={conclusions} contents={contents} meeting={meetingMinutesData.meeting} onAddConclusion={addConclusion} onAddContent={addContent} onAddOpinion={addOpinion} onAddTask={addTask} onChangeConclusion={(id, value) => updateCollectionItem(setConclusions, id, 'content', value)} onChangeContent={(id, field, value) => updateCollectionItem(setContents, id, field, value)} onChangeOpinion={(id, field, value) => updateCollectionItem(setOpinions, id, field, value)} onChangeTask={(id, field, value) => updateCollectionItem(setTasks, id, field, value)} onDeleteConclusion={(id) => deleteCollectionItem(setConclusions, id)} onDeleteContent={(id) => deleteCollectionItem(setContents, id)} onDeleteOpinion={(id) => deleteCollectionItem(setOpinions, id)} onDeleteTask={(id) => deleteCollectionItem(setTasks, id)} opinions={opinions} sectionRefs={sectionRefs} tasks={tasks} />
      </section>

      <ExportModal mode={exportMode} onClose={() => setExportMode(null)} />
    </div>
  )
}

export default MinutesPage
