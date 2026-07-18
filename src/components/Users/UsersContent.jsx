import { ChevronLeft, ChevronRight, Edit3, Eye, KeyRound, Lock, MoreVertical, ShieldCheck, Trash2 } from 'lucide-react'
import { useState } from 'react'

const menuActions = [
  { label: 'Xem chi tiết', icon: Eye, mode: 'detail' },
  { label: 'Chỉnh sửa', icon: Edit3, mode: 'edit' },
  { label: 'Đặt lại mật khẩu', icon: KeyRound, mode: 'reset' },
  { label: 'Phân quyền', icon: ShieldCheck, mode: 'permissions' },
  { label: 'Khóa tài khoản', icon: Lock, mode: 'lock' },
  { label: 'Xóa', icon: Trash2, mode: 'delete', danger: true },
]

const statusClasses = {
  'Đang hoạt động': 'bg-emerald-50 text-emerald-700',
  'Bị khóa': 'bg-red-50 text-red-600',
  'Chờ kích hoạt': 'bg-amber-50 text-amber-700',
}

function UsersContent({ currentPage, onOpenModal, onPageChange, pageSize, totalUsers, users }) {
  const [openMenuId, setOpenMenuId] = useState(null)
  const totalPages = Math.max(1, Math.ceil(totalUsers / pageSize))
  const firstIndex = totalUsers === 0 ? 0 : (currentPage - 1) * pageSize + 1
  const lastIndex = Math.min(currentPage * pageSize, totalUsers)

  const handleAction = (mode, user) => {
    setOpenMenuId(null)
    onOpenModal(mode, user)
  }

  return (
    <section className="grid min-w-0 gap-4">
      <div className="flex min-w-0 flex-col gap-3 rounded-2xl border border-gray-300 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h2 className="break-words text-lg font-bold text-slate-950">Danh sách người dùng</h2>
          <p className="text-sm font-medium text-slate-500">Hiển thị {firstIndex}-{lastIndex} trên tổng số {totalUsers} người dùng</p>
        </div>
        <div className="flex items-center gap-2">
          <button aria-label="Trang trước" className="grid h-10 w-10 place-items-center rounded-2xl border border-gray-300 bg-white text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40" disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)} type="button">
            <ChevronLeft size={18} />
          </button>
          <span className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700">{currentPage}/{totalPages}</span>
          <button aria-label="Trang sau" className="grid h-10 w-10 place-items-center rounded-2xl border border-gray-300 bg-white text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40" disabled={currentPage === totalPages} onClick={() => onPageChange(currentPage + 1)} type="button">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="min-w-0 overflow-x-auto rounded-2xl border border-gray-300 bg-white shadow-sm">
        <table className="w-full min-w-[1180px] border-collapse text-left text-sm">
          <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="border-b border-gray-300 px-4 py-3">Ảnh đại diện</th>
              <th className="border-b border-gray-300 px-4 py-3">Họ và tên</th>
              <th className="border-b border-gray-300 px-4 py-3">Chức vụ</th>
              <th className="border-b border-gray-300 px-4 py-3">Đơn vị</th>
              <th className="border-b border-gray-300 px-4 py-3">Vai trò</th>
              <th className="border-b border-gray-300 px-4 py-3">Email</th>
              <th className="border-b border-gray-300 px-4 py-3">Số điện thoại</th>
              <th className="border-b border-gray-300 px-4 py-3">Trạng thái</th>
              <th className="border-b border-gray-300 px-4 py-3 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr className="align-middle transition hover:bg-slate-50" key={user.id}>
                <td className="border-b border-gray-300 px-4 py-3">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-blue-50 text-sm font-bold text-[#2563EB]">{user.avatar}</span>
                </td>
                <td className="border-b border-gray-300 px-4 py-3">
                  <button className="text-left font-bold text-slate-950 transition hover:text-[#2563EB]" onClick={() => onOpenModal('detail', user)} type="button">{user.name}</button>
                </td>
                <td className="border-b border-gray-300 px-4 py-3 font-semibold text-slate-700">{user.title}</td>
                <td className="border-b border-gray-300 px-4 py-3 font-semibold text-slate-700">{user.department}</td>
                <td className="border-b border-gray-300 px-4 py-3">
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-[#2563EB]">{user.role}</span>
                </td>
                <td className="border-b border-gray-300 px-4 py-3 font-semibold text-slate-600">{user.email}</td>
                <td className="border-b border-gray-300 px-4 py-3 font-semibold text-slate-600">{user.phone}</td>
                <td className="border-b border-gray-300 px-4 py-3">
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${statusClasses[user.status] || 'bg-slate-100 text-slate-600'}`}>{user.status}</span>
                </td>
                <td className="relative border-b border-gray-300 px-4 py-3 text-center">
                  <button aria-label={`Mở thao tác cho ${user.name}`} className="mx-auto grid h-9 w-9 place-items-center rounded-2xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-950" onClick={() => setOpenMenuId(openMenuId === user.id ? null : user.id)} type="button">
                    <MoreVertical size={18} />
                  </button>
                  {openMenuId === user.id && (
                    <div className="absolute right-4 top-12 z-20 w-56 overflow-hidden rounded-2xl border border-gray-300 bg-white py-2 text-left shadow-xl">
                      {menuActions.map(({ label, icon: Icon, mode, danger }) => (
                        <button className={`flex w-full items-center gap-2 px-3 py-2 text-sm font-semibold transition ${danger ? 'text-red-600 hover:bg-red-50' : 'text-slate-700 hover:bg-slate-50 hover:text-[#2563EB]'}`} key={label} onClick={() => handleAction(mode, user)} type="button">
                          <Icon size={16} />
                          {label}
                        </button>
                      ))}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {users.length === 0 && (
        <div className="grid min-h-64 place-items-center rounded-2xl border border-gray-300 bg-white p-6 text-center shadow-sm">
          <div className="max-w-md">
            <h3 className="text-lg font-bold text-slate-950">Không có người dùng phù hợp</h3>
            <p className="mt-2 text-sm font-medium leading-6 text-slate-500">Thử đổi bộ lọc, từ khóa tìm kiếm hoặc thêm tài khoản mới cho đơn vị.</p>
          </div>
        </div>
      )}
    </section>
  )
}

export default UsersContent
