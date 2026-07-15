export const typeStyles = {
  'giao-ban': {
    label: 'Họp giao ban',
    dot: 'bg-[#10B981]',
    event: 'bg-emerald-50 text-emerald-700 ring-emerald-200 hover:bg-emerald-100',
  },
  hdnd: {
    label: 'Họp HĐND',
    dot: 'bg-[#2563EB]',
    event: 'bg-blue-50 text-blue-700 ring-blue-200 hover:bg-blue-100',
  },
  'noi-bo': {
    label: 'Họp nội bộ',
    dot: 'bg-[#F59E0B]',
    event: 'bg-amber-50 text-amber-700 ring-amber-200 hover:bg-amber-100',
  },
  khan: {
    label: 'Khẩn',
    dot: 'bg-[#EF4444]',
    event: 'bg-red-50 text-red-700 ring-red-200 hover:bg-red-100',
  },
  'chuyen-de': {
    label: 'Họp chuyên đề',
    dot: 'bg-purple-500',
    event: 'bg-purple-50 text-purple-700 ring-purple-200 hover:bg-purple-100',
  },
}

export const weekdays = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']

export function toDateKey(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

export function parseDate(dateKey) {
  const [year, month, day] = dateKey.split('-').map(Number)

  return new Date(year, month - 1, day)
}

export function formatDayMonth(date) {
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
  }).format(date)
}

export function formatFullDate(date) {
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date)
}

export function formatMonthYear(date) {
  return new Intl.DateTimeFormat('vi-VN', {
    month: 'long',
    year: 'numeric',
  }).format(date)
}

export function getMonthMatrix(currentDate) {
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const firstDay = new Date(year, month, 1)
  const mondayOffset = (firstDay.getDay() + 6) % 7
  const startDate = new Date(year, month, 1 - mondayOffset)

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(startDate)
    date.setDate(startDate.getDate() + index)

    return date
  })
}

export function getWeekDays(currentDate) {
  const startDate = new Date(currentDate)
  const mondayOffset = (startDate.getDay() + 6) % 7
  startDate.setDate(startDate.getDate() - mondayOffset)

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(startDate)
    date.setDate(startDate.getDate() + index)

    return date
  })
}

export function getMeetingsByDate(meetings, date) {
  const dateKey = toDateKey(date)

  return meetings
    .filter((meeting) => meeting.date === dateKey)
    .sort((a, b) => a.startTime.localeCompare(b.startTime))
}
