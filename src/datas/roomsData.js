export const roomStatuses = ['Tất cả', 'Đang sử dụng', 'Trống', 'Bảo trì']

export const roomCapacities = ['Tất cả', 'Dưới 30 người', '30 - 60 người', 'Trên 60 người']

export const roomDevices = ['Camera', 'Micro', 'Màn hình', 'Máy chiếu', 'Loa']

export const rooms = [
  {
    id: 'room-01',
    name: 'Phòng họp số 01',
    status: 'Đang sử dụng',
    color: 'blue',
    capacity: 30,
    area: '56 m²',
    location: 'Khu hành chính UBND xã',
    floor: 'Tầng 2',
    image:
      'https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=1200&q=80',
    devices: ['Camera', 'Micro', 'Màn hình', 'Loa'],
    currentMeeting: {
      title: 'Họp giao ban đầu tuần',
      time: '08:00 - 09:30',
      host: 'Nguyễn Văn A',
    },
    layout: {
      rows: 4,
      seatsPerRow: 6,
    },
    history: [
      { date: '15/07/2026', title: 'Họp giao ban đầu tuần', time: '08:00 - 09:30' },
      { date: '12/07/2026', title: 'Họp chuyên đề chuyển đổi số', time: '14:00 - 15:30' },
      { date: '10/07/2026', title: 'Họp rà soát hồ sơ', time: '09:00 - 10:00' },
    ],
  },
  {
    id: 'room-02',
    name: 'Phòng họp số 02',
    status: 'Trống',
    color: 'teal',
    capacity: 24,
    area: '42 m²',
    location: 'Khu hành chính UBND xã',
    floor: 'Tầng 2',
    image:
      'https://images.unsplash.com/photo-1564069114553-7215e1ff1890?auto=format&fit=crop&w=1200&q=80',
    devices: ['Camera', 'Micro', 'Máy chiếu'],
    currentMeeting: null,
    layout: {
      rows: 3,
      seatsPerRow: 6,
    },
    history: [
      { date: '14/07/2026', title: 'Họp HĐND chuyên đề', time: '09:30 - 11:00' },
      { date: '11/07/2026', title: 'Họp an ninh trật tự', time: '08:00 - 09:00' },
    ],
  },
  {
    id: 'room-03',
    name: 'Phòng họp lớn',
    status: 'Đang sử dụng',
    color: 'purple',
    capacity: 80,
    area: '120 m²',
    location: 'Hội trường trung tâm',
    floor: 'Tầng 1',
    image:
      'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1200&q=80',
    devices: ['Camera', 'Micro', 'Màn hình', 'Máy chiếu', 'Loa'],
    currentMeeting: {
      title: 'Họp trực tuyến chuyên đề',
      time: '08:30 - 10:00',
      host: 'Phạm Thị D',
    },
    layout: {
      rows: 5,
      seatsPerRow: 8,
    },
    history: [
      { date: '15/07/2026', title: 'Họp trực tuyến chuyên đề', time: '08:30 - 10:00' },
      { date: '13/07/2026', title: 'Hội nghị cán bộ', time: '13:30 - 16:00' },
    ],
  },
  {
    id: 'room-04',
    name: 'Phòng họp A',
    status: 'Trống',
    color: 'amber',
    capacity: 40,
    area: '68 m²',
    location: 'Nhà làm việc liên thông',
    floor: 'Tầng 3',
    image:
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=80',
    devices: ['Camera', 'Micro', 'Màn hình'],
    currentMeeting: null,
    layout: {
      rows: 4,
      seatsPerRow: 7,
    },
    history: [
      { date: '09/07/2026', title: 'Họp tài chính ngân sách', time: '15:00 - 16:30' },
      { date: '08/07/2026', title: 'Họp bộ phận một cửa', time: '10:00 - 11:00' },
    ],
  },
  {
    id: 'room-05',
    name: 'Phòng họp B',
    status: 'Bảo trì',
    color: 'rose',
    capacity: 18,
    area: '32 m²',
    location: 'Nhà làm việc liên thông',
    floor: 'Tầng 3',
    image:
      'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=80',
    devices: ['Micro', 'Màn hình', 'Loa'],
    currentMeeting: null,
    layout: {
      rows: 3,
      seatsPerRow: 5,
    },
    history: [
      { date: '06/07/2026', title: 'Họp kiểm tra thiết bị', time: '08:00 - 08:45' },
      { date: '05/07/2026', title: 'Họp nội bộ văn phòng', time: '14:00 - 15:00' },
    ],
  },
  {
    id: 'room-06',
    name: 'Phòng trực tuyến',
    status: 'Trống',
    color: 'indigo',
    capacity: 16,
    area: '28 m²',
    location: 'Trung tâm điều hành',
    floor: 'Tầng 1',
    image:
      'https://images.unsplash.com/photo-1600508774634-4e11d34730e2?auto=format&fit=crop&w=1200&q=80',
    devices: ['Camera', 'Micro', 'Màn hình', 'Loa'],
    currentMeeting: null,
    layout: {
      rows: 2,
      seatsPerRow: 6,
    },
    history: [
      { date: '14/07/2026', title: 'Họp trực tuyến cấp huyện', time: '15:00 - 16:00' },
      { date: '11/07/2026', title: 'Họp rà soát phần mềm', time: '09:00 - 10:00' },
    ],
  },
]

export const roomColorStyles = {
  blue: {
    border: 'border-l-4 border-l-blue-500',
    bg: 'hover:bg-blue-50/10',
    accentBg: 'bg-blue-50/60 ring-blue-100/50 text-blue-900',
    iconColor: 'text-blue-600',
    iconBg: 'bg-blue-50 text-blue-600 ring-blue-100',
    btnBg: 'bg-blue-50 text-blue-600 hover:bg-blue-100',
    gradient: 'from-blue-500 to-indigo-600',
  },
  teal: {
    border: 'border-l-4 border-l-teal-500',
    bg: 'hover:bg-teal-50/10',
    accentBg: 'bg-teal-50/60 ring-teal-100/50 text-teal-900',
    iconColor: 'text-teal-600',
    iconBg: 'bg-teal-50 text-teal-600 ring-teal-100',
    btnBg: 'bg-teal-50 text-teal-600 hover:bg-teal-100',
    gradient: 'from-teal-500 to-emerald-600',
  },
  purple: {
    border: 'border-l-4 border-l-purple-500',
    bg: 'hover:bg-purple-50/10',
    accentBg: 'bg-purple-50/60 ring-purple-100/50 text-purple-900',
    iconColor: 'text-purple-600',
    iconBg: 'bg-purple-50 text-purple-600 ring-purple-100',
    btnBg: 'bg-purple-50 text-purple-600 hover:bg-purple-100',
    gradient: 'from-purple-500 to-indigo-600',
  },
  amber: {
    border: 'border-l-4 border-l-amber-500',
    bg: 'hover:bg-amber-50/10',
    accentBg: 'bg-amber-50/60 ring-amber-100/50 text-amber-950',
    iconColor: 'text-amber-600',
    iconBg: 'bg-amber-50 text-amber-600 ring-amber-100',
    btnBg: 'bg-amber-50 text-amber-600 hover:bg-amber-100',
    gradient: 'from-amber-500 to-orange-600',
  },
  rose: {
    border: 'border-l-4 border-l-rose-500',
    bg: 'hover:bg-rose-50/10',
    accentBg: 'bg-rose-50/60 ring-rose-100/50 text-rose-900',
    iconColor: 'text-rose-600',
    iconBg: 'bg-rose-50 text-rose-600 ring-rose-100',
    btnBg: 'bg-rose-50 text-rose-600 hover:bg-rose-100',
    gradient: 'from-rose-500 to-pink-600',
  },
  indigo: {
    border: 'border-l-4 border-l-indigo-500',
    bg: 'hover:bg-indigo-50/10',
    accentBg: 'bg-indigo-50/60 ring-indigo-100/50 text-indigo-900',
    iconColor: 'text-indigo-600',
    iconBg: 'bg-indigo-50 text-indigo-600 ring-indigo-100',
    btnBg: 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100',
    gradient: 'from-indigo-500 to-violet-600',
  },
}

export const getRoomColor = (roomNameOrId) => {
  if (!roomNameOrId) return 'blue'
  const name = roomNameOrId.toLowerCase()
  if (name.includes('01') || name.includes('room-01')) return 'blue'
  if (name.includes('02') || name.includes('room-02')) return 'teal'
  if (name.includes('lớn') || name.includes('room-03')) return 'purple'
  if (name.includes('phòng họp a') || name.includes('room-04') || name.endsWith(' a')) return 'amber'
  if (name.includes('phòng họp b') || name.includes('room-05') || name.endsWith(' b')) return 'rose'
  if (name.includes('trực tuyến') || name.includes('room-06')) return 'indigo'

  // Fallback hash
  const hash = Array.from(roomNameOrId).reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const colors = ['blue', 'teal', 'purple', 'amber', 'rose', 'indigo']
  return colors[hash % colors.length]
}

