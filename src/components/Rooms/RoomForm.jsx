import { useMemo, useState } from 'react'
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
  Search,
  Speaker,
  Upload,
  Users,
  X,
} from 'lucide-react'
import AppSelect from '@/components/ui/AppSelect'

const deviceIcons = {
  Camera,
  'Camera họp': Camera,
  Webcam: Camera,
  Loa: Speaker,
  Micro: RadioReceiver,
  'Máy chiếu': Projector,
  'Màn hình': Monitor,
  'Màn hình LED': Monitor,
  TV: Monitor,
}

function RoomForm({
  deviceCategories = [],
  devices,
  mode = 'create',
  onClose,
  onSave,
  room,
  statuses,
}) {
  const isEditMode = mode === 'edit'
  const [previewImage, setPreviewImage] = useState(room?.image ?? '')
  const [imageFile, setImageFile] = useState(null)
  const [deviceSearch, setDeviceSearch] = useState('')
  const [deviceCategory, setDeviceCategory] = useState('')
  const availableDevices = useMemo(
    () =>
      devices.map((device) =>
        typeof device === 'string'
          ? { id: device, name: device, category: device, status: 'Đang hoạt động' }
          : device,
      ),
    [devices],
  )
  const filteredDevices = useMemo(() => {
    const normalizedSearch = deviceSearch.trim().toLowerCase()
    return availableDevices.filter((device) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        device.name.toLowerCase().includes(normalizedSearch) ||
        device.code?.toLowerCase().includes(normalizedSearch)
      const matchesCategory = !deviceCategory || device.category === deviceCategory
      return matchesSearch && matchesCategory
    })
  }, [availableDevices, deviceCategory, deviceSearch])

  const handleImageChange = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setPreviewImage(reader.result)
    reader.readAsDataURL(file)
    setImageFile(file)
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/45 px-3 py-3 backdrop-blur-sm sm:py-6">
      <section
        className="flex h-[calc(100svh-24px)] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-gray-300 bg-white shadow-2xl sm:h-[min(92svh,880px)]"
        key={room?.id ?? 'create-room'}
      >
        <div className="shrink-0 border-b border-gray-300 px-5 py-4 sm:px-6 sm:py-5">
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
                  : 'Nhập thông tin cơ bản, chọn thiết bị từ danh mục dùng chung và sơ đồ phòng họp.'}
              </p>
            </div>
            <button
              aria-label="Đóng"
              className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-950"
              onClick={onClose}
              type="button"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <form
          className="min-h-0 flex-1 overflow-y-auto px-5 py-5 pb-8 sm:px-6"
          id="room-form"
          onSubmit={(event) => {
            event.preventDefault()
            const data = new FormData(event.currentTarget)
            onSave?.(
              {
                name: data.get('name'),
                operationalStatus: data.get('operationalStatus'),
                capacity: Number(data.get('capacity')),
                area: data.get('area'),
                location: data.get('location'),
                floor: data.get('floor'),
                deviceIds: data.getAll('deviceIds'),
                layoutRows: Number(data.get('layoutRows')),
                seatsPerRow: Number(data.get('seatsPerRow')),
                lifecycleStatus: event.nativeEvent.submitter?.value || 'PUBLISHED',
              },
              imageFile,
            )
          }}
        >
          <div className="grid gap-4 lg:grid-cols-2">
            <Field icon={Building2} label="Tên phòng">
              <input
                className={inputClass}
                defaultValue={room?.name ?? ''}
                name="name"
                placeholder="Nhập tên phòng họp"
                required
              />
            </Field>
            <Field icon={Check} label="Trạng thái">
              <AppSelect
                buttonClassName="h-12 px-4"
                defaultValue={room?.operationalStatus ?? 'ACTIVE'}
                name="operationalStatus"
                options={statuses.filter((status) => status !== 'Tất cả')}
              />
            </Field>
            <Field icon={Users} label="Sức chứa">
              <input
                className={inputClass}
                defaultValue={room?.capacity ?? 30}
                min="1"
                name="capacity"
                placeholder="30"
                type="number"
              />
            </Field>
            <Field icon={Ruler} label="Diện tích">
              <input
                className={inputClass}
                defaultValue={room?.area ?? ''}
                name="area"
                placeholder="56 m²"
              />
            </Field>
            <Field icon={MapPin} label="Địa điểm">
              <input
                className={inputClass}
                defaultValue={room?.location ?? ''}
                name="location"
                placeholder="Khu hành chính UBND xã"
              />
            </Field>
            <Field icon={Layers} label="Tầng">
              <input
                className={inputClass}
                defaultValue={room?.floor ?? ''}
                name="floor"
                placeholder="Tầng 2"
              />
            </Field>

            <div className="grid gap-3 lg:col-span-2">
              <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-500">
                <Image size={14} />
                Ảnh phòng
              </span>
              <label className="grid cursor-pointer gap-4 rounded-2xl border border-dashed border-gray-300 bg-slate-50 p-4 transition hover:border-blue-300 hover:bg-blue-50 sm:grid-cols-[180px_minmax(0,1fr)] sm:items-center">
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

          <section className="mt-6 rounded-2xl border border-gray-300 bg-slate-50 p-4">
            <div className="flex min-w-0 flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="min-w-0">
                <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500">
                  Thiết bị của phòng họp
                </h3>
                <p className="mt-1 text-sm font-medium text-slate-500">
                  Chọn từ danh mục thiết bị dùng chung của toàn hệ thống.
                </p>
              </div>
              <span className="w-fit rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-[#2563EB]">
                {filteredDevices.length} thiết bị phù hợp
              </span>
            </div>
            <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(0,1fr)_220px]">
              <label className="flex h-11 min-w-0 items-center gap-2 rounded-2xl border border-gray-300 bg-white px-3 transition focus-within:border-[#2563EB] focus-within:ring-4 focus-within:ring-blue-100">
                <Search size={18} className="shrink-0 text-slate-400" />
                <input
                  className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-slate-700 outline-none placeholder:text-slate-400"
                  onChange={(event) => setDeviceSearch(event.target.value)}
                  placeholder="Tìm nhanh thiết bị..."
                  value={deviceSearch}
                />
              </label>
              <AppSelect
                buttonClassName="h-12 px-4"
                onChange={(event) => setDeviceCategory(event.target.value)}
                options={[{ label: 'Tất cả loại thiết bị', value: '' }, ...deviceCategories]}
                value={deviceCategory}
              />
            </div>
            <div className="mt-4 grid max-h-80 gap-3 overflow-y-auto pr-1 sm:grid-cols-2 lg:grid-cols-3">
              {filteredDevices.map((device) => {
                const Icon = deviceIcons[device.category] ?? Monitor
                const isChecked = room?.deviceIds?.includes(device.id) || false
                return (
                  <label
                    className="flex min-w-0 items-center gap-3 rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-blue-50"
                    key={device.id}
                  >
                    <input
                      className="h-4 w-4 rounded accent-[#2563EB]"
                      defaultChecked={isChecked}
                      name="deviceIds"
                      type="checkbox"
                      value={device.id}
                    />
                    <Icon size={17} className="shrink-0 text-[#2563EB]" />
                    <span className="min-w-0">
                      <span className="block truncate">{device.name}</span>
                      <span className="block truncate text-xs font-semibold text-slate-400">
                        {device.category} • {device.code}
                      </span>
                    </span>
                  </label>
                )
              })}
            </div>
          </section>

          <section className="mt-6 rounded-2xl border border-gray-300 bg-slate-50 p-4">
            <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500">
              Sơ đồ phòng
            </h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field icon={Layers} label="Số hàng ghế">
                <input
                  className={inputClass}
                  defaultValue={room?.layout?.rows ?? 4}
                  min="1"
                  name="layoutRows"
                  type="number"
                />
              </Field>
              <Field icon={Users} label="Số ghế mỗi hàng">
                <input
                  className={inputClass}
                  defaultValue={room?.layout?.seatsPerRow ?? 6}
                  min="1"
                  name="seatsPerRow"
                  type="number"
                />
              </Field>
            </div>
          </section>
        </form>

        <footer className="shrink-0 border-t border-gray-300 bg-white p-3 shadow-[0_-12px_24px_rgba(15,23,42,0.06)] sm:p-4 sm:px-6">
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
              form="room-form"
              type="submit"
              value="DRAFT"
            >
              <Save size={18} />
              Lưu nháp
            </button>
            <button
              className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#2563EB] px-5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700"
              form="room-form"
              type="submit"
              value="PUBLISHED"
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
  'h-12 w-full rounded-2xl border border-gray-300 bg-white px-4 text-sm font-semibold text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#2563EB] focus:ring-4 focus:ring-blue-100'

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
