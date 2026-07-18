import { useMemo, useState } from 'react'
import UserModal from '@/components/Users/UserModal'
import UsersContent from '@/components/Users/UsersContent'
import UsersHeader from '@/components/Users/UsersHeader'
import UsersSidebar from '@/components/Users/UsersSidebar'
import { rolePermissions, userDepartments, userRoles, usersData, userStatuses } from '@/datas/users'

const initialFilters = {
  department: '',
  role: '',
  status: '',
}

const pageSize = 8

function UsersPage() {
  const [users, setUsers] = useState(usersData)
  const [selectedRole, setSelectedRole] = useState('Tất cả người dùng')
  const [searchValue, setSearchValue] = useState('')
  const [filters, setFilters] = useState(initialFilters)
  const [currentPage, setCurrentPage] = useState(1)
  const [modalState, setModalState] = useState({ mode: null, user: null })

  const stats = useMemo(
    () => ({
      totalUsers: users.length,
      activeUsers: users.filter((user) => user.status === 'Đang hoạt động').length,
      lockedUsers: users.filter((user) => user.status === 'Bị khóa').length,
      departments: new Set(users.map((user) => user.department)).size,
    }),
    [users],
  )

  const roleCounts = useMemo(() => {
    const counts = users.reduce(
      (result, user) => ({
        ...result,
        [user.role]: (result[user.role] || 0) + 1,
      }),
      { 'Tất cả người dùng': users.length },
    )

    return counts
  }, [users])

  const filteredUsers = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLowerCase()

    return users.filter((user) => {
      const matchesSearch = normalizedSearch.length === 0 || user.name.toLowerCase().includes(normalizedSearch) || user.email.toLowerCase().includes(normalizedSearch)
      const matchesSidebarRole = selectedRole === 'Tất cả người dùng' || user.role === selectedRole
      const matchesDepartment = !filters.department || user.department === filters.department
      const matchesRole = !filters.role || user.role === filters.role
      const matchesStatus = !filters.status || user.status === filters.status

      return matchesSearch && matchesSidebarRole && matchesDepartment && matchesRole && matchesStatus
    })
  }, [filters, searchValue, selectedRole, users])

  const pagedUsers = useMemo(() => {
    const totalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize))
    const nextPage = Math.min(currentPage, totalPages)
    const startIndex = (nextPage - 1) * pageSize

    return filteredUsers.slice(startIndex, startIndex + pageSize)
  }, [currentPage, filteredUsers])

  const handleFilterChange = (name, value) => {
    setFilters((currentFilters) => ({
      ...currentFilters,
      [name]: value,
    }))
    setCurrentPage(1)
  }

  const handleRoleChange = (role) => {
    setSelectedRole(role)
    setCurrentPage(1)
  }

  const handleRefresh = () => {
    setSearchValue('')
    setFilters(initialFilters)
    setSelectedRole('Tất cả người dùng')
    setCurrentPage(1)
  }

  const openModal = (mode, user = null) => {
    setModalState({ mode, user })
  }

  const closeModal = () => {
    setModalState({ mode: null, user: null })
  }

  const handleSaveUser = (userData) => {
    if (modalState.mode === 'create') {
      setUsers((currentUsers) => [
        {
          ...userData,
          id: Date.now(),
          createdAt: new Date().toLocaleDateString('vi-VN'),
          lastLogin: 'Chưa đăng nhập',
        },
        ...currentUsers,
      ])
    }

    if (modalState.mode === 'edit' || modalState.mode === 'permissions') {
      setUsers((currentUsers) => currentUsers.map((user) => (user.id === modalState.user.id ? { ...user, ...userData } : user)))
    }

    closeModal()
  }

  const handleDeleteUser = (userId) => {
    setUsers((currentUsers) => currentUsers.filter((user) => user.id !== userId))
    closeModal()
  }

  return (
    <div className="mx-auto grid max-w-[1600px] gap-4 sm:gap-6">
      <UsersHeader departments={userDepartments} filters={filters} onAddUser={() => openModal('create')} onFilterChange={handleFilterChange} onRefresh={handleRefresh} roles={userRoles} searchValue={searchValue} setSearchValue={(value) => { setSearchValue(value); setCurrentPage(1) }} stats={stats} statuses={userStatuses} />

      <section className="grid min-w-0 gap-4 xl:grid-cols-[280px_minmax(0,1fr)]">
        <UsersSidebar roleCounts={roleCounts} roles={userRoles} selectedRole={selectedRole} setSelectedRole={handleRoleChange} />
        <UsersContent currentPage={Math.min(currentPage, Math.max(1, Math.ceil(filteredUsers.length / pageSize)))} onOpenModal={openModal} onPageChange={setCurrentPage} pageSize={pageSize} totalUsers={filteredUsers.length} users={pagedUsers} />
      </section>

      <UserModal departments={userDepartments} mode={modalState.mode} onClose={closeModal} onDeleteUser={handleDeleteUser} onSaveUser={handleSaveUser} rolePermissions={rolePermissions} roles={userRoles} statuses={userStatuses} user={modalState.user} />
    </div>
  )
}

export default UsersPage
