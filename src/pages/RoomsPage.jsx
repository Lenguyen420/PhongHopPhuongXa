import { useState } from 'react'
import toast from 'react-hot-toast'
import RoomDetail from '@/components/Rooms/RoomDetail'
import RoomForm from '@/components/Rooms/RoomForm'
import RoomsGrid from '@/components/Rooms/RoomsGrid'
import RoomsHeader from '@/components/Rooms/RoomsHeader'
import RoomsToolbar from '@/components/Rooms/RoomsToolbar'
import {
  useCreateRoomMutation,
  useLazyRoomQuery,
  useRoomsQuery,
  useUpdateRoomMutation,
  useDeviceOptionsQuery,
  useDevicesQuery,
} from '@/services/meetingApi'
import { uploadAttachment } from '@/services/files'
import { getApiErrorMessage } from '@/services/apiError'

const roomStatuses = ['Tất cả', 'Đang sử dụng', 'Trống', 'Bảo trì']
const roomCapacities = ['Tất cả', 'Dưới 30 người', '30 - 60 người', 'Trên 60 người']
const statusToApi = { 'Đang sử dụng': 'IN_USE', Trống: 'AVAILABLE', 'Bảo trì': 'MAINTENANCE' }
const statusFromApi = { IN_USE: 'Đang sử dụng', AVAILABLE: 'Trống', MAINTENANCE: 'Bảo trì' }

const initialFilters = {
  capacity: 'Tất cả',
  search: '',
  status: 'Tất cả',
}

function RoomsPage() {
  const [filters, setFilters] = useState(initialFilters)
  const [roomFormState, setRoomFormState] = useState({ mode: 'create', room: null, visible: false })
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [viewMode, setViewMode] = useState('grid')
  const { data: deviceResponse } = useDevicesQuery({ page: 0, size: 100, status: 'ACTIVE' })
  const { data: deviceOptions } = useDeviceOptionsQuery()
  const roomDevices = (deviceResponse?.data ?? []).map((device) => ({
    ...device,
    category: device.category?.name ?? 'Khác',
    status: device.status === 'ACTIVE' ? 'Đang hoạt động' : device.status,
  }))

  const capacityRange = {
    'Dưới 30 người': 'UNDER_30',
    '30 - 60 người': '30_60',
    'Trên 60 người': 'OVER_60',
  }[filters.capacity]
  const { data, isLoading, isError, refetch } = useRoomsQuery({
    page: 0,
    size: 100,
    keyword: filters.search || undefined,
    status: statusToApi[filters.status],
    capacityRange,
  })
  const [loadRoom] = useLazyRoomQuery()
  const [createRoom] = useCreateRoomMutation()
  const [updateRoom] = useUpdateRoomMutation()
  const filteredRooms = (data?.data ?? []).map((room) => ({
    ...room,
    status: statusFromApi[room.status] || room.status,
  }))

  const handleCreateRoom = () => {
    setSelectedRoom(null)
    setRoomFormState({ mode: 'create', room: null, visible: true })
  }

  const handleEditRoom = (room) => {
    setSelectedRoom(null)
    setRoomFormState({ mode: 'edit', room, visible: true })
  }

  const handleSelectRoom = async (room) => {
    try {
      const detail = await loadRoom(room.id).unwrap()
      setSelectedRoom({ ...detail, status: statusFromApi[detail.status] || detail.status })
    } catch {
      toast.error('Không thể tải chi tiết phòng')
    }
  }

  const handleSaveRoom = async (body, imageFile) => {
    try {
      const saved =
        roomFormState.mode === 'edit'
          ? await updateRoom({ id: roomFormState.room.id, body }).unwrap()
          : await createRoom(body).unwrap()
      if (imageFile) {
        const attachment = await uploadAttachment(imageFile, 'meeting_rooms', saved.id)
        const image = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5175'}/attachments/${attachment.id}/download`
        await updateRoom({ id: saved.id, body: { ...body, image } }).unwrap()
      }
      toast.success(body.lifecycleStatus === 'DRAFT' ? 'Đã lưu nháp phòng' : 'Đã lưu phòng họp')
      setRoomFormState((state) => ({ ...state, visible: false }))
      refetch()
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Không thể lưu phòng họp'))
    }
  }

  const handleFilterChange = (name, value) => {
    setFilters((currentFilters) => ({
      ...currentFilters,
      [name]: value,
    }))
  }

  return (
    <div className="mx-auto grid max-w-[1600px] gap-4 sm:gap-6">
      <RoomsHeader onCreateRoom={handleCreateRoom} onRefresh={refetch} />
      <RoomsToolbar
        capacityOptions={roomCapacities}
        filters={filters}
        onFilterChange={handleFilterChange}
        onSearchChange={(search) => handleFilterChange('search', search)}
        onViewModeChange={setViewMode}
        statusOptions={roomStatuses}
        viewMode={viewMode}
      />
      <RoomsGrid
        onEditRoom={handleEditRoom}
        onSelectRoom={handleSelectRoom}
        rooms={filteredRooms}
        viewMode={viewMode}
      />
      {isLoading && (
        <p className="text-center font-semibold text-slate-500">Đang tải phòng họp...</p>
      )}
      {isError && (
        <p className="text-center font-semibold text-red-600">Không thể tải danh sách phòng.</p>
      )}
      <RoomDetail onClose={() => setSelectedRoom(null)} room={selectedRoom} />
      {roomFormState.visible && (
        <RoomForm
          deviceCategories={(deviceOptions?.categories ?? []).map((item) => item.name)}
          devices={roomDevices}
          mode={roomFormState.mode}
          onSave={handleSaveRoom}
          onClose={() => setRoomFormState((currentState) => ({ ...currentState, visible: false }))}
          room={roomFormState.room}
          statuses={['ACTIVE', 'MAINTENANCE']}
        />
      )}
    </div>
  )
}

export default RoomsPage
