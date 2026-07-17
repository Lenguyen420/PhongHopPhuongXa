import test from 'node:test'
import assert from 'node:assert/strict'
import { getCalendarRange } from '../src/components/MeetingSchedulePage/calendarRange.js'

test('month range includes all 42 calendar cells', () => {
  assert.deepEqual(getCalendarRange(new Date(2026, 6, 15), 'month'), {
    startDate: '2026-06-29',
    endDate: '2026-08-09',
  })
})

test('week and day ranges match the selected date', () => {
  assert.deepEqual(getCalendarRange(new Date(2026, 6, 15), 'week'), {
    startDate: '2026-07-13',
    endDate: '2026-07-19',
  })
  assert.deepEqual(getCalendarRange(new Date(2026, 6, 15), 'day'), {
    startDate: '2026-07-15',
    endDate: '2026-07-15',
  })
})
