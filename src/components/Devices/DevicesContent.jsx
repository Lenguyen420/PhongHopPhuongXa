import { Camera, Edit3, Eye, MoreVertical, Monitor, Trash2, Volume2, Wrench } from 'lucide-react'
import { useState } from 'react'

const statusClasses = {
  'Đang hoạt động': 'bg-emerald-50 text-emerald-700',
  'Đang bảo trì': 'bg-amber-50 text-amber-700',
  Hỏng: 'bg-red-50 text-red-600',
  'Dự phòng': 'bg-slate-100 text-slate-600',
}

const categoryIcons = {
  'Camera họp': Camera,
  Webcam: Camera,
  Micro: Volume2,
  Loa: Volume2,
  'Máy chiếu': Monitor,
  TV: Monitor,
  'Màn hình LED': Monitor,
}

const menuActions = [
  { label: 'Xem', icon: Eye, mode: 'detail' },
  { label: 'Chỉnh sửa', icon: Edit3, mode: 'edit' },
  { label: 'Bảo trì', icon: Wrench, mode: 'maintenance' },
  { label: 'Xóa', icon: Trash2, mode: 'delete', danger: true },
]

function DevicesContent({ devices, onOpenModal }) {
  const [openMenuId, setOpenMenuId] = useState(null)

  const handleAction = (mode, device) => {
    setOpenMenuId(null)
    onOpenModal(mode, device)
  }

  return (
    <section className="grid min-w-0 self-start content-start gap-4">
      <div className="flex min-w-0 flex-col gap-2 rounded-2xl border border-gray-300 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h2 className="break-words text-lg font-bold text-slate-950">Danh sách thiết bị</h2>
          <p className="text-sm font-medium text-slate-500">Hiển thị {devices.length} thiết bị từ dữ liệu mẫu dùng chung</p>
        </div>
        <span className="inline-flex w-fit items-center rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-[#2563EB]">Sẵn sàng liên kết phòng họp</span>
      </div>

      <div className="min-w-0 overflow-x-auto rounded-2xl border border-gray-300 bg-white shadow-sm">
        <table className="w-full min-w-[1080px] border-collapse text-left text-sm">
          <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="border-b border-gray-300 px-4 py-3">Icon</th>
              <th className="border-b border-gray-300 px-4 py-3">Tên thiết bị</th>
              <th className="border-b border-gray-300 px-4 py-3">Loại thiết bị</th>
              <th className="border-b border-gray-300 px-4 py-3">Mã thiết bị</th>
              <th className="border-b border-gray-300 px-4 py-3">Số lượng</th>
              <th className="border-b border-gray-300 px-4 py-3">Vị trí lưu</th>
              <th className="border-b border-gray-300 px-4 py-3">Trạng thái</th>
              <th className="border-b border-gray-300 px-4 py-3">Ngày cập nhật</th>
              <th className="border-b border-gray-300 px-4 py-3 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {devices.map((device) => {
              const Icon = categoryIcons[device.category] || Wrench

              return (
                <tr className="align-middle transition hover:bg-slate-50" key={device.id}>
                  <td className="border-b border-gray-300 px-4 py-3">
                    <span className="grid h-10 w-10 place-items-center rounded-2xl bg-blue-50 text-[#2563EB]">
                      <Icon size={19} />
                    </span>
                  </td>
                  <td className="border-b border-gray-300 px-4 py-3">
                    <button className="text-left font-bold text-slate-950 transition hover:text-[#2563EB]" onClick={() => onOpenModal('detail', device)} type="button">{device.name}</button>
                    <p className="mt-1 text-xs font-semibold text-slate-400">{device.brand} {device.model}</p>
                  </td>
                  <td className="border-b border-gray-300 px-4 py-3 font-semibold text-slate-700">{device.category}</td>
                  <td className="border-b border-gray-300 px-4 py-3 font-bold text-slate-600">{device.code}</td>
                  <td className="border-b border-gray-300 px-4 py-3 font-bold text-slate-700">{device.quantity}</td>
                  <td className="border-b border-gray-300 px-4 py-3 font-semibold text-slate-600">{device.location}</td>
                  <td className="border-b border-gray-300 px-4 py-3">
                    <span className={`rounded-full px-3 py-1 text-xs font-bold ${statusClasses[device.status] || 'bg-slate-100 text-slate-600'}`}>{device.status}</span>
                  </td>
                  <td className="border-b border-gray-300 px-4 py-3 font-semibold text-slate-600">{device.updatedAt}</td>
                  <td className="relative border-b border-gray-300 px-4 py-3 text-center">
                    <button aria-label={`Mở thao tác cho ${device.name}`} className="mx-auto grid h-9 w-9 place-items-center rounded-2xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-950" onClick={() => setOpenMenuId(openMenuId === device.id ? null : device.id)} type="button">
                      <MoreVertical size={18} />
                    </button>
                    {openMenuId === device.id && (
                      <div className="absolute right-4 top-12 z-20 w-44 overflow-hidden rounded-2xl border border-gray-300 bg-white py-2 text-left shadow-xl">
                        {menuActions.map(({ label, icon: ActionIcon, mode, danger }) => (
                          <button className={`flex w-full items-center gap-2 px-3 py-2 text-sm font-semibold transition ${danger ? 'text-red-600 hover:bg-red-50' : 'text-slate-700 hover:bg-slate-50 hover:text-[#2563EB]'}`} key={label} onClick={() => handleAction(mode, device)} type="button">
                            <ActionIcon size={16} />
                            {label}
                          </button>
                        ))}
                      </div>
                    )}
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

export default DevicesContent
