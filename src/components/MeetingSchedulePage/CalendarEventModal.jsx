import { useState } from 'react'
import toast from 'react-hot-toast'
import {
  Bell,
  CalendarDays,
  CheckSquare,
  Download,
  File,
  MapPin,
  Pencil,
  Radio,
  Trash2,
  UserRound,
  Users,
  Video,
  X,
} from 'lucide-react'
import { formatFullDate, parseDate, typeStyles } from './calendarUtils'
import { downloadAttachment } from '@/services/files'

function CalendarEventModal({ meeting, onClose, onEdit, onCancel }) {
  const [participationMode, setParticipationMode] = useState(null)
  const [delegateInfo, setDelegateInfo] = useState({ email: '', name: '', phone: '', position: '' })
  const [declineReason, setDeclineReason] = useState('')

  if (!meeting) {
    return null
  }

  const styles = typeStyles[meeting.type] ?? typeStyles['giao-ban']
  const hasMinutes = meeting.minutesStatus && meeting.minutesStatus !== 'NONE'
  const meetingRoomId = meeting.id
  const meetingRoomUrl = `/meeting-room/${meetingRoomId}`

  const handleAgreeJoin = () => {
    toast.success('Đã xác nhận đồng ý tham gia cuộc họp')
    setParticipationMode(null)
    window.open(meetingRoomUrl, '_blank')
  }

  const handleDelegateSubmit = (event) => {
    event.preventDefault()
    toast.success(`Đã chuyển lịch tham dự cho ${delegateInfo.name}`)
    setParticipationMode(null)
    setDelegateInfo({ email: '', name: '', phone: '', position: '' })
  }

  const handleDeclineSubmit = (event) => {
    event.preventDefault()
    toast.success('Đã ghi nhận phản hồi không đồng ý tham gia')
    setParticipationMode(null)
    setDeclineReason('')
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/45 px-3 py-6 backdrop-blur-sm">
      <section className="flex max-h-[92svh] w-full max-w-4xl flex-col overflow-hidden rounded-[20px] bg-white shadow-2xl ring-1 ring-slate-200">
        <div className="shrink-0 border-b border-slate-200 px-5 py-5 sm:px-6">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex flex-wrap gap-2">
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ring-1 ${styles.event}`}
                >
                  {styles.label}
                </span>
                <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600 ring-1 ring-slate-200">
                  {meeting.status}
                </span>
              </div>
              <h2 className="mt-3 text-xl font-bold tracking-tight text-slate-950 sm:text-2xl">
                {meeting.title}
              </h2>
              <p className="mt-2 max-w-3xl text-sm font-medium leading-6 text-slate-500">
                {meeting.description}
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
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <InfoItem icon={CalendarDays} label="Thời gian">
              <span>
                {meeting.startTime} - {meeting.endTime}
              </span>
              <span className="text-slate-500">{formatFullDate(parseDate(meeting.date))}</span>
              {meeting.allDay && <span className="text-slate-500">Họp cả ngày</span>}
            </InfoItem>
            <InfoItem icon={MapPin} label="Địa điểm">
              <span>{meeting.meetingMode}</span>
              <span className="text-slate-500">{meeting.room}</span>
            </InfoItem>
            <InfoItem icon={UserRound} label="Người chủ trì">
              {meeting.host}
            </InfoItem>
            <InfoItem icon={Users} label="Phòng ban tham dự">
              {meeting.departments?.map((item) => item.name).join(', ') || 'Toàn bộ cán bộ'}
            </InfoItem>
          </div>

          <section className="mt-6 rounded-[20px] bg-slate-50 p-4 ring-1 ring-slate-200">
            <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500">
              Tuỳ chọn cuộc họp
            </h3>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <OptionBadge
                icon={CheckSquare}
                label="Biểu quyết"
                value={meeting.options.voting ? 'Có' : 'Không'}
              />
              <OptionBadge
                icon={Video}
                label="Ghi hình"
                value={meeting.options.recording ? 'Có' : 'Không'}
              />
              <OptionBadge icon={Radio} label="Điểm danh" value={meeting.options.attendance} />
              <OptionBadge
                icon={Bell}
                label="Nhắc lịch"
                value={meeting.options.reminders.join(', ')}
              />
            </div>
          </section>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <section>
              <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500">
                Thành phần tham dự
              </h3>
              <ul className="mt-3 grid gap-2">
                {meeting.participants.map((participant) => (
                  <li
                    className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 ring-1 ring-slate-200"
                    key={participant.id}
                  >
                    {participant.name} - {participant.role}
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500">
                Khách mời
              </h3>
              <div className="mt-3 grid gap-2">
                {meeting.guests?.length ? (
                  meeting.guests.map((guest) => (
                    <div
                      className="rounded-2xl bg-slate-50 px-4 py-3 text-sm ring-1 ring-slate-200"
                      key={`${guest.email}-${guest.phone}`}
                    >
                      <p className="font-bold text-slate-800">{guest.name}</p>
                      <p className="mt-1 font-medium text-slate-500">{guest.unit}</p>
                      <p className="mt-1 font-medium text-slate-500">
                        {guest.email} • {guest.phone}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-500 ring-1 ring-slate-200">
                    Không có khách mời ngoài danh sách tham dự.
                  </p>
                )}
              </div>
            </section>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <section>
              <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500">
                Tài liệu cuộc họp
              </h3>
              <div className="mt-3 grid gap-2">
                {meeting.documents.map((document) => (
                  <div
                    className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 px-4 py-3 ring-1 ring-slate-200"
                    key={document.id}
                  >
                    <span className="flex min-w-0 items-center gap-2 text-sm font-semibold text-slate-700">
                      <File className="shrink-0 text-[#2563EB]" size={17} />
                      <span className="truncate">{document.fileName}</span>
                    </span>
                    <button
                      aria-label={`Tải xuống ${document.fileName}`}
                      className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-slate-500 transition hover:bg-white hover:text-[#2563EB]"
                      onClick={() => downloadAttachment(document)}
                      type="button"
                    >
                      <Download size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-[20px] bg-slate-50 p-4 ring-1 ring-slate-200">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500">
                    Biên bản cuộc họp
                  </h3>
                  <p className="mt-1 text-base font-bold text-slate-900">{meeting.minutesStatus}</p>
                </div>
                {hasMinutes && (
                  <button
                    className="inline-flex h-11 items-center justify-center rounded-2xl bg-white px-4 text-sm font-bold text-[#2563EB] shadow-sm ring-1 ring-slate-200 transition hover:bg-blue-50"
                    type="button"
                  >
                    Xem biên bản
                  </button>
                )}
              </div>
            </section>
          </div>
        </div>

        <footer className="shrink-0 border-t border-slate-200 bg-white p-4 sm:grid sm:grid-cols-3 sm:gap-2 sm:px-6">
          <button
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#2563EB] px-4 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700"
            disabled={!meeting.canJoin}
            onClick={() => setParticipationMode('choice')}
            type="button"
          >
            <Video size={18} />
            Tham gia
          </button>
          <button
            className="mt-2 inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-slate-100 px-4 text-sm font-bold text-slate-700 transition hover:bg-slate-200 sm:mt-0"
            disabled={!meeting.canEdit}
            onClick={() => onEdit?.(meeting)}
            type="button"
          >
            <Pencil size={18} />
            Chỉnh sửa
          </button>
          <button
            className="mt-2 inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-red-50 px-4 text-sm font-bold text-[#EF4444] transition hover:bg-red-100 sm:mt-0"
            disabled={!meeting.canCancel}
            onClick={() => onCancel?.(meeting)}
            type="button"
          >
            <Trash2 size={18} />
            Huỷ cuộc họp
          </button>
        </footer>
      </section>

      {participationMode && (
        <ParticipationModal
          declineReason={declineReason}
          delegateInfo={delegateInfo}
          meetingTitle={meeting.title}
          mode={participationMode}
          onAgree={handleAgreeJoin}
          onClose={() => setParticipationMode(null)}
          onDeclineChange={setDeclineReason}
          onDeclineSubmit={handleDeclineSubmit}
          onDelegateChange={setDelegateInfo}
          onDelegateSubmit={handleDelegateSubmit}
          setMode={setParticipationMode}
        />
      )}
    </div>
  )
}

function ParticipationModal({ declineReason, delegateInfo, meetingTitle, mode, onAgree, onClose, onDeclineChange, onDeclineSubmit, onDelegateChange, onDelegateSubmit, setMode }) {
  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-slate-950/50 px-3 py-6 backdrop-blur-sm">
      <section className="w-full max-w-2xl overflow-hidden rounded-2xl border border-gray-300 bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-gray-300 px-5 py-4">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#2563EB]">Xác nhận tham dự</p>
            <h3 className="mt-2 break-words text-lg font-bold text-slate-950">{meetingTitle}</h3>
          </div>
          <button aria-label="Đóng xác nhận tham dự" className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-950" onClick={onClose} type="button">
            <X size={20} />
          </button>
        </div>

        {mode === 'choice' && (
          <div className="grid gap-3 p-5 sm:grid-cols-3">
            <button className="grid gap-2 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-left transition hover:bg-blue-100" onClick={onAgree} type="button">
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-white text-[#2563EB]"><Video size={18} /></span>
              <span className="font-bold text-slate-950">Đồng ý tham gia</span>
              <span className="text-sm font-medium leading-5 text-slate-500">Xác nhận và mở phòng họp trực tuyến.</span>
            </button>
            <button className="grid gap-2 rounded-2xl border border-gray-300 bg-white p-4 text-left transition hover:bg-slate-50" onClick={() => setMode('delegate')} type="button">
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-slate-100 text-slate-600"><UserRound size={18} /></span>
              <span className="font-bold text-slate-950">Chuyển cho người khác</span>
              <span className="text-sm font-medium leading-5 text-slate-500">Nhập thông tin người tham dự thay.</span>
            </button>
            <button className="grid gap-2 rounded-2xl border border-red-200 bg-red-50 p-4 text-left transition hover:bg-red-100" onClick={() => setMode('decline')} type="button">
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-white text-red-600"><X size={18} /></span>
              <span className="font-bold text-slate-950">Không đồng ý</span>
              <span className="text-sm font-medium leading-5 text-slate-500">Gửi lý do không thể tham dự.</span>
            </button>
          </div>
        )}

        {mode === 'delegate' && (
          <form className="grid gap-4 p-5" onSubmit={onDelegateSubmit}>
            <div className="grid gap-3 sm:grid-cols-2">
              <FormInput label="Họ và tên" name="name" onChange={onDelegateChange} required value={delegateInfo.name} />
              <FormInput label="Chức vụ" name="position" onChange={onDelegateChange} required value={delegateInfo.position} />
              <FormInput label="Email" name="email" onChange={onDelegateChange} required type="email" value={delegateInfo.email} />
              <FormInput label="Số điện thoại" name="phone" onChange={onDelegateChange} required value={delegateInfo.phone} />
            </div>
            <ModalActions onBack={() => setMode('choice')} submitLabel="Xác nhận chuyển" />
          </form>
        )}

        {mode === 'decline' && (
          <form className="grid gap-4 p-5" onSubmit={onDeclineSubmit}>
            <label className="grid gap-1.5">
              <span className="text-xs font-bold uppercase tracking-wide text-slate-500">Lý do không đồng ý tham gia</span>
              <textarea className="min-h-32 rounded-2xl border border-gray-300 bg-white px-3 py-3 text-sm font-semibold leading-6 text-slate-700 outline-none transition focus:border-[#2563EB] focus:ring-4 focus:ring-blue-100" onChange={(event) => onDeclineChange(event.target.value)} placeholder="Nhập lý do..." required value={declineReason} />
            </label>
            <ModalActions onBack={() => setMode('choice')} submitLabel="Gửi phản hồi" />
          </form>
        )}
      </section>
    </div>
  )
}

function FormInput({ label, name, onChange, required = false, type = 'text', value }) {
  return (
    <label className="grid gap-1.5">
      <span className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</span>
      <input className="h-11 rounded-2xl border border-gray-300 bg-white px-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-[#2563EB] focus:ring-4 focus:ring-blue-100" name={name} onChange={(event) => onChange((current) => ({ ...current, [name]: event.target.value }))} required={required} type={type} value={value} />
    </label>
  )
}

function ModalActions({ onBack, submitLabel }) {
  return (
    <div className="flex flex-col-reverse gap-2 border-t border-gray-300 pt-4 sm:flex-row sm:justify-end">
      <button className="inline-flex h-11 items-center justify-center rounded-2xl border border-gray-300 bg-white px-5 text-sm font-bold text-slate-700 transition hover:bg-slate-50" onClick={onBack} type="button">Quay lại</button>
      <button className="inline-flex h-11 items-center justify-center rounded-2xl bg-[#2563EB] px-5 text-sm font-bold text-white transition hover:bg-blue-700" type="submit">{submitLabel}</button>
    </div>
  )
}

function InfoItem({ children, icon: Icon, label }) {
  return (
    <div className="flex gap-3 rounded-[20px] bg-slate-50 p-4 ring-1 ring-slate-200">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-white text-[#2563EB] ring-1 ring-slate-200">
        <Icon size={18} />
      </span>
      <div className="grid gap-1">
        <span className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</span>
        <span className="grid text-sm font-bold text-slate-800">{children}</span>
      </div>
    </div>
  )
}

function OptionBadge({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl bg-white p-3 ring-1 ring-slate-200">
      <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-500">
        <Icon size={15} className="text-[#2563EB]" />
        {label}
      </span>
      <p className="mt-2 text-sm font-bold text-slate-800">{value}</p>
    </div>
  )
}

export default CalendarEventModal
