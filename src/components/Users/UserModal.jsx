import { Check, KeyRound, Lock, ShieldCheck, Trash2, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import AppSelect from '@/components/ui/AppSelect'

const emptyForm = {
  name: '',
  email: '',
  phone: '',
  title: '',
  department: '',
  role: 'Thành viên',
  status: 'Đang hoạt động',
  password: '',
}

function UserModal({
  departments,
  mode,
  onClose,
  onDeleteUser,
  onSaveUser,
  rolePermissions,
  roles,
  statuses,
  user,
}) {
  const [formData, setFormData] = useState(emptyForm)
  const [permissions, setPermissions] = useState([])
  const editableRoles = roles.filter((role) => role !== 'Tất cả người dùng')

  useEffect(() => {
    if (mode === 'create') {
      setFormData(emptyForm)
      setPermissions(rolePermissions['Thành viên'])
    }

    if (user) {
      setFormData({ ...emptyForm, ...user, password: '' })
      setPermissions(rolePermissions[user.role] || [])
    }
  }, [mode, rolePermissions, user])

  const title = useMemo(() => {
    if (mode === 'detail') return 'Thông tin người dùng'
    if (mode === 'create') return 'Thêm người dùng'
    if (mode === 'edit') return 'Chỉnh sửa người dùng'
    if (mode === 'permissions') return 'Phân quyền người dùng'
    if (mode === 'reset') return 'Đặt lại mật khẩu'
    if (mode === 'lock') return 'Khóa tài khoản'
    if (mode === 'delete') return 'Xóa người dùng'
    return ''
  }, [mode])

  if (!mode) {
    return null
  }

  const handleChange = (name, value) => {
    setFormData((currentForm) => ({ ...currentForm, [name]: value }))

    if (name === 'role') {
      setPermissions(rolePermissions[value] || [])
    }
  }

  const togglePermission = (permission) => {
    setPermissions((currentPermissions) =>
      currentPermissions.includes(permission)
        ? currentPermissions.filter((item) => item !== permission)
        : [...currentPermissions, permission],
    )
  }

  const handleSave = () => {
    onSaveUser({
      ...formData,
      avatar:
        formData.name
          .split(' ')
          .slice(-2)
          .map((part) => part[0])
          .join('')
          .toUpperCase() || 'ND',
      permissions,
    })
  }

  const handleConfirm = () => {
    if (mode === 'lock') {
      onSaveUser({ ...formData, status: 'Bị khóa' })
      return
    }

    if (mode === 'reset') {
      onSaveUser(formData)
      return
    }

    onClose()
  }

  const isFormMode = mode === 'create' || mode === 'edit'
  const isDangerMode = mode === 'delete' || mode === 'lock'
  const selectedPermissionRole = formData.role || user?.role || 'Thành viên'

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/45 p-3 backdrop-blur-sm sm:p-4">
      <section className="max-h-[calc(100vh-24px)] w-full max-w-4xl overflow-y-auto rounded-2xl border border-gray-300 bg-white shadow-2xl sm:max-h-[calc(100vh-32px)]">
        <div className="flex min-w-0 items-start justify-between gap-3 border-b border-gray-300 px-4 py-4 sm:px-5">
          <div className="min-w-0">
            <h2 className="break-words text-lg font-bold text-slate-950">{title}</h2>
            <p className="mt-1 text-sm font-medium text-slate-500">
              {user?.name || 'Tài khoản mới trong hệ thống họp trực tuyến UBND phường/xã'}
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
          {mode === 'detail' && <UserDetail user={user} />}
          {isFormMode && (
            <UserForm
              departments={departments}
              formData={formData}
              mode={mode}
              onChange={handleChange}
              roles={editableRoles}
              statuses={statuses}
            />
          )}
          {mode === 'permissions' && (
            <PermissionPanel
              permissions={permissions}
              rolePermissions={rolePermissions}
              selectedRole={selectedPermissionRole}
              togglePermission={togglePermission}
            />
          )}
          {mode === 'reset' && (
            <div className="grid gap-3">
              <ConfirmPanel icon={KeyRound} text="Nhập mật khẩu mới cho người dùng." tone="blue" />
              <FormInput
                label="Mật khẩu mới"
                name="password"
                onChange={handleChange}
                type="password"
                value={formData.password}
              />
            </div>
          )}
          {mode === 'lock' && (
            <ConfirmPanel
              icon={Lock}
              text="Tài khoản sẽ không thể đăng nhập cho đến khi được mở khóa lại."
              tone="amber"
            />
          )}
          {mode === 'delete' && (
            <ConfirmPanel
              icon={Trash2}
              text="Người dùng sẽ bị xóa khỏi danh sách mẫu trên giao diện hiện tại."
              tone="red"
            />
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
              onClick={() => onDeleteUser(user.id)}
              type="button"
            >
              <Trash2 size={17} />
              Xóa
            </button>
          ) : (
            <button
              className={`inline-flex h-11 items-center justify-center gap-2 rounded-2xl px-5 text-sm font-bold text-white transition ${isDangerMode ? 'bg-amber-600 hover:bg-amber-700' : 'bg-[#2563EB] hover:bg-blue-700'}`}
              onClick={isFormMode || mode === 'permissions' ? handleSave : handleConfirm}
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

function UserDetail({ user }) {
  const details = [
    ['Họ và tên', user.name],
    ['Chức vụ', user.title],
    ['Đơn vị', user.department],
    ['Email', user.email],
    ['Số điện thoại', user.phone],
    ['Vai trò', user.role],
    ['Trạng thái', user.status],
    ['Ngày tạo tài khoản', user.createdAt],
    ['Lần đăng nhập gần nhất', user.lastLogin],
  ]

  return (
    <div className="grid gap-4 lg:grid-cols-[220px_minmax(0,1fr)]">
      <div className="grid place-items-center rounded-2xl border border-gray-300 bg-slate-50 p-5">
        <span className="grid h-24 w-24 place-items-center rounded-2xl bg-blue-50 text-3xl font-bold text-[#2563EB]">
          {user.avatar}
        </span>
        <p className="mt-3 text-center text-base font-bold text-slate-950">{user.name}</p>
        <p className="mt-1 text-center text-sm font-semibold text-slate-500">{user.role}</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {details.map(([label, value]) => (
          <InfoItem key={label} label={label} value={value} />
        ))}
      </div>
    </div>
  )
}

function UserForm({ departments, formData, mode, onChange, roles, statuses }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <FormInput label="Họ và tên" name="name" onChange={onChange} value={formData.name} />
      <FormInput
        label="Email"
        name="email"
        onChange={onChange}
        type="email"
        value={formData.email}
      />
      <FormInput label="Số điện thoại" name="phone" onChange={onChange} value={formData.phone} />
      <FormInput label="Chức vụ" name="title" onChange={onChange} value={formData.title} />
      <FormSelect
        label="Đơn vị"
        name="department"
        onChange={onChange}
        options={departments}
        value={formData.department}
      />
      <FormSelect
        label="Vai trò"
        name="role"
        onChange={onChange}
        options={roles}
        value={formData.role}
      />
      <FormSelect
        label="Trạng thái"
        name="status"
        onChange={onChange}
        options={statuses}
        value={formData.status}
      />
      {mode === 'create' && (
        <FormInput
          label="Mật khẩu"
          name="password"
          onChange={onChange}
          type="password"
          value={formData.password}
        />
      )}
    </div>
  )
}

function PermissionPanel({ permissions, rolePermissions, selectedRole, togglePermission }) {
  return (
    <div className="grid gap-4">
      {Object.entries(rolePermissions).map(([role, items]) => (
        <section
          className={`rounded-2xl border p-4 ${role === selectedRole ? 'border-blue-200 bg-blue-50/50' : 'border-gray-300 bg-white'}`}
          key={role}
        >
          <div className="flex items-center gap-2">
            <ShieldCheck
              className={role === selectedRole ? 'text-[#2563EB]' : 'text-slate-400'}
              size={18}
            />
            <h3 className="text-base font-bold text-slate-950">{role}</h3>
          </div>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {items.map((permission) => (
              <label
                className="flex min-w-0 items-center gap-3 rounded-2xl border border-gray-300 bg-white px-3 py-3 text-sm font-bold text-slate-700"
                key={permission}
              >
                <input
                  checked={permissions.includes(permission)}
                  className="h-4 w-4 accent-[#2563EB]"
                  onChange={() => togglePermission(permission)}
                  type="checkbox"
                />
                <span className="min-w-0 break-words">{permission}</span>
              </label>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}

function ConfirmPanel({ icon: Icon, text, tone }) {
  const toneClass =
    tone === 'red'
      ? 'bg-red-50 text-red-600'
      : tone === 'amber'
        ? 'bg-amber-50 text-amber-700'
        : 'bg-blue-50 text-[#2563EB]'

  return (
    <div className="grid place-items-center rounded-2xl border border-gray-300 bg-slate-50 p-6 text-center">
      <span className={`grid h-16 w-16 place-items-center rounded-2xl ${toneClass}`}>
        <Icon size={28} />
      </span>
      <p className="mt-4 max-w-md text-sm font-semibold leading-6 text-slate-600">{text}</p>
    </div>
  )
}

function InfoItem({ label, value }) {
  return (
    <div className="min-w-0 rounded-2xl border border-gray-300 bg-slate-50 px-4 py-3">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 break-words text-sm font-bold text-slate-800">{value}</p>
    </div>
  )
}

function FormInput({ label, name, onChange, type = 'text', value }) {
  return (
    <label className="grid min-w-0 gap-1.5">
      <span className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</span>
      <input
        className="h-11 min-w-0 rounded-2xl border border-gray-300 bg-white px-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-[#2563EB] focus:ring-4 focus:ring-blue-100"
        onChange={(event) => onChange(name, event.target.value)}
        type={type}
        value={value}
      />
    </label>
  )
}

function FormSelect({ label, name, onChange, options, value }) {
  return (
    <label className="grid min-w-0 gap-1.5">
      <span className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</span>
      <AppSelect
        onChange={(event) => onChange(name, event.target.value)}
        options={options}
        value={value}
      />
    </label>
  )
}

export default UserModal
