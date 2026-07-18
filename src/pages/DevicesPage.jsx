import { useMemo, useState } from 'react'
import DeviceModal from '@/components/Devices/DeviceModal'
import DevicesContent from '@/components/Devices/DevicesContent'
import DevicesHeader from '@/components/Devices/DevicesHeader'
import DevicesSidebar from '@/components/Devices/DevicesSidebar'
import { deviceCategories, devicesData, deviceStatuses } from '@/datas/devices'

const initialFilters = { category: '', status: '' }

function DevicesPage() {
  const [devices, setDevices] = useState(devicesData)
  const [selectedCategory, setSelectedCategory] = useState('Tất cả thiết bị')
  const [searchValue, setSearchValue] = useState('')
  const [filters, setFilters] = useState(initialFilters)
  const [modalState, setModalState] = useState({ mode: null, device: null })

  const stats = useMemo(() => ({
    total: devices.reduce((total, device) => total + device.quantity, 0),
    active: devices.filter((device) => device.status === 'Đang hoạt động').reduce((total, device) => total + device.quantity, 0),
    maintenance: devices.filter((device) => device.status === 'Đang bảo trì').reduce((total, device) => total + device.quantity, 0),
    broken: devices.filter((device) => device.status === 'Hỏng').reduce((total, device) => total + device.quantity, 0),
  }), [devices])

  const categoryCounts = useMemo(() => devices.reduce((result, device) => ({ ...result, [device.category]: (result[device.category] || 0) + device.quantity }), { 'Tất cả thiết bị': devices.reduce((total, device) => total + device.quantity, 0) }), [devices])

  const filteredDevices = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLowerCase()
    return devices.filter((device) => {
      const matchesSearch = normalizedSearch.length === 0 || device.name.toLowerCase().includes(normalizedSearch)
      const matchesSidebar = selectedCategory === 'Tất cả thiết bị' || device.category === selectedCategory
      const matchesCategory = !filters.category || device.category === filters.category
      const matchesStatus = !filters.status || device.status === filters.status
      return matchesSearch && matchesSidebar && matchesCategory && matchesStatus
    })
  }, [devices, filters, searchValue, selectedCategory])

  const handleFilterChange = (name, value) => setFilters((currentFilters) => ({ ...currentFilters, [name]: value }))
  const handleRefresh = () => {
    setSearchValue('')
    setFilters(initialFilters)
    setSelectedCategory('Tất cả thiết bị')
  }
  const openModal = (mode, device = null) => setModalState({ mode, device })
  const closeModal = () => setModalState({ mode: null, device: null })
  const handleSaveDevice = (deviceData) => {
    setDevices((currentDevices) => {
      const exists = currentDevices.some((device) => device.id === deviceData.id)
      return exists ? currentDevices.map((device) => (device.id === deviceData.id ? deviceData : device)) : [deviceData, ...currentDevices]
    })
    closeModal()
  }
  const handleDeleteDevice = (deviceId) => {
    setDevices((currentDevices) => currentDevices.filter((device) => device.id !== deviceId))
    closeModal()
  }

  return (
    <div className="mx-auto grid max-w-[1600px] gap-4 sm:gap-6">
      <DevicesHeader categories={deviceCategories} filters={filters} onAddDevice={() => openModal('create')} onFilterChange={handleFilterChange} onRefresh={handleRefresh} searchValue={searchValue} setSearchValue={setSearchValue} stats={stats} statuses={deviceStatuses} />
      <section className="grid min-w-0 items-start gap-4 xl:grid-cols-[280px_minmax(0,1fr)]">
        <DevicesSidebar categoryCounts={categoryCounts} categories={deviceCategories} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
        <DevicesContent devices={filteredDevices} onOpenModal={openModal} />
      </section>
      <DeviceModal categories={deviceCategories} device={modalState.device} mode={modalState.mode} onClose={closeModal} onDeleteDevice={handleDeleteDevice} onSaveDevice={handleSaveDevice} statuses={deviceStatuses} />
    </div>
  )
}

export default DevicesPage
