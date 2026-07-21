import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { getApiErrorMessage } from '@/services/apiError'
import DeviceModal from '@/components/Devices/DeviceModal'
import DevicesContent from '@/components/Devices/DevicesContent'
import DevicesHeader from '@/components/Devices/DevicesHeader'
import DevicesSidebar from '@/components/Devices/DevicesSidebar'
import {
  useCreateDeviceMutation,
  useDeleteDeviceMutation,
  useDeviceOptionsQuery,
  useDevicesQuery,
  useUpdateDeviceMutation,
  useUpdateDeviceStatusMutation,
} from '@/services/meetingApi'

const statusLabels = {
  ACTIVE: 'Đang hoạt động',
  MAINTENANCE: 'Đang bảo trì',
  BROKEN: 'Hỏng',
  STANDBY: 'Dự phòng',
}
const statusCodes = Object.fromEntries(
  Object.entries(statusLabels).map(([code, label]) => [label, code]),
)
const initialFilters = { category: '', status: '' }

function DevicesPage() {
  const { data: response, isLoading, isError, refetch } = useDevicesQuery({ page: 0, size: 100 })
  const { data: options } = useDeviceOptionsQuery()
  const [createDevice] = useCreateDeviceMutation()
  const [updateDevice] = useUpdateDeviceMutation()
  const [updateStatus] = useUpdateDeviceStatusMutation()
  const [deleteDevice] = useDeleteDeviceMutation()
  const [selectedCategory, setSelectedCategory] = useState('Tất cả thiết bị')
  const [searchValue, setSearchValue] = useState('')
  const [filters, setFilters] = useState(initialFilters)
  const [modalState, setModalState] = useState({ mode: null, device: null })

  const categories = useMemo(
    () => ['Tất cả thiết bị', ...(options?.categories ?? []).map((item) => item.name)],
    [options],
  )
  const statuses = (options?.statuses ?? Object.keys(statusLabels)).map(
    (status) => statusLabels[status] ?? status,
  )
  const devices = useMemo(
    () =>
      (response?.data ?? []).map((device) => ({
        ...device,
        categoryId: device.category?.id,
        category: device.category?.name ?? 'Chưa phân loại',
        statusCode: device.status,
        status: statusLabels[device.status] ?? device.status,
        updatedAt: device.updatedAt ? new Date(device.updatedAt).toLocaleDateString('vi-VN') : '',
      })),
    [response],
  )
  const stats = useMemo(
    () => ({
      total: devices.reduce((total, device) => total + device.quantity, 0),
      active: devices
        .filter((device) => device.statusCode === 'ACTIVE')
        .reduce((total, device) => total + device.quantity, 0),
      maintenance: devices
        .filter((device) => device.statusCode === 'MAINTENANCE')
        .reduce((total, device) => total + device.quantity, 0),
      broken: devices
        .filter((device) => device.statusCode === 'BROKEN')
        .reduce((total, device) => total + device.quantity, 0),
    }),
    [devices],
  )
  const categoryCounts = useMemo(
    () =>
      devices.reduce(
        (result, device) => ({
          ...result,
          [device.category]: (result[device.category] || 0) + device.quantity,
        }),
        { 'Tất cả thiết bị': devices.reduce((total, device) => total + device.quantity, 0) },
      ),
    [devices],
  )
  const filteredDevices = useMemo(() => {
    const keyword = searchValue.trim().toLowerCase()
    return devices.filter(
      (device) =>
        (!keyword || device.name.toLowerCase().includes(keyword)) &&
        (selectedCategory === 'Tất cả thiết bị' || device.category === selectedCategory) &&
        (!filters.category || device.category === filters.category) &&
        (!filters.status || device.status === filters.status),
    )
  }, [devices, filters, searchValue, selectedCategory])

  const closeModal = () => setModalState({ mode: null, device: null })
  const save = async (form) => {
    try {
      if (modalState.mode === 'maintenance') {
        await updateStatus({ id: form.id, status: 'MAINTENANCE', note: form.note }).unwrap()
      } else {
        const categoryId = options?.categories?.find((item) => item.name === form.category)?.id
        const body = {
          name: form.name,
          code: form.code,
          categoryId,
          brand: form.brand || undefined,
          model: form.model || undefined,
          quantity: Number(form.quantity),
          location: form.location || undefined,
          status: statusCodes[form.status] ?? 'ACTIVE',
          note: form.note || undefined,
        }
        if (modalState.mode === 'create') await createDevice(body).unwrap()
        else await updateDevice({ id: form.id, body }).unwrap()
      }
      toast.success('Đã lưu thiết bị')
      closeModal()
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Không thể lưu thiết bị'))
    }
  }
  const remove = async (id) => {
    try {
      await deleteDevice(id).unwrap()
      toast.success('Đã xóa thiết bị')
      closeModal()
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Không thể xóa thiết bị'))
    }
  }

  if (isLoading) return <StateMessage text="Đang tải danh sách thiết bị..." />
  if (isError) return <StateMessage action={refetch} text="Không thể tải thiết bị" />
  return (
    <div className="mx-auto grid max-w-[1600px] gap-4 sm:gap-6">
      <DevicesHeader
        categories={categories.filter((item) => item !== 'Tất cả thiết bị')}
        filters={filters}
        onAddDevice={() => setModalState({ mode: 'create', device: null })}
        onFilterChange={(name, value) => setFilters((current) => ({ ...current, [name]: value }))}
        onRefresh={() => {
          setSearchValue('')
          setFilters(initialFilters)
          setSelectedCategory('Tất cả thiết bị')
          refetch()
        }}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        stats={stats}
        statuses={statuses}
      />
      <section className="grid min-w-0 items-start gap-4 xl:grid-cols-[280px_minmax(0,1fr)]">
        <DevicesSidebar
          categoryCounts={categoryCounts}
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
        <DevicesContent
          devices={filteredDevices}
          onOpenModal={(mode, device) => setModalState({ mode, device })}
        />
      </section>
      <DeviceModal
        categories={categories.filter((item) => item !== 'Tất cả thiết bị')}
        device={modalState.device}
        mode={modalState.mode}
        onClose={closeModal}
        onDeleteDevice={remove}
        onSaveDevice={save}
        statuses={statuses}
      />
    </div>
  )
}

function StateMessage({ action, text }) {
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
export default DevicesPage
