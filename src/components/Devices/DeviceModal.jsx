import { Check, Trash2, Wrench, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import AppSelect from '@/components/ui/AppSelect'

const emptyForm = {
  name: '',
  code: '',
  category: 'Camera họp',
  brand: '',
  model: '',
  quantity: 1,
  status: 'Đang hoạt động',
  location: '',
  note: '',
}

function DeviceModal({
  categories,
  device,
  mode,
  onClose,
  onDeleteDevice,
  onSaveDevice,
  statuses,
}) {
  const [formData, setFormData] = useState(emptyForm)

  useEffect(() => {
    setFormData(mode === 'create' ? emptyForm : { ...emptyForm, ...device })
  }, [device, mode])

  if (!mode) return null

  const isReadOnly = mode === 'detail' || mode === 'delete' || mode === 'maintenance'
  const title =
    mode === 'create'
      ? 'Thêm thiết bị'
      : mode === 'edit'
        ? 'Chỉnh sửa thiết bị'
        : mode === 'detail'
          ? 'Thông tin thiết bị'
          : mode === 'maintenance'
            ? 'Đưa vào bảo trì'
            : 'Xóa thiết bị'

  const handleChange = (name, value) => setFormData((current) => ({ ...current, [name]: value }))
  const handleSave = () =>
    onSaveDevice({
      ...formData,
      id: device?.id ?? Date.now(),
      quantity: Number(formData.quantity),
      updatedAt: new Date().toLocaleDateString('vi-VN'),
    })
  const handleMaintenance = () =>
    onSaveDevice({
      ...formData,
      status: 'Đang bảo trì',
      updatedAt: new Date().toLocaleDateString('vi-VN'),
    })

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/45 p-3 backdrop-blur-sm sm:p-4">
      <section className="max-h-[calc(100vh-24px)] w-full max-w-3xl overflow-y-auto rounded-2xl border border-gray-300 bg-white shadow-2xl sm:max-h-[calc(100vh-32px)]">
        <div className="flex min-w-0 items-start justify-between gap-3 border-b border-gray-300 px-4 py-4 sm:px-5">
          <div className="min-w-0">
            <h2 className="break-words text-lg font-bold text-slate-950">{title}</h2>
            <p className="mt-1 text-sm font-medium text-slate-500">
              {device?.name || 'Danh mục thiết bị dùng chung cho tất cả phòng họp'}
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

        <div className="p-4 sm:p-5">
          {mode === 'delete' || mode === 'maintenance' ? (
            <div className="grid place-items-center rounded-2xl border border-gray-300 bg-slate-50 p-6 text-center">
              <span
                className={`grid h-16 w-16 place-items-center rounded-2xl ${mode === 'delete' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-700'}`}
              >
                {mode === 'delete' ? <Trash2 size={28} /> : <Wrench size={28} />}
              </span>
              <p className="mt-4 max-w-md text-sm font-semibold leading-6 text-slate-600">
                {mode === 'delete'
                  ? 'Thiết bị sẽ bị xóa khỏi danh mục mẫu trên giao diện hiện tại.'
                  : 'Thiết bị sẽ được chuyển sang trạng thái Đang bảo trì.'}
              </p>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              <FormInput
                label="Tên thiết bị"
                name="name"
                onChange={handleChange}
                readOnly={isReadOnly}
                value={formData.name}
              />
              <FormInput
                label="Mã thiết bị"
                name="code"
                onChange={handleChange}
                readOnly={isReadOnly}
                value={formData.code}
              />
              <FormSelect
                label="Loại thiết bị"
                name="category"
                onChange={handleChange}
                options={categories}
                readOnly={isReadOnly}
                value={formData.category}
              />
              <FormInput
                label="Hãng sản xuất"
                name="brand"
                onChange={handleChange}
                readOnly={isReadOnly}
                value={formData.brand}
              />
              <FormInput
                label="Model"
                name="model"
                onChange={handleChange}
                readOnly={isReadOnly}
                value={formData.model}
              />
              <FormInput
                label="Số lượng"
                name="quantity"
                onChange={handleChange}
                readOnly={isReadOnly}
                type="number"
                value={formData.quantity}
              />
              <FormSelect
                label="Trạng thái"
                name="status"
                onChange={handleChange}
                options={statuses}
                readOnly={isReadOnly}
                value={formData.status}
              />
              <FormInput
                label="Vị trí"
                name="location"
                onChange={handleChange}
                readOnly={isReadOnly}
                value={formData.location}
              />
              <label className="grid min-w-0 gap-1.5 sm:col-span-2">
                <span className="text-xs font-bold uppercase tracking-wide text-slate-500">
                  Ghi chú
                </span>
                <textarea
                  className="min-h-24 min-w-0 rounded-2xl border border-gray-300 bg-white px-3 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-[#2563EB] focus:ring-4 focus:ring-blue-100 disabled:bg-slate-50"
                  disabled={isReadOnly}
                  onChange={(event) => handleChange('note', event.target.value)}
                  value={formData.note}
                />
              </label>
            </div>
          )}
        </div>

        <div className="flex flex-col-reverse gap-2 border-t border-gray-300 bg-slate-50 px-4 py-4 sm:flex-row sm:justify-end sm:px-5">
          <button
            className="inline-flex h-11 items-center justify-center rounded-2xl border border-gray-300 bg-white px-5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
            onClick={onClose}
            type="button"
          >
            Hủy
          </button>
          {mode === 'delete' ? (
            <button
              className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-red-600 px-5 text-sm font-bold text-white transition hover:bg-red-700"
              onClick={() => onDeleteDevice(device.id)}
              type="button"
            >
              <Trash2 size={17} />
              Xóa
            </button>
          ) : mode === 'detail' ? null : (
            <button
              className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-[#2563EB] px-5 text-sm font-bold text-white transition hover:bg-blue-700"
              onClick={mode === 'maintenance' ? handleMaintenance : handleSave}
              type="button"
            >
              <Check size={17} />
              Lưu
            </button>
          )}
        </div>
      </section>
    </div>
  )
}

function FormInput({ label, name, onChange, readOnly, type = 'text', value }) {
  return (
    <label className="grid min-w-0 gap-1.5">
      <span className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</span>
      <input
        className="h-11 min-w-0 rounded-2xl border border-gray-300 bg-white px-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-[#2563EB] focus:ring-4 focus:ring-blue-100 disabled:bg-slate-50"
        disabled={readOnly}
        onChange={(event) => onChange(name, event.target.value)}
        type={type}
        value={value}
      />
    </label>
  )
}

function FormSelect({ label, name, onChange, options, readOnly, value }) {
  return (
    <label className="grid min-w-0 gap-1.5">
      <span className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</span>
      <AppSelect
        disabled={readOnly}
        onChange={(event) => onChange(name, event.target.value)}
        options={options}
        value={value}
      />
    </label>
  )
}

export default DeviceModal
