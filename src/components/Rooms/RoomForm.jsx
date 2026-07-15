import { useState } from 'react'
import {
  Building2,
  Camera,
  Check,
  Image,
  Layers,
  MapPin,
  Monitor,
  Projector,
  RadioReceiver,
  Ruler,
  Save,
  Speaker,
  Upload,
  Users,
  X,
} from 'lucide-react'

const deviceIcons = {
  Camera,
  Loa: Speaker,
  Micro: RadioReceiver,
  'Máy chiếu': Projector,
  'Màn hình': Monitor,
}

function RoomForm({ devices, mode = 'create', onClose, room, statuses }) {
  const isEditMode = mode === 'edit'
  const [previewImage, setPreviewImage] = useState(room?.image ?? '')

  const handleImageChange = (event) => {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      setPreviewImage(reader.result)
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/45 px-3 py-3 backdrop-blur-sm sm:py-6">
      <section
        className="flex h-[calc(100svh-24px)] w-full max-w-4xl flex-col overflow-hidden rounded-[20px] bg-white shadow-2xl ring-1 ring-slate-200 sm:h-[min(92svh,880px)]"
        key={room?.id ?? 'create-room'}
      >
        <div className="shrink-0 border-b border-slate-200 px-5 py-4 sm:px-6 sm:py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#2563EB]">
                {isEditMode ? 'Cập nhật phòng họp' : 'Thêm phòng họp'}
              </p>
              <h2 className="mt-2 text-xl font-bold tracking-tight text-slate-950 sm:text-2xl">
                {isEditMode ? 'Chỉnh sửa thông tin phòng' : 'Thêm phòng mới'}
              </h2>
              <p className="mt-1 text-sm font-medium text-slate-500">
                {isEditMode
                  ? 'Dữ liệu phòng đã được nạp sẵn để chỉnh sửa.'
                  : 'Nhập thông tin cơ bản, thiết bị và sơ đồ phòng họp.'}
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

        <form className="min-h-0 flex-1 overflow-y-auto px-5 py-5 pb-8 sm:px-6">
          <div className="grid gap-4 lg:grid-cols-2">
            <Field icon={Building2} label="Tên phòng">
              <input
                className={inputClass}
                defaultValue={room?.name ?? ''}
                placeholder="Nhập tên phòng họp"
              />
            </Field>

            <Field icon={Check} label="Trạng thái">
              <select className={inputClass} defaultValue={room?.status ?? 'Trống'}>
                {statuses
                  .filter((status) => status !== 'Tất cả')
                  .map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
              </select>
            </Field>

            <Field icon={Users} label="Sức chứa">
              <input
                className={inputClass}
                defaultValue={room?.capacity ?? 30}
                min="1"
                placeholder="30"
                type="number"
              />
            </Field>

            <Field icon={Ruler} label="Diện tích">
              <input className={inputClass} defaultValue={room?.area ?? ''} placeholder="56 m²" />
            </Field>

            <Field icon={MapPin} label="Địa điểm">
              <input
                className={inputClass}
                defaultValue={room?.location ?? ''}
                placeholder="Khu hành chính UBND xã"
              />
            </Field>

            <Field icon={Layers} label="Tầng">
              <input className={inputClass} defaultValue={room?.floor ?? ''} placeholder="Tầng 2" />
            </Field>

            <div className="grid gap-3 lg:col-span-2">
              <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-500">
                <Image size={14} />
                Ảnh phòng
              </span>
              <label className="grid cursor-pointer gap-4 rounded-[20px] border border-dashed border-slate-300 bg-slate-50 p-4 transition hover:border-blue-300 hover:bg-blue-50 sm:grid-cols-[180px_minmax(0,1fr)] sm:items-center">
                {previewImage ? (
                  <img
                    alt={room?.name ?? 'Ảnh phòng đã chọn'}
                    className="h-32 w-full rounded-2xl object-cover ring-1 ring-slate-200 sm:h-28"
                    src={previewImage}
                  />
                ) : (
                  <span className="grid h-32 place-items-center rounded-2xl bg-white text-[#2563EB] ring-1 ring-slate-200 sm:h-28">
                    <Image size={34} />
                  </span>
                )}
                <span className="min-w-0">
                  <span className="inline-flex items-center gap-2 text-sm font-bold text-slate-900">
                    <Upload size={17} className="text-[#2563EB]" />
                    Chọn ảnh từ máy
                  </span>
                  <span className="mt-1 block text-sm font-medium text-slate-500">
                    Hỗ trợ JPG, PNG, WEBP. Ảnh hiện tại sẽ được thay khi chọn file mới.
                  </span>
                  <span className="mt-3 inline-flex rounded-2xl bg-white px-4 py-2 text-sm font-bold text-[#2563EB] shadow-sm ring-1 ring-blue-100">
                    Duyệt ảnh
                  </span>
                </span>
                <input
                  accept="image/*"
                  className="sr-only"
                  onChange={handleImageChange}
                  type="file"
                />
              </label>
            </div>
          </div>

          <section className="mt-6 rounded-[20px] bg-slate-50 p-4 ring-1 ring-slate-200">
            <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500">Thiết bị</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {devices.map((device) => {
                const Icon = deviceIcons[device] ?? Monitor

                return (
                  <label
                    className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-700 ring-1 ring-slate-200 transition hover:bg-blue-50 hover:ring-blue-100"
                    key={device}
                  >
                    <input
                      className="h-4 w-4 rounded accent-[#2563EB]"
                      defaultChecked={room?.devices?.includes(device) ?? device === 'Camera'}
                      type="checkbox"
                    />
                    <Icon size={17} className="text-[#2563EB]" />
                    {device}
                  </label>
                )
              })}
            </div>
          </section>

          <section className="mt-6 rounded-[20px] bg-slate-50 p-4 ring-1 ring-slate-200">
            <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500">
              Sơ đồ phòng
            </h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field icon={Layers} label="Số hàng ghế">
                <input
                  className={inputClass}
                  defaultValue={room?.layout?.rows ?? 4}
                  min="1"
                  type="number"
                />
              </Field>
              <Field icon={Users} label="Số ghế mỗi hàng">
                <input
                  className={inputClass}
                  defaultValue={room?.layout?.seatsPerRow ?? 6}
                  min="1"
                  type="number"
                />
              </Field>
            </div>
          </section>
        </form>

        <footer className="shrink-0 border-t border-slate-200 bg-white p-3 shadow-[0_-12px_24px_rgba(15,23,42,0.06)] sm:p-4 sm:px-6">
          <div className="grid gap-2 sm:grid-cols-[1fr_auto_auto]">
            <button
              className="inline-flex h-12 items-center justify-center rounded-2xl bg-slate-100 px-5 text-sm font-bold text-slate-700 transition hover:bg-slate-200 sm:w-fit"
              onClick={onClose}
              type="button"
            >
              Hủy
            </button>
            <button
              className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-white px-5 text-sm font-bold text-[#2563EB] shadow-sm ring-1 ring-blue-100 transition hover:bg-blue-50"
              type="button"
            >
              <Save size={18} />
              Lưu nháp
            </button>
            <button
              className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#2563EB] px-5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700"
              type="button"
            >
              <Check size={18} />
              {isEditMode ? 'Cập nhật phòng' : 'Thêm phòng'}
            </button>
          </div>
        </footer>
      </section>
    </div>
  )
}

const inputClass =
  'h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#2563EB] focus:ring-4 focus:ring-blue-100'

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

export default RoomForm
