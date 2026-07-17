import { getMonthMatrix, getWeekDays, toDateKey } from './calendarUtils.js'

export function getCalendarRange(currentDate, viewMode) {
  if (viewMode === 'month') {
    const days = getMonthMatrix(currentDate)
    return { startDate: toDateKey(days[0]), endDate: toDateKey(days.at(-1)) }
  }
  if (viewMode === 'week') {
    const days = getWeekDays(currentDate)
    return { startDate: toDateKey(days[0]), endDate: toDateKey(days.at(-1)) }
  }
  const date = toDateKey(currentDate)
  return { startDate: date, endDate: date }
}
