import { Camera, Monitor, RadioReceiver, Users } from 'lucide-react'

const deviceIcons = {
  Camera,
  Livestream: RadioReceiver,
  Micro: RadioReceiver,
  'Máy chiếu': Monitor,
  'Màn hình': Monitor,
}

function DashboardRoomGrid({ rooms }) {
  return (
    <section className="rounded-[20px] bg-white p-4 shadow-sm ring-1 ring-slate-200/70 sm:p-6">
      <h2 className="text-base font-bold text-slate-950 sm:text-lg">Danh sách phòng họp</h2>

      <div className="mt-4 grid gap-4 sm:mt-5 md:grid-cols-2">
        {rooms.map((room) => {
          const isBusy = room.status === 'Đang sử dụng'

          return (
            <article
              className="rounded-[20px] border border-slate-200 bg-slate-50/70 p-4 transition hover:-translate-y-1 hover:bg-white hover:shadow-md sm:p-5"
              key={room.name}
            >
              <div className="flex flex-col gap-3 min-[420px]:flex-row min-[420px]:items-start min-[420px]:justify-between">
                <div className="min-w-0">
                  <h3 className="text-base font-bold text-slate-950">{room.name}</h3>
                  <p className="mt-2 flex items-center gap-2 text-sm font-medium text-slate-500">
                    <Users size={16} />
                    Sức chứa {room.capacity} người
                  </p>
                </div>
                <span
                  className={`w-fit rounded-full px-3 py-1 text-xs font-bold ring-1 ${
                    isBusy
                      ? 'bg-[#ECFDF5] text-[#10B981] ring-[#A7F3D0]'
                      : 'bg-slate-100 text-slate-600 ring-slate-200'
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
                      <Icon size={14} />
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
