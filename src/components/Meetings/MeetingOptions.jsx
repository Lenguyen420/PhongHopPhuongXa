import { Bell, CheckSquare, QrCode, ToggleLeft, Video } from 'lucide-react'

function MeetingOptions() {
  return (
    <aside className="grid gap-4 lg:sticky lg:top-6">
      <OptionCard icon={CheckSquare} title="Biểu quyết">
        <Switch label="Có / Không" defaultChecked />
      </OptionCard>

      <OptionCard icon={Video} title="Ghi hình">
        <Switch label="Có / Không" />
      </OptionCard>

      <OptionCard icon={QrCode} title="Điểm danh">
        <Switch label="Bật điểm danh" defaultChecked />
        <div className="mt-4 grid gap-2">
          {['QR Code', 'FaceID', 'Thủ công', 'QR + FaceID'].map((item, index) => (
            <label
              className="flex items-center gap-3 rounded-2xl bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700 ring-1 ring-slate-200"
              key={item}
            >
              <input
                className="h-4 w-4 accent-[#2563EB]"
                defaultChecked={index === 0}
                name="attendanceType"
                type="radio"
              />
              {item}
            </label>
          ))}
        </div>
      </OptionCard>

      <OptionCard icon={Bell} title="Nhắc lịch">
        <div className="grid gap-2">
          {['Trước 30 phút', 'Trước 1 giờ', 'Trước 1 ngày'].map((item, index) => (
            <label
              className="flex items-center gap-3 rounded-2xl bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700 ring-1 ring-slate-200"
              key={item}
            >
              <input
                className="h-4 w-4 rounded accent-[#2563EB]"
                defaultChecked={index < 2}
                type="checkbox"
              />
              {item}
            </label>
          ))}
        </div>
      </OptionCard>
    </aside>
  )
}

function OptionCard({ children, icon: Icon, title }) {
  return (
    <section className="rounded-[20px] bg-white p-5 shadow-sm ring-1 ring-slate-200/70">
      <div className="mb-4 flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-blue-50 text-[#2563EB] ring-1 ring-blue-100">
          <Icon size={19} />
        </span>
        <h2 className="text-base font-bold text-slate-950">{title}</h2>
      </div>
      {children}
    </section>
  )
}

function Switch({ defaultChecked = false, label }) {
  return (
    <label className="flex items-center justify-between gap-4 rounded-2xl bg-slate-50 px-3 py-3 text-sm font-semibold text-slate-700 ring-1 ring-slate-200">
      <span>{label}</span>
      <span className="relative inline-flex">
        <input className="peer sr-only" defaultChecked={defaultChecked} type="checkbox" />
        <span className="h-7 w-12 rounded-full bg-slate-300 transition peer-checked:bg-[#2563EB]" />
        <span className="absolute left-1 top-1 h-5 w-5 rounded-full bg-white shadow-sm transition peer-checked:translate-x-5" />
        <ToggleLeft className="sr-only" size={16} />
      </span>
    </label>
  )
}

export default MeetingOptions
