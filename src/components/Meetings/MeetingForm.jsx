import {
  AlignLeft,
  Bold,
  Building2,
  CalendarDays,
  Clock3,
  File,
  FileSpreadsheet,
  FileText,
  Italic,
  List,
  ListOrdered,
  Mail,
  MapPin,
  Paperclip,
  Phone,
  Plus,
  Redo2,
  Type,
  Underline,
  Undo2,
  Upload,
  UserRound,
  Users,
  Video,
} from 'lucide-react'

function MeetingForm({ departments, hosts, rooms, sampleFiles, types }) {
  return (
    <form className="grid gap-4 sm:gap-6">
      <FormCard icon={FileText} title="Thông tin cuộc họp">
        <div className="grid gap-4 lg:grid-cols-2">
          <Field icon={Type} label="Tên cuộc họp">
            <input
              className={inputClass}
              defaultValue="Họp giao ban đầu tuần"
              placeholder="Nhập tên cuộc họp"
            />
          </Field>
          <Field icon={FileText} label="Loại cuộc họp">
            <select className={inputClass} defaultValue="giao-ban">
              {types.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </Field>
          <Field className="lg:col-span-2" icon={AlignLeft} label="Mô tả">
            <textarea
              className={`${inputClass} min-h-28 resize-y py-3`}
              defaultValue="Trao đổi tình hình hoạt động trong tuần và phân công nhiệm vụ trọng tâm."
              placeholder="Nhập mô tả cuộc họp"
            />
          </Field>
        </div>
      </FormCard>

      <FormCard icon={Clock3} title="Thời gian">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Field icon={CalendarDays} label="Ngày">
            <input className={inputClass} defaultValue="2026-07-15" type="date" />
          </Field>
          <Field icon={Clock3} label="Giờ bắt đầu">
            <input className={inputClass} defaultValue="08:00" type="time" />
          </Field>
          <Field icon={Clock3} label="Giờ kết thúc">
            <input className={inputClass} defaultValue="09:30" type="time" />
          </Field>
          <label className="flex items-end">
            <span className="flex h-12 w-full items-center gap-3 rounded-2xl bg-slate-50 px-4 text-sm font-semibold text-slate-700 ring-1 ring-slate-200">
              <input className="h-4 w-4 accent-[#2563EB]" type="checkbox" />
              Họp cả ngày
            </span>
          </label>
        </div>
      </FormCard>

      <FormCard icon={MapPin} title="Địa điểm">
        <div className="grid gap-4">
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { label: 'Trực tiếp', icon: Building2 },
              { label: 'Trực tuyến', icon: Video },
              { label: 'Kết hợp', icon: MapPin },
            ].map(({ label, icon: Icon }, index) => (
              <label
                className="flex cursor-pointer items-center gap-3 rounded-[20px] border border-slate-200 bg-slate-50/70 p-4 text-sm font-bold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50"
                key={label}
              >
                <input
                  className="h-4 w-4 accent-[#2563EB]"
                  defaultChecked={index === 0}
                  name="meetingMode"
                  type="radio"
                />
                <Icon size={18} className="text-[#2563EB]" />
                {label}
              </label>
            ))}
          </div>

          <Field icon={Building2} label="Chọn phòng">
            <select className={inputClass} defaultValue="large">
              {rooms.map((room) => (
                <option key={room.id} value={room.id}>
                  {room.name} - {room.capacity} người
                </option>
              ))}
            </select>
          </Field>
        </div>
      </FormCard>

      <FormCard icon={UserRound} title="Người chủ trì">
        <Field icon={UserRound} label="Chọn người chủ trì">
          <select className={inputClass} defaultValue="chu-tich">
            {hosts.map((host) => (
              <option key={host.id} value={host.id}>
                {host.name}
              </option>
            ))}
          </select>
        </Field>
      </FormCard>

      <FormCard icon={Users} title="Thành phần tham dự">
        <div className="grid gap-5">
          <div className="grid gap-3 sm:grid-cols-2">
            {['Toàn bộ cán bộ', 'Chọn phòng ban'].map((item, index) => (
              <label
                className="flex cursor-pointer items-center gap-3 rounded-[20px] border border-slate-200 bg-slate-50/70 p-4 text-sm font-bold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50"
                key={item}
              >
                <input
                  className="h-4 w-4 accent-[#2563EB]"
                  defaultChecked={index === 1}
                  name="participantsMode"
                  type="radio"
                />
                {item}
              </label>
            ))}
          </div>

          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-500">
              Phòng ban
            </p>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {departments.map((department, index) => (
                <label
                  className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 ring-1 ring-slate-200"
                  key={department.id}
                >
                  <input
                    className="h-4 w-4 rounded accent-[#2563EB]"
                    defaultChecked={index < 3}
                    type="checkbox"
                  />
                  {department.name}
                </label>
              ))}
            </div>
          </div>

          <div className="rounded-[20px] bg-slate-50 p-4 ring-1 ring-slate-200">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="text-sm font-bold text-slate-950">Khách mời</h3>
              <button
                className="inline-flex h-10 items-center justify-center gap-2 rounded-2xl bg-white px-4 text-sm font-bold text-[#2563EB] shadow-sm ring-1 ring-blue-100 transition hover:bg-blue-50"
                type="button"
              >
                <Plus size={17} />
                Thêm khách mời
              </button>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <Field icon={UserRound} label="Họ tên">
                <input className={inputClass} placeholder="Nguyễn Văn B" />
              </Field>
              <Field icon={Building2} label="Đơn vị">
                <input className={inputClass} placeholder="UBND xã" />
              </Field>
              <Field icon={Mail} label="Email">
                <input className={inputClass} placeholder="email@donvi.gov.vn" type="email" />
              </Field>
              <Field icon={Phone} label="Điện thoại">
                <input className={inputClass} placeholder="0900 000 000" />
              </Field>
            </div>
          </div>
        </div>
      </FormCard>

      <FormCard icon={FileText} title="Nội dung cuộc họp">
        <div className="overflow-hidden rounded-[20px] border border-slate-200 bg-white">
          <div className="flex flex-wrap gap-2 border-b border-slate-200 bg-slate-50 p-3">
            {[Bold, Italic, Underline, List, ListOrdered, AlignLeft, Undo2, Redo2].map(
              (Icon, index) => (
                <button
                  className="grid h-9 w-9 place-items-center rounded-xl text-slate-600 transition hover:bg-white hover:text-[#2563EB]"
                  key={index}
                  type="button"
                >
                  <Icon size={17} />
                </button>
              ),
            )}
          </div>
          <textarea
            className="min-h-48 w-full resize-y border-0 bg-white p-4 text-sm font-medium leading-7 text-slate-700 outline-none placeholder:text-slate-400"
            defaultValue="1. Đánh giá kết quả thực hiện nhiệm vụ tuần qua&#10;2. Triển khai nhiệm vụ trọng tâm tuần tới&#10;3. Phân công đơn vị phụ trách và thời hạn hoàn thành"
          />
        </div>
      </FormCard>

      <FormCard icon={Paperclip} title="Tài liệu đính kèm">
        <div className="grid gap-4">
          <label className="grid cursor-pointer place-items-center rounded-[20px] border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center transition hover:border-blue-300 hover:bg-blue-50">
            <Upload className="text-[#2563EB]" size={32} />
            <span className="mt-3 text-sm font-bold text-slate-800">
              Tải lên PDF, DOCX, PPTX hoặc Excel
            </span>
            <span className="mt-1 text-xs font-medium text-slate-500">
              Kéo thả file hoặc bấm để chọn
            </span>
            <input className="sr-only" multiple type="file" />
          </label>

          <div className="grid gap-3">
            {sampleFiles.map((file) => (
              <div
                className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 px-4 py-3 ring-1 ring-slate-200"
                key={file.id}
              >
                <span className="flex min-w-0 items-center gap-3">
                  {file.type === 'Excel' ? (
                    <FileSpreadsheet className="shrink-0 text-[#10B981]" size={20} />
                  ) : (
                    <File className="shrink-0 text-[#2563EB]" size={20} />
                  )}
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-bold text-slate-800">
                      {file.name}
                    </span>
                    <span className="text-xs font-medium text-slate-500">
                      {file.type} - {file.size}
                    </span>
                  </span>
                </span>
                <button
                  className="text-sm font-bold text-[#EF4444] hover:text-red-700"
                  type="button"
                >
                  Xóa
                </button>
              </div>
            ))}
          </div>
        </div>
      </FormCard>
    </form>
  )
}

const inputClass =
  'h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#2563EB] focus:ring-4 focus:ring-blue-100'

function FormCard({ children, icon: Icon, title }) {
  return (
    <section className="rounded-[20px] bg-white p-4 shadow-sm ring-1 ring-slate-200/70 sm:p-6">
      <div className="mb-5 flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-blue-50 text-[#2563EB] ring-1 ring-blue-100">
          <Icon size={19} />
        </span>
        <h2 className="text-base font-bold text-slate-950 sm:text-lg">{title}</h2>
      </div>
      {children}
    </section>
  )
}

function Field({ children, className = '', icon: Icon, label }) {
  return (
    <label className={`grid gap-1.5 ${className}`}>
      <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-500">
        <Icon size={14} />
        {label}
      </span>
      {children}
    </label>
  )
}

export default MeetingForm
