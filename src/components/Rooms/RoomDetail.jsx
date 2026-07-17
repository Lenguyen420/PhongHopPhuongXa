import {
  Camera,
  Clock3,
  MapPin,
  Monitor,
  Projector,
  RadioReceiver,
  Ruler,
  Speaker,
  Users,
  Video,
  X,
} from 'lucide-react'
import { getRoomColor, roomColorStyles } from '@/datas/roomsData'

const statusClasses = {
  'Đang sử dụng': 'bg-rose-50 text-rose-700 ring-rose-200/70',
  Trống: 'bg-emerald-50 text-emerald-700 ring-emerald-200/70',
  'Bảo trì': 'bg-amber-50 text-amber-700 ring-amber-200/70',
}

const deviceIcons = {
  Camera,
  Loa: Speaker,
  Micro: RadioReceiver,
  'Máy chiếu': Projector,
  'Màn hình': Monitor,
}

function RoomDetail({ onClose, room }) {
  if (!room) {
    return null
  }

  const colorKey = room.color || getRoomColor(room.name)
  const styles = roomColorStyles[colorKey] ?? roomColorStyles.blue

  const currentMeetingId =
    room.currentMeeting?.id ?? (room.id === 'room-01' ? 'meeting-001' : 'meeting-005')

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/45 p-0 backdrop-blur-sm sm:p-4">
      <section className="flex h-full w-full flex-col overflow-hidden bg-white shadow-2xl ring-1 ring-slate-200 sm:max-w-3xl sm:rounded-[20px]">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 p-4 sm:p-6">
          <div className="min-w-0">
            <StatusBadge status={room.status} />
            <h2 className="mt-3 text-xl font-bold tracking-tight text-slate-950 sm:text-2xl">
              {room.name}
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

        <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
          <img
            alt={room.name}
            className="h-56 w-full rounded-[20px] object-cover ring-1 ring-slate-200 sm:h-72"
            src={room.image}
          />

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <InfoCard icon={Users} label="Sức chứa" value={`${room.capacity} người`} styles={styles} />
            <InfoCard icon={Ruler} label="Diện tích" value={room.area} styles={styles} />
            <InfoCard icon={MapPin} label="Vị trí" value={room.location} styles={styles} />
            <InfoCard icon={Monitor} label="Tầng" value={room.floor} styles={styles} />
          </div>

          <section className="mt-6 rounded-[20px] bg-slate-50 p-4 ring-1 ring-slate-200">
            <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500">
              Danh sách thiết bị
            </h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {room.devices.map((device) => {
                const Icon = deviceIcons[device] ?? Monitor

                return (
                  <span
                    className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-bold text-slate-700 ring-1 ring-slate-200 shadow-sm"
                    key={device}
                  >
                    <Icon size={15} className={styles.iconColor} />
                    {device}
                  </span>
                )
              })}
            </div>
          </section>

          <section className="mt-6 rounded-[20px] bg-white p-4 ring-1 ring-slate-200">
            <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500">
              Sơ đồ phòng họp
            </h3>
            <div className="mt-4 rounded-[20px] bg-slate-50 p-4 text-center ring-1 ring-slate-200">
              <div className="mx-auto max-w-md rounded-2xl bg-slate-900 px-4 py-3 text-sm font-bold text-white">
                Màn hình
              </div>
              <div className="mx-auto my-4 h-px max-w-lg bg-slate-300" />
              <div className="mx-auto mb-5 max-w-xs rounded-2xl bg-blue-50 px-4 py-3 text-sm font-bold text-[#2563EB] ring-1 ring-blue-100">
                Bàn chủ trì
              </div>
              <div className="grid gap-3">
                {Array.from({ length: room.layout.rows }).map((_, rowIndex) => (
                  <div className="flex justify-center gap-2" key={rowIndex}>
                    {Array.from({ length: room.layout.seatsPerRow }).map((__, seatIndex) => (
                      <span
                        className="h-4 w-4 rounded-full bg-white ring-2 ring-slate-300"
                        key={`${rowIndex}-${seatIndex}`}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="mt-6">
            {room.currentMeeting ? (
              <div className="rounded-[20px] bg-blue-50 p-4 ring-1 ring-blue-100">
                <h3 className="text-sm font-bold uppercase tracking-wide text-[#2563EB]">
                  Phòng đang họp
                </h3>
                <p className="mt-3 text-lg font-bold text-slate-950">{room.currentMeeting.title}</p>
                <div className="mt-3 grid gap-2 text-sm font-semibold text-slate-600">
                  <span className="flex items-center gap-2">
                    <Clock3 size={16} className="text-[#2563EB]" />
                    {room.currentMeeting.time}
                  </span>
                  <span className="flex items-center gap-2">
                    <Users size={16} className="text-[#10B981]" />
                    {room.currentMeeting.host}
                  </span>
                </div>
                <button
                  className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-[#2563EB] px-4 text-sm font-bold text-white transition hover:bg-blue-700 sm:w-auto"
                  onClick={() => window.open(`/meeting-room/${currentMeetingId}`, '_blank')}
                  type="button"
                >
                  <Video size={18} />
                  Tham gia cuộc họp
                </button>
              </div>
            ) : (
              <div className="rounded-[20px] bg-emerald-50 p-4 text-sm font-bold text-emerald-700 ring-1 ring-emerald-200/70">
                Phòng hiện đang trống.
              </div>
            )}
          </section>

          <section className="mt-6 rounded-[20px] bg-white p-4 ring-1 ring-slate-200">
            <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500">
              Lịch sử sử dụng
            </h3>
            <div className="mt-4 grid gap-3">
              {room.history.map((item) => (
                <div
                  className="rounded-2xl bg-slate-50 p-3 text-sm ring-1 ring-slate-200"
                  key={`${item.date}-${item.title}`}
                >
                  <p className="font-bold text-slate-900">{item.title}</p>
                  <p className="mt-1 font-medium text-slate-500">
                    {item.date} • {item.time}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>
    </div>
  )
}

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex w-fit shrink-0 rounded-full px-3 py-1 text-xs font-bold ring-1 ${
        statusClasses[status] ?? statusClasses.Trống
      }`}
    >
      {status}
    </span>
  )
}

function InfoCard({ icon: Icon, label, value, styles }) {
  return (
    <div className={`flex gap-3 rounded-[20px] p-4 ring-1 transition duration-200 ${styles.accentBg}`}>
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-white ring-1 ring-slate-200/50 shadow-sm">
        <Icon size={18} className={styles.iconColor} />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-bold uppercase tracking-wide opacity-75">{label}</p>
        <p className="mt-1 truncate text-sm font-bold">{value}</p>
      </div>
    </div>
  )
}

export default RoomDetail
