import {
  Camera,
  Edit3,
  MapPin,
  Monitor,
  Projector,
  RadioReceiver,
  Speaker,
  Users,
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

function RoomsGrid({ onEditRoom, onSelectRoom, rooms, viewMode }) {
  if (viewMode === 'table') {
    return (
      <section className="overflow-hidden rounded-[20px] bg-white shadow-sm ring-1 ring-slate-200/70">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-left">
            <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-6 py-4">Tên phòng</th>
                <th className="px-6 py-4">Trạng thái</th>
                <th className="px-6 py-4">Sức chứa</th>
                <th className="px-6 py-4">Thiết bị</th>
                <th className="px-6 py-4">Vị trí</th>
                <th className="px-6 py-4">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rooms.map((room) => {
                const colorKey = room.color || getRoomColor(room.name)
                const styles = roomColorStyles[colorKey] ?? roomColorStyles.blue
                return (
                  <tr className="transition hover:bg-slate-50/80" key={room.id}>
                    <td className={`px-6 py-5 text-sm font-bold ${styles.iconColor}`}>{room.name}</td>
                    <td className="px-6 py-5">
                      <StatusBadge status={room.status} />
                    </td>
                    <td className="px-6 py-5 text-sm font-semibold text-slate-600">
                      {room.capacity} người
                    </td>
                    <td className="px-6 py-5">
                      <DeviceList devices={room.devices} compact styles={styles} />
                    </td>
                    <td className="px-6 py-5 text-sm text-slate-600">
                      {room.location}, {room.floor}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex gap-2">
                        <button
                          aria-label={`Xem chi tiết ${room.name}`}
                          className={`rounded-2xl px-4 py-2 text-sm font-bold transition ${styles.btnBg}`}
                          onClick={() => onSelectRoom(room)}
                          type="button"
                        >
                          Xem chi tiết
                        </button>
                        <button
                          aria-label={`Chỉnh sửa ${room.name}`}
                          className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-200"
                          onClick={() => onEditRoom(room)}
                          type="button"
                        >
                          Chỉnh sửa
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>
    )
  }

  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {rooms.map((room) => {
        const colorKey = room.color || getRoomColor(room.name)
        const styles = roomColorStyles[colorKey] ?? roomColorStyles.blue

        return (
          <article
            className={`rounded-[20px] bg-white p-4 shadow-sm ring-1 ring-slate-200/70 transition hover:-translate-y-1 hover:shadow-lg sm:p-5 ${styles.border} ${styles.bg}`}
            key={room.id}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h2 className="truncate text-lg font-bold text-slate-950">{room.name}</h2>
                <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-slate-500">
                  <Users size={16} className={styles.iconColor} />
                  {room.capacity} người
                </p>
              </div>
              <StatusBadge status={room.status} />
            </div>

            <div className="mt-5">
              <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">
                Thiết bị
              </p>
              <DeviceList devices={room.devices} styles={styles} />
            </div>

            <div className={`mt-5 grid gap-2 rounded-[20px] p-4 text-sm font-semibold ring-1 transition duration-200 ${styles.accentBg}`}>
              <span className="flex items-center gap-2">
                <MapPin size={16} className={styles.iconColor} />
                {room.location}
              </span>
              <span className="flex items-center gap-2">
                <Monitor size={16} className={styles.iconColor} />
                {room.floor}
              </span>
            </div>

            <div className="mt-5 grid gap-2 min-[420px]:grid-cols-2">
              <button
                aria-label={`Xem chi tiết ${room.name}`}
                className={`inline-flex h-11 items-center justify-center rounded-2xl px-4 text-sm font-bold text-white transition ${styles.gradient ? `bg-gradient-to-r ${styles.gradient} hover:opacity-90 shadow-md shadow-blue-500/10` : 'bg-[#2563EB] hover:bg-blue-700'}`}
                onClick={() => onSelectRoom(room)}
                type="button"
              >
                Xem chi tiết
              </button>
              <button
                aria-label={`Chỉnh sửa ${room.name}`}
                className={`inline-flex h-11 items-center justify-center gap-2 rounded-2xl px-4 text-sm font-bold transition ${styles.btnBg} ring-1 ring-transparent hover:ring-current/10`}
                onClick={() => onEditRoom(room)}
                type="button"
              >
                <Edit3 size={16} />
                Chỉnh sửa
              </button>
            </div>
          </article>
        )
      })}
    </section>
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

function DeviceList({ compact = false, devices, styles }) {
  return (
    <div className="flex flex-wrap gap-2">
      {devices.map((device) => {
        const Icon = deviceIcons[device] ?? Monitor

        return (
          <span
            className={`inline-flex items-center gap-2 rounded-full bg-slate-50 text-xs font-bold text-slate-600 ring-1 ring-slate-200 ${
              compact ? 'px-2.5 py-1.5' : 'px-3 py-2'
            }`}
            key={device}
          >
            <Icon size={14} className={styles?.iconColor} />
            {device}
          </span>
        )
      })}
    </div>
  )
}

export default RoomsGrid
