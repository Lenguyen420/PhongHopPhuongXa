import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { getApiErrorMessage } from '@/services/apiError'
import UserModal from '@/components/Users/UserModal'
import UsersContent from '@/components/Users/UsersContent'
import UsersHeader from '@/components/Users/UsersHeader'
import UsersSidebar from '@/components/Users/UsersSidebar'
import {
  useCreateUserMutation,
  useDeleteUserMutation,
  useSetUserPermissionsMutation,
  useResetUserPasswordMutation,
  useUpdateUserMutation,
  useUpdateUserStatusMutation,
  useUserOptionsQuery,
  useUsersQuery,
} from '@/services/meetingApi'

const statusLabels = { ACTIVE: 'Đang hoạt động', LOCKED: 'Bị khóa', PENDING: 'Chờ kích hoạt' }
const statusCodes = Object.fromEntries(
  Object.entries(statusLabels).map(([code, label]) => [label, code]),
)
const initialFilters = { department: '', role: '', status: '' }
const pageSize = 8

function UsersPage() {
  const { data: response, isLoading, isError, refetch } = useUsersQuery({ page: 0, size: 200 })
  const { data: options } = useUserOptionsQuery()
  const [createUser] = useCreateUserMutation()
  const [updateUser] = useUpdateUserMutation()
  const [updateStatus] = useUpdateUserStatusMutation()
  const [setPermissions] = useSetUserPermissionsMutation()
  const [resetPassword] = useResetUserPasswordMutation()
  const [deleteUser] = useDeleteUserMutation()
  const [selectedRole, setSelectedRole] = useState('Tất cả người dùng')
  const [searchValue, setSearchValue] = useState('')
  const [filters, setFilters] = useState(initialFilters)
  const [currentPage, setCurrentPage] = useState(1)
  const [modalState, setModalState] = useState({ mode: null, user: null })

  const roles = useMemo(
    () => ['Tất cả người dùng', ...(options?.roles ?? []).map((role) => role.name)],
    [options],
  )
  const departments = (options?.departments ?? []).map((item) => item.name)
  const statuses = (options?.statuses ?? Object.keys(statusLabels)).map(
    (status) => statusLabels[status] ?? status,
  )
  const rolePermissions = useMemo(
    () =>
      Object.fromEntries(
        (options?.roles ?? []).map((role) => [
          role.name,
          role.permissions.map((permission) => permission.name),
        ]),
      ),
    [options],
  )
  const users = useMemo(
    () =>
      (response?.data ?? []).map((user) => ({
        ...user,
        avatar: user.avatar || (user.name ?? user.username).slice(0, 2).toUpperCase(),
        departmentId: user.department?.id,
        department: user.department?.name ?? 'Chưa phân đơn vị',
        roleId: user.businessRole?.id,
        role: user.businessRole?.name ?? 'Chưa phân vai trò',
        systemRole: user.role,
        statusCode: user.status,
        status: statusLabels[user.status] ?? user.status,
        createdAt: user.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : '',
        lastLogin: user.lastLoginAt
          ? new Date(user.lastLoginAt).toLocaleString('vi-VN')
          : 'Chưa đăng nhập',
      })),
    [response],
  )
  const stats = useMemo(
    () => ({
      totalUsers: users.length,
      activeUsers: users.filter((user) => user.statusCode === 'ACTIVE').length,
      lockedUsers: users.filter((user) => user.statusCode === 'LOCKED').length,
      departments: new Set(users.map((user) => user.departmentId).filter(Boolean)).size,
    }),
    [users],
  )
  const roleCounts = useMemo(
    () =>
      users.reduce((result, user) => ({ ...result, [user.role]: (result[user.role] || 0) + 1 }), {
        'Tất cả người dùng': users.length,
      }),
    [users],
  )
  const filteredUsers = useMemo(() => {
    const keyword = searchValue.trim().toLowerCase()
    return users.filter(
      (user) =>
        (!keyword ||
          user.name.toLowerCase().includes(keyword) ||
          (user.email ?? '').toLowerCase().includes(keyword)) &&
        (selectedRole === 'Tất cả người dùng' || user.role === selectedRole) &&
        (!filters.department || user.department === filters.department) &&
        (!filters.role || user.role === filters.role) &&
        (!filters.status || user.status === filters.status),
    )
  }, [filters, searchValue, selectedRole, users])
  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize))
  const page = Math.min(currentPage, totalPages)
  const pagedUsers = filteredUsers.slice((page - 1) * pageSize, page * pageSize)
  const closeModal = () => setModalState({ mode: null, user: null })

  const save = async (form) => {
    try {
      if (modalState.mode === 'lock') {
        await updateStatus({ id: modalState.user.id, status: 'LOCKED' }).unwrap()
      } else if (modalState.mode === 'reset') {
        await resetPassword({ id: modalState.user.id, password: form.password }).unwrap()
      } else if (modalState.mode === 'permissions') {
        const allPermissions = (options?.roles ?? []).flatMap((role) => role.permissions)
        const permissionIds = form.permissions
          .map((name) => allPermissions.find((item) => item.name === name)?.id)
          .filter(Boolean)
        await setPermissions({ id: modalState.user.id, permissionIds }).unwrap()
      } else {
        const body = {
          name: form.name,
          email: form.email || undefined,
          phone: form.phone || undefined,
          title: form.title || undefined,
          departmentId: options?.departments?.find((item) => item.name === form.department)?.id,
          roleId: options?.roles?.find((item) => item.name === form.role)?.id,
          password: form.password || undefined,
          status: statusCodes[form.status] ?? 'ACTIVE',
        }
        if (modalState.mode === 'create') await createUser(body).unwrap()
        else await updateUser({ id: modalState.user.id, body }).unwrap()
        const desiredStatus = statusCodes[form.status]
        if (
          modalState.user?.statusCode &&
          desiredStatus &&
          desiredStatus !== modalState.user.statusCode
        )
          await updateStatus({ id: modalState.user.id, status: desiredStatus }).unwrap()
      }
      toast.success('Đã lưu người dùng')
      closeModal()
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Không thể lưu người dùng'))
    }
  }
  const remove = async (id) => {
    try {
      await deleteUser(id).unwrap()
      toast.success('Đã xóa người dùng')
      closeModal()
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Không thể xóa người dùng'))
    }
  }

  if (isLoading) return <State text="Đang tải người dùng..." />
  if (isError) return <State action={refetch} text="Không thể tải người dùng" />
  return (
    <div className="mx-auto grid max-w-[1600px] gap-4 sm:gap-6">
      <UsersHeader
        departments={departments}
        filters={filters}
        onAddUser={() => setModalState({ mode: 'create', user: null })}
        onFilterChange={(name, value) => {
          setFilters((current) => ({ ...current, [name]: value }))
          setCurrentPage(1)
        }}
        onRefresh={() => {
          setSearchValue('')
          setFilters(initialFilters)
          setSelectedRole('Tất cả người dùng')
          setCurrentPage(1)
          refetch()
        }}
        roles={roles.filter((item) => item !== 'Tất cả người dùng')}
        searchValue={searchValue}
        setSearchValue={(value) => {
          setSearchValue(value)
          setCurrentPage(1)
        }}
        stats={stats}
        statuses={statuses}
      />
      <section className="grid min-w-0 gap-4 xl:grid-cols-[280px_minmax(0,1fr)]">
        <UsersSidebar
          roleCounts={roleCounts}
          roles={roles}
          selectedRole={selectedRole}
          setSelectedRole={(role) => {
            setSelectedRole(role)
            setCurrentPage(1)
          }}
        />
        <UsersContent
          currentPage={page}
          onOpenModal={(mode, user) => setModalState({ mode, user })}
          onPageChange={setCurrentPage}
          pageSize={pageSize}
          totalUsers={filteredUsers.length}
          users={pagedUsers}
        />
      </section>
      <UserModal
        departments={departments}
        mode={modalState.mode}
        onClose={closeModal}
        onDeleteUser={remove}
        onSaveUser={save}
        rolePermissions={rolePermissions}
        roles={roles}
        statuses={statuses}
        user={modalState.user}
      />
    </div>
  )
}

function State({ action, text }) {
  return (
    <div className="rounded-2xl bg-white p-8 text-center font-semibold text-slate-600 ring-1 ring-slate-200">
      {text}
      {action && (
        <button className="ml-3 text-blue-600" onClick={action} type="button">
          Thử lại
        </button>
      )}
    </div>
  )
}
export default UsersPage
