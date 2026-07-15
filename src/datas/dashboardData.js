export const dashboardStats = [
  {
    title: 'Cuộc họp hôm nay',
    value: '12',
    icon: 'Calendar',
    color: 'blue',
  },
  {
    title: 'Đang diễn ra',
    value: '3',
    icon: 'PlayCircle',
    color: 'green',
  },
  {
    title: 'Đã kết thúc',
    value: '8',
    icon: 'CheckCircle',
    color: 'gray',
  },
  {
    title: 'Sắp diễn ra',
    value: '1',
    icon: 'Clock3',
    color: 'orange',
  },
  {
    title: 'Phòng họp sử dụng',
    value: '4 / 6',
    icon: 'Building2',
    color: 'blue',
  },
  {
    title: 'Đại biểu tham dự',
    value: '86',
    icon: 'Users',
    color: 'green',
  },
]

export const todayMeetings = [
  {
    time: '08:00',
    name: 'Họp giao ban',
    room: 'Phòng 1',
    host: 'Nguyễn Văn A',
    status: 'Đang diễn ra',
  },
  {
    time: '09:30',
    name: 'Họp HĐND',
    room: 'Phòng 2',
    host: 'Trần Văn B',
    status: 'Sắp diễn ra',
  },
  {
    time: '14:00',
    name: 'Họp triển khai',
    room: 'Phòng lớn',
    host: 'Lê Văn C',
    status: 'Chưa bắt đầu',
  },
]

export const meetingRooms = [
  {
    name: 'Phòng họp 01',
    capacity: 30,
    devices: ['Camera', 'Micro', 'Màn hình'],
    status: 'Đang sử dụng',
  },
  {
    name: 'Phòng họp 02',
    capacity: 24,
    devices: ['Camera', 'Micro', 'Máy chiếu'],
    status: 'Trống',
  },
  {
    name: 'Phòng họp 03',
    capacity: 18,
    devices: ['Micro', 'Màn hình'],
    status: 'Trống',
  },
  {
    name: 'Phòng họp lớn',
    capacity: 80,
    devices: ['Camera', 'Micro', 'Màn hình', 'Livestream'],
    status: 'Đang sử dụng',
  },
]

export const runningMeetings = [
  {
    name: 'Họp giao ban',
    time: '08:00 - 09:00',
    room: 'Phòng 1',
    host: 'Nguyễn Văn A',
    participants: 28,
  },
  {
    name: 'Họp trực tuyến chuyên đề',
    time: '08:30 - 10:00',
    room: 'Phòng họp lớn',
    host: 'Phạm Thị D',
    participants: 46,
  },
]

export const notifications = [
  { time: '09:00', title: 'Họp giao ban' },
  { time: '09:30', title: 'Họp HĐND' },
  { time: '14:00', title: 'Họp triển khai' },
  { time: '16:00', title: 'Họp tổng kết' },
]
