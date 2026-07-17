import { Camera, Monitor, RadioReceiver, Users } from 'lucide-react'
import { getRoomColor, roomColorStyles } from '@/datas/roomsData'

const deviceIcons = {
  Camera,
  Livestream: RadioReceiver,
  Micro: RadioReceiver,
  'Máy chiếu': Monitor,
  'Màn hình': Monitor,
}

const statusClasses = {
  'Đang sử dụng': 'bg-rose-50 text-rose-700 ring-rose-200/70',
  Trống: 'bg-emerald-50 text-emerald-700 ring-emerald-200/70',
  'Bảo trì': 'bg-amber-50 text-amber-700 ring-amber-200/70',
}

function DashboardRoomGrid({ rooms }) {
  return (
    <section className="rounded-[20px] bg-white p-4 shadow-sm ring-1 ring-slate-200/70 sm:p-6">
      <h2 className="text-base font-bold text-slate-950 sm:text-lg">Danh sách phòng họp</h2>

      <div className="mt-4 grid gap-4 sm:mt-5 md:grid-cols-2">
        {rooms.map((room) => {
          const colorKey = room.color || getRoomColor(room.name)
          const styles = roomColorStyles[colorKey] ?? roomColorStyles.blue

          return (
            <article
              className={`rounded-[20px] border border-slate-200 bg-slate-50/70 p-4 transition duration-200 hover:-translate-y-1 hover:bg-white hover:shadow-md sm:p-5 ${styles.border} ${styles.bg}`}
              key={room.name}
            >
              <div className="flex flex-col gap-3 min-[420px]:flex-row min-[420px]:items-start min-[420px]:justify-between">
                <div className="min-w-0">
                  <h3 className="text-base font-bold text-slate-950">{room.name}</h3>
                  <p className="mt-2 flex items-center gap-2 text-sm font-medium text-slate-500">
                    <Users size={16} className={styles.iconColor} />
                    Sức chứa {room.capacity} người
                  </p>
                </div>
                <span
                  className={`w-fit rounded-full px-3 py-1 text-xs font-bold ring-1 ${
                    statusClasses[room.status] ?? statusClasses.Trống
                  }`}
                >
                  {room.status}
                </span>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {room.devices.map((device) => {
                  const Icon = deviceIcons[device] ?? Monitor

                  return (
                    <span
                      className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-semibold text-slate-600 ring-1 ring-slate-200"
                      key={device}
                    >
                      <Icon size={14} className={styles.iconColor} />
                      {device}
                    </span>
                  )
                })}
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}

export default DashboardRoomGrid
