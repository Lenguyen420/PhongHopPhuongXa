export const reportRooms = ['Tất cả phòng họp', 'Phòng họp A', 'Phòng họp B', 'Phòng họp C', 'Phòng họp tầng 2', 'Hội trường lớn']

export const reportUnits = ['Tất cả đơn vị', 'Văn phòng UBND', 'Phòng Nội vụ', 'Phòng Tài chính', 'Phòng Tư pháp', 'Phòng Văn hóa']

export const reportHosts = ['Tất cả chủ trì', 'Nguyễn Văn Minh', 'Lê Hoàng Phúc', 'Trần Thị Lan', 'Phạm Quốc Huy', 'Huỳnh Ngọc Ánh']

export const overviewStats = [
  { id: 'meetings', title: 'Tổng số cuộc họp', value: '245', suffix: 'cuộc họp', change: 12, trend: 'up' },
  { id: 'attendance', title: 'Tỷ lệ tham dự', value: '96%', suffix: '', change: 3, trend: 'up' },
  { id: 'duration', title: 'Thời gian họp trung bình', value: '78', suffix: 'phút', change: 5, trend: 'down' },
  { id: 'rooms', title: 'Số phòng họp đã sử dụng', value: '12', suffix: 'phòng', change: 2, trend: 'up' },
  { id: 'participants', title: 'Tổng số người tham dự', value: '1.860', suffix: 'lượt', change: 8, trend: 'up' },
  { id: 'tasks', title: 'Tổng nhiệm vụ được giao', value: '315', suffix: 'nhiệm vụ', change: 15, trend: 'up' },
]

export const meetingsByTime = {
  day: [
    { label: 'T2', meetings: 28 },
    { label: 'T3', meetings: 34 },
    { label: 'T4', meetings: 31 },
    { label: 'T5', meetings: 39 },
    { label: 'T6', meetings: 42 },
    { label: 'T7', meetings: 18 },
    { label: 'CN', meetings: 9 },
  ],
  week: [
    { label: 'Tuần 1', meetings: 52 },
    { label: 'Tuần 2', meetings: 61 },
    { label: 'Tuần 3', meetings: 58 },
    { label: 'Tuần 4', meetings: 74 },
  ],
  month: [
    { label: 'T1', meetings: 168 },
    { label: 'T2', meetings: 181 },
    { label: 'T3', meetings: 194 },
    { label: 'T4', meetings: 203 },
    { label: 'T5', meetings: 221 },
    { label: 'T6', meetings: 232 },
    { label: 'T7', meetings: 245 },
  ],
  year: [
    { label: '2022', meetings: 1720 },
    { label: '2023', meetings: 1885 },
    { label: '2024', meetings: 2030 },
    { label: '2025', meetings: 2194 },
    { label: '2026', meetings: 2468 },
  ],
}

export const topRooms = [
  { name: 'Phòng họp A', count: 68 },
  { name: 'Phòng họp B', count: 54 },
  { name: 'Phòng họp C', count: 47 },
  { name: 'Phòng họp tầng 2', count: 41 },
  { name: 'Hội trường lớn', count: 35 },
]

export const topUnits = [
  { name: 'Văn phòng UBND', count: 74 },
  { name: 'Phòng Nội vụ', count: 58 },
  { name: 'Phòng Tài chính', count: 43 },
  { name: 'Phòng Tư pháp', count: 39 },
  { name: 'Phòng Văn hóa', count: 31 },
]

export const roomUsageRate = [
  { name: 'Phòng A', value: 34 },
  { name: 'Phòng B', value: 27 },
  { name: 'Phòng C', value: 21 },
  { name: 'Hội trường', value: 18 },
]

export const meetingStatusRate = [
  { name: 'Đã hoàn thành', value: 72 },
  { name: 'Đang diễn ra', value: 8 },
  { name: 'Đã hủy', value: 6 },
  { name: 'Chờ diễn ra', value: 14 },
]

export const reportDetails = [
  { id: 1, date: '01/07/2026', name: 'Họp giao ban UBND phường', host: 'Nguyễn Văn Minh', room: 'Phòng họp A', unit: 'Văn phòng UBND', attendees: 32, attendanceRate: 97, duration: 90, status: 'Đã hoàn thành' },
  { id: 2, date: '02/07/2026', name: 'Họp triển khai cải cách hành chính', host: 'Lê Hoàng Phúc', room: 'Phòng họp tầng 2', unit: 'Phòng Nội vụ', attendees: 24, attendanceRate: 92, duration: 75, status: 'Đã hoàn thành' },
  { id: 3, date: '03/07/2026', name: 'Rà soát ngân sách quý III', host: 'Huỳnh Ngọc Ánh', room: 'Phòng họp B', unit: 'Phòng Tài chính', attendees: 18, attendanceRate: 95, duration: 68, status: 'Đã hoàn thành' },
  { id: 4, date: '04/07/2026', name: 'Họp chuyên đề tư pháp hộ tịch', host: 'Trần Thị Lan', room: 'Phòng họp C', unit: 'Phòng Tư pháp', attendees: 21, attendanceRate: 100, duration: 82, status: 'Đã hoàn thành' },
  { id: 5, date: '05/07/2026', name: 'Họp kiểm tra thiết chế văn hóa', host: 'Lê Hoàng Phúc', room: 'Hội trường lớn', unit: 'Phòng Văn hóa', attendees: 46, attendanceRate: 94, duration: 110, status: 'Đã hoàn thành' },
  { id: 6, date: '06/07/2026', name: 'Họp an ninh trật tự địa bàn', host: 'Phạm Quốc Huy', room: 'Phòng họp A', unit: 'Văn phòng UBND', attendees: 28, attendanceRate: 96, duration: 70, status: 'Đã hoàn thành' },
  { id: 7, date: '07/07/2026', name: 'Họp chuyển đổi số cấp phường', host: 'Nguyễn Văn Minh', room: 'Phòng họp tầng 2', unit: 'Văn phòng UBND', attendees: 35, attendanceRate: 97, duration: 88, status: 'Đang diễn ra' },
  { id: 8, date: '08/07/2026', name: 'Họp tiếp công dân định kỳ', host: 'Lê Hoàng Phúc', room: 'Phòng họp B', unit: 'Phòng Tư pháp', attendees: 16, attendanceRate: 89, duration: 60, status: 'Chờ diễn ra' },
  { id: 9, date: '09/07/2026', name: 'Họp quản lý trật tự xây dựng', host: 'Nguyễn Văn Minh', room: 'Phòng họp C', unit: 'Phòng Nội vụ', attendees: 27, attendanceRate: 93, duration: 95, status: 'Đã hoàn thành' },
  { id: 10, date: '10/07/2026', name: 'Họp chuẩn bị ngày chủ nhật xanh', host: 'Trần Thị Lan', room: 'Hội trường lớn', unit: 'Phòng Văn hóa', attendees: 52, attendanceRate: 98, duration: 72, status: 'Đã hoàn thành' },
  { id: 11, date: '11/07/2026', name: 'Họp rà soát nhiệm vụ sau kết luận', host: 'Huỳnh Ngọc Ánh', room: 'Phòng họp A', unit: 'Phòng Tài chính', attendees: 20, attendanceRate: 91, duration: 64, status: 'Đã hủy' },
  { id: 12, date: '12/07/2026', name: 'Họp trực tuyến với cấp quận', host: 'Nguyễn Văn Minh', room: 'Phòng họp tầng 2', unit: 'Văn phòng UBND', attendees: 38, attendanceRate: 100, duration: 120, status: 'Đã hoàn thành' },
  { id: 13, date: '13/07/2026', name: 'Họp đánh giá dịch vụ công', host: 'Trần Thị Lan', room: 'Phòng họp B', unit: 'Phòng Nội vụ', attendees: 23, attendanceRate: 96, duration: 78, status: 'Đã hoàn thành' },
  { id: 14, date: '14/07/2026', name: 'Họp phối hợp truyền thông', host: 'Lê Hoàng Phúc', room: 'Phòng họp C', unit: 'Phòng Văn hóa', attendees: 19, attendanceRate: 90, duration: 55, status: 'Chờ diễn ra' },
  { id: 15, date: '15/07/2026', name: 'Họp tổng hợp báo cáo tuần', host: 'Nguyễn Văn Minh', room: 'Phòng họp A', unit: 'Văn phòng UBND', attendees: 30, attendanceRate: 97, duration: 80, status: 'Đã hoàn thành' },
]
