import { useMemo, useState } from 'react'
import RoomDetail from '@/components/Rooms/RoomDetail'
import RoomForm from '@/components/Rooms/RoomForm'
import RoomsGrid from '@/components/Rooms/RoomsGrid'
import RoomsHeader from '@/components/Rooms/RoomsHeader'
import RoomsToolbar from '@/components/Rooms/RoomsToolbar'
import { roomCapacities, roomDevices, rooms, roomStatuses } from '@/datas/roomsData'

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

  const filteredRooms = useMemo(() => {
    const normalizedSearch = filters.search.trim().toLowerCase()

    return rooms.filter((room) => {
      const matchesSearch =
        normalizedSearch.length === 0 || room.name.toLowerCase().includes(normalizedSearch)
      const matchesStatus = filters.status === 'Tất cả' || room.status === filters.status
      const matchesCapacity =
        filters.capacity === 'Tất cả' ||
        (filters.capacity === 'Dưới 30 người' && room.capacity < 30) ||
        (filters.capacity === '30 - 60 người' && room.capacity >= 30 && room.capacity <= 60) ||
        (filters.capacity === 'Trên 60 người' && room.capacity > 60)

      return matchesSearch && matchesStatus && matchesCapacity
    })
  }, [filters])

  const handleCreateRoom = () => {
    setSelectedRoom(null)
    setRoomFormState({ mode: 'create', room: null, visible: true })
  }

  const handleEditRoom = (room) => {
    setSelectedRoom(null)
    setRoomFormState({ mode: 'edit', room, visible: true })
  }

  const handleFilterChange = (name, value) => {
    setFilters((currentFilters) => ({
      ...currentFilters,
      [name]: value,
    }))
  }

  return (
    <div className="mx-auto grid max-w-[1600px] gap-4 sm:gap-6">
      <RoomsHeader onCreateRoom={handleCreateRoom} />
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
        onSelectRoom={setSelectedRoom}
        rooms={filteredRooms}
        viewMode={viewMode}
      />
      <RoomDetail onClose={() => setSelectedRoom(null)} room={selectedRoom} />
      {roomFormState.visible && (
        <RoomForm
          devices={roomDevices}
          mode={roomFormState.mode}
          onClose={() => setRoomFormState((currentState) => ({ ...currentState, visible: false }))}
          room={roomFormState.room}
          statuses={roomStatuses}
        />
      )}
    </div>
  )
}

export default RoomsPage
