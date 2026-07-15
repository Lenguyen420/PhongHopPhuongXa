import {
  CalendarDays,
  Download,
  File,
  MapPin,
  Pencil,
  Trash2,
  UserRound,
  Users,
  Video,
  X,
} from 'lucide-react'
import { formatFullDate, parseDate, typeStyles } from './calendarUtils'

function CalendarEventModal({ meeting, onClose }) {
  if (!meeting) {
    return null
  }

  const styles = typeStyles[meeting.type] ?? typeStyles['giao-ban']
  const hasMinutes = meeting.minutesStatus === 'Đã cập nhật'

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/45 px-3 py-6 backdrop-blur-sm">
      <section className="max-h-[92svh] w-full max-w-3xl overflow-hidden rounded-[20px] bg-white shadow-2xl ring-1 ring-slate-200">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-5 sm:px-6">
          <div className="min-w-0">
            <span
              className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ring-1 ${styles.event}`}
            >
              {styles.label}
            </span>
            <h2 className="mt-3 text-xl font-bold tracking-tight text-slate-950 sm:text-2xl">
              {meeting.title}
            </h2>
          </div>
          <button
            className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-950"
            onClick={onClose}
            type="button"
          >
            <X size={20} />
          </button>
        </div>

        <div className="max-h-[calc(92svh-170px)] overflow-y-auto px-5 py-5 sm:px-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <InfoItem icon={CalendarDays} label="Thời gian">
              <span>
                {meeting.startTime} - {meeting.endTime}
              </span>
              <span className="text-slate-500">{formatFullDate(parseDate(meeting.date))}</span>
            </InfoItem>
            <InfoItem icon={MapPin} label="Địa điểm">
              {meeting.room}
            </InfoItem>
            <InfoItem icon={UserRound} label="Người chủ trì">
              {meeting.host}
            </InfoItem>
            <InfoItem icon={Users} label="Trạng thái">
              {meeting.status}
            </InfoItem>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <section>
              <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500">
                Thành phần tham dự
              </h3>
              <ul className="mt-3 grid gap-2">
                {meeting.participants.map((participant) => (
                  <li
                    className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 ring-1 ring-slate-200"
                    key={participant}
                  >
                    {participant}
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500">
                Tài liệu cuộc họp
              </h3>
              <div className="mt-3 grid gap-2">
                {meeting.documents.map((document) => (
                  <div
                    className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 px-4 py-3 ring-1 ring-slate-200"
                    key={document}
                  >
                    <span className="flex min-w-0 items-center gap-2 text-sm font-semibold text-slate-700">
                      <File className="shrink-0 text-[#2563EB]" size={17} />
                      <span className="truncate">{document}</span>
                    </span>
                    <button
                      className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-slate-500 transition hover:bg-white hover:text-[#2563EB]"
                      type="button"
                    >
                      <Download size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <section className="mt-6 rounded-[20px] bg-slate-50 p-4 ring-1 ring-slate-200">
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

        <footer className="grid gap-2 border-t border-slate-200 p-4 sm:grid-cols-3 sm:px-6">
          <button
            className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#2563EB] px-4 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700"
            type="button"
          >
            <Video size={18} />
            Tham gia
          </button>
          <button
            className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-slate-100 px-4 text-sm font-bold text-slate-700 transition hover:bg-slate-200"
            type="button"
          >
            <Pencil size={18} />
            Chỉnh sửa
          </button>
          <button
            className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-red-50 px-4 text-sm font-bold text-[#EF4444] transition hover:bg-red-100"
            type="button"
          >
            <Trash2 size={18} />
            Huỷ cuộc họp
          </button>
        </footer>
      </section>
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

export default CalendarEventModal
